import type { CSSProperties } from 'vue'

// 通用尺寸类型
export type Size = 'small' | 'medium' | 'large'

// 通用状态类型
export type Status = 'success' | 'warning' | 'error' | 'info'

// 通用主题类型
export type Theme = 'light' | 'dark'

// 通用位置类型
export type Placement = 
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

// 通用对齐方式
export type Align = 'left' | 'center' | 'right'

// 通用方向类型
export type Direction = 'horizontal' | 'vertical'

// 通用样式对象
export type StyleObject = CSSProperties

// 通用类名类型
export type ClassName = string | string[] | Record<string, boolean>

// 通用事件处理器
export type EventHandler<T = Event> = (event: T) => void

// 通用回调函数
export type Callback<T = void> = () => T

// 通用异步回调函数
export type AsyncCallback<T = void> = () => Promise<T>

// 通用可选类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 通用必需类型
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }

// 通用深度部分类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 通用深度只读类型
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}