/**
 * 通用类型定义
 * @description 定义组件库中通用的基础类型
 */

import type { VNode, Component } from 'vue'
import type { FormItemRule } from 'naive-ui'

// 基础尺寸类型
export type Size = 'small' | 'medium' | 'large'

// 基础状态类型
export type Status = 'success' | 'warning' | 'error' | 'info'

// 基础位置类型
export type Placement = 'top' | 'bottom' | 'left' | 'right'

// 基础对齐类型
export type Align = 'left' | 'center' | 'right'

// 基础方向类型
export type Direction = 'horizontal' | 'vertical'

// 基础组件 Props
export interface BaseComponentProps {
  size?: Size
  disabled?: boolean | ConditionalFunction
  loading?: boolean
  class?: string
  style?: string | Record<string, any>
}

// 响应式断点类型
export interface ResponsiveConfig {
  xs?: number | string // < 576px
  sm?: number | string // >= 576px
  md?: number | string // >= 768px
  lg?: number | string // >= 992px
  xl?: number | string // >= 1200px
  xxl?: number | string // >= 1600px
}

// 条件显示函数类型
export type ConditionalFunction<T = any> = (model: Record<string, any>, context?: T) => boolean

// 动态值类型
export type DynamicValue<T> = T | ((model: Record<string, any>) => T)

// 字段事件处理函数类型
export type FieldEventHandler<T = any> = (value: T, model: Record<string, any>) => void

// 验证规则类型（基于 Naive UI）
export type ValidationRule = FormItemRule

// 组件渲染函数类型
export type ComponentRenderer = () => VNode | Component

// 深度可选类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 深度必需类型
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// 提取函数参数类型
export type ExtractFunctionArgs<T> = T extends (...args: infer P) => any ? P : never

// 提取函数返回类型
export type ExtractFunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never

// 键值对类型
export type KeyValuePair<K = string, V = any> = {
  key: K
  value: V
  label?: string
  disabled?: boolean
}

// 选项类型
export interface OptionItem {
  label: string
  value: any
  disabled?: boolean
  children?: OptionItem[]
  [key: string]: any
}

// 错误信息类型
export interface ErrorInfo {
  field: string
  message: string
  type: 'error' | 'warning'
  code?: string
}

// 加载状态类型
export interface LoadingState {
  loading: boolean
  error?: string | null
  success?: boolean
}

// 分页配置类型
export interface PaginationConfig {
  page: number
  pageSize: number
  total?: number
  showSizePicker?: boolean
  pageSizes?: number[]
}

// 排序配置类型
export interface SortConfig {
  field: string
  order: 'asc' | 'desc'
}

// 过滤配置类型
export interface FilterConfig {
  field: string
  value: any
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin'
}