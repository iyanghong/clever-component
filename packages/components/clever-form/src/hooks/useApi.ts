/**
 * useApi 组合式函数
 * @description API请求管理逻辑的组合式API
 */

import { ref, computed, reactive, watch, onUnmounted } from 'vue'
import type { UseApiOptions, UseApiReturn } from './types'
import type {
  ApiConfig,
  ApiState,
  ApiMethods,
  ApiEvents
} from '../types'
import { error } from '../utils'
import { ERROR_CODES } from '../constants'

// 简化的API工具
const apiUtils = {
  request: async (config: any) => {
    // 简化的请求实现
    const response = await fetch(config.url, {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
      signal: config.signal
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return { data, status: response.status, headers: response.headers }
  }
}

// 简化的缓存工具
const cache = {
  store: new Map<string, { data: any; timestamp: number; ttl?: number }>(),
  
  get: (key: string, ttl?: number) => {
    const item = cache.store.get(key)
    if (!item) return null
    
    const now = Date.now()
    const itemTtl = ttl || item.ttl || 300000 // 默认5分钟
    
    if (now - item.timestamp > itemTtl) {
      cache.store.delete(key)
      return null
    }
    
    return item.data
  },
  
  set: (key: string, data: any, ttl?: number) => {
    cache.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  },
  
  delete: (key: string) => {
    cache.store.delete(key)
  },
  
  clear: () => {
    cache.store.clear()
  }
}

/**
 * API组合式函数
 * @param options 配置选项
 * @returns API状态和方法
 */
export function useApi(options: UseApiOptions = {}): UseApiReturn {
  const {
    config,
    immediate = false,
    cache: cacheConfig = false,
    retry: retryConfig = false
  } = options

  // 响应式状态
  const data = ref<any>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)
  const finished = ref<boolean>(false)

  // API状态
  const apiState = ref<ApiState>({
    loading: false,
    error: null,
    data: null,
    response: null,
    request: null,
    retryCount: 0,
    lastRequestTime: null,
    cache: null
  })

  // 内部状态
  const abortController = ref<AbortController | null>(null)
  const retryTimer = ref<NodeJS.Timeout | null>(null)
  const cacheKey = ref<string>('')
  const destroyed = ref<boolean>(false)

  /**
   * 执行API请求
   * @param params 请求参数
   * @returns 响应数据
   */
  const execute = async (params?: any): Promise<any> => {
    if (destroyed.value || !config) {
      throw new Error('API已销毁或配置无效')
    }

    // 取消之前的请求
    cancel()

    try {
      // 更新状态
      loading.value = true
      finished.value = false
      error.value = null
      apiState.value.loading = true
      apiState.value.error = null
      apiState.value.lastRequestTime = new Date()

      // 生成缓存键
      if (cacheConfig) {
        cacheKey.value = generateCacheKey(config, params)
        
        // 检查缓存
        const cachedData = getCachedData(cacheKey.value)
        if (cachedData) {
          data.value = cachedData
          apiState.value.data = cachedData
          apiState.value.cache = { hit: true, key: cacheKey.value }
          return cachedData
        }
      }

      // 创建取消控制器
      abortController.value = new AbortController()

      // 构建请求配置
      const requestConfig = {
        ...config,
        params,
        signal: abortController.value.signal
      }

      // 执行请求
      const response = await apiUtils.request(requestConfig)
      
      // 更新状态
      data.value = response.data
      apiState.value.data = response.data
      apiState.value.response = response
      apiState.value.request = requestConfig
      apiState.value.retryCount = 0

      // 缓存数据
      if (cacheConfig && cacheKey.value) {
        setCachedData(cacheKey.value, response.data)
        apiState.value.cache = { hit: false, key: cacheKey.value }
      }

      return response.data
    } catch (err: any) {
      // 如果是取消请求，不处理错误
      if (err.name === 'AbortError') {
        return
      }

      // 重试逻辑
      if (shouldRetry(err)) {
        return await handleRetry(params)
      }

      // 更新错误状态
      const apiError = error.createError(ERROR_CODES.API_ERROR, err.message || '请求失败', err)
      error.value = apiError
      apiState.value.error = apiError

      throw apiError
    } finally {
      loading.value = false
      finished.value = true
      apiState.value.loading = false
      abortController.value = null
    }
  }

  /**
   * 刷新请求
   * @returns 响应数据
   */
  const refresh = async (): Promise<any> => {
    if (!apiState.value.request) {
      throw new Error('没有可刷新的请求')
    }

    // 清除缓存
    if (cacheKey.value) {
      clearCachedData(cacheKey.value)
    }

    return await execute(apiState.value.request.params)
  }

  /**
   * 取消请求
   */
  const cancel = (): void => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }

    if (retryTimer.value) {
      clearTimeout(retryTimer.value)
      retryTimer.value = null
    }

    loading.value = false
    apiState.value.loading = false
  }

  /**
   * 重置状态
   */
  const reset = (): void => {
    cancel()
    data.value = null
    error.value = null
    finished.value = false
    apiState.value = {
      loading: false,
      error: null,
      data: null,
      response: null,
      request: null,
      retryCount: 0,
      lastRequestTime: null,
      cache: null
    }
  }

  /**
   * 设置API配置
   * @param newConfig 新配置
   */
  const setConfig = (newConfig: ApiConfig): void => {
    Object.assign(config || {}, newConfig)
  }

  /**
   * 判断是否应该重试
   * @param err 错误对象
   * @returns 是否重试
   */
  const shouldRetry = (err: any): boolean => {
    if (!retryConfig || apiState.value.retryCount >= getMaxRetries()) {
      return false
    }

    // 网络错误或5xx错误可以重试
    const retryableErrors = ['NETWORK_ERROR', 'TIMEOUT_ERROR']
    const retryableStatus = [500, 502, 503, 504]
    
    return (
      retryableErrors.includes(err.code) ||
      (err.response && retryableStatus.includes(err.response.status))
    )
  }

  /**
   * 处理重试
   * @param params 请求参数
   * @returns 响应数据
   */
  const handleRetry = async (params?: any): Promise<any> => {
    const delay = getRetryDelay()
    apiState.value.retryCount++

    return new Promise((resolve, reject) => {
      retryTimer.value = setTimeout(async () => {
        try {
          const result = await execute(params)
          resolve(result)
        } catch (err) {
          reject(err)
        }
      }, delay)
    })
  }

  /**
   * 获取最大重试次数
   * @returns 重试次数
   */
  const getMaxRetries = (): number => {
    if (typeof retryConfig === 'boolean') {
      return retryConfig ? 3 : 0
    }
    return retryConfig.times || 3
  }

  /**
   * 获取重试延迟
   * @returns 延迟时间（毫秒）
   */
  const getRetryDelay = (): number => {
    if (typeof retryConfig === 'boolean') {
      return 1000 * Math.pow(2, apiState.value.retryCount) // 指数退避
    }
    return retryConfig.delay || 1000
  }

  /**
   * 生成缓存键
   * @param config API配置
   * @param params 请求参数
   * @returns 缓存键
   */
  const generateCacheKey = (config: ApiConfig, params?: any): string => {
    const keyParts = [
      config.url,
      config.method || 'GET',
      JSON.stringify(params || {})
    ]
    return btoa(keyParts.join('|'))
  }

  /**
   * 获取缓存数据
   * @param key 缓存键
   * @returns 缓存数据
   */
  const getCachedData = (key: string): any => {
    if (typeof cacheConfig === 'boolean') {
      return cache.get(key)
    }
    return cache.get(key, cacheConfig.ttl)
  }

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 数据
   */
  const setCachedData = (key: string, data: any): void => {
    if (typeof cacheConfig === 'boolean') {
      cache.set(key, data)
    } else {
      cache.set(key, data, cacheConfig.ttl)
    }
  }

  /**
   * 清除缓存数据
   * @param key 缓存键
   */
  const clearCachedData = (key: string): void => {
    cache.delete(key)
  }

  // 立即执行
  if (immediate && config) {
    execute()
  }

  // 清理资源
  onUnmounted(() => {
    destroyed.value = true
    cancel()
  })

  return {
    apiState,
    data,
    error,
    loading,
    finished,
    execute,
    refresh,
    cancel,
    reset,
    setConfig
  }
}