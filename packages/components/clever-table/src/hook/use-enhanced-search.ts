import {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  h,
  readonly,
  toRef
} from 'vue'
import { useMessage } from 'naive-ui'
import type {
  EnhancedSearchConfig,
  SearchState,
  SearchPreset,
  SearchHistory,
  UseSearchReturnType,
  SearchCacheConfig
} from '../types/search'
import { SearchMode } from '../types/search'

// 搜索缓存管理
class SearchCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; expireTime: number }
  >()
  private config: SearchCacheConfig

  constructor(config: SearchCacheConfig = {}) {
    this.config = {
      enabled: true,
      expireTime: 5 * 60 * 1000, // 5分钟
      maxSize: 50,
      ...config
    }
  }

  generateKey(params: Record<string, any>): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(params)
    }
    return JSON.stringify(params, Object.keys(params).sort())
  }

  get(params: Record<string, any>): any | null {
    if (!this.config.enabled) return null

    const key = this.generateKey(params)
    const item = this.cache.get(key)

    if (!item) return null

    // 检查是否过期
    if (Date.now() > item.timestamp + item.expireTime) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set(params: Record<string, any>, data: any): void {
    if (!this.config.enabled) return

    const key = this.generateKey(params)

    // 检查缓存大小限制
    if (this.cache.size >= (this.config.maxSize || 50)) {
      // 删除最旧的缓存项
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expireTime: this.config.expireTime || 5 * 60 * 1000
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 深度比较对象
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }

  return true
}

// 清理空值参数
function cleanParams(params: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {}

  for (const [key, value] of Object.entries(params)) {
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      cleaned[key] = value
    }
  }

  return cleaned
}

