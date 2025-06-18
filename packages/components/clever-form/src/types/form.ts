import type { CSSProperties, ComputedRef, Ref } from 'vue'
import type { GridItemProps, GridProps } from 'naive-ui/lib/grid'
import type { ButtonProps } from 'naive-ui/lib/button'
import type { FormProps } from 'naive-ui'
import type { LabelPlacement, Size } from 'naive-ui/es/form/src/interface'
import type { CleverPopupProps } from '@/components/clever-popup/types'
import type { ComponentType } from './index'
import type {
  GetApiFn,
  CreateApiFn,
  UpdateApiFn,
  DeleteApiFn,
  ResponseBaseModel
} from '../../../types/response'

export interface CleverFormMethods<T extends Record<string, any> = any> {
  resetFields: () => Promise<void>
  setFieldValue: (field: keyof T, value: any) => void
  getFieldValue: (field: keyof T) => any
  setFormData: (values: Partial<T>) => void
  getFormData: () => T
  clearValidate: (name?: string | string[]) => Promise<void>
  validate: (nameList?: any[]) => Promise<any>
  submit: () => Promise<any>
}

export interface FormFieldSchema<T extends Record<string, any> = any> {
  /** 字段名 */
  field: keyof T | string
  /** 标签文本 */
  label: string
  /** 标签提示信息 */
  labelMessage?: string
  /** 标签宽度 */
  labelWidth?: string | number
  /** 标签提示样式 */
  labelMessageStyle?: Record<string, any> | string
  /** 默认值 */
  defaultValue?: any
  /** 组件类型 */
  component: ComponentType
  /** 组件属性 */
  componentProps?: Record<string, any>
  /** 自定义插槽名 */
  slot?: string
  /** 验证规则 */
  rules?: Record<string, any> | Record<string, any>[]
  /** 网格项属性 */
  giProps?: GridItemProps
  /** 是否占满整行 */
  isFull?: boolean
  /** 后缀文本 */
  suffix?: string
  /** 是否必填 */
  required?: boolean
  /** 条件显示函数 */
  ifShow?: (formModel: T, value: any, methods: CleverFormMethods<T>) => boolean
  /** 值变化回调 */
  onChange?: (newValue: any, oldValue: any, methods: CleverFormMethods<T>) => void | Promise<void>
  /** 显示模式 */
  showMode?: 'edit' | 'detail' | 'disable'
  /** 其他属性 */
  [key: string]: any
}

export interface FormGroupSchema<T extends Record<string, any> = any> {
  /** 分组标题 */
  title: string
  /** 是否可以收缩 */
  collapsible?: boolean
  /** 是否默认展开分组 */
  defaultExpanded?: boolean
  /** 默认分多少列 */
  columns?: number
  /** 分组内字段集合 */
  fields: FormFieldSchema<T>[]
  /** 分组样式 */
  style?: Record<string, any>
  /** 分组类名 */
  className?: string
  /** 条件显示函数 */
  ifShow?: (formModel: T, methods: CleverFormMethods<T>) => boolean
}

export type FormSchema<T extends Record<string, any> = any> = FormFieldSchema<T> | FormGroupSchema<T>

export interface FormApiConfig<T extends Record<string, any> = any> {
  // 获取单条数据的API
  getApi?: GetApiFn<Record<string, any>>
  // 新增数据的API
  createApi?: CreateApiFn<T>
  // 更新数据的API
  updateApi?: UpdateApiFn<T>
  // 删除数据的API
  deleteApi?: DeleteApiFn<Record<string, any>>
}

export interface CleverFormProps<T extends Record<string, any> = any> {
  /** 是否为弹窗模式 */
  isPopup?: boolean
  /** 弹窗模式类型 */
  popupMode?: 'modal' | 'drawer'
  /** 弹窗是否可见 */
  popupVisible?: boolean
  /** 弹窗配置 */
  popupOption?: CleverPopupProps
  /** 表单数据 */
  data?: T
  /** 标签宽度 */
  labelWidth?: number | string
  /** 表单配置项 */
  schemas: FormSchema<T>[]
  /** API配置 */
  apiConfig?: FormApiConfig<T>
  /** 表单模式 */
  mode?: 'create' | 'edit' | 'view'
  /** 数据ID（编辑模式时使用） */
  dataId?: string | number
  /** 自定义ID字段名，默认为'id' */
  idField?: string
  /** 布局方式 */
  layout?: string | 'inline'
  /** 是否为行内表单 */
  inline?: boolean
  /** 表单尺寸 */
  size?: Size
  /** 标签位置 */
  labelPlacement?: LabelPlacement | undefined
  /** 组件是否占满宽度 */
  isFull?: boolean
  /** 是否显示操作按钮组 */
  showActionButtonGroup?: boolean
  /** 是否显示重置按钮 */
  showResetButton?: boolean
  /** 重置按钮配置 */
  resetButtonOptions?: ButtonProps
  /** 是否显示提交按钮 */
  showSubmitButton?: boolean
  /** 提交按钮配置 */
  submitButtonOptions?: ButtonProps
  /** 是否显示展开收起按钮 */
  showAdvancedButton?: boolean
  /** 提交按钮文本 */
  submitButtonText?: string
  /** 重置按钮文本 */
  resetButtonText?: string
  /** 网格配置 */
  gridProps?: GridProps
  /** 网格项配置 */
  giProps?: GridItemProps
  /** 重置函数 */
  resetFunc?: () => Promise<void>
  /** 提交函数 */
  submitFunc?: () => Promise<void>
  /** 重置时是否提交 */
  submitOnReset?: boolean
  /** 折叠行数 */
  collapsedRows?: number
  /** 其他属性 */
  [key: string]: any
}

export interface FormActionType {
  submit: () => Promise<any>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  setFieldsValue: (values: Record<string, any>) => Promise<void>
  clearValidate: (name?: string | string[]) => Promise<void>
  getFieldsValue: () => Record<string, any>
  resetFields: () => Promise<void>
  validate: (nameList?: any[]) => Promise<any>
}

export type RegisterFn = (formInstance: FormActionType) => void
export type UseFormReturnType = [RegisterFn, FormActionType]

export function getDefaultCleverFormProps(): CleverFormProps {
  return {
    isPopup: false,
    popupMode: 'modal',
    labelPlacement: 'left',
    popupVisible: false,
    labelWidth: 80,
    schemas: [],
    layout: 'inline',
    inline: false,
    size: 'medium',
    isFull: true,
    showActionButtonGroup: true,
    showResetButton: true,
    showSubmitButton: true,
    showAdvancedButton: false,
    submitButtonText: '确认',
    resetButtonText: '重置',
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    collapsedRows: 1,
    submitOnReset: false
  }
}