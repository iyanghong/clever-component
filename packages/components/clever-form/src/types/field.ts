/**
 * 字段相关类型定义
 * @description 定义表单字段的所有相关类型
 */

import type { Component, VNode } from 'vue'
import type {
  BaseComponentProps,
  ValidationRule,
  ConditionalFunction,
  DynamicValue,
  FieldEventHandler,
  OptionItem,
  ResponsiveConfig
} from './common'

// 字段组件类型
export type FieldComponentType =
  // 输入类
  | 'input'
  | 'textarea'
  | 'number-input'
  | 'password'
  | 'search'
  // 选择类
  | 'select'
  | 'radio-group'
  | 'checkbox-group'
  | 'cascader'
  | 'transfer'
  | 'tree-select'
  // 日期时间类
  | 'date-picker'
  | 'time-picker'
  | 'datetime-picker'
  | 'date-range-picker'
  | 'time-range-picker'
  // 其他类
  | 'switch'
  | 'slider'
  | 'rate'
  | 'color-picker'
  | 'upload'
  | 'mention'
  | 'auto-complete'
  // 自定义
  | 'custom'

// 字段基础配置
export interface BaseFieldConfig extends BaseComponentProps {
  // 字段标识
  field: string
  // 字段标签
  label: string

  labelWidth?: string | number
  // 字段类型
  component: FieldComponentType
  // 默认值
  defaultValue?: any
  // 占位符
  placeholder?: string
  // 帮助文本
  help?: string
  // 是否必填
  required?: boolean
  // 条件显示
  show?: boolean | ConditionalFunction
  // 条件禁用
  disabled?: boolean | ConditionalFunction
  // 条件只读
  readonly?: boolean | ConditionalFunction
  // 验证规则
  rules?: ValidationRule[]
  // 字段属性（传递给具体组件）
  props?: Record<string, any>
  // 字段事件
  events?: Record<string, FieldEventHandler>
  // 自定义渲染
  render?: (value: any, model: Record<string, any>) => VNode
  // 响应式配置
  responsive?: ResponsiveConfig
  // 字段分组
  group?: string
  // 排序权重
  order?: number
}

// 输入类字段配置
export interface InputFieldConfig extends BaseFieldConfig {
  component: 'input' | 'textarea' | 'password' | 'search'
  type?: 'input' | 'password' | 'email' | 'url' | 'tel'
  inputType?: 'text' | 'email' | 'url' | 'tel' | 'number'
  maxlength?: number
  minlength?: number
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  showCount?: boolean
  clearable?: boolean
  pattern?: string | RegExp
  patternMessage?: string
  validator?: (value: any, config: InputFieldConfig) => boolean | string | Promise<boolean | string>
  onEnter?: (event: KeyboardEvent) => void
  prefix?: Component | VNode | string
  suffix?: Component | VNode | string
  inputProps?: Record<string, any>
  props?: {
    type?: 'text' | 'email' | 'url' | 'tel'
    maxlength?: number
    minlength?: number
    showCount?: boolean
    clearable?: boolean
    autosize?: boolean | { minRows?: number; maxRows?: number }
    rows?: number
    resizable?: boolean
    [key: string]: any
  }
}

// 数字输入字段配置
export interface NumberInputFieldConfig extends BaseFieldConfig {
  component: 'number-input'
  props?: {
    min?: number
    max?: number
    step?: number
    precision?: number
    showButton?: boolean
    buttonPlacement?: 'both' | 'right'
    clearable?: boolean
    [key: string]: any
  }
}

// 选择类字段配置
export interface SelectFieldConfig extends BaseFieldConfig {
  component:
    | 'select'
    | 'radio-group'
    | 'checkbox-group'
    | 'cascader'
    | 'transfer'
    | 'tree-select'
  // 选项数据
  options?: OptionItem[] | DynamicValue<OptionItem[]>
  // 远程数据源
  remote?: {
    url: string
    method?: 'GET' | 'POST'
    params?: Record<string, any>
    transform?: (data: any) => OptionItem[]
  }
  props?: {
    multiple?: boolean
    filterable?: boolean
    clearable?: boolean
    maxTagCount?: number
    checkStrategy?: 'all' | 'parent' | 'child'
    cascade?: boolean
    showPath?: boolean
    separator?: string
    [key: string]: any
  }
}

