/**
 * 表单验证管理 Hook
 * @description 提供表单验证相关的组合式API
 */

import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { FormSchema, ValidationRule, ValidationResult } from '../types'

export interface UseFormValidationOptions {
  schemas: FormSchema[]
  model: Record<string, any>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export interface UseFormValidationReturn {
  errors: Ref<Record<string, string[]>>
  isValid: Ref<boolean>
  isValidating: Ref<boolean>
  validateField: (field: string) => Promise<ValidationResult>
  validateForm: () => Promise<ValidationResult>
  clearErrors: (field?: string) => void
  resetValidation: () => void
}

/**
 * 表单验证管理
 */
export function useFormValidation(options: UseFormValidationOptions): UseFormValidationReturn {
  const {
    schemas,
    model,
    validateOnChange = true,
    validateOnBlur = true
  } = options

  // 验证错误
  const errors = ref<Record<string, string[]>>({})
  
  // 验证状态
  const isValidating = ref(false)
  
  // 表单是否有效
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  /**
   * 验证单个字段
   */
  const validateField = async (field: string): Promise<ValidationResult> => {
    const schema = schemas.find(s => s.field === field)
    if (!schema || !schema.rules) {
      return { valid: true, errors: [] }
    }

    const value = model[field]
    const fieldErrors: string[] = []

    // 执行验证规则
    for (const rule of schema.rules) {
      const result = await executeValidationRule(rule, value, model)
      if (!result.valid) {
        fieldErrors.push(result.message || '验证失败')
      }
    }

    // 更新错误状态
    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors
    } else {
      delete errors.value[field]
    }

    return {
      valid: fieldErrors.length === 0,
      errors: fieldErrors
    }
  }

  /**
   * 验证整个表单
   */
  const validateForm = async (): Promise<ValidationResult> => {
    isValidating.value = true
    
    try {
      const results = await Promise.all(
        schemas.map(schema => validateField(schema.field))
      )
      
      const allErrors = results.reduce((acc, result, index) => {
        if (!result.valid) {
          acc[schemas[index].field] = result.errors
        }
        return acc
      }, {} as Record<string, string[]>)
      
      errors.value = allErrors
      
      return {
        valid: Object.keys(allErrors).length === 0,
        errors: Object.values(allErrors).flat()
      }
    } finally {
      isValidating.value = false
    }
  }

  /**
   * 清除错误
   */
  const clearErrors = (field?: string) => {
    if (field) {
      delete errors.value[field]
    } else {
      errors.value = {}
    }
  }

  /**
   * 重置验证状态
   */
  const resetValidation = () => {
    errors.value = {}
    isValidating.value = false
  }

  /**
   * 执行验证规则
   */
  const executeValidationRule = async (
    rule: ValidationRule,
    value: any,
    model: Record<string, any>
  ): Promise<{ valid: boolean; message?: string }> => {
    // 必填验证
    if (rule.required && (value === undefined || value === null || value === '')) {
      return { valid: false, message: rule.message || '此字段为必填项' }
    }

    // 如果值为空且不是必填，跳过其他验证
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return { valid: true }
    }

    // 类型验证
    if (rule.type) {
      const typeValid = validateType(value, rule.type)
      if (!typeValid) {
        return { valid: false, message: rule.message || `值类型必须为 ${rule.type}` }
      }
    }

    // 长度验证
    if (rule.min !== undefined || rule.max !== undefined) {
      const length = typeof value === 'string' ? value.length : value
      if (rule.min !== undefined && length < rule.min) {
        return { valid: false, message: rule.message || `最小长度为 ${rule.min}` }
      }
      if (rule.max !== undefined && length > rule.max) {
        return { valid: false, message: rule.message || `最大长度为 ${rule.max}` }
      }
    }

    // 正则验证
    if (rule.pattern) {
      const regex = new RegExp(rule.pattern)
      if (!regex.test(String(value))) {
        return { valid: false, message: rule.message || '格式不正确' }
      }
    }

    // 自定义验证函数
    if (rule.validator) {
      try {
        const result = await rule.validator(value, model)
        if (result !== true) {
          return { valid: false, message: typeof result === 'string' ? result : rule.message || '验证失败' }
        }
      } catch (error) {
        return { valid: false, message: rule.message || '验证过程中发生错误' }
      }
    }

    return { valid: true }
  }

  /**
   * 类型验证
   */
  const validateType = (value: any, type: string): boolean => {
    switch (type) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number' && !isNaN(value)
      case 'boolean':
        return typeof value === 'boolean'
      case 'array':
        return Array.isArray(value)
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value)
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      case 'url':
        return /^https?:\/\/.+/.test(String(value))
      case 'phone':
        return /^1[3-9]\d{9}$/.test(String(value))
      default:
        return true
    }
  }

  // 监听模型变化进行验证
  if (validateOnChange) {
    watch(
      () => model,
      (newModel, oldModel) => {
        if (oldModel) {
          Object.keys(newModel).forEach(field => {
            if (newModel[field] !== oldModel[field] && errors.value[field]) {
              validateField(field)
            }
          })
        }
      },
      { deep: true }
    )
  }

  return {
    errors,
    isValid,
    isValidating,
    validateField,
    validateForm,
    clearErrors,
    resetValidation
  }
}

export default useFormValidation