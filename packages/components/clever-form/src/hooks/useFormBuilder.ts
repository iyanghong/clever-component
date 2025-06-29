/**
 * useFormBuilder 组合式函数
 * @description 表单构建器逻辑的组合式API，用于快速构建动态表单JSON配置
 * 借鉴 schema-helpers.ts 的构建器模式，提供链式调用和预设配置
 */

import { ref, computed, reactive, watch, nextTick, onUnmounted } from 'vue'
import type { UseFormBuilderOptions, UseFormBuilderReturn } from './types'
import type {
  FormFieldConfig,
  ContainerConfig,
  LayoutItemConfig,
  LayoutState,
  ContainerType,
  BaseContainerConfig
} from '../types'
import { object, form as formUtils, error } from '../utils'
import { ERROR_CODES, COMPONENT_NAMES } from '../constants'
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
  component: string
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
  ifShow?: (formModel: T, value: any, methods: any) => boolean
  /** 字段值变化回调 */
  onChange?: (
    newValue: any,
    oldValue: any,
    methods: any
  ) => void | Promise<void>
  /** 字段布局配置 */
  layout?: {
    span?: number
    offset?: number
    isFull?: boolean
  }
  /** 字段分组配置 */
  group?: string
  /** 显示模式 */
  showMode?: 'edit' | 'view' | 'both'
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
 * 快速创建表单字段配置
 * @template T 表单数据类型
 * @param options 字段配置选项
 * @returns 完整的FormFieldConfig对象
 */
export function createField<T extends Record<string, any> = any>(
  options: QuickFieldOptions<T>
): FormFieldConfig {
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

  // 构建基础配置
  const fieldConfig: FormFieldConfig = {
    type: 'field',
    field: field as string,
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
    fieldConfig.rules = Array.isArray(rules) ? rules : [rules]
  } else if (required) {
    // 如果设置了required但没有rules，自动添加必填规则
    fieldConfig.rules = [
      {
        required: true,
        message: `请输入${label}`,
        trigger: ['blur', 'input']
      }
    ]
  }

  // 处理布局配置
  if (layout || span !== undefined || isFull !== undefined) {
    fieldConfig.layout = {
      ...layout,
      ...(span !== undefined && { span }),
      ...(isFull !== undefined && { span: isFull ? 24 : span || 12 })
    }
  }

  // 处理分组配置
  if (group) {
    fieldConfig.group = group
  }

  return fieldConfig
}

/**
 * 字段预设配置
 * 提供常用字段类型的快速创建方法
 */
export const FieldPresets = {
  /** 文本输入框 */
  input: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-input',
    componentProps: {
      placeholder: `请输入${label}`,
      clearable: true,
      ...options.componentProps
    },
    ...options
  }),

  /** 密码输入框 */
  password: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-input',
    componentProps: {
      type: 'password',
      placeholder: `请输入${label}`,
      clearable: true,
      showPasswordOn: 'click',
      ...options.componentProps
    },
    ...options
  }),

  /** 数字输入框 */
  number: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-input-number',
    componentProps: {
      placeholder: `请输入${label}`,
      clearable: true,
      ...options.componentProps
    },
    ...options
  }),

  /** 文本域 */
  textarea: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-input',
    componentProps: {
      type: 'textarea',
      placeholder: `请输入${label}`,
      clearable: true,
      rows: 3,
      ...options.componentProps
    },
    ...options
  }),

  /** 单选选择器 */
  select: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-select',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true,
      options: [],
      ...options.componentProps
    },
    ...options
  }),

  /** 多选选择器 */
  multiSelect: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-select',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true,
      multiple: true,
      options: [],
      ...options.componentProps
    },
    ...options
  }),

  /** 单选框组 */
  radio: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-radio-group',
    componentProps: {
      options: [],
      ...options.componentProps
    },
    ...options
  }),

  /** 复选框组 */
  checkbox: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-checkbox-group',
    componentProps: {
      options: [],
      ...options.componentProps
    },
    ...options
  }),

  /** 日期选择器 */
  date: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-date-picker',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true,
      type: 'date',
      ...options.componentProps
    },
    ...options
  }),

  /** 日期时间选择器 */
  datetime: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-date-picker',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true,
      type: 'datetime',
      ...options.componentProps
    },
    ...options
  }),

  /** 时间选择器 */
  time: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-time-picker',
    componentProps: {
      placeholder: `请选择${label}`,
      clearable: true,
      ...options.componentProps
    },
    ...options
  }),

  /** 开关 */
  switch: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-switch',
    defaultValue: false,
    ...options
  }),

  /** 滑块 */
  slider: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-slider',
    componentProps: {
      min: 0,
      max: 100,
      step: 1,
      ...options.componentProps
    },
    defaultValue: 0,
    ...options
  }),

  /** 评分 */
  rate: (field: string, label: string, options: Partial<QuickFieldOptions> = {}): QuickFieldOptions => ({
    field,
    label,
    component: 'n-rate',
    componentProps: {
      clearable: true,
      ...options.componentProps
    },
    defaultValue: 0,
    ...options
  })
}

