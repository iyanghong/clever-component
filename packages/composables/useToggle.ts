import type { Ref } from 'vue'
import { computed, ref } from 'vue'

interface UseToggleOptions {
  /**
   * 初始状态
   * @default false
   */
  initialValue?: boolean
  /**
   * 真值
   * @default true
   */
  truthyValue?: any
  /**
   * 假值
   * @default false
   */
  falsyValue?: any
}

interface UseToggleReturn<T = boolean> {
  /** 当前状态 */
  value: Ref<T>
  /** 是否为真值 */
  isTruthy: Ref<boolean>
  /** 是否为假值 */
  isFalsy: Ref<boolean>
  /** 切换状态 */
  toggle: () => void
  /** 设置为真值 */
  setTrue: () => void
  /** 设置为假值 */
  setFalse: () => void
  /** 设置状态 */
  setValue: (value: T) => void
}

/**
 * 切换状态管理组合式函数
 */
export function useToggle(): UseToggleReturn<boolean>
export function useToggle<T>(
  initialValue: T,
  options?: UseToggleOptions
): UseToggleReturn<T>
export function useToggle<T>(
  initialValue?: T,
  options: UseToggleOptions = {}
): UseToggleReturn<T> {
  const {
    truthyValue = true,
    falsyValue = false
  } = options

  const value = ref<T>(
    initialValue !== undefined ? initialValue : (falsyValue as T)
  )

  // 计算属性
  const isTruthy = computed(() => value.value === truthyValue)
  const isFalsy = computed(() => value.value === falsyValue)

  // 切换状态
  const toggle = () => {
    value.value = isTruthy.value ? falsyValue : truthyValue
  }

  // 设置为真值
  const setTrue = () => {
    value.value = truthyValue
  }

  // 设置为假值
  const setFalse = () => {
    value.value = falsyValue
  }

  // 设置状态
  const setValue = (newValue: T) => {
    value.value = newValue
  }

  return {
    value,
    isTruthy,
    isFalsy,
    toggle,
    setTrue,
    setFalse,
    setValue
  }
}

/**
 * 布尔值切换组合式函数
 */
export const useBooleanToggle = (initialValue = false) => {
  return useToggle(initialValue)
}

/**
 * 多状态切换组合式函数
 */
export const useMultiToggle = <T extends readonly any[]>(
  values: T,
  initialIndex = 0
) => {
  const currentIndex = ref(initialIndex)
  
  const currentValue = computed(() => values[currentIndex.value])
  
  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % values.length
  }
  
  const prev = () => {
    currentIndex.value = 
      currentIndex.value === 0 ? values.length - 1 : currentIndex.value - 1
  }
  
  const setIndex = (index: number) => {
    if (index >= 0 && index < values.length) {
      currentIndex.value = index
    }
  }
  
  const setValue = (value: T[number]) => {
    const index = values.indexOf(value)
    if (index !== -1) {
      currentIndex.value = index
    }
  }
  
  return {
    currentValue,
    currentIndex,
    next,
    prev,
    setIndex,
    setValue,
    values
  }
}