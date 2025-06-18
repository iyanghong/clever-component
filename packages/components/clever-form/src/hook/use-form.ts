import { ref, computed, watch, nextTick, unref } from 'vue'
import type { Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { isArray, isFunction, isObject } from '@/utils/is'
import type { CleverFormProps, FormSchema, CleverFormMethods } from '../types/form'

export function useForm<T extends Record<string, any> = any>(
  props: CleverFormProps<T>,
  formRef: Ref,
  emit: any
) {
  const formModel = ref<T>({} as T)
  const formItemFieldKeys = ref<Record<string, string>>({})
  const loading = ref(false)
  const collapsed = ref(true)

  // 初始化表单数据
  const initFormModel = () => {
    const model = {} as T
    const fieldKeys = {} as Record<string, string>
    
    props.schemas.forEach((schema) => {
      const field = schema.field as string
      model[field as keyof T] = schema.defaultValue ?? null
      fieldKeys[field] = `${field}-${Date.now()}`
    })
    
    // 合并传入的数据
    if (props.data && isObject(props.data)) {
      Object.assign(model, props.data)
    }
    
    formModel.value = model
    formItemFieldKeys.value = fieldKeys
  }

  // 监听schemas变化，重新初始化
  watch(
    () => props.schemas,
    () => {
      initFormModel()
    },
    { immediate: true, deep: true }
  )

  // 监听data变化
  watch(
    () => props.data,
    (newData) => {
      if (newData && isObject(newData)) {
        Object.assign(formModel.value, newData)
      }
    },
    { deep: true }
  )

  // 设置单个字段值
  const setFieldValue = (field: keyof T, value: any) => {
    formModel.value[field] = value
    // 更新字段key以触发重新渲染
    formItemFieldKeys.value[field as string] = `${field as string}-${Date.now()}`
  }

  // 获取单个字段值
  const getFieldValue = (field: keyof T) => {
    return formModel.value[field]
  }

  // 设置整个表单数据
  const setFormData = (values: Partial<T>) => {
    Object.assign(formModel.value, values)
    // 更新所有字段key
    Object.keys(values).forEach(key => {
      formItemFieldKeys.value[key] = `${key}-${Date.now()}`
    })
  }

  // 获取整个表单数据
  const getFormData = (): T => {
    return cloneDeep(formModel.value)
  }

  // 重置表单
  const resetFields = async () => {
    if (formRef.value) {
      await formRef.value.restoreValidation()
    }
    initFormModel()
    if (props.submitOnReset) {
      await handleSubmit()
    }
  }

  // 清除验证
  const clearValidate = async (name?: string | string[]) => {
    if (formRef.value) {
      await formRef.value.restoreValidation(name)
    }
  }

  // 验证表单
  const validate = async (nameList?: any[]) => {
    if (formRef.value) {
      return await formRef.value.validate(nameList)
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      loading.value = true
      if (formRef.value) {
        await formRef.value.validate()
      }
      
      const formData = getFormData()
      emit('submit', formData)
      
      if (props.submitFunc && isFunction(props.submitFunc)) {
        await props.submitFunc()
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    } finally {
      loading.value = false
    }
  }

  // 重置处理
  const handleReset = async () => {
    if (props.resetFunc && isFunction(props.resetFunc)) {
      await props.resetFunc()
    } else {
      await resetFields()
    }
    emit('reset', getFormData())
  }

  // 展开收起切换
  const unfoldToggle = () => {
    collapsed.value = !collapsed.value
  }

  // 获取组件属性
  const getComponentProps = (schema: FormSchema) => {
    const { componentProps = {} } = schema
    return {
      ...componentProps,
      disabled: schema.showMode === 'disable'
    }
  }

  // 获取表单项属性
  const getFormItemProps = (schema: FormSchema) => {
    const { field, label, labelWidth, rules, required } = schema
    return {
      path: field,
      label,
      labelWidth: labelWidth || props.labelWidth,
      rule: rules,
      required
    }
  }

  // 获取表单属性
  const getProps = computed(() => {
    return {
      model: formModel.value,
      size: props.size,
      labelPlacement: props.labelPlacement,
      labelWidth: props.labelWidth,
      inline: props.inline
    }
  })

  // 获取网格属性
  const getGrid = computed(() => {
    return {
      ...props.gridProps
    }
  })

  // 获取显示的schema
  const getSchema = computed(() => {
    if (!props.showAdvancedButton) {
      return props.schemas
    }
    
    if (collapsed.value) {
      return props.schemas.slice(0, props.collapsedRows || 1)
    }
    
    return props.schemas
  })

  // 是否为行内布局
  const isInline = computed(() => {
    return props.layout === 'inline' || props.inline
  })

  // 获取提交按钮属性
  const getSubmitBtnOptions = computed(() => {
    return {
      type: 'primary',
      loading: loading.value,
      ...props.submitButtonOptions
    }
  })

  // 获取重置按钮属性
  const getResetBtnOptions = computed(() => {
    return {
      ...props.resetButtonOptions
    }
  })

  // 方法集合
  const methods: CleverFormMethods<T> = {
    resetFields,
    setFieldValue,
    getFieldValue,
    setFormData,
    getFormData,
    clearValidate,
    validate,
    submit: handleSubmit
  }

  return {
    formModel,
    formItemFieldKeys,
    loading,
    collapsed,
    setFieldValue,
    getFieldValue,
    setFormData,
    getFormData,
    resetFields,
    clearValidate,
    validate,
    handleSubmit,
    handleReset,
    unfoldToggle,
    getComponentProps,
    getFormItemProps,
    getProps,
    getGrid,
    getSchema,
    isInline,
    getSubmitBtnOptions,
    getResetBtnOptions,
    methods
  }
}