/**
 * CleverForm 核心类型定义
 * 重构后的类型系统，提供更好的类型安全和扩展性
 */

import type { Component, VNode } from 'vue'
import type { FormItemRule, FormProps as NFormProps } from 'naive-ui'
import type { ButtonProps } from 'naive-ui/lib/button'

// ============= 基础类型 =============

/** 表单字段值类型 */
export type FormFieldValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | any[]

/** 表单数据模型 */
export type FormModel<T = Record<string, any>> = T

/** 字段路径类型 */
export type FieldPath<T> = keyof T | string

// ============= 组件类型映射 =============

/** 支持的表单组件类型 */
export type ComponentType =
  | 'input'
  | 'textarea'
  | 'input-number'
  | 'select'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'radio-group'
  | 'date-picker'
  | 'time-picker'
  | 'datetime-picker'
  | 'switch'
  | 'slider'
  | 'rate'
  | 'upload'
  | 'cascader'
  | 'tree-select'
  | 'auto-complete'
  | 'mention'
  | 'color-picker'
  | 'transfer'
  | 'dynamic-tags'
  | 'custom'

/** 组件属性映射 */
export interface ComponentPropsMap {
  input: Record<string, any>
  textarea: Record<string, any>
  'input-number': Record<string, any>
  select: { options?: OptionItem[] } & Record<string, any>
  checkbox: Record<string, any>
  'checkbox-group': { options?: OptionItem[] } & Record<string, any>
  radio: Record<string, any>
  'radio-group': { options?: OptionItem[] } & Record<string, any>
  'date-picker': Record<string, any>
  'time-picker': Record<string, any>
  'datetime-picker': Record<string, any>
  switch: Record<string, any>
  slider: Record<string, any>
  rate: Record<string, any>
  upload: Record<string, any>
  cascader: { options?: CascaderOption[] } & Record<string, any>
  'tree-select': { options?: TreeSelectOption[] } & Record<string, any>
  'auto-complete': { options?: OptionItem[] } & Record<string, any>
  mention: { options?: OptionItem[] } & Record<string, any>
  'color-picker': Record<string, any>
  transfer: { options?: TransferOption[] } & Record<string, any>
  'dynamic-tags': Record<string, any>
  custom: Record<string, any>
}

// ============= 选项类型 =============

/** 基础选项项 */
export interface OptionItem {
  label: string
  value: any
  disabled?: boolean
  [key: string]: any
}

/** 级联选择器选项 */
export interface CascaderOption extends OptionItem {
  children?: CascaderOption[]
}

/** 树选择器选项 */
export interface TreeSelectOption extends OptionItem {
  children?: TreeSelectOption[]
  key?: string | number
}

/** 穿梭框选项 */
export interface TransferOption extends OptionItem {
  key?: string | number
}

// ============= 布局类型 =============

/** 布局模式 */
export type LayoutMode = 'grid' | 'flex' | 'inline' | 'vertical'

/** 响应式断点 */
export interface ResponsiveConfig {
  xs?: number | { span?: number; offset?: number }
  sm?: number | { span?: number; offset?: number }
  md?: number | { span?: number; offset?: number }
  lg?: number | { span?: number; offset?: number }
  xl?: number | { span?: number; offset?: number }
  xxl?: number | { span?: number; offset?: number }
}

/** 网格布局配置 */
export interface GridLayoutConfig {
  /** 列数配置 */
  cols?: string | number
  /** 行间距 */
  xGap?: number
  /** 列间距 */
  yGap?: number
  /** 响应式配置 */
  responsive?: boolean
}

/** Flex布局配置 */
export interface FlexLayoutConfig {
  /** 主轴方向 */
  direction?: 'row' | 'column'
  /** 换行方式 */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  /** 主轴对齐 */
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  /** 交叉轴对齐 */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  /** 间距 */
  gap?: string | number
}

/** 布局配置 */
export interface LayoutConfig {
  /** 布局模式 */
  mode?: LayoutMode
  /** 网格布局配置 */
  grid?: GridLayoutConfig
  /** Flex布局配置 */
  flex?: FlexLayoutConfig
}

// ============= 表单字段Schema =============

/** 字段显示模式 */
export type FieldShowMode = 'edit' | 'view' | 'disabled' | 'hidden'

/** 字段布局配置 */
export interface FieldLayoutConfig {
  /** 占用列数 */
  span?: number
  /** 偏移列数 */
  offset?: number
  /** 响应式配置 */
  responsive?: ResponsiveConfig
  /** 自定义样式 */
  style?: Record<string, any>
  /** 自定义类名 */
  className?: string
}

