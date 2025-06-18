import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type { Theme } from '../utils/types'

interface UseThemeOptions {
  /**
   * 默认主题
   * @default 'light'
   */
  defaultTheme?: Theme
  /**
   * 是否持久化到 localStorage
   * @default true
   */
  persist?: boolean
  /**
   * localStorage 存储键名
   * @default 'clever-component-theme'
   */
  storageKey?: string
}

interface UseThemeReturn {
  /** 当前主题 */
  theme: Ref<Theme>
  /** 是否为暗色主题 */
  isDark: Ref<boolean>
  /** 是否为亮色主题 */
  isLight: Ref<boolean>
  /** 切换主题 */
  toggleTheme: () => void
  /** 设置主题 */
  setTheme: (theme: Theme) => void
  /** 设置为暗色主题 */
  setDark: () => void
  /** 设置为亮色主题 */
  setLight: () => void
}

/**
 * 主题管理组合式函数
 */
export const useTheme = (options: UseThemeOptions = {}): UseThemeReturn => {
  const {
    defaultTheme = 'light',
    persist = true,
    storageKey = 'clever-component-theme'
  } = options

  // 从 localStorage 获取初始主题
  const getInitialTheme = (): Theme => {
    if (!persist || typeof window === 'undefined') {
      return defaultTheme
    }
    
    try {
      const stored = localStorage.getItem(storageKey)
      return (stored as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  }

  const theme = ref<Theme>(getInitialTheme())

  // 计算属性
  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // 切换主题
  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // 设置为暗色主题
  const setDark = () => {
    setTheme('dark')
  }

  // 设置为亮色主题
  const setLight = () => {
    setTheme('light')
  }

  // 监听主题变化，持久化到 localStorage
  if (persist && typeof window !== 'undefined') {
    watch(
      theme,
      (newTheme) => {
        try {
          localStorage.setItem(storageKey, newTheme)
        } catch {
          // 忽略存储错误
        }
      },
      { immediate: true }
    )
  }

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    setDark,
    setLight
  }
}