import type { FormSchema, FormFieldSchema, FormContainerSchema, LayoutConfig } from '../types/form'
import type { ComponentType } from '../types'

/**
 * 表单字段快速创建辅助函数
 */
export interface QuickFieldOptions<T extends Record<string, any> = any> {
  /** 字段名 */
  field: keyof T | string
  /** 标签文本 */
  label: string
  /** 组件类型 */
  component: ComponentType
  /** 组件属性 */
  componentProps?: Record<string, any>
  /** 默认值 */
  defaultValue?: any
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: Record<string, any> | Record<string, any>[]
  /** 占用列数 */
  span?: number
  /** 是否占满整行 */
  isFull?: boolean
  /** 条件显示函数 */
  ifShow?: (formModel: T, value: any, methods: any) => boolean
  /** 值变化回调 */
  onChange?: (newValue: any, oldValue: any, methods: any) => void | Promise<void>
  /** 其他属性 */
  [key: string]: any
}

/**
 * 快速创建表单字段
 */
export function createField<T extends Record<string, any> = any>(
  options: QuickFieldOptions<T>
): FormFieldSchema<T> {
  const { field, label, component, span, isFull, ...rest } = options
  
  const schema: FormFieldSchema<T> = {
    field,
    label,
    component,
    ...rest
  }
  
  // 设置布局属性
  if (span !== undefined || isFull !== undefined) {
    schema.layout = {
      ...(span !== undefined && { span }),
      ...(isFull !== undefined && { span: isFull ? 24 : span })
    }
  }
  
  return schema
}

/**
 * 网格布局快速创建器
 */
export class GridLayoutBuilder<T extends Record<string, any> = any> {
  private schemas: FormSchema<T>[] = []
  private config: LayoutConfig['grid'] = {
    cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  }
  
  /**
   * 设置网格配置
   */
  setGridConfig(config: Partial<LayoutConfig['grid']>): this {
    this.config = { ...this.config, ...config }
    return this
  }
  
  /**
   * 添加字段
   */
  addField(options: QuickFieldOptions<T>): this {
    this.schemas.push(createField(options))
    return this
  }
  
  /**
   * 添加多个字段
   */
  addFields(fields: QuickFieldOptions<T>[]): this {
    fields.forEach(field => this.addField(field))
    return this
  }
  
  /**
   * 添加分隔线
   */
  addDivider(title?: string): this {
    this.schemas.push({
      type: 'container',
      containerType: 'divider',
      title,
      children: []
    } as FormContainerSchema<T>)
    return this
  }
  
  /**
   * 构建schema
   */
  build(): { schemas: FormSchema<T>[], layoutConfig: LayoutConfig } {
    return {
      schemas: this.schemas,
      layoutConfig: {
        grid: this.config
      }
    }
  }
}

/**
 * Flex布局快速创建器
 */
export class FlexLayoutBuilder<T extends Record<string, any> = any> {
  private schemas: FormSchema<T>[] = []
  private config: LayoutConfig['flex'] = {
    direction: 'row',
    wrap: 'wrap',
    justify: 'flex-start',
    align: 'stretch',
    gap: 16
  }
  
  /**
   * 设置Flex配置
   */
  setFlexConfig(config: Partial<LayoutConfig['flex']>): this {
    this.config = { ...this.config, ...config }
    return this
  }
  
  /**
   * 添加字段
   */
  addField(options: QuickFieldOptions<T>): this {
    this.schemas.push(createField(options))
    return this
  }
  
  /**
   * 添加多个字段
   */
  addFields(fields: QuickFieldOptions<T>[]): this {
    fields.forEach(field => this.addField(field))
    return this
  }
  
  /**
   * 构建schema
   */
  build(): { schemas: FormSchema<T>[], layoutConfig: LayoutConfig } {
    // 包装在flex容器中
    const containerSchema: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'flex',
      children: this.schemas,
      config: this.config
    }
    