/** 表单方法接口 */
export interface FormMethods<T = Record<string, any>> {
  /** 设置字段值 */
  setFieldValue: (field: FieldPath<T>, value: any) => void
  /** 获取字段值 */
  getFieldValue: (field: FieldPath<T>) => any
  /** 设置表单数据 */
  setFormData: (data: Partial<T>) => void
  /** 获取表单数据 */
  getFormData: () => T
  /** 重置表单 */
  resetFields: () => Promise<void>
  /** 清除验证 */
  clearValidate: (fields?: FieldPath<T> | FieldPath<T>[]) => Promise<void>
  /** 验证表单 */
  validate: (fields?: FieldPath<T>[]) => Promise<any>
  /** 提交表单 */
  submit: () => Promise<any>
}

/** 表单字段Schema */
export interface FormFieldSchema<T = Record<string, any>> {
  /** 字段名 */
  field: FieldPath<T>
  /** 标签文本 */
  label: string
  /** 组件类型 */
  component: ComponentType

  // 可选属性
  /** 默认值 */
  defaultValue?: FormFieldValue
  /** 组件属性 */
  componentProps?: ComponentPropsMap[ComponentType]
  /** 自定义组件 */
  customComponent?: Component | string
  /** 自定义渲染函数 */
  render?: (props: {
    value: any
    field: FieldPath<T>
    formData: T
    methods: FormMethods<T>
  }) => VNode | string

  // 验证相关
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: FormItemRule | FormItemRule[]

  // 显示控制
  /** 显示模式 */
  showMode?: FieldShowMode
  /** 条件显示 */
  ifShow?: (formData: T, methods: FormMethods<T>) => boolean

  // 布局相关
  /** 字段布局配置 */
  layout?: FieldLayoutConfig
  /** 是否占满整行 */
  fullWidth?: boolean

  // 标签相关
  /** 标签宽度 */
  labelWidth?: string | number
  /** 标签提示信息 */
  labelTooltip?: string
  /** 标签提示样式 */
  labelTooltipStyle?: Record<string, any>

  // 其他
  /** 后缀文本 */
  suffix?: string
  /** 前缀文本 */
  prefix?: string
  /** 帮助文本 */
  help?: string
  /** 额外信息 */
  extra?: string

  // 事件回调
  /** 值变化回调 */
  onChange?: (
    value: any,
    oldValue: any,
    formData: T,
    methods: FormMethods<T>
  ) => void | Promise<void>
  /** 失焦回调 */
  onBlur?: (value: any, formData: T, methods: FormMethods<T>) => void
  /** 聚焦回调 */
  onFocus?: (value: any, formData: T, methods: FormMethods<T>) => void

  // 插槽
  /** 自定义插槽名 */
  slot?: string

  // 扩展属性
  [key: string]: any
}

// ============= 表单配置 =============

/** 表单配置 */
export interface FormConfig<T = Record<string, any>>
  extends Omit<NFormProps, 'model'> {
  /** 表单字段配置 */
  schemas: FormFieldSchema<T>[]
  /** 表单数据 */
  model?: T
  /** 布局配置 */
  layout?: LayoutConfig

  // 操作按钮配置
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 是否显示提交按钮 */
  showSubmit?: boolean
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 提交按钮配置 */
  submitButton?: ButtonProps & { text?: string }
  /** 重置按钮配置 */
  resetButton?: ButtonProps & { text?: string }

  // 事件回调
  /** 提交回调 */
  onSubmit?: (formData: T) => void | Promise<void>
  /** 重置回调 */
  onReset?: () => void | Promise<void>
  /** 字段值变化回调 */
  onFieldChange?: (field: FieldPath<T>, value: any, formData: T) => void
}

// ============= 导出默认配置 =============

/** 默认布局配置 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  mode: 'grid',
  grid: {
    cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  },
  flex: {
    direction: 'row',
    wrap: 'wrap',
    gap: '16px',
    align: 'flex-start'
  }
}

/** 默认表单配置 */
export const DEFAULT_FORM_CONFIG: Partial<FormConfig> = {
  labelPlacement: 'left',
  labelWidth: 'auto',
  size: 'medium',
  showActions: true,
  showSubmit: true,
  showReset: true,
  submitButton: {
    type: 'primary',
    text: '提交'
  },
  resetButton: {
    text: '重置'
  },
  layout: DEFAULT_LAYOUT_CONFIG
}
