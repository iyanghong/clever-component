import type { InjectionKey, Ref } from 'vue'
import { computed, inject, provide, ref } from 'vue'
import type { Size } from '../utils/types'

// 注入键
export const SIZE_INJECTION_KEY: InjectionKey<Ref<Size>> = Symbol('size')

interface UseSizeOptions {
  /**
   * 默认尺寸
   * @default 'medium'
   */
  defaultSize?: Size
  /**
   * 组件自身的尺寸属性
   */
  size?: Size
}

interface UseSizeReturn {
  /** 当前尺寸 */
  size: Ref<Size>
  /** 是否为小尺寸 */
  isSmall: Ref<boolean>
  /** 是否为中等尺寸 */
  isMedium: Ref<boolean>
  /** 是否为大尺寸 */
  isLarge: Ref<boolean>
  /** 设置尺寸 */
  setSize: (size: Size) => void
}

/**
 * 尺寸管理组合式函数
 */
export const useSize = (options: UseSizeOptions = {}): UseSizeReturn => {
  const { defaultSize = 'medium', size: propSize } = options

  // 尝试从父组件注入尺寸
  const injectedSize = inject(SIZE_INJECTION_KEY, null)

  // 确定最终尺寸：组件属性 > 注入的尺寸 > 默认尺寸
  const finalSize = computed(() => {
    return propSize || injectedSize?.value || defaultSize
  })

  const size = ref<Size>(finalSize.value)

  // 计算属性
  const isSmall = computed(() => size.value === 'small')
  const isMedium = computed(() => size.value === 'medium')
  const isLarge = computed(() => size.value === 'large')

  // 设置尺寸
  const setSize = (newSize: Size) => {
    size.value = newSize
  }

  return {
    size,
    isSmall,
    isMedium,
    isLarge,
    setSize
  }
}

/**
 * 提供尺寸上下文
 */
export const provideSizeContext = (size: Ref<Size> | Size) => {
  const sizeRef = ref(size)
  provide(SIZE_INJECTION_KEY, sizeRef)
  return sizeRef
}

/**
 * 注入尺寸上下文
 */
export const injectSizeContext = (defaultSize: Size = 'medium') => {
  return inject(SIZE_INJECTION_KEY, ref(defaultSize))
}