// 日期时间字段配置
export interface DateTimeFieldConfig extends BaseFieldConfig {
  component:
    | 'date-picker'
    | 'time-picker'
    | 'datetime-picker'
    | 'date-range-picker'
    | 'time-range-picker'
  props?: {
    format?: string
    valueFormat?: string
    type?:
      | 'date'
      | 'datetime'
      | 'daterange'
      | 'datetimerange'
      | 'month'
      | 'year'
      | 'quarter'
    clearable?: boolean
    shortcuts?: Array<{
      label: string
      value: Date | [Date, Date] | (() => Date | [Date, Date])
    }>
    disabledDate?: (date: Date) => boolean
    disabledTime?: (date: Date) => {
      disabledHours?: () => number[]
      disabledMinutes?: (hour: number) => number[]
      disabledSeconds?: (hour: number, minute: number) => number[]
    }
    [key: string]: any
  }
}

// 开关字段配置
export interface SwitchFieldConfig extends BaseFieldConfig {
  component: 'switch'
  props?: {
    checkedValue?: any
    uncheckedValue?: any
    checkedText?: string
    uncheckedText?: string
    loading?: boolean
    [key: string]: any
  }
}

// 滑块字段配置
export interface SliderFieldConfig extends BaseFieldConfig {
  component: 'slider'
  props?: {
    min?: number
    max?: number
    step?: number
    range?: boolean
    marks?: Record<number, string>
    tooltip?: boolean
    formatTooltip?: (value: number) => string
    [key: string]: any
  }
}

// 评分字段配置
export interface RateFieldConfig extends BaseFieldConfig {
  component: 'rate'
  props?: {
    count?: number
    allowHalf?: boolean
    allowClear?: boolean
    color?: string
    icon?: Component
    [key: string]: any
  }
}

// 颜色选择器字段配置
export interface ColorPickerFieldConfig extends BaseFieldConfig {
  component: 'color-picker'
  props?: {
    modes?: Array<'rgb' | 'hex' | 'hsl' | 'hsv'>
    showAlpha?: boolean
    showPreview?: boolean
    swatches?: string[]
    [key: string]: any
  }
}

// 上传字段配置
export interface UploadFieldConfig extends BaseFieldConfig {
  component: 'upload'
  props?: {
    action?: string
    accept?: string
    multiple?: boolean
    max?: number
    listType?: 'text' | 'image' | 'image-card'
    showFileList?: boolean
    directory?: boolean
    beforeUpload?: (file: File) => boolean | Promise<boolean>
    customRequest?: (options: any) => void
    [key: string]: any
  }
}

// 自定义字段配置
export interface CustomFieldConfig extends BaseFieldConfig {
  component: 'custom'
  // 自定义组件
  customComponent: Component | (() => Component)
  // 自定义属性
  customProps?: Record<string, any>
}

// 字段配置联合类型
export type FieldConfig =
  | InputFieldConfig
  | NumberInputFieldConfig
  | SelectFieldConfig
  | DateTimeFieldConfig
  | SwitchFieldConfig
  | SliderFieldConfig
  | RateFieldConfig
  | ColorPickerFieldConfig
  | UploadFieldConfig
  | CustomFieldConfig

// 字段状态
export interface FieldState {
  // 字段值
  value: any
  // 验证状态
  validating: boolean
  // 验证错误
  error?: string
  // 是否已验证
  validated: boolean
  // 是否已修改
  dirty: boolean
  // 是否已触摸
  touched: boolean
  // 是否可见
  visible: boolean
  // 是否禁用
  disabled: boolean
  // 是否只读
  readonly: boolean
}

// 字段事件类型
export interface FieldEvents {
  // 值变化
  'field:change': (field: string, value: any, oldValue: any) => void
  // 获得焦点
  'field:focus': (field: string) => void
  // 失去焦点
  'field:blur': (field: string) => void
  // 验证完成
  'field:validate': (
    field: string,
    result: { valid: boolean; error?: string }
  ) => void
  // 字段重置
  'field:reset': (field: string) => void
}

// 字段组件实例方法
export interface FieldComponentMethods {
  // 获取字段值
  getValue(): any

  // 设置字段值
  setValue(value: any): void

  // 验证字段
  validate(): Promise<{ valid: boolean; error?: string }>

  // 清除验证
  clearValidation(): void

  // 重置字段
  reset(): void

  // 获取焦点
  focus(): void

  // 失去焦点
  blur(): void
}
