/**
 * 事件相关类型定义
 * @description 定义表单事件系统的所有相关类型
 */

import type { FormData } from './form'
import type { FieldConfig } from './field'
import type { ContainerConfig } from './layout'
import type { ValidationResult } from './validation'
import type { ApiResponse, ApiError } from './api'
import type { PopupState } from './popup'

// 事件优先级
export type EventPriority = 'highest' | 'high' | 'normal' | 'low' | 'lowest'

// 事件状态
export type EventStatus = 'pending' | 'running' | 'completed' | 'cancelled' | 'error'

// 事件传播控制
export interface EventPropagation {
  // 是否停止传播
  stopPropagation: boolean
  // 是否阻止默认行为
  preventDefault: boolean
  // 是否立即停止传播
  stopImmediatePropagation: boolean
}

// 基础事件接口
export interface BaseEvent {
  // 事件类型
  type: string
  // 事件时间戳
  timestamp: number
  // 事件源
  source?: string
  // 事件目标
  target?: string
  // 事件数据
  data?: any
  // 传播控制
  propagation: EventPropagation
  // 事件元数据
  meta?: Record<string, any>
}

// 表单事件类型
export interface FormEvent extends BaseEvent {
  // 表单数据
  formData: FormData
  // 变化的字段
  changedField?: string
  // 变化前的值
  oldValue?: any
  // 变化后的值
  newValue?: any
}

// 字段事件类型
export interface FieldEvent extends BaseEvent {
  // 字段配置
  field: FieldConfig
  // 字段路径
  fieldPath: string
  // 字段值
  value: any
  // 旧值
  oldValue?: any
  // 表单数据
  formData: FormData
}

// 容器事件类型
export interface ContainerEvent extends BaseEvent {
  // 容器配置
  container: ContainerConfig
  // 容器路径
  containerPath: string
  // 容器数据
  containerData: Record<string, any>
  // 表单数据
  formData: FormData
}

// 验证事件类型
export interface ValidationEvent extends BaseEvent {
  // 验证结果
  results: ValidationResult[]
  // 验证字段
  field?: string
  // 验证触发器
  trigger?: string
  // 表单数据
  formData: FormData
}

// API事件类型
export interface ApiEvent extends BaseEvent {
  // API类型
  apiType: string
  // 请求配置
  config?: any
  // 响应数据
  response?: ApiResponse
  // 错误信息
  error?: ApiError
  // 表单数据
  formData?: FormData
}

// 弹窗事件类型
export interface PopupEvent extends BaseEvent {
  // 弹窗状态
  popupState: PopupState
  // 弹窗模式
  mode?: string
  // 弹窗数据
  popupData?: FormData
  // 操作原因
  reason?: string
}

// 生命周期事件类型
export interface LifecycleEvent extends BaseEvent {
  // 生命周期阶段
  phase: 'init' | 'mount' | 'update' | 'unmount' | 'destroy'
  // 组件实例
  instance?: any
  // 上下文数据
  context?: any
}

// 自定义事件类型
export interface CustomEvent extends BaseEvent {
  // 自定义事件名称
  eventName: string
  // 自定义数据
  payload: any
  // 事件来源组件
  component?: string
}

// 事件联合类型
export type Event = 
  | FormEvent 
  | FieldEvent 
  | ContainerEvent 
  | ValidationEvent 
  | ApiEvent 
  | PopupEvent 
  | LifecycleEvent 
  | CustomEvent

// 事件处理器类型
export type EventHandler<T extends Event = Event> = (
  event: T
) => void | Promise<void> | boolean | Promise<boolean>

// 事件监听器配置
export interface EventListenerConfig {
  // 事件类型
  type: string
  // 事件处理器
  handler: EventHandler
  // 优先级
  priority?: EventPriority
  // 是否只执行一次
  once?: boolean
  // 是否被动监听
  passive?: boolean
  // 条件函数
  condition?: (event: Event) => boolean
  // 监听器标识
  id?: string
  // 监听器描述
  description?: string
}

// 事件过滤器
export interface EventFilter {
  // 过滤器名称
  name: string
  // 过滤函数
  filter: (event: Event) => boolean
  // 过滤器描述
  description?: string
}

// 事件转换器
export interface EventTransformer {
  // 转换器名称
  name: string
  // 转换函数
  transform: (event: Event) => Event | Event[]
  // 转换器描述
  description?: string
}

// 事件中间件
export interface EventMiddleware {
  // 中间件名称
  name: string
  // 执行顺序
  order?: number
  // 前置处理
  before?: (event: Event) => Event | Promise<Event>
  // 后置处理
  after?: (event: Event, result: any) => any | Promise<any>
  // 错误处理
  error?: (event: Event, error: Error) => any | Promise<any>
  // 条件判断
  condition?: (event: Event) => boolean
}