/**
 * 验证规则预设
 * 提供常用验证规则的快速创建方法
 */
export const RulePresets = {
  /** 必填规则 */
  required: (message?: string): FormItemRule => ({
    required: true,
    message: message || '此项为必填项',
    trigger: ['blur', 'input']
  }),

  /** 邮箱验证 */
  email: (message?: string): FormItemRule => ({
    type: 'email',
    message: message || '请输入正确的邮箱地址',
    trigger: ['blur', 'input']
  }),

  /** 手机号验证 */
  phone: (message?: string): FormItemRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '请输入正确的手机号码',
    trigger: ['blur', 'input']
  }),

  /** 长度范围验证 */
  length: (min: number, max: number, message?: string): FormItemRule => ({
    min,
    max,
    message: message || `长度应在${min}-${max}个字符之间`,
    trigger: ['blur', 'input']
  }),

  /** 最小长度验证 */
  minLength: (min: number, message?: string): FormItemRule => ({
    min,
    message: message || `最少输入${min}个字符`,
    trigger: ['blur', 'input']
  }),

  /** 最大长度验证 */
  maxLength: (max: number, message?: string): FormItemRule => ({
    max,
    message: message || `最多输入${max}个字符`,
    trigger: ['blur', 'input']
  }),

  /** 数值范围验证 */
  range: (min: number, max: number, message?: string): FormItemRule => ({
    type: 'number',
    min,
    max,
    message: message || `数值应在${min}-${max}之间`,
    trigger: ['blur', 'change']
  }),

  /** 正则表达式验证 */
  pattern: (pattern: RegExp, message: string): FormItemRule => ({
    pattern,
    message,
    trigger: ['blur', 'input']
  }),

  /** 自定义验证 */
  custom: (validator: (rule: any, value: any) => boolean | Error | Promise<void>, message?: string): FormItemRule => ({
    validator,
    message,
    trigger: ['blur', 'change']
  })
}

/**
 * 表单工具函数
 */
export const FormUtils = {
  /** 合并多个验证规则数组 */
  combineRules: (...ruleArrays: (FormItemRule | FormItemRule[])[]): FormItemRule[] => {
    const result: FormItemRule[] = []
    ruleArrays.forEach(rules => {
      if (Array.isArray(rules)) {
        result.push(...rules)
      } else if (rules) {
        result.push(rules)
      }
    })
    return result
  },

  /** 创建条件显示函数 */
  createIfShow: <T extends Record<string, any>>(
    condition: (formModel: T) => boolean
  ) => condition,

  /** 创建字段变化处理函数 */
  createOnChange: <T extends Record<string, any>>(
    handler: (newValue: any, oldValue: any, formModel: T, methods: any) => void
  ) => handler,

  /** 创建依赖字段的条件显示 */
  createDependentShow: <T extends Record<string, any>>(
    dependentField: keyof T,
    expectedValue: any
  ) => (formModel: T) => formModel[dependentField] === expectedValue,

  /** 创建字段联动处理 */
  createFieldLink: <T extends Record<string, any>>(
    targetField: keyof T,
    valueMapper: (sourceValue: any, formModel: T) => any
  ) => (newValue: any, oldValue: any, formModel: T, methods: any) => {
    methods.setFieldValue(targetField, valueMapper(newValue, formModel))
  },

  /** 创建选项过滤器 */
  createOptionFilter: (
    allOptions: any[],
    filterFn: (option: any, formModel: any) => boolean
  ) => (formModel: any) => allOptions.filter(option => filterFn(option, formModel))
}

/**
 * 布局构建器基类
 * @template T 表单数据类型
 */
abstract class BaseLayoutBuilder<T extends Record<string, any> = any> {
  protected items: LayoutItemConfig[] = []
  protected fieldOrder = 0

