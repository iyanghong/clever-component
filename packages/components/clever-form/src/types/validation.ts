/**
 * 验证相关类型定义
 * @description 定义表单验证系统的所有相关类型
 */

import type { FormItemRule } from 'naive-ui'
import type { FieldConfig } from './field'
import type { ContainerConfig } from './layout'

// 验证触发时机
export type ValidationTrigger = 'blur' | 'change' | 'input' | 'focus' | 'submit' | 'manual'

// 验证状态
export type ValidationStatus = 'validating' | 'success' | 'error' | 'warning'

// 验证级别
export type ValidationLevel = 'error' | 'warning' | 'info'

// 验证结果
export interface ValidationResult {
  // 验证状态
  status: ValidationStatus
  // 验证级别
  level?: ValidationLevel
  // 错误信息
  message?: string
  // 验证字段路径
  field?: string
  // 验证规则键
  rule?: string
  // 验证时间戳
  timestamp: number
}

// 字段验证规则
export interface FieldValidationRule extends Omit<FormItemRule, 'trigger'> {
  // 规则键值（用于标识）
  key?: string
  // 触发时机
  trigger?: ValidationTrigger | ValidationTrigger[]
  // 验证级别
  level?: ValidationLevel
  // 异步验证
  asyncValidator?: (value: any, rule: FieldValidationRule) => Promise<boolean | string>
  // 条件验证（根据其他字段值决定是否验证）
  condition?: (formData: Record<string, any>) => boolean
  // 依赖字段（当依赖字段变化时重新验证）
  dependencies?: string[]
  // 自定义验证器
  validator?: (value: any, rule: FieldValidationRule, formData: Record<string, any>) => boolean | string | Promise<boolean | string>
}

// 容器验证规则
export interface ContainerValidationRule {
  // 规则键值
  key: string
  // 规则名称
  name?: string
  // 触发时机
  trigger?: ValidationTrigger | ValidationTrigger[]
  // 验证级别
  level?: ValidationLevel
  // 验证函数
  validator: (containerData: Record<string, any>, formData: Record<string, any>) => boolean | string | Promise<boolean | string>
  // 错误信息
  message?: string
  // 条件验证
  condition?: (formData: Record<string, any>) => boolean
  // 依赖字段
  dependencies?: string[]
}

// 表单验证规则
export interface FormValidationRule {
  // 规则键值
  key: string
  // 规则名称
  name?: string
  // 触发时机
  trigger?: ValidationTrigger | ValidationTrigger[]
  // 验证级别
  level?: ValidationLevel
  // 验证函数
  validator: (formData: Record<string, any>) => boolean | string | Promise<boolean | string>
  // 错误信息
  message?: string
  // 条件验证
  condition?: (formData: Record<string, any>) => boolean
}

// 验证配置
export interface ValidationConfig {
  // 字段验证规则
  fieldRules?: Record<string, FieldValidationRule[]>
  // 容器验证规则
  containerRules?: Record<string, ContainerValidationRule[]>
  // 表单验证规则
  formRules?: FormValidationRule[]
  // 全局验证配置
  global?: {
    // 默认触发时机
    defaultTrigger?: ValidationTrigger | ValidationTrigger[]
    // 验证延迟（毫秒）
    validateDelay?: number
    // 停止首次错误
    stopOnFirstError?: boolean
    // 显示所有错误
    showAllErrors?: boolean
    // 验证消息显示位置
    messagePosition?: 'top' | 'bottom' | 'left' | 'right'
    // 自定义错误消息模板
    messageTemplate?: (rule: FieldValidationRule, value: any) => string
  }
}

// 验证错误信息
export interface ValidationError {
  // 字段路径
  field: string
  // 错误信息
  message: string
  // 验证规则
  rule: string
  // 错误级别
  level: ValidationLevel
  // 错误值
  value: any
  // 错误时间戳
  timestamp: number
}

// 验证状态映射
export interface ValidationStateMap {
  // 字段验证状态
  fields: Record<string, ValidationResult[]>
  // 容器验证状态
  containers: Record<string, ValidationResult[]>
  // 表单验证状态
  form: ValidationResult[]
  // 全局验证状态
  global: {
    // 是否正在验证
    validating: boolean
    // 是否有错误
    hasError: boolean
    // 是否有警告
    hasWarning: boolean
    // 错误数量
    errorCount: number
    // 警告数量
    warningCount: number
    // 最后验证时间
    lastValidateTime?: number
  }
}