    return {
      schemas: [containerSchema],
      layoutConfig: {
        flex: this.config
      }
    }
  }
}

/**
 * 标签页布局快速创建器
 */
export class TabsLayoutBuilder<T extends Record<string, any> = any> {
  private tabs: Array<{
    name: string
    title: string
    fields: FormSchema<T>[]
  }> = []
  private config: LayoutConfig['tabs'] = {
    placement: 'top',
    type: 'line',
    closable: false,
    addable: false
  }
  
  /**
   * 设置标签页配置
   */
  setTabsConfig(config: Partial<LayoutConfig['tabs']>): this {
    this.config = { ...this.config, ...config }
    return this
  }
  
  /**
   * 添加标签页
   */
  addTab(name: string, title: string, fields: QuickFieldOptions<T>[] = []): this {
    this.tabs.push({
      name,
      title,
      fields: fields.map(field => createField(field))
    })
    return this
  }
  
  /**
   * 向指定标签页添加字段
   */
  addFieldToTab(tabName: string, field: QuickFieldOptions<T>): this {
    const tab = this.tabs.find(t => t.name === tabName)
    if (tab) {
      tab.fields.push(createField(field))
    }
    return this
  }
  
  /**
   * 构建schema
   */
  build(): { schemas: FormSchema<T>[], layoutConfig: LayoutConfig } {
    const tabChildren: FormContainerSchema<T>[] = this.tabs.map(tab => ({
      type: 'container',
      containerType: 'grid',
      name: tab.name,
      title: tab.title,
      children: tab.fields,
      config: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16
      }
    }))
    
    const containerSchema: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'tabs',
      children: tabChildren,
      config: this.config
    }
    
    return {
      schemas: [containerSchema],
      layoutConfig: {
        tabs: this.config
      }
    }
  }
}

/**
 * 手风琴布局快速创建器
 */
export class AccordionLayoutBuilder<T extends Record<string, any> = any> {
  private panels: Array<{
    name: string
    title: string
    fields: FormSchema<T>[]
    defaultExpanded?: boolean
  }> = []
  private config: LayoutConfig['accordion'] = {
    accordion: true,
    defaultExpandedNames: [],
    arrowPlacement: 'left'
  }
  
  /**
   * 设置手风琴配置
   */
  setAccordionConfig(config: Partial<LayoutConfig['accordion']>): this {
    this.config = { ...this.config, ...config }
    return this
  }
  
  /**
   * 添加面板
   */
  addPanel(
    name: string, 
    title: string, 
    fields: QuickFieldOptions<T>[] = [], 
    defaultExpanded = false
  ): this {
    this.panels.push({
      name,
      title,
      fields: fields.map(field => createField(field)),
      defaultExpanded
    })
    
    if (defaultExpanded) {
      this.config.defaultExpandedNames = this.config.defaultExpandedNames || []
      this.config.defaultExpandedNames.push(name)
    }
    
    return this
  }
  
  /**
   * 向指定面板添加字段
   */
  addFieldToPanel(panelName: string, field: QuickFieldOptions<T>): this {
    const panel = this.panels.find(p => p.name === panelName)
    if (panel) {
      panel.fields.push(createField(field))
    }
    return this
  }
  
  /**
   * 构建schema
   */
  build(): { schemas: FormSchema<T>[], layoutConfig: LayoutConfig } {
    const panelChildren: FormContainerSchema<T>[] = this.panels.map(panel => ({
      type: 'container',
      containerType: 'grid',
      name: panel.name,
      title: panel.title,
      children: panel.fields,
      config: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16
      }
    }))
    
    const containerSchema: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'accordion',
      children: panelChildren,
      config: this.config
    }
    
    return {
      schemas: [containerSchema],
      layoutConfig: {
        accordion: this.config
      }
    }
  }
}

/**
 * 混合布局快速创建器
 */
