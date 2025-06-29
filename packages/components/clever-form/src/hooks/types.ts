/**
 * 组合式函数类型定义 - 重构版
 * @description 简化的组合式函数类型定义
 */

import type { Ref, ComputedRef } from 'vue'
import type {
  FormConfig,
  FormData,
  FieldConfig,
  ContainerConfig,
  FormEngine,
  FormEngineState
} from '../types'

// useForm 相关类型
export interface UseFormOptions {
  /** 表单配置 */
  config?: FormConfig
  /** 初始数据 */
  initialData?: FormData
  /** 外部数据引用（用于直接操作外部数据） */
  externalData?: Ref<FormData>
  /** 是否立即初始化 */
  immediate?: boolean
  /** 事件处理器 */
  onSubmit?: (data: FormData) => void | Promise<void>
  onReset?: () => void
  onChange?: (data: FormData) => void
  onDataChange?: (data: FormData, field?: string, value?: any) => void
  onFieldChange?: (field: string, value: any, oldValue?: any) => void
  onFieldFocus?: (field: string) => void
  onFieldBlur?: (field: string) => void
  onSubmitBefore?: (data: FormData) => void
  onSubmitSuccess?: (result: any) => void
  onSubmitError?: (error: Error) => void
  onValidate?: (results: any[]) => void
  onStatusChange?: (status: string, prevStatus: string) => void
}

export interface UseFormReturn {
  /** 简化的表单状态 */
  formState: Ref<{
    status: string
    data: FormData
    originalData: FormData
    isDirty: boolean
    isSubmitting: boolean
    isLoading: boolean
  }>
  /** 表单配置 */
  formConfig: Ref<FormConfig | undefined>
  /** 是否正在加载 */
  loading: Ref<boolean>
  /** 是否正在提交 */
  submitting: Ref<boolean>
  /** 表单字段键值映射 */
  formItemFieldKeys: Ref<Record<string, string>>
  /** 是否已修改 */
  isDirty: ComputedRef<boolean>
  /** 是否有效 */
  isValid: ComputedRef<boolean>
  /** 是否有错误 */
  hasErrors: ComputedRef<boolean>
  /** 验证规则（Naive UI 格式） */
  validationRules: ComputedRef<Record<string, any[]>>
  
  /** 表单方法 */
  initialize: (config?: FormConfig) => Promise<void>
  initFormModel: <T extends FormData = FormData>() => void
  extractFieldsFromSchemas: (schemas: Array<FieldConfig | ContainerConfig>) => FieldConfig[]
  getActualSchemas: () => Array<FieldConfig | ContainerConfig>
  setConfig: (config: FormConfig, shouldInitModel?: boolean) => Promise<void>
  updateData: (path: string, value: any) => void
  validate: () => Promise<boolean>
  clearValidation: () => void
  submit: () => Promise<void>
  reset: () => void
  destroy: () => void
}

// useField 相关类型
export interface UseFieldOptions {
  /** 字段配置 */
  config?: FieldConfig
  /** 字段值 */
  modelValue?: any
  /** 是否立即初始化 */
  immediate?: boolean
  /** 事件处理器 */
  onChange?: (value: any) => void
}

export interface UseFieldReturn {
  /** 字段配置 */
  fieldConfig: Ref<FieldConfig | undefined>
  /** 简化的字段状态 */
  fieldState: Ref<{
    value: any
    originalValue: any
  }>
  
  /** 事件处理 */
  handleFocus: () => void
  handleBlur: () => void
  handleChange: (value: any) => void
  
  /** 字段方法 */
  setValue: (value: any) => void
  getValue: () => any
  reset: () => void
  setConfig: (config: FieldConfig) => void
  destroy: () => void
}

// useFormEngine 相关类型
export interface UseFormEngineOptions {
  /** 表单配置 */
  config?: FormConfig
}

export interface UseFormEngineReturn {
  /** 引擎ID */
  engineId: string
  /** 引擎状态 */
  engineState: Ref<FormEngineState>
  /** 是否已初始化 */
  initialized: ComputedRef<boolean>
  /** 是否已销毁 */
  destroyed: ComputedRef<boolean>
  
  /** 引擎方法 */
  initialize: (config: FormConfig) => FormEngine
  getEngine: () => FormEngine | undefined
  destroy: () => void
  
  /** 数据操作（代理到引擎实例） */
  getData: (path?: string) => any
  setData: (data: FormData) => void
  updateData: (path: string, value: any) => void
  submit: () => Promise<any>
  reset: () => void
}