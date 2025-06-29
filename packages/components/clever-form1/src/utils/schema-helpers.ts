import type {
  FormSchema,
  FormFieldSchema,
  FormContainerSchema,
  LayoutConfig,
  CleverFormMethods, FormApiConfig, CleverFormProps, FormGroupSchema
} from '../types/form'
import type { ComponentType } from '../types'
import type { FormItemRule } from 'naive-ui'

/**
 * 表单字段快速创建选项接口
 * @template T 表单数据类型
 */
export interface QuickFieldOptions<T extends Record<string, any> = any> {
  /** 字段名 - 支持类型安全的字段名 */
  field: keyof T | string
  /** 标签文本 */
  label: string
  /** 组件类型 - 基于Naive UI组件 */
  component: ComponentType
  /** 组件属性配置 */
  componentProps?: Record<string, any>
  /** 字段默认值 */
  defaultValue?: any
  /** 是否为必填字段 */
  required?: boolean
  /** 表单验证规则 */
  rules?: FormItemRule | FormItemRule[]
  /** 网格布局占用列数 */
  span?: number
  /** 是否占满整行 */
  isFull?: boolean
  /** 条件显示函数 - 支持动态显示控制 */
  ifShow?: (formModel: T, value: any, methods: CleverFormMethods<T>) => boolean
  /** 字段值变化回调 */
  onChange?: (
    newValue: any,
    oldValue: any,
    methods: CleverFormMethods<T>
  ) => void | Promise<void>
  /** 字段布局配置 */
  layout?: FormFieldSchema<T>['layout']
  /** 字段分组配置 */
  group?: FormFieldSchema<T>['group']
  /** 显示模式 */
  showMode?: FormFieldSchema<T>['showMode']
  /** 标签宽度 */
  labelWidth?: string | number
  /** 标签提示信息 */
  labelMessage?: string
  /** 字段排序权重 */
  order?: number

  /** 其他扩展属性 */
  [key: string]: any
}

/**
 * 快速创建表单字段Schema
 * @template T 表单数据类型
 * @param options 字段配置选项
 * @returns 完整的FormFieldSchema对象
 */
export function createField<T extends Record<string, any> = any>(
  options: QuickFieldOptions<T>
): FormFieldSchema<T> {
  const {
    field,
    label,
    component,
    span,
    isFull,
    required,
    rules,
    layout,
    group,
    showMode,
    labelWidth,
    labelMessage,
    order,
    componentProps,
    defaultValue,
    ifShow,
    onChange,
    ...rest
  } = options

  // 构建基础schema
  const schema: FormFieldSchema<T> = {
    field,
    label,
    component,
    ...(componentProps && { componentProps }),
    ...(defaultValue !== undefined && { defaultValue }),
    ...(required !== undefined && { required }),
    ...(showMode && { showMode }),
    ...(labelWidth && { labelWidth }),
    ...(labelMessage && { labelMessage }),
    ...(order !== undefined && { order }),
    ...(ifShow && { ifShow }),
    ...(onChange && { onChange }),
    ...rest
  }

  // 处理验证规则
  if (rules) {
    schema.rules = Array.isArray(rules) ? rules : [rules]
  } else if (required) {
    // 如果设置了required但没有rules，自动添加必填规则
    schema.rules = [
      {
        required: true,
        message: `请输入${label}`,
        trigger: ['blur', 'input']
      }
    ]
  }

  // 处理布局配置
  if (layout || span !== undefined || isFull !== undefined) {
    schema.layout = {
      ...layout,
      ...(span !== undefined && { span }),
      ...(isFull !== undefined && { span: isFull ? 24 : span || 12 })
    }
  }

  // 处理分组配置
  if (group) {
    schema.group = group
  }

  return schema
}

/**
 * 布局构建器基类
 * @template T 表单数据类型
 */
abstract class BaseLayoutBuilder<T extends Record<string, any> = any> {
  protected schemas: FormSchema<T>[] = []
  protected layoutConfig: LayoutConfig = {}

  /**
   * 添加单个字段
   * @param options 字段配置选项
   */
  addField(options: QuickFieldOptions<T>): this {
    this.schemas.push(createField(options))
    return this
  }

  /**
   * 批量添加字段
   * @param fields 字段配置数组
   */
  addFields(fields: QuickFieldOptions<T>[]): this {
    fields.forEach(field => this.addField(field))
    return this
  }

  /**
   * 添加分隔线
   * @param title 分隔线标题
   * @param config 分隔线配置
   */
  addDivider(title?: string, config?: Record<string, any>): this {
    this.schemas.push({
      type: 'container',
      containerType: 'divider',
      title,
      children: [],
      config
    } as FormContainerSchema<T>)
    return this
  }

