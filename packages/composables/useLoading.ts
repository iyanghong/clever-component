import type { Ref } from 'vue'
import { computed, ref } from 'vue'

interface UseLoadingOptions {
  /**
   * 初始加载状态
   * @default false
   */
  initialLoading?: boolean
  /**
   * 最小加载时间（毫秒）
   * @default 0
   */
  minDuration?: number
}

interface UseLoadingReturn {
  /** 加载状态 */
  loading: Ref<boolean>
  /** 是否正在加载 */
  isLoading: Ref<boolean>
  /** 开始加载 */
  startLoading: () => void
  /** 停止加载 */
  stopLoading: () => void
  /** 切换加载状态 */
  toggleLoading: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
  /** 异步操作包装器 */
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>
}

/**
 * 加载状态管理组合式函数
 */
export const useLoading = (options: UseLoadingOptions = {}): UseLoadingReturn => {
  const { initialLoading = false, minDuration = 0 } = options

  const loading = ref(initialLoading)
  let loadingStartTime = 0

  // 计算属性
  const isLoading = computed(() => loading.value)

  // 开始加载
  const startLoading = () => {
    loading.value = true
    loadingStartTime = Date.now()
  }

  // 停止加载
  const stopLoading = async () => {
    if (minDuration > 0) {
      const elapsed = Date.now() - loadingStartTime
      const remaining = minDuration - elapsed
      
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }
    }
    
    loading.value = false
  }

  // 切换加载状态
  const toggleLoading = () => {
    if (loading.value) {
      stopLoading()
    } else {
      startLoading()
    }
  }

  // 设置加载状态
  const setLoading = (newLoading: boolean) => {
    if (newLoading) {
      startLoading()
    } else {
      stopLoading()
    }
  }

  // 异步操作包装器
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      startLoading()
      const result = await fn()
      return result
    } finally {
      await stopLoading()
    }
  }

  return {
    loading,
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading,
    withLoading
  }
}