export function useEnhancedSearch(
  config: EnhancedSearchConfig,
  onSearch: (params: Record<string, any>) => Promise<any>
): UseSearchReturnType {
  const message = useMessage()

  // 搜索缓存实例
  const searchCache = new SearchCache(config.performance?.cache)

  // 响应式状态
  const searchParams = ref<Record<string, any>>({})
  const searchMode = ref<SearchMode>(config.mode || SearchMode.SIMPLE)
  const searchCollapsed = ref(config.collapsed || false)
  const quickSearchValue = ref('')

  // 搜索状态
  const searchState = ref<SearchState>({
    searching: false,
    resultCount: 0,
    duration: 0,
    activeConditions: 0,
    lastSearchTime: undefined
  })

  // 搜索历史
  const searchHistory = ref<SearchHistory[]>([])

  // 搜索预设
  const searchPresets = ref<SearchPreset[]>(config.presets?.list || [])

  // 上次搜索参数（用于智能搜索）
  const lastSearchParams = ref<Record<string, any>>({})

  // 计算属性
  const activeConditionsCount = computed(() => {
    const cleaned = cleanParams(searchParams.value)
    return Object.keys(cleaned).length
  })

  const hasActiveConditions = computed(() => activeConditionsCount.value > 0)

  const canClearAll = computed(() => hasActiveConditions.value)

  // 防抖搜索函数
  const debouncedSearch = debounce(async (params: Record<string, any>) => {
    await performSearch(params)
  }, config.performance?.debounceDelay || 300)

  // 执行搜索
  async function performSearch(params: Record<string, any>) {
    const cleanedParams = cleanParams(params)

    // 智能搜索：如果参数没有变化，不重复搜索
    if (
      config.performance?.smartSearch &&
      deepEqual(cleanedParams, lastSearchParams.value)
    ) {
      return
    }

    // 检查缓存
    const cachedResult = searchCache.get(cleanedParams)
    if (cachedResult) {
      updateSearchState(cleanedParams, cachedResult, 0)
      return cachedResult
    }

    try {
      searchState.value.searching = true
      const startTime = Date.now()

      // 搜索前回调
      let finalParams = cleanedParams
      if (config.callbacks?.beforeSearch) {
        finalParams = await config.callbacks.beforeSearch(cleanedParams)
      }

      // 执行搜索
      const result = await onSearch(finalParams)
      const duration = Date.now() - startTime

      // 缓存结果
      searchCache.set(cleanedParams, result)

      // 更新搜索状态
      updateSearchState(finalParams, result, duration)

      // 保存到历史记录
      saveToHistory(finalParams, result)

      // 搜索后回调
      if (config.callbacks?.afterSearch) {
        config.callbacks.afterSearch(finalParams, result)
      }

      // 更新上次搜索参数
      lastSearchParams.value = { ...finalParams }

      return result
    } catch (error) {
      console.error('Search error:', error)
      message.error('搜索失败，请重试')
      throw error
    } finally {
      searchState.value.searching = false
    }
  }

  // 更新搜索状态
  function updateSearchState(
    params: Record<string, any>,
    result: any,
    duration: number
  ) {
    searchState.value.duration = duration
    searchState.value.activeConditions = Object.keys(params).length
    searchState.value.lastSearchTime = Date.now()

    // 计算结果数量
    if (Array.isArray(result)) {
      searchState.value.resultCount = result.length
    } else if (result && typeof result === 'object') {
      if (Array.isArray(result.data)) {
        searchState.value.resultCount = result.data.length
      } else if (Array.isArray(result.list)) {
        searchState.value.resultCount = result.list.length
      } else if (typeof result.total === 'number') {
        searchState.value.resultCount = result.total
      } else {
        searchState.value.resultCount = 0
      }
    } else {
      searchState.value.resultCount = 0
    }
  }

  // 保存到历史记录
  function saveToHistory(params: Record<string, any>, result: any) {
    if (!config.history?.enabled) return

    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      params: { ...params },
      timestamp: Date.now(),
      resultCount: searchState.value.resultCount,
      description: generateSearchDescription(params)
    }

    searchHistory.value.unshift(historyItem)

    // 限制历史记录数量
    const maxRecords = config.history?.maxRecords || 20
    if (searchHistory.value.length > maxRecords) {
      searchHistory.value = searchHistory.value.slice(0, maxRecords)
    }
  }

  // 生成搜索描述
  function generateSearchDescription(params: Record<string, any>): string {
    const conditions = Object.entries(params)
      .filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, 3) // 只显示前3个条件

    return conditions.join(', ') + (conditions.length > 3 ? '...' : '')
  }

  // 搜索处理函数
  const handleSearch = async (params: Record<string, any>) => {
    searchParams.value = { ...params }

    if (config.performance?.debounceDelay) {
      debouncedSearch(params)
    } else {
      await performSearch(params)
    }
  }

  // 重置搜索
  const handleReset = () => {
    searchParams.value = {}
    quickSearchValue.value = ''
    lastSearchParams.value = {}
    searchCache.clear()

    // 触发搜索
    handleSearch({})
  }

  // 清空所有条件
  const handleClearAll = () => {
    handleReset()
  }

  // 快速搜索
  const handleQuickSearch = (value: string) => {
    quickSearchValue.value = value

    if (!config.quickSearch?.enabled) return

    const quickParams: Record<string, any> = {}

    if (value && value.length >= (config.quickSearch.minLength || 1)) {
      config.quickSearch.fields.forEach(field => {
        quickParams[field] = value
      })
    }

    if (config.quickSearch.realtime) {
      handleSearch(quickParams)
    }
  }

  // 切换搜索模式
  const handleModeChange = (mode: SearchMode) => {
    searchMode.value = mode

    if (config.callbacks?.onParamsChange) {
      config.callbacks.onParamsChange(searchParams.value)
    }
  }

  // 更新搜索参数
  const updateSearchParams = (params: Record<string, any>) => {
    searchParams.value = { ...searchParams.value, ...params }

    if (config.callbacks?.onParamsChange) {
      config.callbacks.onParamsChange(searchParams.value)
    }
  }

  // 保存预设
  const savePreset = (name: string, description?: string) => {
    if (!config.presets?.enabled) return

    const preset: SearchPreset = {
      key: Date.now().toString(),
      label: name,
      params: { ...searchParams.value },
      description,
      default: false
    }

    searchPresets.value.push(preset)

    // 限制预设数量
    const maxSaved = config.presets?.maxSaved || 10
    if (searchPresets.value.length > maxSaved) {
      searchPresets.value = searchPresets.value.slice(-maxSaved)
    }

    if (config.callbacks?.onPresetSave) {
      config.callbacks.onPresetSave(preset)
    }

    message.success('搜索预设保存成功')
  }

  // 删除预设
  const deletePreset = (key: string) => {
    const index = searchPresets.value.findIndex(preset => preset.key === key)
    if (index > -1) {
      searchPresets.value.splice(index, 1)

      if (config.callbacks?.onPresetDelete) {
        config.callbacks.onPresetDelete(key)
      }

      message.success('搜索预设删除成功')
    }
  }

  // 应用预设
  const applyPreset = (preset: SearchPreset) => {
    searchParams.value = { ...preset.params }
    handleSearch(preset.params)
    message.success(`已应用预设：${preset.label}`)
  }

  // 获取搜索历史
  const getSearchHistory = (): SearchHistory[] => {
    return searchHistory.value
  }

  // 清空搜索历史
  const clearSearchHistory = () => {
    searchHistory.value = []
    message.success('搜索历史已清空')
  }

  // 应用历史记录
  const applyHistoryItem = (item: SearchHistory) => {
    searchParams.value = { ...item.params }
    handleSearch(item.params)
  }

  // 导出搜索参数
  const exportSearchParams = (format: string) => {
    if (!config.export?.enabled) return

    const params = cleanParams(searchParams.value)

    if (config.export.customExporter) {
      config.export.customExporter(params, format)
      return
    }

    let content: string
    let filename: string
    const prefix = config.export.filenamePrefix || 'search-params'
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')

    switch (format) {
      case 'json':
        content = JSON.stringify(params, null, 2)
        filename = `${prefix}-${timestamp}.json`
        break
      case 'csv':
        const csvRows = Object.entries(params).map(
          ([key, value]) => `${key},${value}`
        )
        content = 'Field,Value\n' + csvRows.join('\n')
        filename = `${prefix}-${timestamp}.csv`
        break
      case 'url':
        const urlParams = new URLSearchParams(params).toString()
        content = `${window.location.origin}${window.location.pathname}?${urlParams}`
        filename = `${prefix}-${timestamp}.txt`
        break
      default:
        message.warning('不支持的导出格式')
        return
    }

    // 创建下载链接
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    message.success('搜索参数导出成功')
  }

  // 导入搜索参数
  const importSearchParams = (data: string | object) => {
    try {
      let params: Record<string, any>

      if (typeof data === 'string') {
        params = JSON.parse(data)
      } else {
        params = data
      }

      searchParams.value = { ...params }
      handleSearch(params)
      message.success('搜索参数导入成功')
    } catch (error) {
      console.error('Import error:', error)
      message.error('搜索参数导入失败，请检查数据格式')
    }
  }

  // 监听搜索参数变化
  watch(
    () => searchParams.value,
    newParams => {
      if (config.callbacks?.onParamsChange) {
        config.callbacks.onParamsChange(newParams)
      }
    },
    { deep: true }
  )

  return {
    // 状态
    searchParams,
    searchMode,
    searchState,
    searchCollapsed,
    quickSearchValue,

    // 计算属性
    activeConditionsCount,
    hasActiveConditions,
    canClearAll,

    // 方法
    handleSearch,
    handleReset,
    handleClearAll,
    handleQuickSearch,
    handleModeChange,
    updateSearchParams,

    // 预设管理
    savePreset,
    deletePreset,
    applyPreset,

    // 历史记录
    getSearchHistory,
    clearSearchHistory,
    applyHistoryItem,

    // 导出功能
    exportSearchParams,
    importSearchParams
  }
}
