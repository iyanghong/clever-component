/**
 * useForm 组合式函数
 * @description 表单数据管理的核心组合式API，作为表单数据的唯一管理中心
 */

import { ref, reactive, computed, provide, inject, watch, onUnmounted, nextTick } from 'vue'
import type { UseFormOptions, UseFormReturn } from './types'
import type {
  FormConfig,
  FormData,
  FormStatus,
  FieldConfig,
  ContainerConfig,
  ValidationResult
} from '../types'
import utils from '../utils'

const { is, object, validate } = utils
import { FORM_STATUS } from '../constants'

// 表单上下文注入键
const FORM_CONTEXT_KEY = Symbol('clever-form-context')

/**
 * 表单上下文接口
 */
export interface FormContext {
  // 数据相关
  formData: FormData
  getFieldValue: (field: string) => any
  setFieldValue: (field: string, value: any) => void
  updateData: (path: string, value: any) => void
  
  // 状态相关
  formState: {
    status: string
    isDirty: boolean
    isSubmitting: boolean
    isLoading: boolean
  }
  
  // 配置相关
  formConfig: FormConfig | undefined
  
  // 方法
  validate: () => Promise<boolean>
  clearValidation: () => void
  submit: () => Promise<void>
  reset: () => void
}

/**
 * 表单组合式函数 - 重构版
 * @param options 配置选项
 * @returns 表单状态和方法
 */