  /**
   * 添加自定义容器
   * @param container 容器配置
   */
  addContainer(container: FormContainerSchema<T>): this {
    this.schemas.push(container)
    return this
  }

  /**
   * 根据条件添加字段
   * @param condition 条件函数
   * @param options 字段配置选项
   */
  addFieldIf(
    condition: boolean | (() => boolean),
    options: QuickFieldOptions<T>
  ): this {
    const shouldAdd = typeof condition === 'function' ? condition() : condition
    if (shouldAdd) {
      this.addField(options)
    }
    return this
  }

  /**
   * 清空所有schemas
   */
  clear(): this {
    this.schemas = []
    return this
  }

  /**
   * 获取当前schemas数量
   */
  getCount(): number {
    return this.schemas.length
  }

  /**
   * 抽象方法：构建最终结果
   */
  abstract build(): { schemas: FormSchema<T>[]; layoutConfig: LayoutConfig }
}

/**
 * 网格布局构建器
 * @template T 表单数据类型
 */
export class GridLayoutBuilder<
  T extends Record<string, any> = any
> extends BaseLayoutBuilder<T> {
  private gridConfig: NonNullable<LayoutConfig['grid']> = {
    cols: 24, // 改为数字类型，更直观
    xGap: 16,
    yGap: 16,
    responsive: 'screen'
  }

  /**
   * 设置网格配置
   * @param config 网格配置
   */
  setGridConfig(config: Partial<LayoutConfig['grid']>): this {
    this.gridConfig = { ...this.gridConfig, ...config }
    return this
  }

  /**
   * 设置响应式列数
   * @param cols 列数配置
   */
  setCols(cols: number | string): this {
    this.gridConfig.cols = cols
    return this
  }

  /**
   * 设置间距
   * @param xGap 水平间距
   * @param yGap 垂直间距
   */
  setGap(xGap: number, yGap?: number): this {
    this.gridConfig.xGap = xGap
    this.gridConfig.yGap = yGap ?? xGap
    return this
  }

  /**
   * 构建网格布局
   */
  build(): { schemas: FormSchema<T>[]; layoutConfig: LayoutConfig } {
    return {
      schemas: this.schemas,
      layoutConfig: {
        grid: this.gridConfig
      }
    }
  }
}

/**
 * Flex布局构建器
 * @template T 表单数据类型
 */
export class FlexLayoutBuilder<
  T extends Record<string, any> = any