// 事件总线配置
export interface EventBusConfig {
  // 最大监听器数量
  maxListeners?: number
  // 是否启用调试模式
  debug?: boolean
  // 事件历史记录大小
  historySize?: number
  // 是否启用性能监控
  performance?: boolean
  // 默认事件优先级
  defaultPriority?: EventPriority
  // 错误处理策略
  errorHandling?: 'throw' | 'log' | 'ignore'
  // 异步事件超时时间
  asyncTimeout?: number
}

// 事件统计信息
export interface EventStats {
  // 事件总数
  totalEvents: number
  // 各类型事件数量
  eventCounts: Record<string, number>
  // 监听器总数
  totalListeners: number
  // 各类型监听器数量
  listenerCounts: Record<string, number>
  // 平均处理时间
  averageProcessTime: number
  // 错误事件数量
  errorCount: number
  // 最后事件时间
  lastEventTime?: number
}

// 事件历史记录
export interface EventHistory {
  // 事件
  event: Event
  // 处理结果
  result?: any
  // 处理时间
  processTime: number
  // 错误信息
  error?: Error
  // 监听器执行情况
  listenerResults: Array<{
    listenerId: string
    result: any
    processTime: number
    error?: Error
  }>
}

// 事件总线接口
export interface EventBus {
  // 配置
  config: EventBusConfig
  // 监听事件
  on(type: string, handler: EventHandler, config?: Partial<EventListenerConfig>): string
  // 监听一次
  once(type: string, handler: EventHandler, config?: Partial<EventListenerConfig>): string
  // 移除监听器
  off(type: string, handlerOrId?: EventHandler | string): void
  // 移除所有监听器
  removeAllListeners(type?: string): void
  // 触发事件
  emit(event: Event | string, data?: any): Promise<any[]>
  // 同步触发事件
  emitSync(event: Event | string, data?: any): any[]
  // 添加事件过滤器
  addFilter(filter: EventFilter): void
  // 移除事件过滤器
  removeFilter(name: string): void
  // 添加事件转换器
  addTransformer(transformer: EventTransformer): void
  // 移除事件转换器
  removeTransformer(name: string): void
  // 添加中间件
  addMiddleware(middleware: EventMiddleware): void
  // 移除中间件
  removeMiddleware(name: string): void
  // 获取监听器列表
  getListeners(type?: string): EventListenerConfig[]
  // 获取事件统计
  getStats(): EventStats
  // 获取事件历史
  getHistory(limit?: number): EventHistory[]
  // 清除历史记录
  clearHistory(): void
  // 销毁事件总线
  destroy(): void
}

// 事件工厂接口
export interface EventFactory {
  // 创建表单事件
  createFormEvent(type: string, formData: FormData, extra?: any): FormEvent
  // 创建字段事件
  createFieldEvent(type: string, field: FieldConfig, fieldPath: string, value: any, formData: FormData, extra?: any): FieldEvent
  // 创建容器事件
  createContainerEvent(type: string, container: ContainerConfig, containerPath: string, containerData: Record<string, any>, formData: FormData, extra?: any): ContainerEvent
  // 创建验证事件
  createValidationEvent(type: string, results: ValidationResult[], formData: FormData, extra?: any): ValidationEvent
  // 创建API事件
  createApiEvent(type: string, apiType: string, extra?: any): ApiEvent
  // 创建弹窗事件
  createPopupEvent(type: string, popupState: PopupState, extra?: any): PopupEvent
  // 创建生命周期事件
  createLifecycleEvent(type: string, phase: string, extra?: any): LifecycleEvent
  // 创建自定义事件
  createCustomEvent(eventName: string, payload: any, extra?: any): CustomEvent
}

// 事件插件接口
export interface EventPlugin {
  // 插件名称
  name: string
  // 插件版本
  version?: string
  // 安装插件
  install(eventBus: EventBus): void
  // 卸载插件
  uninstall?(eventBus: EventBus): void
  // 插件配置
  options?: Record<string, any>
}

// 事件调试器接口
export interface EventDebugger {
  // 是否启用调试
  enabled: boolean
  // 开始调试
  start(): void
  // 停止调试
  stop(): void
  // 记录事件
  logEvent(event: Event): void
  // 记录监听器执行
  logListener(listenerId: string, event: Event, result: any, processTime: number): void
  // 记录错误
  logError(event: Event, error: Error): void
  // 获取调试日志
  getLogs(): any[]
  // 清除调试日志
  clearLogs(): void
  // 导出调试数据
  exportDebugData(): string
}

// 事件性能监控器接口
export interface EventPerformanceMonitor {
  // 是否启用监控
  enabled: boolean
  // 开始监控
  start(): void
  // 停止监控
  stop(): void
  // 记录事件性能
  recordEvent(event: Event, processTime: number): void
  // 记录监听器性能
  recordListener(listenerId: string, processTime: number): void
  // 获取性能报告
  getReport(): {
    totalEvents: number
    averageProcessTime: number
    slowestEvents: Array<{ event: Event; processTime: number }>
    slowestListeners: Array<{ listenerId: string; averageProcessTime: number }>
    performanceWarnings: string[]
  }
  // 清除性能数据
  clearData(): void
}