export function useForm(options: UseFormOptions = {}): UseFormReturn {
  const {
    config: initialConfig,
    initialData = {},
    externalData,
    immediate = true,
    onSubmit,
    onReset,
    onChange,
    onDataChange,
    onFieldChange,
    onFieldFocus,
    onFieldBlur,
    onSubmitBefore,
    onSubmitSuccess,
    onSubmitError,
    onValidate,
    onStatusChange
  } = options

  // 响应式状态 - 如果有外部数据引用则使用外部数据，否则创建内部数据
  const formData = externalData || ref<FormData>({})
  const formConfig = ref<FormConfig | undefined>(initialConfig)
  const loading = ref(false)
  const submitting = ref(false)
  const formItemFieldKeys = ref<Record<string, string>>({})

  // 简化的表单状态
  const formState = ref({
    status: FORM_STATUS.IDLE,
    data: formData.value,
    originalData: {},
    isDirty: false,
    isSubmitting: false,
    isLoading: false
  })

  // 原始数据（用于比较是否修改）
  const originalData = ref<FormData>({})

  // 计算属性
  const isDirty = computed(() => {
    return !object.compareData(formData.value, originalData.value)
  })

  // 表单是否有效（简化实现）
  const isValid = computed(() => {
    return formState.value.status !== FORM_STATUS.ERROR
  })

  // 表单是否有错误
  const hasErrors = computed(() => {
    return formState.value.status === FORM_STATUS.ERROR
  })

  // 验证规则（Naive UI 格式）
  const validationRules = computed(() => {
    if (!formConfig.value?.validation?.fieldRules) {
      return {}
    }

    const rules: Record<string, any[]> = {}

    // 从验证配置中获取字段规则
    Object.entries(formConfig.value.validation.fieldRules).forEach(
      ([fieldName, fieldRules]) => {
        const naiveRules: any[] = []

        fieldRules.forEach(rule => {
          const naiveRule: any = {
            trigger: rule.trigger || 'blur'
          }

          // 复制基础属性
          if (rule.required) naiveRule.required = rule.required
          if (rule.min !== undefined) naiveRule.min = rule.min
          if (rule.max !== undefined) naiveRule.max = rule.max
          if (rule.pattern) naiveRule.pattern = rule.pattern
          if (rule.validator) naiveRule.validator = rule.validator

          naiveRules.push(naiveRule)
        })

        if (naiveRules.length > 0) {
          rules[fieldName] = naiveRules
        }
      }
    )

    return rules
  })

  /**
   * 获取字段值
   */
  const getFieldValue = (field: string): any => {
    return object.get(formData.value, field)
  }

  /**
   * 设置字段值
   */
  const setFieldValue = (field: string, value: any): void => {
    const oldValue = getFieldValue(field)
    object.set(formData.value, field, value)
    
    // 触发字段变化事件
    onFieldChange?.(field, value, oldValue)
  }

  /**
   * 更新表单数据
   */
  const updateData = (path: string, value: any): void => {
    const oldValue = object.get(formData.value, path)
    object.set(formData.value, path, value)
    
    // 触发数据变化事件
    onDataChange?.(formData.value, path, value)
    onChange?.(formData.value)
  }

  /**
   * 获取表单数据
   */
  const getData = (path?: string): any => {
    if (path) {
      return object.get(formData.value, path)
    }
    return formData.value
  }

  /**
   * 设置表单数据
   */
  const setData = (data: FormData): void => {
    formData.value = object.deepClone(data)
    originalData.value = object.deepClone(data)
    formState.value.data = formData.value
    formState.value.originalData = originalData.value
  }

  // 监听数据变化 - 触发 change 事件
  watch(
    formData,
    (newData, oldData) => {
      formState.value.data = newData
      formState.value.isDirty = isDirty.value
      
      // 只有在数据真正变化时才触发 change 事件
      if (oldData && !object.compareData(newData, oldData)) {
        onChange?.(newData)
        onDataChange?.(newData)
      }
    },
    { deep: true }
  )

  // 监听加载状态
  watch(loading, newLoading => {
    formState.value.isLoading = newLoading
  })

  // 监听提交状态
  watch(submitting, newSubmitting => {
    formState.value.isSubmitting = newSubmitting
  })

  /**
   * 递归提取所有字段配置
   */
  const extractFieldsFromSchemas = (
    items: Array<FieldConfig | ContainerConfig>
  ): FieldConfig[] => {
    const fields: FieldConfig[] = []

    const extractFromItem = (item: FieldConfig | ContainerConfig) => {
      if ('field' in item && 'component' in item) {
        // 这是一个字段配置
        fields.push(item as FieldConfig)
      } else if ('type' in item && 'children' in item) {
        // 这是一个容器配置
        const container = item as ContainerConfig
        if (container.children && Array.isArray(container.children)) {
          container.children.forEach(child => {
            extractFromItem(child)
          })
        }
      }
    }

    items.forEach(item => {
      extractFromItem(item)
    })

    return fields
  }

  /**
   * 获取实际的字段配置数组
   */
  const getActualSchemas = (): Array<FieldConfig | ContainerConfig> => {
    if (!formConfig.value?.layout) {
      return []
    }

    const layout = formConfig.value.layout
    if ('children' in layout && Array.isArray(layout.children)) {
      return layout.children
    }

    return []
  }

  /**
   * 初始化表单数据
   */
  const initFormModel = <T extends FormData = FormData>(): void => {
    console.log('执行initFormModel')
    const model = {} as T
    const fieldKeys = {} as Record<string, string>
    const actualSchemas = getActualSchemas()

    // 递归提取所有字段
    const allFields = extractFieldsFromSchemas(actualSchemas)
    console.log(allFields)
    allFields.forEach((fieldSchema: FieldConfig) => {
      const field = fieldSchema.field as string
      // 获取默认值，支持函数形式
      let defaultValue = fieldSchema.defaultValue
      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue()
      }
      model[field as keyof T] = defaultValue ?? null
      fieldKeys[field] = `${field}-${Date.now()}`
    })

    // 合并传入的初始数据
    if (initialData && is.object(initialData)) {
      Object.assign(model, initialData)
    }

    formData.value = model as FormData
    formItemFieldKeys.value = fieldKeys
    originalData.value = object.deepClone(model as FormData)
    formState.value.data = formData.value
    formState.value.originalData = originalData.value
  }

  /**
   * 设置表单配置
   */
  const setConfig = async (config: FormConfig): Promise<void> => {
    formConfig.value = config

    // 如果配置中有初始数据，则合并到表单数据
    if (config.defaultData) {
      let initialData: FormData = {}
      if (is.function(config.defaultData)) {
        initialData = (await config.defaultData()) as FormData
        config.defaultData = config.defaultData as FormData
      } else {
        initialData = config.defaultData as FormData
      }
      Object.assign(formData.value, initialData)
      originalData.value = object.deepClone(formData.value)
      formState.value.data = formData.value
      formState.value.originalData = originalData.value
    }
  }

  /**
   * 验证表单
   */
  const validate = async (): Promise<boolean> => {
    try {
      // 简化的验证逻辑，实际验证由 Naive UI 处理
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 清除验证
   */
  const clearValidation = (): void => {
    // 清除验证状态
    if (formState.value.status === FORM_STATUS.ERROR) {
      formState.value.status = FORM_STATUS.IDLE
    }
  }

  /**
   * 提交表单
   */
  const submit = async (formRef?: any): Promise<void> => {
    try {
      submitting.value = true
      formState.value.status = FORM_STATUS.SUBMITTING

      // 🔥 新增：提交前强制校验
      if (formRef) {
        try {
          await formRef.validate()
        } catch (validationErrors) {
          formState.value.status = FORM_STATUS.ERROR
          const error = new Error('表单校验失败，请检查输入内容')
          onSubmitError?.(error)
          throw error
        }
      }

      onSubmitBefore?.(formData.value)

      // 调用提交处理器
      if (onSubmit) {
        const result = await onSubmit(formData.value)
        onSubmitSuccess?.(result)
      }

      // 更新原始数据（提交成功后认为数据已保存）
      originalData.value = object.deepClone(formData.value)

      formState.value.status = FORM_STATUS.SUCCESS
    } catch (err) {
      formState.value.status = FORM_STATUS.ERROR
      if (!err.message?.includes('校验失败')) {
        onSubmitError?.(err as Error)
      }
      throw err
    } finally {
      submitting.value = false
    }
  }

  /**
   * 重置表单
   */
  const reset = (): void => {
    formData.value = object.deepClone(originalData.value)
    formState.value.status = FORM_STATUS.IDLE

    onReset?.()
  }

  /**
   * 初始化表单
   */
  const initialize = async (config?: FormConfig): Promise<void> => {
    try {
      loading.value = true
      formState.value.status = FORM_STATUS.LOADING

      // 设置配置并初始化模型
      if (config) {
        await setConfig(config)
      }

      formState.value.status = FORM_STATUS.IDLE
    } catch (err) {
      formState.value.status = FORM_STATUS.ERROR
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 销毁表单
   */
  const destroy = (): void => {
    // 清理所有状态
    formData.value = {}
    formConfig.value = undefined
    formState.value = {
      status: FORM_STATUS.IDLE,
      data: {},
      originalData: {},
      isDirty: false,
      isSubmitting: false,
      isLoading: false
    }
  }

  // 创建表单上下文
  const formContext: FormContext = {
    formData: formData.value,
    getFieldValue,
    setFieldValue,
    updateData,
    formState: formState.value,
    formConfig: formConfig.value,
    validate,
    clearValidation,
    submit,
    reset
  }

  // 提供表单上下文给子组件
  provide(FORM_CONTEXT_KEY, formContext)

  // 初始化
  if (immediate) {
    if (formConfig.value) {
      nextTick(() => {
        initialize(formConfig.value)
      })
    } else if (Object.keys(initialData).length > 0) {
      // 如果没有配置但有初始数据，直接设置
      formData.value = object.deepClone(initialData)
      originalData.value = object.deepClone(initialData)
      formState.value.data = formData.value
      formState.value.originalData = originalData.value
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    destroy()
  })
  
  initFormModel()
  
  return {
    // 响应式状态
    formState,
    formConfig,
    loading,
    submitting,
    formItemFieldKeys,

    // 计算属性
    isDirty,
    isValid,
    hasErrors,
    validationRules,

    // 数据操作方法
    getFieldValue,
    setFieldValue,
    updateData,
    getData,
    setData,

    // 方法
    initialize,
    initFormModel,
    extractFieldsFromSchemas,
    getActualSchemas,
    setConfig,
    validate,
    clearValidation,
    submit,
    reset,
    destroy
  }
}

/**
 * 注入表单上下文
 */
export function useFormContext(): FormContext | null {
  return inject(FORM_CONTEXT_KEY, null)
}

export default useForm