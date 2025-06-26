/**
 * CleverForm 核心逻辑组合式函数
 * 重构后的表单核心逻辑，提供完整的表单管理功能
 */

import { ref, reactive, computed, watch, nextTick, type Ref } from 'vue'
import type { FormInst } from 'naive-ui'
import type {
  FormConfig,
  FormFieldSchema,
  FormMethods,
  FieldPath,
  FormModel,
  LayoutConfig,
  DEFAULT_FORM_CONFIG,
  DEFAULT_LAYOUT_CONFIG
} from '../types/core'
import { createDefaultFieldValue, isFormFieldSchema } from './useFormField'

// ============= 接口定义 =============

export interface UseCleverFormOptions<T = Record<string, any>> {
  /** 表单配置 */
  config: FormConfig<T>
  /** 表单实例引用 */
  formRef?: Ref<FormInst | undefined>
  /** 事件发射器 */
  emit?: (event: string, ...args: any[]) => void
}

export interface UseCleverFormReturn<T = Record<string, any>> {
  // 响应式数据
  formData: Ref<T>
  loading: Ref<boolean>
  
  // 计算属性
  formProps: Ref<Record<string, any>>
  layoutConfig: Ref<LayoutConfig>
  visibleSchemas: Ref<FormFieldSchema<T>[]>
  
  // 表单方法
  methods: FormMethods<T>
  
  // 内部方法
  initializeForm: () => void
  updateConfig: (newConfig: Partial<FormConfig<T>>) => void
}

// ============= 主要组合式函数 =============