export class MixedLayoutBuilder<T extends Record<string, any> = any> {
  private containers: FormContainerSchema<T>[] = []
  
  /**
   * 添加网格容器
   */
  addGridContainer(
    name: string,
    title: string,
    fields: QuickFieldOptions<T>[],
    config?: Partial<LayoutConfig['grid']>
  ): this {
    const gridConfig = {
      cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
      xGap: 16,
      yGap: 16,
      ...config
    }
    
    this.containers.push({
      type: 'container',
      containerType: 'grid',
      name,
      title,
      children: fields.map(field => createField(field)),
      config: gridConfig
    })
    
    return this
  }
  
  /**
   * 添加Flex容器
   */
  addFlexContainer(
    name: string,
    title: string,
    fields: QuickFieldOptions<T>[],
    config?: Partial<LayoutConfig['flex']>
  ): this {
    const flexConfig = {
      direction: 'row' as const,
      wrap: 'wrap' as const,
      justify: 'flex-start' as const,
      align: 'stretch' as const,
      gap: 16,
      ...config
    }
    
    this.containers.push({
      type: 'container',
      containerType: 'flex',
      name,
      title,
      children: fields.map(field => createField(field)),
      config: flexConfig
    })
    
    return this
  }
  
  /**
   * 添加标签页容器
   */
  addTabsContainer(
    name: string,
    title: string,
    tabs: Array<{ name: string; title: string; fields: QuickFieldOptions<T>[] }>,
    config?: Partial<LayoutConfig['tabs']>
  ): this {
    const tabsConfig = {
      placement: 'top' as const,
      type: 'line' as const,
      closable: false,
      addable: false,
      ...config
    }
    
    const tabChildren: FormContainerSchema<T>[] = tabs.map(tab => ({
      type: 'container',
      containerType: 'grid',
      name: tab.name,
      title: tab.title,
      children: tab.fields.map(field => createField(field)),
      config: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16
      }
    }))
    
    this.containers.push({
      type: 'container',
      containerType: 'tabs',
      name,
      title,
      children: tabChildren,
      config: tabsConfig
    })
    
    return this
  }
  
  /**
   * 添加手风琴容器
   */
  addAccordionContainer(
    name: string,
    title: string,
    panels: Array<{ 
      name: string; 
      title: string; 
      fields: QuickFieldOptions<T>[]; 
      defaultExpanded?: boolean 
    }>,
    config?: Partial<LayoutConfig['accordion']>
  ): this {
    const accordionConfig = {
      accordion: true,
      defaultExpandedNames: panels
        .filter(p => p.defaultExpanded)
        .map(p => p.name),
      arrowPlacement: 'left' as const,
      ...config
    }
    
    const panelChildren: FormContainerSchema<T>[] = panels.map(panel => ({
      type: 'container',
      containerType: 'grid',
      name: panel.name,
      title: panel.title,
      children: panel.fields.map(field => createField(field)),
      config: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16
      }
    }))
    
    this.containers.push({
      type: 'container',
      containerType: 'accordion',
      name,
      title,
      children: panelChildren,
      config: accordionConfig
    })
    
    return this
  }
  
  /**
   * 添加卡片容器
   */
  addCardContainer(
    name: string,
    title: string,
    fields: QuickFieldOptions<T>[],
    config?: Partial<LayoutConfig['card']>
  ): this {
    const cardConfig = {
      title,
      bordered: true,
      size: 'medium' as const,
      collapsible: false,
      ...config
    }
    
    this.containers.push({
      type: 'container',
      containerType: 'card',
      name,
      title,
      children: fields.map(field => createField(field)),
      config: cardConfig
    })
    
    return this
  }
  
  /**
   * 构建schema
   */
  build(): { schemas: FormSchema<T>[], layoutConfig: LayoutConfig } {
    return {
      schemas: this.containers,
      layoutConfig: {}
    }
  }
}

/**
 * 快速创建网格布局
 */
