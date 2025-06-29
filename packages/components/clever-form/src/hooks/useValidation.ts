/**
 * useValidation 组合式函数
 * @description 表单验证逻辑的组合式API
 */

import { ref, computed, reactive, watch, onUnmounted } from 'vue'
import type { UseValidationOptions, UseValidationReturn } from './types'
import type {
  ValidationConfig,
  ValidationResult,
  ValidationEngine,
  ValidationRule
} from '../types'
import { validate as validateUtils, error } from '../utils'
import { ERROR_CODES } from '../constants'

/**
 * 验证组合式函数
 * @param options 配置选项
 * @returns 验证状态和方法
 */
export function useValidation(options: UseValidationOptions = {}): UseValidationReturn {
  const {
    config,
    immediate = false,
    trigger = 'change'
  } = options

  // 响应式状态
  const validationEngine = ref<ValidationEngine | null>(null)
  const validationResults = ref<Record<string, ValidationResult>>({})
  const validating = ref(false)

  // 计算属性
  const hasErrors = computed(() => {
    return Object.values(validationResults.value).some(result => !result.valid)
  })

  const errorCount = computed(() => {
    return Object.values(validationResults.value).filter(result => !result.valid).length
  })

  /**
   * 验证单个字段
   * @param path 字段路径
   * @param value 字段值
   * @returns 验证结果
   */
  const validate = async (path?: string, value?: any): Promise<ValidationResult> => {
    if (!validationEngine.value || !path) {
      return { valid: true, errors: [], warnings: [] }
    }

    try {
      validating.value = true
      const result = await validationEngine.value.validate(path, value)
      validationResults.value[path] = result
      return result
    } catch (err) {
      const errorResult: ValidationResult = {
        valid: false,
        errors: [error.createError(ERROR_CODES.VALIDATION_ERROR, `验证失败: ${err}`)],
        warnings: []
      }
      validationResults.value[path] = errorResult
      return errorResult
    } finally {
      validating.value = false
    }
  }

  /**
   * 验证所有字段
   * @returns 所有验证结果
   */
  const validateAll = async (): Promise<Record<string, ValidationResult>> => {
    if (!validationEngine.value) {
      return {}
    }

    try {
      validating.value = true
      const results = await validationEngine.value.validateAll()
      validationResults.value = results
      return results
    } catch (err) {
      console.error('批量验证失败:', err)
      return {}
    } finally {
      validating.value = false
    }
  }

  /**
   * 清除验证结果
   * @param path 字段路径，不传则清除所有
   */
  const clearValidation = (path?: string): void => {
    if (path) {
      delete validationResults.value[path]
    } else {
      validationResults.value = {}
    }
  }

  /**
   * 清除所有验证结果
   */
  const clearAllValidation = (): void => {
    validationResults.value = {}
  }

  /**
   * 添加验证规则
   * @param path 字段路径
   * @param rule 验证规则
   */
  const addRule = (path: string, rule: ValidationRule): void => {
    if (validationEngine.value) {
      validationEngine.value.addRule(path, rule)
    }
  }

  /**
   * 移除验证规则
   * @param path 字段路径
   * @param ruleId 规则ID
   */
  const removeRule = (path: string, ruleId?: string): void => {
    if (validationEngine.value) {
      validationEngine.value.removeRule(path, ruleId)
    }
  }

  /**
   * 设置验证配置
   * @param newConfig 新的验证配置
   */
  const setConfig = (newConfig: ValidationConfig): void => {
    if (validationEngine.value) {
      validationEngine.value.setConfig(newConfig)
    }
  }

  // 初始化验证引擎
  if (config) {
    try {
      validationEngine.value = validateUtils.createEngine(config)
      if (immediate) {
        validateAll()
      }
    } catch (err) {
      console.error('验证引擎初始化失败:', err)
    }
  }

  // 清理资源
  onUnmounted(() => {
    if (validationEngine.value) {
      validationEngine.value.destroy?.()
    }
  })

  return {
    validationEngine,
    validationResults,
    validating,
    hasErrors,
    errorCount,
    validate,
    validateAll,
    clearValidation,
    clearAllValidation,
    addRule,
    removeRule,
    setConfig
  }
}