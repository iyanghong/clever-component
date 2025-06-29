/**
 * useField 组合式函数 - 重构版
 * @description 简化的字段逻辑，移除内置校验和字段状态
 */

import { ref, computed, watch, onUnmounted } from 'vue'
import type { UseFieldOptions, UseFieldReturn } from './types'
import type { FieldConfig } from '../types'
import utils from '../utils'

const { is } = utils

/**
 * 字段组合式函数 - 重构版
 * @param options 配置选项
 * @returns 字段状态和方法
 */
export function useField(options: UseFieldOptions): UseFieldReturn {
  const {
    config: initialConfig,
    modelValue,
    immediate = true,
    onChange
  } = options

  // 响应式状态
  const fieldConfig = ref<FieldConfig | undefined>(initialConfig)
  
  // 简化的字段状态 - 只保留基本的值管理
  const fieldState = ref({
    value: is.ref(modelValue) ? modelValue.value : modelValue,
    originalValue: is.ref(modelValue) ? modelValue.value : modelValue
  })

  // 事件处理函数
  const handleFocus = () => {
    // 简化：只处理焦点事件，不维护状态
  }

  const handleBlur = () => {
    // 简化：只处理失焦事件，不维护状态
  }

  const handleChange = (value: any) => {
    // 更新内部状态
    fieldState.value.value = value
    
    // 更新外部 modelValue
    if (is.ref(modelValue)) {
      modelValue.value = value
    }
    
    // 触发变化回调
    onChange?.(value)
  }

  // 监听外部 modelValue 变化
  if (is.ref(modelValue)) {
    watch(
      modelValue,
      (newValue) => {
        fieldState.value.value = newValue
      },
      { immediate: true }
    )
  }

  /**
   * 设置字段值
   */
  const setValue = (value: any) => {
    fieldState.value.value = value
    
    if (is.ref(modelValue)) {
      modelValue.value = value
    }
    
    onChange?.(value)
  }

  /**
   * 获取字段值
   */
  const getValue = () => {
    return fieldState.value.value
  }

  /**
   * 重置字段
   */
  const reset = () => {
    const originalValue = fieldState.value.originalValue
    setValue(originalValue)
  }

  /**
   * 设置字段配置
   */
  const setConfig = (config: FieldConfig) => {
    fieldConfig.value = config
  }

  /**
   * 销毁字段
   */
  const destroy = () => {
    fieldConfig.value = undefined
    fieldState.value = {
      value: undefined,
      originalValue: undefined
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    destroy()
  })

  return {
    // 响应式状态
    fieldConfig,
    fieldState,

    // 事件处理
    handleFocus,
    handleBlur,
    handleChange,

    // 方法
    setValue,
    getValue,
    reset,
    setConfig,
    destroy
  }
}

export default useField