export function createGridLayout<T extends Record<string, any> = any>(
  fields: QuickFieldOptions<T>[],
  config?: Partial<LayoutConfig['grid']>
) {
  return new GridLayoutBuilder<T>()
    .setGridConfig(config || {})
    .addFields(fields)
    .build()
}

/**
 * 快速创建Flex布局
 */
export function createFlexLayout<T extends Record<string, any> = any>(
  fields: QuickFieldOptions<T>[],
  config?: Partial<LayoutConfig['flex']>
) {
  return new FlexLayoutBuilder<T>()
    .setFlexConfig(config || {})
    .addFields(fields)
    .build()
}

/**
 * 快速创建标签页布局
 */
export function createTabsLayout<T extends Record<string, any> = any>(
  tabs: Array<{ name: string; title: string; fields: QuickFieldOptions<T>[] }>,
  config?: Partial<LayoutConfig['tabs']>
) {
  const builder = new TabsLayoutBuilder<T>().setTabsConfig(config || {})
  tabs.forEach(tab => builder.addTab(tab.name, tab.title, tab.fields))
  return builder.build()
}

/**
 * 快速创建手风琴布局
 */
export function createAccordionLayout<T extends Record<string, any> = any>(
  panels: Array<{ 
    name: string; 
    title: string; 
    fields: QuickFieldOptions<T>[]; 
    defaultExpanded?: boolean 
  }>,
  config?: Partial<LayoutConfig['accordion']>
) {
  const builder = new AccordionLayoutBuilder<T>().setAccordionConfig(config || {})
  panels.forEach(panel => 
    builder.addPanel(panel.name, panel.title, panel.fields, panel.defaultExpanded)
  )
  return builder.build()
}

/**
 * 常用字段预设
 */
export const FieldPresets = {
  /**
   * 文本输入框
   */
  input: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NInput',
    componentProps: {
      placeholder: `请输入${label}`,
      clearable: true
    },
    ...options
  }),
  
  /**
   * 密码输入框
   */
  password: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NInputPassword',
    componentProps: {
      placeholder: `请输入${label}`,
      showPasswordOn: 'mousedown'
    },
    ...options
  }),
  
  /**
   * 数字输入框
   */
  number: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NInputNumber',
    componentProps: {
      placeholder: `请输入${label}`,
      clearable: true
    },
    ...options
  }),
  
  /**
   * 文本域
   */
  textarea: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NInputTextArea',
    componentProps: {
      placeholder: `请输入${label}`,
      rows: 3,
      clearable: true
    },
    isFull: true,
    ...options
  }),
  
  /**
   * 选择器
   */
  select: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options: Array<{ label: string; value: any }>,
    extraOptions?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NSelect',
    componentProps: {
      placeholder: `请选择${label}`,
      options,
      clearable: true
    },
    ...extraOptions
  }),
  
  /**
   * 单选框组
   */
  radio: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options: Array<{ label: string; value: any }>,
    extraOptions?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NRadioGroup',
    componentProps: {
      options
    },
    ...extraOptions
  }),
  
  /**
   * 复选框组
   */
  checkbox: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options: Array<{ label: string; value: any }>,
    extraOptions?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NCheckboxGroup',
    componentProps: {
      options
    },
    ...extraOptions
  }),
  
  /**
   * 日期选择器
   */
  date: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NDatePicker',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true,
      type: 'date'
    },
    ...options
  }),
  
  /**
   * 时间选择器
   */
  time: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NTimePicker',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true
    },
    ...options
  }),
  
  /**
   * 开关
   */
  switch: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NSwitch',
    defaultValue: false,
    ...options
  }),
  
  /**
   * 滑块
   */
  slider: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NSlider',
    componentProps: {
      min: 0,
      max: 100,
      step: 1
    },
    ...options
  }),
  
  /**
   * 评分
   */
  rate: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NRate',
    componentProps: {
      allowHalf: true,
      clearable: true
    },
    ...options
  })
}