  /**
   * 添加单个字段
   * @param options 字段配置选项
   */
  addField(options: QuickFieldOptions<T>): this {
    const fieldConfig = createField({
      ...options,
      order: options.order ?? this.fieldOrder++
    })
    
    const layoutItem: LayoutItemConfig = {
      type: 'field',
      config: fieldConfig,
      layout: fieldConfig.layout || {}
    }
    
    this.items.push(layoutItem)
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
   * 根据条件添加字段
   * @param condition 条件函数或布尔值
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
   * 添加容器
   * @param containerType 容器类型
   * @param config 容器配置
   */
  addContainer(
    containerType: ContainerType,
    config: Partial<BaseContainerConfig> = {}
  ): this {
    const containerConfig: ContainerConfig = {
      type: containerType,
      title: config.title || `${containerType}容器`,
      description: config.description,
      ifShow: config.ifShow,
      children: config.children || [],
      responsive: config.responsive,
      props: config.props,
      customRender: config.customRender,
      className: config.className,
      style: config.style
    }

    const layoutItem: LayoutItemConfig = {
      type: 'container',
      config: containerConfig,
      layout: {}
    }

    this.items.push(layoutItem)
    return this
  }

  /**
   * 清空所有项目
   */
  clear(): this {
    this.items = []
    this.fieldOrder = 0
    return this
  }

  /**
   * 获取当前项目数量
   */
  getCount(): number {
    return this.items.length
  }

  /**
   * 抽象方法：构建最终结果
   */
  abstract build(): any
}

/**
 * 表单构建器
 * @template T 表单数据类型
 */
export class FormBuilder<T extends Record<string, any> = any> extends BaseLayoutBuilder<T> {
  private formConfig: any = {
    items: [],
    layout: {
      type: 'grid',
      cols: 2,
      xGap: 16,
      yGap: 16
    },
    formProps: {
      labelWidth: 'auto',
      labelPlacement: 'left',
      size: 'medium'
    }
  }

  /**
   * 设置表单属性
   * @param props 表单属性
   */
  setFormProps(props: Record<string, any>): this {
    this.formConfig.formProps = { ...this.formConfig.formProps, ...props }
    return this
  }

  /**
   * 设置布局配置
   * @param layout 布局配置
   */
  setLayout(layout: Record<string, any>): this {
    this.formConfig.layout = { ...this.formConfig.layout, ...layout }
    return this
  }

  /**
   * 设置网格布局
   * @param cols 列数
   * @param xGap 水平间距
   * @param yGap 垂直间距
   */
  setGridLayout(cols: number = 2, xGap: number = 16, yGap: number = 16): this {
    this.formConfig.layout = {
      type: 'grid',
      cols,
      xGap,
      yGap
    }
    return this
  }

  /**
   * 设置Flex布局
   * @param direction 方向
   * @param wrap 是否换行
   * @param justify 主轴对齐
   * @param align 交叉轴对齐
   * @param gap 间距
   */
  setFlexLayout(
    direction: 'row' | 'column' = 'row',
    wrap: boolean = false,
    justify: string = 'start',
    align: string = 'start',
    gap: number = 16
  ): this {
    this.formConfig.layout = {
      type: 'flex',
      direction,
      wrap,
      justify,
      align,
      gap
    }
    return this
  }

  /**
   * 合并其他构建器的结果
   * @param builder 其他构建器
   */
  merge(builder: BaseLayoutBuilder<T>): this {
    const result = builder.build()
    if (result.items) {
      this.items.push(...result.items)
    }
    return this
  }

