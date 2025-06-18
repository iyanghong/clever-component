// 导出所有组件类型
export type * from '../components/button/src/button'
export type * from '../components/card/src/card'
export type * from '../components/input/src/input'

// 导出工具类型
export type * from '../utils/types'

// 导出组件实例类型
export type { CButton } from '../components/button'
export type { CCard } from '../components/card'
export type { CInput } from '../components/input'

// 全局配置类型
export interface GlobalConfig {
  /**
   * 全局尺寸
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * 全局主题
   */
  theme?: 'light' | 'dark'
  /**
   * 全局语言
   */
  locale?: string
  /**
   * 组件前缀
   */
  componentPrefix?: string
  /**
   * 是否开启调试模式
   */
  debug?: boolean
}

// 组件库实例类型
export interface CleverComponentInstance {
  version: string
  install: (app: any) => void
  config: GlobalConfig
}

// 事件类型
export interface ComponentEvent<T = any> {
  type: string
  target: T
  currentTarget: T
  preventDefault: () => void
  stopPropagation: () => void
}

// 验证规则类型
export interface ValidationRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean | Promise<boolean>
  trigger?: 'blur' | 'change' | 'input'
}

// 表单项类型
export interface FormItem {
  label?: string
  prop?: string
  rules?: ValidationRule[]
  required?: boolean
  error?: string
}

// 表格列类型
export interface TableColumn {
  key: string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: any, index: number) => any
}

// 分页类型
export interface Pagination {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
}