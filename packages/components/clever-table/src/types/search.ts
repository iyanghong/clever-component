import type { FormSchema } from '../../../clever-form/src/types/form.ts'
import type { Ref, ComputedRef } from 'vue'

// 搜索模式枚举
export enum SearchMode {
  SIMPLE = 'simple', // 简单搜索
  ADVANCED = 'advanced', // 高级搜索
  QUICK = 'quick' // 快速搜索
}

// 搜索预设配置
export interface SearchPreset {
  // 预设标识
  key: string
  // 预设名称
  label: string
  // 预设参数
  params: Record<string, any>
  // 预设描述
  description?: string
  // 是否为默认预设
  default?: boolean
  // 预设图标
  icon?: string
}

// 搜索历史记录
export interface SearchHistory {
  // 历史记录ID
  id: string
  // 搜索参数
  params: Record<string, any>
  // 搜索时间
  timestamp: number
  // 搜索结果数量
  resultCount?: number
  // 搜索描述
  description?: string
}

// 搜索状态
export interface SearchState {
  // 是否正在搜索
  searching: boolean
  // 搜索结果数量
  resultCount: number
  // 搜索耗时（毫秒）
  duration: number
  // 活跃搜索条件数量
  activeConditions: number
  // 最后搜索时间
  lastSearchTime?: number
}

// 搜索统计信息
export interface SearchStats {
  // 总搜索次数
  totalSearches: number
  // 平均搜索耗时
  averageDuration: number
  // 最常用的搜索条件
  popularConditions: Array<{
    field: string
    value: any
    count: number
  }>
}

// 快速搜索配置
export interface QuickSearchConfig {
  // 是否启用快速搜索
  enabled?: boolean
  // 快速搜索字段
  fields: string[]
  // 搜索占位符
  placeholder?: string
  // 是否实时搜索
  realtime?: boolean
  // 防抖延迟（毫秒）
  debounceDelay?: number
  // 最小搜索长度
  minLength?: number
  // 搜索建议
  suggestions?: string[]
}

// 高级搜索配置
export interface AdvancedSearchConfig {
  // 是否启用高级搜索
  enabled?: boolean
  // 高级搜索表单配置
  schemas: FormSchema[]
  // 是否支持条件组合
  supportLogicalOperators?: boolean
  // 支持的逻辑操作符
  logicalOperators?: Array<{
    value: 'AND' | 'OR' | 'NOT'
    label: string
  }>
  // 是否支持分组
  supportGrouping?: boolean
  // 最大条件数量
  maxConditions?: number
}

// 搜索缓存配置
export interface SearchCacheConfig {
  // 是否启用缓存
  enabled?: boolean
  // 缓存过期时间（毫秒）
  expireTime?: number
  // 最大缓存数量
  maxSize?: number
  // 缓存键生成函数
  keyGenerator?: (params: Record<string, any>) => string
}

// 搜索导出配置
export interface SearchExportConfig {
  // 是否启用导出
  enabled?: boolean
  // 支持的导出格式
  formats?: Array<'json' | 'csv' | 'excel' | 'url'>
  // 导出文件名前缀
  filenamePrefix?: string
  // 自定义导出处理函数
  customExporter?: (params: Record<string, any>, format: string) => void
}

// 搜索配置增强版
export interface EnhancedSearchConfig<T extends Record<string, any> = any> {
  // 基础配置
  schemas: FormSchema<T>[]
  show?: boolean
  collapsible?: boolean
  collapsed?: boolean

  // 搜索模式
  mode?: SearchMode

  // 快速搜索配置
  quickSearch?: QuickSearchConfig

  // 高级搜索配置
  advancedSearch?: AdvancedSearchConfig

  // 搜索预设
  presets?: {
    enabled?: boolean
    list?: SearchPreset[]
    allowSave?: boolean
    maxSaved?: number
  }

  // 搜索历史
  history?: {
    enabled?: boolean
    maxRecords?: number
    showInDropdown?: boolean
  }

  // 性能优化
  performance?: {
    // 防抖延迟
    debounceDelay?: number
    // 是否启用智能搜索（仅在参数变化时触发）
    smartSearch?: boolean
    // 搜索缓存配置
    cache?: SearchCacheConfig
  }

  // 用户体验
  ui?: {
    // 搜索状态指示
    showSearchStatus?: boolean
    // 显示搜索结果统计
    showResultStats?: boolean
    // 显示活跃条件数量
    showActiveConditions?: boolean
    // 显示清空所有按钮
    showClearAll?: boolean
    // 搜索为空时的提示
    emptyResultTip?: string
    // 搜索建议
    searchSuggestions?: boolean
  }

  // 搜索导出
  export?: SearchExportConfig

  // 按钮文本配置
  text?: {
    searchText?: string
    resetText?: string
    expandText?: string
    collapseText?: string
    clearAllText?: string
    savePresetText?: string
    quickSearchPlaceholder?: string
    advancedSearchText?: string
    simpleSearchText?: string
  }

  // 事件回调
  callbacks?: {
    // 搜索前回调
    beforeSearch?: (
      params: Record<string, any>
    ) => Record<string, any> | Promise<Record<string, any>>
    // 搜索后回调
    afterSearch?: (params: Record<string, any>, result: any) => void
    // 参数变化回调
    onParamsChange?: (params: Record<string, any>) => void
    // 预设保存回调
    onPresetSave?: (preset: SearchPreset) => void
    // 预设删除回调
    onPresetDelete?: (presetKey: string) => void
  }
}

// 搜索组合式函数返回类型
export interface UseSearchReturnType {
  // 状态
  searchParams: Ref<Record<string, any>>
  searchMode: Ref<SearchMode>
  searchState: Ref<SearchState>
  searchCollapsed: Ref<boolean>
  quickSearchValue: Ref<string>

  // 计算属性
  activeConditionsCount: ComputedRef<number>
  hasActiveConditions: ComputedRef<boolean>
  canClearAll: ComputedRef<boolean>

  // 方法
  handleSearch: (params: Record<string, any>) => Promise<void>
  handleReset: () => void
  handleClearAll: () => void
  handleQuickSearch: (value: string) => void
  handleModeChange: (mode: SearchMode) => void
  updateSearchParams: (params: Record<string, any>) => void

  // 预设管理
  savePreset: (name: string, description?: string) => void
  deletePreset: (key: string) => void
  applyPreset: (preset: SearchPreset) => void

  // 历史记录
  getSearchHistory: () => SearchHistory[]
  clearSearchHistory: () => void
  applyHistoryItem: (item: SearchHistory) => void

  // 导出功能
  exportSearchParams: (format: string) => void
  importSearchParams: (data: string | object) => void
}

// 搜索组件属性
export interface SearchComponentProps {
  config: EnhancedSearchConfig
  loading?: boolean
  disabled?: boolean
}

// 搜索组件事件
export interface SearchComponentEmits {
  search: [params: Record<string, any>]
  reset: []
  'clear-all': []
  'mode-change': [mode: SearchMode]
  'preset-save': [preset: SearchPreset]
  'preset-delete': [key: string]
  'preset-apply': [preset: SearchPreset]
  'params-change': [params: Record<string, any>]
}