  /**
   * 构建最终配置
   */
  build(): any {
    return {
      ...this.formConfig,
      items: this.items
    }
  }
}

/**
 * 快速创建表单构建器
 * @template T 表单数据类型
 */
export function createFormBuilder<T extends Record<string, any> = any>(): FormBuilder<T> {
  return new FormBuilder<T>()
}

/**
 * 快速创建表单配置
 * @template T 表单数据类型
 * @param builderFn 构建器函数
 */
export function defineForm<T extends Record<string, any> = any>(
  builderFn: (builder: FormBuilder<T>) => FormBuilder<T>
): any {
  const builder = createFormBuilder<T>()
  return builderFn(builder).build()
}

/**
 * 快速创建字段数组
 * @template T 表单数据类型
 * @param fields 字段配置数组
 */
export function defineFields<T extends Record<string, any> = any>(
  fields: QuickFieldOptions<T>[]
): LayoutItemConfig[] {
  return fields.map(field => ({
    type: 'field' as const,
    config: createField(field),
    layout: field.layout || {}
  }))
}

/**
 * 表单构建器组合式函数
 * @param options 配置选项
 * @returns 构建器状态和方法
 */
export function useFormBuilder(options: UseFormBuilderOptions = {}): UseFormBuilderReturn {
  const {
    initialConfig,
    draggable = true,
    components = {}
  } = options

  // 响应式状态
  const formBuilder = ref<FormBuilder>(new FormBuilder())
  const currentConfig = ref<any>(object.deepClone(initialConfig) || createEmptyConfig())
  const selectedItem = ref<LayoutItemConfig | null>(null)
  const editing = ref<boolean>(false)
  const layoutState = ref<LayoutState>({
    activeTabs: {},
    expandedGroups: {},
    expandedPanels: {},
    currentSteps: {},
    breakpoint: 'lg'
  })

  // 内部状态
  const history = ref<any[]>([])
  const historyIndex = ref<number>(-1)
  const maxHistorySize = 50
  const destroyed = ref<boolean>(false)
  const fieldIdCounter = ref<number>(0)
  const containerIdCounter = ref<number>(0)

  // 计算属性
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const hasChanges = computed(() => {
    if (!initialConfig || !currentConfig.value) return false
    return JSON.stringify(initialConfig) !== JSON.stringify(currentConfig.value)
  })
  const itemCount = computed(() => {
    return currentConfig.value?.items?.length || 0
  })

  /**
   * 获取构建器实例
   */
  const getBuilder = (): FormBuilder => {
    return formBuilder.value
  }

  /**
   * 使用构建器快速构建表单
   * @param builderFn 构建器函数
   */
  const buildForm = (builderFn: (builder: FormBuilder) => FormBuilder): void => {
    const builder = createFormBuilder()
    const config = builderFn(builder).build()
    setConfig(config)
  }

  /**
   * 添加字段
   * @param options 字段选项或字段配置
   * @param index 插入位置
   */
  const addField = (options: QuickFieldOptions | FormFieldConfig, index?: number): void => {
    if (destroyed.value || !currentConfig.value) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 确保有items数组
      if (!config.items) {
        config.items = []
      }

      // 创建字段配置
      const fieldConfig = 'type' in options ? options : createField(options)
      
      // 生成唯一ID
      if (!fieldConfig.id) {
        fieldConfig.id = generateFieldId()
      }

      // 创建布局项
      const layoutItem: LayoutItemConfig = {
        type: 'field',
        config: fieldConfig,
        layout: fieldConfig.layout || {}
      }

      // 插入字段
      if (typeof index === 'number' && index >= 0) {
        config.items.splice(index, 0, layoutItem)
      } else {
        config.items.push(layoutItem)
      }

      // 更新配置
      updateConfig(config)
      
      // 选中新添加的字段
      selectItem(layoutItem)
    } catch (err) {
      console.error('添加字段失败:', err)
    }
  }

