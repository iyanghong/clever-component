/**
 * 表单相关类型定义
 * @description 定义表单核心功能的所有相关类型
 */

import type { VNode, Component, Ref } from 'vue'
import type { FormInst, FormProps } from 'naive-ui'
import type { BaseComponentProps, Size } from './common'
import type { EventHandler } from './events'
import type { FieldConfig } from './field'
import type { ContainerConfig } from './layout'
import type {
  ValidationConfig,
  ValidationResult,
  ValidationEngine
} from './validation'
import type { ApiConfig, ApiManager } from './api'
import type { PopupConfig } from './popup'

// 表单模式
export type FormMode = 'create' | 'edit' | 'view' | 'search'

// 表单状态
export type FormStatus =
  | 'idle'
  | 'loading'
  | 'submitting'
  | 'validating'
  | 'success'
  | 'error'

// 表单数据类型
export type FormData = Record<string, any>

// 表单配置
export interface FormConfig {
  // 表单标识
  id?: string
  // 表单标题
  title?: string
  // 表单描述
  description?: string
  // 表单模式
  mode?: FormMode
  // 表单布局
  layout: ContainerConfig
  // 验证配置
  validation?: ValidationConfig
  // API配置
  api?: ApiConfig
  // 弹窗配置
  popup?: PopupConfig
  // 表单属性
  props?: Partial<FormProps>
  // 默认数据
  defaultData?: FormData | (() => FormData) | (() => Promise<FormData>)
  // 表单选项
  options?: FormOptions
}

// 表单选项
export interface FormOptions {
  // 表单大小
  size?: Size
  // 标签位置
  labelPlacement?: 'left' | 'top'
  // 标签宽度
  labelWidth?: number | string
  // 标签对齐
  labelAlign?: 'left' | 'center' | 'right'
  // 是否显示标签冒号
  showLabel?: boolean
  // 是否显示必填星号
  showRequiredMark?: boolean
  // 是否显示反馈图标
  showFeedback?: boolean
  // 是否内联显示
  inline?: boolean
  // 是否禁用
  disabled?: boolean
  // 是否只读
  readonly?: boolean
  // 自动聚焦
  autoFocus?: boolean
  // 提交时验证
  validateOnSubmit?: boolean
  // 重置时清除验证
  clearValidationOnReset?: boolean
  // 自动保存
  autoSave?: {
    // 是否启用
    enabled: boolean
    // 保存间隔（毫秒）
    interval: number
    // 保存键
    key?: string
  }
  // 确认离开
  confirmBeforeLeave?: boolean
  // 自定义样式类
  customClass?: string
  // 自定义内联样式
  customStyle?: string | Record<string, any>
}

// 表单状态
export interface FormState {
  // 表单数据
  data: FormData
  // 原始数据（用于重置）
  originalData: FormData
  // 表单状态
  status: FormStatus
  // 是否已修改
  isDirty: boolean
  // 是否有效
  isValid: boolean
  // 是否正在提交
  isSubmitting: boolean
  // 是否正在加载
  isLoading: boolean
  // 错误信息
  errors: Record<string, string[]>
  // 警告信息
  warnings: Record<string, string[]>
  // 最后提交时间
  lastSubmitTime?: number
  // 最后验证时间
  lastValidateTime?: number
}

// 表单事件类型
export interface FormEvents {
  // 表单数据变化
  'data:change': (data: FormData, field?: string, value?: any) => void
  // 字段值变化
  'field:change': (field: string, value: any, oldValue?: any) => void
  // 字段聚焦
  'field:focus': (field: string) => void
  // 字段失焦
  'field:blur': (field: string) => void
  // 表单提交前
  'submit:before': (data: FormData) => void | Promise<void>
  // 表单提交
  submit: (data: FormData) => void
  // 表单提交成功
  'submit:success': (result: any) => void
  // 表单提交失败
  'submit:error': (error: Error) => void
  // 表单重置前
  'reset:before': () => void
  // 表单重置
  reset: () => void
  // 表单重置后
  'reset:after': () => void
  // 表单验证
  validate: (results: ValidationResult[]) => void
  // 表单状态变化
  'status:change': (status: FormStatus, prevStatus: FormStatus) => void
  // 表单加载
  'load:start': () => void
  // 表单加载完成
  'load:complete': (data: FormData) => void
  // 表单加载失败
  'load:error': (error: Error) => void
  // 表单销毁
  destroy: () => void
}

// 表单方法接口
export interface FormMethods {
  // 获取表单数据
  getData(): FormData

  // 设置表单数据
  setData(data: Partial<FormData>): void

  // 获取字段值
  getFieldValue(field: string): any

  // 设置字段值
  setFieldValue(field: string, value: any): void

  // 重置表单
  reset(data?: FormData): void

  // 清空表单
  clear(): void

  // 提交表单
  submit(): Promise<any>

  // 验证表单
  validate(fields?: string[]): Promise<ValidationResult[]>

  // 验证字段
  validateField(field: string): Promise<ValidationResult[]>

  // 清除验证
  clearValidation(fields?: string[]): void

  // 获取表单状态
  getState(): FormState

  // 获取表单引用
  getFormRef(): Ref<FormInst | undefined>

  // 获取验证引擎
  getValidationEngine(): ValidationEngine

  // 获取API管理器
  getApiManager(): ApiManager

  // 刷新表单
  refresh(): Promise<void>

  // 销毁表单
  destroy(): void
}

// 表单引擎接口
export interface FormEngine extends FormMethods {
  // 表单配置
  config: FormConfig
  // 表单状态
  state: Ref<FormState>
  // 事件总线
  events: Record<keyof FormEvents, EventHandler[]>