// 验证选项
export interface ValidationOptions {
  // 验证字段列表（为空则验证所有）
  fields?: string[]
  // 触发时机
  trigger?: ValidationTrigger
  // 是否清除之前的验证结果
  clearPrevious?: boolean
  // 是否停止首次错误
  stopOnFirstError?: boolean
  // 是否包含警告
  includeWarnings?: boolean
  // 验证回调
  callback?: (results: ValidationResult[]) => void
}

// 验证事件类型
export interface ValidationEvents {
  // 验证开始
  'validate:start': (field?: string) => void
  // 验证完成
  'validate:complete': (results: ValidationResult[]) => void
  // 验证成功
  'validate:success': (field?: string) => void
  // 验证失败
  'validate:error': (errors: ValidationError[]) => void
  // 验证警告
  'validate:warning': (warnings: ValidationResult[]) => void
  // 清除验证
  'validate:clear': (field?: string) => void
  // 字段验证状态变化
  'field:validate': (field: string, result: ValidationResult) => void
  // 容器验证状态变化
  'container:validate': (container: string, result: ValidationResult) => void
  // 表单验证状态变化
  'form:validate': (result: ValidationResult) => void
}

// 验证引擎接口
export interface ValidationEngine {
  // 添加字段验证规则
  addFieldRule(field: string, rule: FieldValidationRule): void
  // 移除字段验证规则
  removeFieldRule(field: string, ruleKey?: string): void
  // 添加容器验证规则
  addContainerRule(container: string, rule: ContainerValidationRule): void
  // 移除容器验证规则
  removeContainerRule(container: string, ruleKey?: string): void
  // 添加表单验证规则
  addFormRule(rule: FormValidationRule): void
  // 移除表单验证规则
  removeFormRule(ruleKey: string): void
  // 验证字段
  validateField(field: string, value: any, options?: ValidationOptions): Promise<ValidationResult[]>
  // 验证容器
  validateContainer(container: string, data: Record<string, any>, options?: ValidationOptions): Promise<ValidationResult[]>
  // 验证表单
  validateForm(data: Record<string, any>, options?: ValidationOptions): Promise<ValidationResult[]>
  // 清除验证结果
  clearValidation(field?: string): void
  // 获取验证状态
  getValidationState(): ValidationStateMap
  // 获取字段错误
  getFieldErrors(field: string): ValidationError[]
  // 获取所有错误
  getAllErrors(): ValidationError[]
  // 是否有错误
  hasErrors(field?: string): boolean
  // 是否有警告
  hasWarnings(field?: string): boolean
  // 是否正在验证
  isValidating(field?: string): boolean
}

// 验证器工厂
export interface ValidatorFactory {
  // 创建必填验证器
  required(message?: string): FieldValidationRule
  // 创建长度验证器
  length(min?: number, max?: number, message?: string): FieldValidationRule
  // 创建模式验证器
  pattern(pattern: RegExp, message?: string): FieldValidationRule
  // 创建邮箱验证器
  email(message?: string): FieldValidationRule
  // 创建URL验证器
  url(message?: string): FieldValidationRule
  // 创建数字验证器
  number(min?: number, max?: number, message?: string): FieldValidationRule
  // 创建整数验证器
  integer(message?: string): FieldValidationRule
  // 创建自定义验证器
  custom(validator: Function, message?: string): FieldValidationRule
  // 创建异步验证器
  async(validator: Function, message?: string): FieldValidationRule
}

// 验证规则构建器
export interface ValidationRuleBuilder {
  // 设置触发时机
  trigger(trigger: ValidationTrigger | ValidationTrigger[]): ValidationRuleBuilder
  // 设置验证级别
  level(level: ValidationLevel): ValidationRuleBuilder
  // 设置错误信息
  message(message: string): ValidationRuleBuilder
  // 设置条件验证
  when(condition: (formData: Record<string, any>) => boolean): ValidationRuleBuilder
  // 设置依赖字段
  depends(fields: string[]): ValidationRuleBuilder
  // 构建规则
  build(): FieldValidationRule
}

// 验证中间件
export interface ValidationMiddleware {
  // 中间件名称
  name: string
  // 执行顺序
  order?: number
  // 前置处理
  before?: (field: string, value: any, rule: FieldValidationRule) => any
  // 后置处理
  after?: (field: string, value: any, result: ValidationResult) => ValidationResult
  // 错误处理
  error?: (field: string, error: Error) => ValidationResult
}

// 验证插件接口
export interface ValidationPlugin {
  // 插件名称
  name: string
  // 插件版本
  version?: string
  // 安装插件
  install(engine: ValidationEngine): void
  // 卸载插件
  uninstall?(engine: ValidationEngine): void
  // 插件配置
  options?: Record<string, any>
}