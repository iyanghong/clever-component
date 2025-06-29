/**
 * 表单数据管理 Hook
 * @description 提供表单数据管理相关的组合式API
 */

import { ref, computed, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import type { FormSchema } from '../types'

export interface UseFormDataOptions {
  schemas: FormSchema[]
  initialData?: Record<string, any>
  autoSave?: boolean
  autoSaveDelay?: number
}

export interface UseFormDataReturn {
  model: Ref<Record<string, any>>
  originalData: Ref<Record<string, any>>
  isDirty: Ref<boolean>
  isChanged: Ref<boolean>
  changedFields: Ref<string[]>
  setFieldValue: (field: string, value: any) => void
  getFieldValue: (field: string) => any
  setFormData: (data: Record<string, any>) => void
  getFormData: () => Record<string, any>
  resetForm: () => void
  resetField: (field: string) => void
  clearForm: () => void
  compareData: (data1: Record<string, any>, data2: Record<string, any>) => boolean
  getChangedData: () => Record<string, any>
  restoreData: () => void
}

/**
 * 表单数据管理
 */
export function useFormData(options: UseFormDataOptions): UseFormDataReturn {
  const {
    schemas,
    initialData = {},
    autoSave = false,
    autoSaveDelay = 1000
  } = options

  // 表单数据模型
  const model = ref<Record<string, any>>({})
  
  // 原始数据（用于重置和比较）
  const originalData = ref<Record<string, any>>({})
  
  // 自动保存定时器
  let autoSaveTimer: NodeJS.Timeout | null = null

  // 初始化表单数据
  const initializeFormData = () => {
    const defaultData: Record<string, any> = {}
    
    // 根据 schemas 设置默认值
    schemas.forEach(schema => {
      if (schema.defaultValue !== undefined) {
        defaultData[schema.field] = schema.defaultValue
      } else {
        // 根据字段类型设置默认值
        switch (schema.type) {
          case 'input':
          case 'textarea':
          case 'password':
            defaultData[schema.field] = ''
            break
          case 'number':
            defaultData[schema.field] = 0
            break
          case 'switch':
          case 'checkbox':
            defaultData[schema.field] = false
            break
          case 'select':
          case 'radio':
            defaultData[schema.field] = null
            break
          case 'date':
          case 'datetime':
          case 'time':
            defaultData[schema.field] = null
            break
          case 'upload':
            defaultData[schema.field] = []
            break
          default:
            defaultData[schema.field] = null
        }
      }
    })
    
    // 合并初始数据
    const mergedData = { ...defaultData, ...initialData }
    model.value = { ...mergedData }
    originalData.value = { ...mergedData }
  }

  // 表单是否有变化
  const isDirty = computed(() => {
    return !compareData(model.value, originalData.value)
  })

  // 表单是否已修改（别名）
  const isChanged = computed(() => isDirty.value)

  // 已变化的字段
  const changedFields = computed(() => {
    const fields: string[] = []
    Object.keys(model.value).forEach(key => {
      if (model.value[key] !== originalData.value[key]) {
        fields.push(key)
      }
    })
    return fields
  })

  /**
   * 设置字段值
   */
  const setFieldValue = (field: string, value: any) => {
    model.value[field] = value
    
    // 触发自动保存
    if (autoSave) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
      autoSaveTimer = setTimeout(() => {
        // 这里可以触发保存事件或调用保存方法
        console.log('Auto save triggered for field:', field)
      }, autoSaveDelay)
    }
  }

  /**
   * 获取字段值
   */
  const getFieldValue = (field: string) => {
    return model.value[field]
  }

  /**
   * 设置整个表单数据
   */
  const setFormData = (data: Record<string, any>) => {
    model.value = { ...model.value, ...data }
  }

  /**
   * 获取整个表单数据
   */
  const getFormData = () => {
    return { ...model.value }
  }

  /**
   * 重置表单到原始状态
   */
  const resetForm = () => {
    model.value = { ...originalData.value }
  }

  /**
   * 重置单个字段
   */
  const resetField = (field: string) => {
    if (originalData.value.hasOwnProperty(field)) {
      model.value[field] = originalData.value[field]
    }
  }

  /**
   * 清空表单
   */
  const clearForm = () => {
    const clearedData: Record<string, any> = {}
    schemas.forEach(schema => {
      switch (schema.type) {
        case 'input':
        case 'textarea':
        case 'password':
          clearedData[schema.field] = ''
          break
        case 'number':
          clearedData[schema.field] = 0
          break
        case 'switch':
        case 'checkbox':
          clearedData[schema.field] = false
          break
        case 'upload':
          clearedData[schema.field] = []
          break
        default:
          clearedData[schema.field] = null
      }
    })
    model.value = clearedData
  }

  /**
   * 比较两个数据对象是否相等
   */
  const compareData = (data1: Record<string, any>, data2: Record<string, any>): boolean => {
    const keys1 = Object.keys(data1)
    const keys2 = Object.keys(data2)
    
    if (keys1.length !== keys2.length) {
      return false
    }
    
    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false
      }
      
      const value1 = data1[key]
      const value2 = data2[key]
      
      // 深度比较
      if (typeof value1 === 'object' && typeof value2 === 'object') {
        if (Array.isArray(value1) && Array.isArray(value2)) {
          if (value1.length !== value2.length) {
            return false
          }
          for (let i = 0; i < value1.length; i++) {
            if (JSON.stringify(value1[i]) !== JSON.stringify(value2[i])) {
              return false
            }
          }
        } else if (value1 !== null && value2 !== null) {
          if (JSON.stringify(value1) !== JSON.stringify(value2)) {
            return false
          }
        } else if (value1 !== value2) {
          return false
        }
      } else if (value1 !== value2) {
        return false
      }
    }
    
    return true
  }

  /**
   * 获取变化的数据
   */
  const getChangedData = (): Record<string, any> => {
    const changed: Record<string, any> = {}
    changedFields.value.forEach(field => {
      changed[field] = model.value[field]
    })
    return changed
  }

  /**
   * 恢复数据（将当前数据设为原始数据）
   */
  const restoreData = () => {
    originalData.value = { ...model.value }
  }

  // 监听 schemas 变化，重新初始化数据
  watch(
    () => schemas,
    () => {
      nextTick(() => {
        initializeFormData()
      })
    },
    { immediate: true, deep: true }
  )

  // 监听 initialData 变化
  watch(
    () => initialData,
    (newData) => {
      if (newData) {
        setFormData(newData)
        originalData.value = { ...model.value }
      }
    },
    { deep: true }
  )

  // 清理定时器
  const cleanup = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
      autoSaveTimer = null
    }
  }

  // 组件卸载时清理
  watch(
    () => false, // 这里可以监听组件的卸载状态
    cleanup
  )

  return {
    model,
    originalData,
    isDirty,
    isChanged,
    changedFields,
    setFieldValue,
    getFieldValue,
    setFormData,
    getFormData,
    resetForm,
    resetField,
    clearForm,
    compareData,
    getChangedData,
    restoreData
  }
}

export default useFormData