> extends BaseLayoutBuilder<T> {
  private flexConfig: NonNullable<LayoutConfig['flex']> = {
    direction: 'row',
    wrap: 'wrap',
    justify: 'flex-start',
    align: 'stretch',
    gap: 16
  }

  /**
   * 设置Flex配置
   * @param config Flex配置
   */
  setFlexConfig(config: Partial<LayoutConfig['flex']>): this {
    this.flexConfig = { ...this.flexConfig, ...config }
    return this
  }

  /**
   * 设置主轴方向
   * @param direction 主轴方向
   */
  setDirection(
    direction: NonNullable<LayoutConfig['flex']>['direction']
  ): this {
    this.flexConfig.direction = direction
    return this
  }

  /**
   * 设置换行方式
   * @param wrap 换行方式
   */
  setWrap(wrap: NonNullable<LayoutConfig['flex']>['wrap']): this {
    this.flexConfig.wrap = wrap
    return this
  }

  /**
   * 设置主轴对齐方式
   * @param justify 主轴对齐方式
   */
  setJustify(justify: NonNullable<LayoutConfig['flex']>['justify']): this {
    this.flexConfig.justify = justify
    return this
  }

  /**
   * 设置交叉轴对齐方式
   * @param align 交叉轴对齐方式
   */
  setAlign(align: NonNullable<LayoutConfig['flex']>['align']): this {
    this.flexConfig.align = align
    return this
  }

  /**
   * 设置间距
   * @param gap 间距值
   */
  setGap(gap: string | number): this {
    this.flexConfig.gap = gap
    return this
  }

  /**
   * 构建Flex布局
   */
  build(): { schemas: FormSchema<T>[]; layoutConfig: LayoutConfig } {
    // 包装在flex容器中
    const containerSchema: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'flex',
      children: this.schemas,
      config: this.flexConfig
    }

    return {
      schemas: [containerSchema],
      layoutConfig: {
        flex: this.flexConfig
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
  addTab(
    name: string,
    title: string,
    fields: QuickFieldOptions<T>[] = []
  ): this {
    this.tabs.push({
      name,
      title,
      fields: (fields || []).map(field => createField(field))
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
  build(): { schemas: FormSchema<T>[]; layoutConfig: LayoutConfig } {
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
      fields: (fields || []).map(field => createField(field)),
      defaultExpanded
    })

    if (defaultExpanded) {
      if (!this.config?.defaultExpandedNames) {
        this.config!.defaultExpandedNames = []
      }
      this.config?.defaultExpandedNames?.push(name)
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
  build(): { schemas: FormSchema<T>[]; layoutConfig: LayoutConfig } {
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
 * CleverForm 默认布局构建器
 * 专为 clever-form 组件设计的嵌套布局构建器
 * @template T 表单数据类型
 */
export class CleverFormLayoutBuilder<
  T extends Record<string, any> = any
> extends BaseLayoutBuilder<T> {
  private containers: FormContainerSchema<T>[] = []
  private globalLayoutConfig: LayoutConfig = {}
  private fieldOrder = 0

  /**
   * 设置全局布局配置
   * @param config 布局配置
   */
  setGlobalLayoutConfig(config: Partial<LayoutConfig>): this {
    this.globalLayoutConfig = { ...this.globalLayoutConfig, ...config }
    return this
  }

  /**
   * 添加网格容器
   * @param options 网格容器选项
   */
  addGridContainer(options: {
    name?: string
    title?: string
    fields: QuickFieldOptions<T>[]
    config?: Partial<LayoutConfig['grid']>
    collapsible?: boolean
    collapsed?: boolean
    showMode?: FormContainerSchema<T>['showMode']
    ifShow?: (formModel: T) => boolean
  }): this {
    const {
      name = `grid_${this.containers.length}`,
      title,
      fields,
      config,
      collapsible = false,
      collapsed = false,
      showMode,
      ifShow
    } = options

    const gridConfig: NonNullable<LayoutConfig['grid']> = {
      cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
      xGap: 16,
      yGap: 16,
      responsive: 'screen',
      ...config
    }

    const container: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'grid',
      name,
      title,
      children: (fields || []).map(field =>
        createField({
          ...field,
          order: field.order ?? this.fieldOrder++
        })
      ),
      config: gridConfig,
      collapsible,
      collapsed,
      showMode,
      ifShow
    }

    this.containers.push(container)
    return this
  }

  /**
   * 添加Flex容器
   * @param options Flex容器选项
   */
  addFlexContainer(options: {
    name?: string
    title?: string
    fields: QuickFieldOptions<T>[]
    config?: Partial<LayoutConfig['flex']>
    collapsible?: boolean
    collapsed?: boolean
    showMode?: FormContainerSchema<T>['showMode']
    ifShow?: (formModel: T) => boolean
  }): this {
    const {
      name = `flex_${this.containers.length}`,
      title,
      fields,
      config,
      collapsible = false,
      collapsed = false,
      showMode,
      ifShow
    } = options

    const flexConfig: NonNullable<LayoutConfig['flex']> = {
      direction: 'row',
      wrap: 'wrap',
      justify: 'flex-start',
      align: 'stretch',
      gap: 16,
      ...config
    }

    const container: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'flex',
      name,
      title,
      children: (fields || []).map(field =>
        createField({
          ...field,
          order: field.order ?? this.fieldOrder++
        })
      ),
      config: flexConfig,
      collapsible,
      collapsed,
      showMode,
      ifShow
    }

    this.containers.push(container)
    return this
  }

  /**
   * 添加标签页容器
   * @param options 标签页容器选项
   */
  addTabsContainer(options: {
    name?: string
    title?: string
    tabs: Array<{
      name: string
      title: string
      fields: QuickFieldOptions<T>[]
      disabled?: boolean
      closable?: boolean
    }>
    config?: Partial<LayoutConfig['tabs']>
    showMode?: FormContainerSchema<T>['showMode']
    ifShow?: (formModel: T) => boolean
  }): this {
    const {
      name = `tabs_${this.containers.length}`,
      title,
      tabs,
      config,
      showMode,
      ifShow
    } = options

    const tabsConfig: NonNullable<LayoutConfig['tabs']> = {
      placement: 'top',
      type: 'line',
      closable: false,
      addable: false,
      ...config
    }

    const tabChildren: FormContainerSchema<T>[] = (tabs || []).map(tab => ({
      type: 'container',
      containerType: 'grid',
      name: tab.name,
      title: tab.title,
      children: (tab.fields || []).map(field =>
        createField({
          ...field,
          order: field.order ?? this.fieldOrder++
        })
      ),
      config: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16,
        responsive: 'screen'
      },
      disabled: tab.disabled,
      closable: tab.closable
    }))

    const container: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'tabs',
      name,
      title,
      children: tabChildren,
      config: tabsConfig,
      showMode,
      ifShow
    }

    this.containers.push(container)
    return this
  }

  /**
   * 添加手风琴容器
   * @param options 手风琴容器选项
   */
  addAccordionContainer(options: {
    name?: string
    title?: string
    panels: Array<{
      name: string
      title: string
      fields: QuickFieldOptions<T>[]
      defaultExpanded?: boolean
      disabled?: boolean
    }>
    config?: Partial<LayoutConfig['accordion']>
    showMode?: FormContainerSchema<T>['showMode']
    ifShow?: (formModel: T) => boolean
  }): this {
    const {
      name = `accordion_${this.containers.length}`,
      title,
      panels,
      config,
      showMode,
      ifShow
    } = options

    const accordionConfig: NonNullable<LayoutConfig['accordion']> = {
      accordion: true,
      defaultExpandedNames: panels
        .filter(p => p.defaultExpanded)
        .map(p => p.name),
      arrowPlacement: 'left',
      ...config
    }

    const panelChildren: FormContainerSchema<T>[] = panels.map(panel => ({
      type: 'container',
      containerType: 'grid',
      name: panel.name,
      title: panel.title,
      children: (panel.fields || []).map(field =>
        createField({
          ...field,
          order: field.order ?? this.fieldOrder++
        })
      ),
      config: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16,
        responsive: 'screen'
      },
      disabled: panel.disabled
    }))

    const container: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'accordion',
      name,
      title,
      children: panelChildren,
      config: accordionConfig,
      showMode,
      ifShow
    }

    this.containers.push(container)
    return this
  }

  /**
   * 添加卡片容器
   * @param options 卡片容器选项
   */
  addCardContainer(options: {
    name?: string
    title?: string
    fields: QuickFieldOptions<T>[]
    config?: Partial<LayoutConfig['card']>
    collapsible?: boolean
    collapsed?: boolean
    showMode?: FormContainerSchema<T>['showMode']
    ifShow?: (formModel: T) => boolean
  }): this {
    const {
      name = `card_${this.containers.length}`,
      title,
      fields,
      config,
      collapsible = false,
      collapsed = false,
      showMode,
      ifShow
    } = options

    const cardConfig: NonNullable<LayoutConfig['card']> = {
      title,
      bordered: true,
      size: 'medium',
      collapsible,
      ...config
    }

    const container: FormContainerSchema<T> = {
      type: 'container',
      containerType: 'card',
      name,
      title,
      children: (fields || []).map(field =>
        createField({
          ...field,
          order: field.order ?? this.fieldOrder++
        })
      ),
      config: cardConfig,
      collapsible,
      collapsed,
      showMode,
      ifShow
    }

    this.containers.push(container)
    return this
  }

  /**
   * 添加嵌套容器
   * @param options 嵌套容器选项
   */
  addNestedContainer(options: {
    name?: string
    title?: string
    containerType: FormContainerSchema<T>['containerType']
    children: (
      | FormFieldSchema<T>
      | FormGroupSchema<T>
      | FormContainerSchema<T>
    )[]
    config?: any
    collapsible?: boolean
    collapsed?: boolean
    showMode?: FormContainerSchema<T>['showMode']
    ifShow?: (formModel: T) => boolean
  }): this {
    const {
      name = `nested_${this.containers.length}`,
      title,
      containerType,
      children,
      config,
      collapsible = false,
      collapsed = false,
      showMode,
      ifShow
    } = options

    const container: FormContainerSchema<T> = {
      type: 'container',
      containerType,
      name,
      title,
      children,
      config,
      collapsible,
      collapsed,
      showMode,
      ifShow
    }

    this.containers.push(container)
    return this
  }

  /**
   * 添加分组到指定容器
   * @param containerName 容器名称
   * @param groupTitle 分组标题
   * @param fields 字段数组
   * @param options 分组选项
   */
  addGroupToContainer(
    containerName: string,
    groupTitle: string,
    fields: QuickFieldOptions<T>[],
    options?: {
      collapsed?: boolean
      showMode?: FormGroupSchema<T>['showMode']
      ifShow?: (formModel: T) => boolean
    }
  ): this {
    const container = this.containers.find(c => c.name === containerName)
    if (container) {
      const group: FormGroupSchema<T> = {
        type: 'group',
        title: groupTitle,
        fields: (fields || []).map(field =>
          createField({
            ...field,
            order: field.order ?? this.fieldOrder++
          })
        ),
        ...options
      }
      container.children.push(group)
    }
    return this
  }

  /**
   * 添加字段到指定容器
   * @param containerName 容器名称
   * @param field 字段选项
   */
  addFieldToContainer(
    containerName: string,
    field: QuickFieldOptions<T>
  ): this {
    const container = this.containers.find(c => c.name === containerName)
    if (container) {
      container.children.push(
        createField({
          ...field,
          order: field.order ?? this.fieldOrder++
        })
      )
    }
    return this
  }

  /**
   * 获取容器数量
   */
  getContainerCount(): number {
    return this.containers.length
  }

  /**
   * 获取指定容器
   * @param name 容器名称
   */
  getContainer(name: string): FormContainerSchema<T> | undefined {
    return this.containers.find(c => c.name === name)
  }

  /**
   * 移除指定容器
   * @param name 容器名称
   */
  removeContainer(name: string): this {
    const index = this.containers.findIndex(c => c.name === name)
    if (index > -1) {
      this.containers.splice(index, 1)
    }
    return this
  }

  /**
   * 清空所有容器
   */
  clear(): this {
    this.containers = []
    this.globalLayoutConfig = {}
    this.fieldOrder = 0
    return this
  }

  /**
   * 构建最终的表单配置
   */
  build(): { schemas: FormSchema<T>[]; layoutConfig: LayoutConfig } {
    // 如果没有容器，返回空的schemas
    if (this.containers.length === 0) {
      return {
        schemas: [],
        layoutConfig: this.globalLayoutConfig
      }
    }

    // 如果只有一个容器，直接返回其children
    if (this.containers.length === 1) {
      const container = this.containers[0]
      return {
        schemas: [container],
        layoutConfig: {
          ...this.globalLayoutConfig,
          [container.containerType]: container.config
        }
      }
    }

    // 多个容器时，返回所有容器
    return {
      schemas: this.containers,
      layoutConfig: this.globalLayoutConfig
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
  return new CleverFormLayoutBuilder<T>()
    .addGridContainer({ fields, config })
    .build()
}

/**
 * 快速创建Flex布局
 */
export function createFlexLayout<T extends Record<string, any> = any>(
  fields: QuickFieldOptions<T>[],
  config?: Partial<LayoutConfig['flex']>
) {
  return new CleverFormLayoutBuilder<T>()
    .addFlexContainer({ fields, config })
    .build()
}

/**
 * 快速创建标签页布局
 */
export function createTabsLayout<T extends Record<string, any> = any>(
  tabs: Array<{
    name: string
    title: string
    fields: QuickFieldOptions<T>[]
    disabled?: boolean
    closable?: boolean
  }>,
  config?: Partial<LayoutConfig['tabs']>
) {
  return new CleverFormLayoutBuilder<T>()
    .addTabsContainer({ tabs, config })
    .build()
}

/**
 * 快速创建手风琴布局
 */
export function createAccordionLayout<T extends Record<string, any> = any>(
  panels: Array<{
    name: string
    title: string
    fields: QuickFieldOptions<T>[]
    defaultExpanded?: boolean
    disabled?: boolean
  }>,
  config?: Partial<LayoutConfig['accordion']>
) {
  return new CleverFormLayoutBuilder<T>()
    .addAccordionContainer({ panels, config })
    .build()
}

/**
 * 快速创建卡片布局
 */
export function createCardLayout<T extends Record<string, any> = any>(
  fields: QuickFieldOptions<T>[],
  config?: Partial<LayoutConfig['card']>
) {
  return new CleverFormLayoutBuilder<T>()
    .addCardContainer({ fields, config })
    .build()
}

/**
 * 快速创建嵌套布局
 */
export function createNestedLayout<T extends Record<string, any> = any>(
  containerType: FormContainerSchema<T>['containerType'],
  children: (
    | FormFieldSchema<T>
    | FormGroupSchema<T>
    | FormContainerSchema<T>
  )[],
  config?: any
) {
  return new CleverFormLayoutBuilder<T>()
    .addNestedContainer({ containerType, children, config })
    .build()
}

/**
 * 创建CleverForm布局构建器
 */
export function createCleverFormLayoutBuilder<
  T extends Record<string, any> = any
>(): CleverFormLayoutBuilder<T> {
  return new CleverFormLayoutBuilder<T>()
}

/**
 * 创建混合布局（向后兼容）
 * @deprecated 请使用 createCleverFormLayoutBuilder 替代
 */
export function createMixedLayout<
  T extends Record<string, any> = any
>(): CleverFormLayoutBuilder<T> {
  return new CleverFormLayoutBuilder<T>()
}

/**
 * 表单构建器
 * @template T 表单数据类型
 */
export class FormBuilder<T extends Record<string, any> = any> {
  private schemas: FormSchema<T>[] = []
  private layoutConfig: LayoutConfig = {}
  private apiConfig?: FormApiConfig
  private formProps: Partial<CleverFormProps<T>> = {}
  private fieldCount = 0

  /**
   * 设置表单属性
   * @param props 表单属性
   */
  setFormProps(props: Partial<CleverFormProps<T>>): this {
    this.formProps = { ...this.formProps, ...props }
    return this
  }

  /**
   * 设置标签宽度
   * @param width 标签宽度
   */
  setLabelWidth(width: string | number): this {
    this.formProps.labelWidth = width
    return this
  }

  /**
   * 设置表单模式
   * @param mode 表单模式
   */
  setMode(mode: CleverFormProps<T>['mode']): this {
    this.formProps.mode = mode
    return this
  }

  /**
   * 设置布局模式
   * @param layoutMode 布局模式
   */
  setLayoutMode(layoutMode: CleverFormProps<T>['layoutMode']): this {
    this.formProps.layoutMode = layoutMode
    return this
  }

  /**
   * 设置API配置
   * @param config API配置
   */
  setApiConfig(config: FormApiConfig): this {
    this.apiConfig = config
    return this
  }

  /**
   * 设置布局配置
   * @param config 布局配置
   */
  setLayoutConfig(config: LayoutConfig): this {
    this.layoutConfig = { ...this.layoutConfig, ...config }
    return this
  }

  /**
   * 添加字段
   * @param options 字段选项
   */
  addField(options: QuickFieldOptions<T>): this {
    const field = createField({
      ...options,
      order: options.order ?? this.fieldCount++
    })
    this.schemas.push(field)
    return this
  }

  /**
   * 条件添加字段
   * @param condition 条件
   * @param options 字段选项
   */
  addFieldIf(condition: boolean, options: QuickFieldOptions<T>): this {
    if (condition) {
      this.addField(options)
    }
    return this
  }

  /**
   * 添加多个字段
   * @param fields 字段数组
   */
  addFields(fields: QuickFieldOptions<T>[]): this {
    fields.forEach(field => this.addField(field))
    return this
  }

  /**
   * 添加分组
   * @param title 分组标题
   * @param fields 字段数组
   * @param options 分组选项
   */
  addGroup(
    title: string,
    fields: QuickFieldOptions<T>[],
    options?: {
      collapsed?: boolean
      showMode?: FormGroupSchema<T>['showMode']
    }
  ): this {
    const groupSchema: FormGroupSchema<T> = {
      type: 'group',
      title,
      fields: (fields || []).map(field =>
        createField({
          ...field,
          order: field.order ?? this.fieldCount++
        })
      ),
      ...options
    }
    this.schemas.push(groupSchema)
    return this
  }

  /**
   * 添加容器
   * @param containerType 容器类型
   * @param children 子元素
   * @param config 容器配置
   */
  addContainer(
    containerType: FormContainerSchema<T>['containerType'],
    children: FormSchema<T>[],
    config?: any
  ): this {
    const containerSchema: FormContainerSchema<T> = {
      type: 'container',
      containerType,
      children,
      config
    }
    this.schemas.push(containerSchema)
    return this
  }

  /**
   * 使用网格布局构建器
   */
  useGridLayout(): GridLayoutBuilder<T> {
    return new GridLayoutBuilder<T>()
  }

  /**
   * 使用Flex布局构建器
   */
  useFlexLayout(): FlexLayoutBuilder<T> {
    return new FlexLayoutBuilder<T>()
  }

  /**
   * 合并其他构建器的结果
   * @param builderResult 构建器结果
   */
  merge(builderResult: {
    schemas: FormSchema<T>[]
    layoutConfig?: LayoutConfig
  }): this {
    this.schemas.push(...builderResult.schemas)
    if (builderResult.layoutConfig) {
      this.layoutConfig = {
        ...this.layoutConfig,
        ...builderResult.layoutConfig
      }
    }
    return this
  }

  /**
   * 清空所有配置
   */
  clear(): this {
    this.schemas = []
    this.layoutConfig = {}
    this.apiConfig = undefined
    this.formProps = {}
    this.fieldCount = 0
    return this
  }

  /**
   * 获取字段数量
   */
  getFieldCount(): number {
    return this.fieldCount
  }

  /**
   * 获取当前schemas
   */
  getSchemas(): FormSchema<T>[] {
    return [...this.schemas]
  }

  /**
   * 构建最终配置
   */
  build(): CleverFormProps<T> {
    const result: CleverFormProps<T> = {
      ...this.formProps,
      schemas: this.schemas,
      layoutConfig: this.layoutConfig
    }

    if (this.apiConfig) {
      result.apiConfig = this.apiConfig
    }

    return result
  }
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
    component: 'NInput',
    componentProps: {
      type: 'password',
      showPasswordOn: 'click',
      placeholder: `请输入${label}`,
      clearable: true
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
    component: 'NInput',
    componentProps: {
      type: 'textarea',
      rows: 3,
      placeholder: `请输入${label}`,
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
    selectOptions: Array<{ label: string; value: any }>,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NSelect',
    componentProps: {
      placeholder: `请选择${label}`,
      options: selectOptions,
      clearable: true
    },
    ...options
  }),

  /**
   * 多选选择器
   */
  multiSelect: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    selectOptions: Array<{ label: string; value: any }>,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NSelect',
    componentProps: {
      placeholder: `请选择${label}`,
      options: selectOptions,
      clearable: true,
      multiple: true
    },
    ...options
  }),

  /**
   * 单选框组
   */
  radio: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    radioOptions: Array<{ label: string; value: any }>,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NRadioGroup',
    componentProps: {
      options: radioOptions
    },
    ...options
  }),

  /**
   * 复选框组
   */
  checkbox: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    checkboxOptions: Array<{ label: string; value: any }>,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NCheckboxGroup',
    componentProps: {
      options: checkboxOptions
    },
    ...options
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
   * 日期时间选择器
   */
  datetime: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NDatePicker',
    componentProps: {
      type: 'datetime',
      placeholder: `请选择${label}`,
      clearable: true
    },
    ...options
  }),

  /**
   * 日期范围选择器
   */
  dateRange: <T extends Record<string, any> = any>(
    field: keyof T | string,
    label: string,
    options?: Partial<QuickFieldOptions<T>>
  ): QuickFieldOptions<T> => ({
    field,
    label,
    component: 'NDatePicker',
    componentProps: {
      type: 'daterange',
      placeholder: [`开始${label}`, `结束${label}`],
      clearable: true
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

/**
 * 验证规则预设
 */
export const RulePresets = {
  /**
   * 必填规则
   * @param message 错误信息
   */
  required: (message?: string): FormItemRule => ({
    required: true,
    message: message || '此项为必填项',
    trigger: ['blur', 'input']
  }),

  /**
   * 邮箱验证规则
   * @param message 错误信息
   */
  email: (message?: string): FormItemRule => ({
    type: 'email',
    message: message || '请输入正确的邮箱地址',
    trigger: ['blur', 'input']
  }),

  /**
   * 手机号验证规则
   * @param message 错误信息
   */
  phone: (message?: string): FormItemRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '请输入正确的手机号码',
    trigger: ['blur', 'input']
  }),

  /**
   * 长度范围验证规则
   * @param min 最小长度
   * @param max 最大长度
   * @param message 错误信息
   */
  length: (min: number, max: number, message?: string): FormItemRule => ({
    min,
    max,
    message: message || `长度应在 ${min} 到 ${max} 个字符之间`,
    trigger: ['blur', 'input']
  }),

  /**
   * 最小长度验证规则
   * @param min 最小长度
   * @param message 错误信息
   */
  minLength: (min: number, message?: string): FormItemRule => ({
    min,
    message: message || `最少输入 ${min} 个字符`,
    trigger: ['blur', 'input']
  }),

  /**
   * 最大长度验证规则
   * @param max 最大长度
   * @param message 错误信息
   */
  maxLength: (max: number, message?: string): FormItemRule => ({
    max,
    message: message || `最多输入 ${max} 个字符`,
    trigger: ['blur', 'input']
  }),

  /**
   * 数值范围验证规则
   * @param min 最小值
   * @param max 最大值
   * @param message 错误信息
   */
  range: (min: number, max: number, message?: string): FormItemRule => ({
    type: 'number',
    min,
    max,
    message: message || `数值应在 ${min} 到 ${max} 之间`,
    trigger: ['blur', 'change']
  }),

  /**
   * 正则表达式验证规则
   * @param pattern 正则表达式
   * @param message 错误信息
   */
  pattern: (pattern: RegExp, message: string): FormItemRule => ({
    pattern,
    message,
    trigger: ['blur', 'input']
  }),

  /**
   * 自定义验证规则
   * @param validator 验证函数
   * @param message 错误信息
   */
  custom: (
    validator: (rule: any, value: any) => boolean | Promise<boolean>,
    message: string
  ): FormItemRule => ({
    validator: (rule, value) => {
      const result = validator(rule, value)
      if (result instanceof Promise) {
        return result.then(valid =>
          valid ? Promise.resolve() : Promise.reject(new Error(message))
        )
      }
      return result ? Promise.resolve() : Promise.reject(new Error(message))
    },
    trigger: ['blur', 'change']
  })
}

/**
 * 工具函数
 */
export const FormUtils = {
  /**
   * 合并验证规则
   * @param rules 规则数组
   */
  combineRules: (
    ...rules: (FormItemRule | FormItemRule[])[]
  ): FormItemRule[] => {
    return rules.flat().filter(Boolean)
  },

  /**
   * 创建条件显示函数
   * @param condition 条件函数
   */
  createIfShow: <T extends Record<string, any>>(
    condition: (formModel: T) => boolean
  ): ((formModel: T) => boolean) => {
    return condition
  },

  /**
   * 创建字段变化处理函数
   * @param handler 处理函数
   */
  createOnChange: <T extends Record<string, any>>(
    handler: (value: any, formModel: T, methods: CleverFormMethods<T>) => void
  ): ((value: any, formModel: T, methods: CleverFormMethods<T>) => void) => {
    return handler
  },

  /**
   * 创建依赖字段的条件显示
   * @param dependField 依赖字段
   * @param condition 条件函数
   */
  createDependentShow: <T extends Record<string, any>>(
    dependField: keyof T,
    condition: (value: any) => boolean
  ): ((formModel: T) => boolean) => {
    return (formModel: T) => condition(formModel[dependField])
  },

  /**
   * 创建字段联动处理
   * @param targetField 目标字段
   * @param valueMapper 值映射函数
   */
  createFieldLink: <T extends Record<string, any>>(
    targetField: keyof T,
    valueMapper: (value: any) => any
  ): ((value: any, formModel: T, methods: CleverFormMethods<T>) => void) => {
    return (value, formModel, methods) => {
      const mappedValue = valueMapper(value)
      methods.setFieldValue(targetField as string, mappedValue)
    }
  },

  /**
   * 创建选项过滤器
   * @param allOptions 所有选项
   * @param filterFn 过滤函数
   */
  createOptionFilter: <T = any>(
    allOptions: Array<{ label: string; value: T }>,
    filterFn: (option: { label: string; value: T }, formModel: any) => boolean
  ) => {
    return (formModel: any) =>
      allOptions.filter(option => filterFn(option, formModel))
  }
}

/**
 * 快速创建表单构建器
 * @template T 表单数据类型
 */
export function createFormBuilder<
  T extends Record<string, any> = any
>(): FormBuilder<T> {
  return new FormBuilder<T>()
}

/**
 * 快速创建网格布局构建器
 * @template T 表单数据类型
 */
export function createGridBuilder<
  T extends Record<string, any> = any
>(): GridLayoutBuilder<T> {
  return new GridLayoutBuilder<T>()
}

/**
 * 快速创建Flex布局构建器
 * @template T 表单数据类型
 */
export function createFlexBuilder<
  T extends Record<string, any> = any
>(): FlexLayoutBuilder<T> {
  return new FlexLayoutBuilder<T>()
}

/**
 * 快速创建表单配置
 * @param config 配置函数
 */
export function defineForm<T extends Record<string, any> = any>(
  config: (builder: FormBuilder<T>) => FormBuilder<T>
): CleverFormProps<T> {
  const builder = createFormBuilder<T>()
  return config(builder).build()
}

/**
 * 快速创建字段数组
 * @param fields 字段配置数组
 */
export function defineFields<T extends Record<string, any> = any>(
  fields: QuickFieldOptions<T>[]
): FormFieldSchema<T>[] {
  return (fields || []).map(field => createField(field))
}

/**
 * 快速创建分组
 * @param title 分组标题
 * @param fields 字段数组
 * @param options 分组选项
 */
export function defineGroup<T extends Record<string, any> = any>(
  title: string,
  fields: QuickFieldOptions<T>[],
  options?: {
    collapsed?: boolean
    showMode?: FormGroupSchema<T>['showMode']
  }
): FormGroupSchema<T> {
  return {
    type: 'group',
    title,
    fields: defineFields(fields),
    ...options
  }
}