  // 初始化表单
  initialize(config: FormConfig): Promise<void>

  // 渲染表单
  render(): VNode

  // 监听事件
  on<K extends keyof FormEvents>(event: K, handler: FormEvents[K]): void

  // 移除事件监听
  off<K extends keyof FormEvents>(event: K, handler?: FormEvents[K]): void

  // 触发事件
  emit<K extends keyof FormEvents>(
    event: K,
    ...args: Parameters<FormEvents[K]>
  ): void
}

// 表单构建器接口
export interface FormBuilder {
  // 设置表单ID
  id(id: string): FormBuilder

  // 设置表单标题
  title(title: string): FormBuilder

  // 设置表单描述
  description(description: string): FormBuilder

  // 设置表单模式
  mode(mode: FormMode): FormBuilder

  // 设置表单布局
  layout(layout: ContainerConfig): FormBuilder

  // 设置验证配置
  validation(validation: ValidationConfig): FormBuilder

  // 设置API配置
  api(api: ApiConfig): FormBuilder

  // 设置弹窗配置
  popup(popup: PopupConfig): FormBuilder

  // 设置表单属性
  props(props: Partial<FormProps>): FormBuilder

  // 设置默认数据
  defaultData(data: FormData): FormBuilder

  // 设置表单选项
  options(options: FormOptions): FormBuilder

  // 构建表单配置
  build(): FormConfig
}

// 表单工厂接口
export interface FormFactory {
  // 创建表单引擎
  createEngine(config: FormConfig): FormEngine

  // 创建表单构建器
  createBuilder(): FormBuilder

  // 从JSON创建表单
  fromJSON(json: string | object): FormEngine

  // 从Schema创建表单
  fromSchema(schema: any): FormEngine

  // 注册字段组件
  registerField(type: string, component: Component): void

  // 注册容器组件
  registerContainer(type: string, component: Component): void

  // 注册验证器
  registerValidator(name: string, validator: Function): void

  // 注册中间件
  registerMiddleware(middleware: any): void
}

// 表单渲染器接口
export interface FormRenderer {
  // 渲染表单
  render(config: FormConfig, engine: FormEngine): VNode

  // 渲染字段
  renderField(config: FieldConfig, engine: FormEngine): VNode

  // 渲染容器
  renderContainer(config: ContainerConfig, engine: FormEngine): VNode

  // 渲染验证消息
  renderValidation(field: string, errors: string[]): VNode

  // 渲染加载状态
  renderLoading(): VNode

  // 渲染错误状态
  renderError(error: Error): VNode
}

// 表单中间件接口
export interface FormMiddleware {
  // 中间件名称
  name: string
  // 执行顺序
  order?: number

  // 初始化钩子
  onInit?(engine: FormEngine): void

  // 数据变化钩子
  onDataChange?(data: FormData, field?: string, value?: any): void

  // 提交前钩子
  onBeforeSubmit?(data: FormData): FormData | Promise<FormData>

  // 提交后钩子
  onAfterSubmit?(result: any, data: FormData): void

  // 验证钩子
  onValidate?(results: ValidationResult[]): ValidationResult[]

  // 销毁钩子
  onDestroy?(engine: FormEngine): void
}

// 表单插件接口
export interface FormPlugin {
  // 插件名称
  name: string
  // 插件版本
  version?: string

  // 安装插件
  install(factory: FormFactory): void

  // 卸载插件
  uninstall?(factory: FormFactory): void

  // 插件配置
  options?: Record<string, any>
}

// 表单上下文
export interface FormContext {
  // 表单数据
  formData: FormData
  // 表单配置
  formConfig: Ref<FormConfig | null>
  // 表单状态
  formStatus: Ref<FormStatus>
  // 表单错误
  formErrors: Ref<Record<string, ValidationResult>>
  // 加载状态
  loading: Ref<boolean>
  // 提交状态
  submitting: Ref<boolean>
  // 计算属性
  hasErrors: Ref<boolean>
  isValid: Ref<boolean>
  isDirty: Ref<boolean>
  // 方法
  getFieldValue: <T = any>(path: string) => T
  setFieldValue: (path: string, value: any) => void
  setFieldValues: (values: Record<string, any>) => void
  updateData: (data: FormData) => void
  reset: () => void
  clear: () => void
  validateForm: (path?: string) => Promise<ValidationResult>
  submit: () => Promise<FormData>
}

// 表单提供者属性
export interface FormProviderProps extends BaseComponentProps {
  // 表单配置
  config: FormConfig
  // 初始数据
  modelValue?: FormData
  // 表单选项
  options?: FormOptions
}

// 表单提供者事件
export interface FormProviderEvents {
  // 数据更新
  'update:modelValue': (data: FormData) => void
  // 提交事件
  submit: (data: FormData) => void
  // 重置事件
  reset: () => void
  // 验证事件
  validate: (results: ValidationResult[]) => void
}

// 表单组件属性
export interface CleverFormProps extends FormProviderProps {
  // 是否在弹窗中显示
  popup?: boolean | PopupConfig
  // 自定义渲染器
  renderer?: FormRenderer
  // 中间件列表
  middlewares?: FormMiddleware[]
  // 插件列表
  plugins?: FormPlugin[]
}

// 表单组件事件
export interface CleverFormEvents extends FormProviderEvents {
  // 表单状态变化
  'status:change': (status: FormStatus) => void
  // 表单加载
  load: (data: FormData) => void
  // 表单错误
  error: (error: Error) => void
}

// 表单组件暴露的方法
export interface CleverFormExposed extends FormMethods {
  // 获取表单引擎
  getEngine(): FormEngine

  // 获取表单上下文
  getContext(): FormContext
}