export function useCleverForm<T = Record<string, any>>(
  options: UseCleverFormOptions<T>
): UseCleverFormReturn<T> {
  const { config, formRef, emit } = options

  // ============= 响应式状态 =============

  /** 表单数据 */
  const formData = ref({} as T) as Ref<T>
  
  /** 加载状态 */
  const loading = ref(false)
  
  /** 内部配置 */
  const internalConfig = reactive({ ...DEFAULT_FORM_CONFIG, ...config })

  // ============= 计算属性 =============

  /** 表单属性 */
  const formProps = computed(() => {
    const {
      schemas,
      model,
      layout,
      showActions,
      showSubmit,
      showReset,
      submitButton,
      resetButton,
      onSubmit,
      onReset,
      onFieldChange,
      ...nativeFormProps
    } = internalConfig

    return {
      ...nativeFormProps,
      model: formData.value
    }
  })

  /** 布局配置 */
  const layoutConfig = computed(() => {
    return {
      ...DEFAULT_LAYOUT_CONFIG,
      ...internalConfig.layout
    }
  })

  /** 可见的字段配置 */
  const visibleSchemas = computed(() => {
    return internalConfig.schemas.filter(schema => {
      if (!isFormFieldSchema(schema)) return false
      
      if (schema.showMode === 'hidden') return false
      
      if (schema.ifShow) {
        return schema.ifShow(formData.value, methods)
      }
      
      return true
    })
  })

  // ============= 表单方法实现 =============

  /** 设置字段值 */
  const setFieldValue = (field: FieldPath<T>, value: any) => {
    const fieldKey = String(field)
    ;(formData.value as any)[fieldKey] = value
    
    // 触发字段变化事件
    if (internalConfig.onFieldChange) {
      internalConfig.onFieldChange(field, value, formData.value)
    }
    
    emit?.('field-change', field, value, formData.value)
  }

  /** 获取字段值 */
  const getFieldValue = (field: FieldPath<T>) => {
    const fieldKey = String(field)
    return (formData.value as any)[fieldKey]
  }

  /** 设置表单数据 */
  const setFormData = (data: Partial<T>) => {
    Object.assign(formData.value, data)
    emit?.('data-change', formData.value)
  }

  /** 获取表单数据 */
  const getFormData = (): T => {
    return { ...formData.value }
  }

  /** 重置表单 */
  const resetFields = async () => {
    try {
      loading.value = true
      
      // 重置为默认值
      const resetData = {} as T
      internalConfig.schemas.forEach(schema => {
        if (isFormFieldSchema(schema)) {
          const fieldKey = String(schema.field)
          const defaultValue = schema.defaultValue ?? createDefaultFieldValue(schema.component)
          ;(resetData as any)[fieldKey] = defaultValue
        }
      })
      
      formData.value = resetData
      
      // 清除验证状态
      await nextTick()
      formRef?.value?.restoreValidation()
      
      // 触发重置事件
      if (internalConfig.onReset) {
        await internalConfig.onReset()
      }
      
      emit?.('reset', formData.value)
    } finally {
      loading.value = false
    }
  }

  /** 清除验证 */
  const clearValidate = async (fields?: FieldPath<T> | FieldPath<T>[]) => {
    if (!formRef?.value) return
    
    if (fields) {
      const fieldArray = Array.isArray(fields) ? fields : [fields]
      const fieldNames = fieldArray.map(field => String(field))
      formRef.value.restoreValidation(fieldNames)
    } else {
      formRef.value.restoreValidation()
    }
  }

  /** 验证表单 */
  const validate = async (fields?: FieldPath<T>[]) => {
    if (!formRef?.value) {
      throw new Error('Form reference is not available')
    }
    
    try {
      if (fields) {
        const fieldNames = fields.map(field => String(field))
        return await formRef.value.validate(undefined, rule => {
          return fieldNames.includes(rule.key as string)
        })
      } else {
        return await formRef.value.validate()
      }
    } catch (errors) {
      console.warn('Form validation failed:', errors)
      throw errors
    }
  }

  /** 提交表单 */
  const submit = async () => {
    try {
      loading.value = true
      
      // 先验证表单
      await validate()
      
      // 触发提交事件
      if (internalConfig.onSubmit) {
        await internalConfig.onSubmit(formData.value)
      }
      
      emit?.('submit', formData.value)
      
      return formData.value
    } catch (error) {
      console.error('Form submission failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /** 表单方法对象 */
  const methods: FormMethods<T> = {
    setFieldValue,
    getFieldValue,
    setFormData,
    getFormData,
    resetFields,
    clearValidate,
    validate,
    submit
  }

  // ============= 内部方法 =============

  /** 初始化表单 */
  const initializeForm = () => {
    const initialData = {} as T
    
    // 从配置中提取字段并设置默认值
    internalConfig.schemas.forEach(schema => {
      if (isFormFieldSchema(schema)) {
        const fieldKey = String(schema.field)
        const defaultValue = schema.defaultValue ?? createDefaultFieldValue(schema.component)
        ;(initialData as any)[fieldKey] = defaultValue
      }
    })
    
    // 合并传入的初始数据
    if (internalConfig.model) {
      Object.assign(initialData, internalConfig.model)
    }
    
    formData.value = initialData
  }

  /** 更新配置 */
  const updateConfig = (newConfig: Partial<FormConfig<T>>) => {
    Object.assign(internalConfig, newConfig)
  }

  // ============= 监听器 =============

  /** 监听配置变化 */
  watch(
    () => config,
    (newConfig) => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  /** 监听模型数据变化 */
  watch(
    () => config.model,
    (newModel) => {
      if (newModel) {
        setFormData(newModel)
      }
    },
    { deep: true, immediate: true }
  )

  // ============= 初始化 =============
  
  initializeForm()

  // ============= 返回值 =============

  return {
    // 响应式数据
    formData,
    loading,
    
    // 计算属性
    formProps,
    layoutConfig,
    visibleSchemas,
    
    // 表单方法
    methods,
    
    // 内部方法
    initializeForm,
    updateConfig
  }
}

// ============= 工具函数 =============

/** 创建表单配置 */
export function createFormConfig<T = Record<string, any>>(
  schemas: FormFieldSchema<T>[],
  options: Partial<FormConfig<T>> = {}
): FormConfig<T> {
  return {
    ...DEFAULT_FORM_CONFIG,
    ...options,
    schemas
  }
}

/** 合并表单配置 */
export function mergeFormConfig<T = Record<string, any>>(
  baseConfig: FormConfig<T>,
  overrideConfig: Partial<FormConfig<T>>
): FormConfig<T> {
  return {
    ...baseConfig,
    ...overrideConfig,
    schemas: overrideConfig.schemas || baseConfig.schemas,
    layout: {
      ...baseConfig.layout,
      ...overrideConfig.layout
    }
  }
}