  /**
   * 移除字段
   * @param index 字段索引
   */
  const removeField = (index: number): void => {
    if (destroyed.value || !currentConfig.value?.items) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 确保有items数组
      if (!config.items) {
        config.items = []
      }

      // 检查索引有效性
      if (index < 0 || index >= config.items.length) {
        console.warn('移除字段失败: 索引无效')
        return
      }

      // 获取要移除的项
      const removedItem = config.items[index]
      
      // 移除字段
      config.items.splice(index, 1)
      
      // 如果移除的是当前选中项，清除选择
      if (selectedItem.value === removedItem) {
        clearSelection()
      }
      
      // 更新配置
      updateConfig(config)
    } catch (err) {
      console.error('移除字段失败:', err)
    }
  }

  /**
   * 更新字段
   * @param index 字段索引
   * @param fieldConfig 新的字段配置
   */
  const updateField = (index: number, fieldConfig: Partial<FormFieldConfig>): void => {
    if (destroyed.value || !currentConfig.value?.items) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 检查索引有效性
      if (index < 0 || index >= config.items.length) {
        console.warn('更新字段失败: 索引无效')
        return
      }

      const item = config.items[index]
      if (item.type !== 'field') {
        console.warn('更新字段失败: 指定索引不是字段')
        return
      }

      // 更新字段配置
      config.items[index] = {
        ...item,
        config: {
          ...item.config,
          ...fieldConfig
        }
      }
      
      // 如果是当前选中项，同步更新选中状态
      if (selectedItem.value === item) {
        selectedItem.value = config.items[index]
      }
      
      // 更新配置
      updateConfig(config)
    } catch (err) {
      console.error('更新字段失败:', err)
    }
  }

  /**
   * 移动字段位置
   * @param fromIndex 源索引
   * @param toIndex 目标索引
   */
  const moveField = (fromIndex: number, toIndex: number): void => {
    if (destroyed.value || !currentConfig.value?.items) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      const items = config.items
      
      // 检查索引有效性
      if (fromIndex < 0 || fromIndex >= items.length || 
          toIndex < 0 || toIndex >= items.length) {
        console.warn('移动字段失败: 索引无效')
        return
      }

      // 移动元素
      const [movedItem] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, movedItem)
      
      // 更新配置
      updateConfig(config)
    } catch (err) {
      console.error('移动字段失败:', err)
    }
  }

  /**
   * 添加容器
   * @param containerType 容器类型
   * @param config 容器配置
   * @param index 插入位置
   */
  const addContainer = (
    containerType: ContainerType,
    config: Partial<BaseContainerConfig> = {},
    index?: number
  ): void => {
    if (destroyed.value || !currentConfig.value) {
      return
    }

    try {
      const formConfig = object.deepClone(currentConfig.value)
      
      // 确保有items数组
      if (!formConfig.items) {
        formConfig.items = []
      }

      // 创建容器配置
      const containerConfig: ContainerConfig = {
        type: containerType,
        title: config.title || `${containerType}容器`,
        description: config.description,
        ifShow: config.ifShow,
        children: config.children || [],
        responsive: config.responsive,
        props: config.props,
        customRender: config.customRender,
        className: config.className,
        style: config.style,
        ...getDefaultContainerConfig(containerType)
      }

      // 生成唯一ID
      const containerId = generateContainerId()

      // 创建布局项
      const layoutItem: LayoutItemConfig = {
        type: 'container',
        config: containerConfig,
        layout: {}
      }

      // 插入容器
      if (typeof index === 'number' && index >= 0) {
        formConfig.items.splice(index, 0, layoutItem)
      } else {
        formConfig.items.push(layoutItem)
      }

      // 更新配置
      updateConfig(formConfig)
      
      // 选中新添加的容器
      selectItem(layoutItem)
    } catch (err) {
      console.error('添加容器失败:', err)
    }
  }

  /**
   * 移除容器
   * @param index 容器索引
   */
  const removeContainer = (index: number): void => {
    if (destroyed.value || !currentConfig.value?.items) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 检查索引有效性
      if (index < 0 || index >= config.items.length) {
        console.warn('移除容器失败: 索引无效')
        return
      }

      // 获取要移除的项
      const removedItem = config.items[index]
      
      // 移除容器
      config.items.splice(index, 1)
      
      // 如果移除的是当前选中项，清除选择
      if (selectedItem.value === removedItem) {
        clearSelection()
      }
      
      // 更新配置
      updateConfig(config)
    } catch (err) {
      console.error('移除容器失败:', err)
    }
  }

  /**
   * 更新容器
   * @param index 容器索引
   * @param containerConfig 新的容器配置
   */
  const updateContainer = (index: number, containerConfig: Partial<ContainerConfig>): void => {
    if (destroyed.value || !currentConfig.value?.items) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 检查索引有效性
      if (index < 0 || index >= config.items.length) {
        console.warn('更新容器失败: 索引无效')
        return
      }

      const item = config.items[index]
      if (item.type !== 'container') {
        console.warn('更新容器失败: 指定索引不是容器')
        return
      }

      // 更新容器配置
      config.items[index] = {
        ...item,
        config: {
          ...item.config,
          ...containerConfig
        }
      }
      
      // 如果是当前选中项，同步更新选中状态
      if (selectedItem.value === item) {
        selectedItem.value = config.items[index]
      }
      
      // 更新配置
      updateConfig(config)
    } catch (err) {
      console.error('更新容器失败:', err)
    }
  }

  /**
   * 选中项目
   * @param item 要选中的项目
   */
  const selectItem = (item: LayoutItemConfig): void => {
    selectedItem.value = item
    editing.value = true
  }

  /**
   * 清除选中状态
   */
  const clearSelection = (): void => {
    selectedItem.value = null
    editing.value = false
  }

  /**
   * 获取当前表单配置
   */
  const getConfig = () => {
    return object.deepClone(currentConfig.value)
  }

  /**
   * 设置表单配置
   * @param config 新的表单配置
   */
  const setConfig = (config: any): void => {
    currentConfig.value = object.deepClone(config)
    clearSelection()
    addToHistory(config)
  }

  /**
   * 重置表单
   * @param config 重置到的配置，默认为初始配置或空配置
   */
  const reset = (config?: any): void => {
    const resetConfig = config || initialConfig || createEmptyConfig()
    currentConfig.value = object.deepClone(resetConfig)
    clearSelection()
    
    // 重置历史记录
    history.value = [resetConfig]
    historyIndex.value = 0
  }

  /**
   * 撤销操作
   */
  const undo = (): void => {
    if (canUndo.value) {
      historyIndex.value--
      currentConfig.value = object.deepClone(history.value[historyIndex.value])
      clearSelection()
    }
  }

  /**
   * 重做操作
   */
  const redo = (): void => {
    if (canRedo.value) {
      historyIndex.value++
      currentConfig.value = object.deepClone(history.value[historyIndex.value])
      clearSelection()
    }
  }

  /**
   * 更新配置并记录历史
   * @param config 新配置
   */
  const updateConfig = (config: any): void => {
    currentConfig.value = config
    addToHistory(config)
  }

  /**
   * 添加到历史记录
   * @param config 配置
   */
  const addToHistory = (config: any): void => {
    // 移除当前位置之后的历史记录
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    
    // 添加新的历史记录
    history.value.push(object.deepClone(config))
    historyIndex.value = history.value.length - 1
    
    // 限制历史记录大小
    if (history.value.length > maxHistorySize) {
      history.value = history.value.slice(-maxHistorySize)
      historyIndex.value = history.value.length - 1
    }
  }

  /**
   * 生成字段ID
   */
  const generateFieldId = (): string => {
    return `field_${++fieldIdCounter.value}_${Date.now()}`
  }

  /**
   * 生成容器ID
   */
  const generateContainerId = (): string => {
    return `container_${++containerIdCounter.value}_${Date.now()}`
  }

  /**
   * 获取默认容器配置
   * @param containerType 容器类型
   */
  const getDefaultContainerConfig = (containerType: ContainerType): any => {
    const defaultConfigs = {
      grid: {
        cols: 2,
        xGap: 16,
        yGap: 16,
        responsive: 'screen'
      },
      flex: {
        direction: 'row',
        wrap: false,
        justify: 'start',
        align: 'start',
        gap: 16
      },
      tabs: {
        type: 'line',
        placement: 'top',
        defaultValue: undefined,
        tabs: []
      },
      group: {
        collapsible: false,
        defaultExpanded: true,
        bordered: true,
        titleAlign: 'left'
      },
      inline: {
        gap: 16,
        align: 'center'
      },
      vertical: {
        gap: 16,
        align: 'stretch'
      },
      card: {
        size: 'medium',
        bordered: true,
        hoverable: false
      },
      collapse: {
        accordion: false,
        defaultExpandedNames: [],
        panels: []
      },
      steps: {
        current: 0,
        status: 'process',
        direction: 'horizontal',
        size: 'medium',
        steps: []
      },
      custom: {
        component: null,
        props: {}
      }
    }
    
    return defaultConfigs[containerType] || {}
  }

  /**
   * 创建空的表单配置
   */
  const createEmptyConfig = () => {
    return {
      items: [],
      layout: {
        type: 'grid',
        cols: 2,
        xGap: 16,
        yGap: 16
      },
      formProps: {
        labelWidth: 'auto',
        labelPlacement: 'left',
        size: 'medium'
      }
    }
  }

  // 初始化历史记录
  if (currentConfig.value) {
    addToHistory(currentConfig.value)
  }

  // 组件卸载时清理资源
  onUnmounted(() => {
    destroyed.value = true
    history.value = []
    selectedItem.value = null
  })

  return {
    // 状态
    formBuilder,
    currentConfig,
    selectedItem,
    editing,
    layoutState,
    
    // 计算属性
    canUndo,
    canRedo,
    hasChanges,
    itemCount,
    
    // 构建器方法
    getBuilder,
    buildForm,
    
    // 字段操作方法
    createField,
    addField,
    removeField,
    updateField,
    moveField,
    
    // 容器操作方法
    addContainer,
    removeContainer,
    updateContainer,
    
    // 选择操作方法
    selectItem,
    clearSelection,
    
    // 配置操作方法
    getConfig,
    setConfig,
    reset,
    
    // 历史操作方法
    undo,
    redo,
    
    // 工具方法
    generateFieldId,
    generateContainerId
  }
}


