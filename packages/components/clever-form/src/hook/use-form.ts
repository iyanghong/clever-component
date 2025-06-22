import { ref, computed, watch, nextTick, unref } from 'vue'
import type { Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { isArray, isFunction, isObject } from '../../../../utils/is'
import type {
  CleverFormProps,
  FormSchema,
  FormFieldSchema,
  FormGroupSchema,
  FormContainerSchema,
  CleverFormMethods
} from '../types/form'
import type { UseFormReturn } from '../types/use-form'

export function useForm<T extends Record<string, any> = any>(
  props: CleverFormProps<T>,
  formRef: Ref,
  emit: any
): UseFormReturn<T> {
  const formModel = ref<T>({} as T)
  const formItemFieldKeys = ref<Record<string, string>>({})
  const loading = ref<boolean>(false)
  const collapsed = ref<boolean>(true)
  const isOnlyShowOneRow = ref<boolean>(props.onlyShowOneRow || false)

  watch(
    () => props.onlyShowOneRow,
    value => {
      isOnlyShowOneRow.value = value || false
    }
  )

  // 获取实际的 schemas
  const getActualSchemas = () => {
    // 如果传入了 schemaConfig，优先使用其中的 schemas
    if (props.schemaConfig && props.schemaConfig.schemas) {
      return props.schemaConfig.schemas
    }
    // 否则使用直接传入的 schemas
    return props.schemas || []
  }

  // 获取实际的 layoutConfig
  const getActualLayoutConfig = () => {
    // 如果传入了 schemaConfig，优先使用其中的 layoutConfig
    if (props.schemaConfig && props.schemaConfig.layoutConfig) {
      return props.schemaConfig.layoutConfig
    }
    // 否则使用直接传入的 layoutConfig
    return props.layoutConfig || {}
  }

  // 递归处理schema，提取所有字段
  const extractFieldsFromSchemas = (
    schemas: FormSchema<T>[]
  ): FormFieldSchema<T>[] => {
    const fields: FormFieldSchema<T>[] = []

    schemas.forEach(schema => {
      // 如果是FormFieldSchema（有field属性）
      if ('field' in schema) {
        fields.push(schema as FormFieldSchema<T>)
      }
      // 如果是FormGroupSchema（有fields属性）
      else if ('fields' in schema) {
        const groupSchema = schema as FormGroupSchema<T>
        fields.push(...extractFieldsFromSchemas(groupSchema.fields))
      }
      // 如果是FormContainerSchema（有children属性）
      else if ('children' in schema) {
        const containerSchema = schema as FormContainerSchema<T>
        fields.push(...extractFieldsFromSchemas(containerSchema.children))
      }
    })

    return fields
  }

  // 初始化表单数据
  const initFormModel = () => {
    const model = {} as T
    const fieldKeys = {} as Record<string, string>
    const actualSchemas = getActualSchemas()

    // 递归提取所有字段
    const allFields = extractFieldsFromSchemas(actualSchemas)

    allFields.forEach((fieldSchema: FormFieldSchema<T>) => {
      const field = fieldSchema.field as string
      model[field as keyof T] = fieldSchema.defaultValue ?? null
      fieldKeys[field] = `${field}-${Date.now()}`
    })

    // 合并传入的数据
    if (props.data && isObject(props.data)) {
      Object.assign(model, props.data)
    }

    formModel.value = model
    formItemFieldKeys.value = fieldKeys
  }

  // 监听schemas和schemaConfig变化，重新初始化
  watch(
    () => [props.schemas, props.schemaConfig],
    () => {
      initFormModel()
    },
    { immediate: true, deep: true }
  )

  // 监听data变化
  watch(
    () => props.data,
    newData => {
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
    formItemFieldKeys.value[field as string] =
      `${field as string}-${Date.now()}`
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
    isOnlyShowOneRow.value = collapsed.value
  }

  // 获取组件属性
  const getComponentProps = (schema: FormSchema<T>) => {
    // 只有FormFieldSchema才有componentProps和showMode属性
    if (!('field' in schema)) {
      return {}
    }

    const fieldSchema = schema as FormFieldSchema<T>
    const { componentProps = {} } = fieldSchema
    return {
      ...componentProps,
      disabled: fieldSchema.showMode === 'disable'
    }
  }

  // 判断是否显示表单项
  const ifShowFormItem = (schema: FormFieldSchema<T>) => {
    if (!schema) return false

    // 检查showMode属性
    if (schema.showMode === 'hidden') {
      return false
    }

    // 检查ifShow函数
    if (typeof schema.ifShow === 'function') {
      const fieldValue = formModel.value[schema.field as keyof T]
      return schema.ifShow(formModel.value, fieldValue, methods)
    }

    return true
  }

  // 获取表单项属性
  const getFormItemProps = (schema: FormSchema<T>) => {
    // 只有FormFieldSchema才有field属性
    if (!('field' in schema)) {
      return {}
    }

    const fieldSchema = schema as FormFieldSchema<T>
    const { field, label, labelWidth, rules, required, giProps } = fieldSchema
    const baseProps = {
      path: field,
      label,
      labelWidth: labelWidth || props.labelWidth,
      rule: rules,
      required
    }

    // 如果是Grid容器中的字段，添加giProps
    if (giProps) {
      return {
        ...baseProps,
        ...giProps
      }
    }

    return baseProps
  }

  // 获取表单属性
  const getProps = computed(() => {
    return {
      model: formModel.value,
      size: props.size,
      labelPlacement: props.labelPlacement,
      labelWidth: props.labelWidth,
      inline: props.inline,
      disabled: props.disabled
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
    const actualSchemas = getActualSchemas()

    // 如果是只显示一行模式
    if (isOnlyShowOneRow.value) {
      // 递归提取所有字段schema
      const extractFieldSchemas = (
        schemas: FormSchema<T>[]
      ): FormFieldSchema<T>[] => {
        const fields: FormFieldSchema<T>[] = []

        schemas.forEach((schema: FormSchema<T>) => {
          if ('field' in schema) {
            fields.push(schema as FormFieldSchema<T>)
          } else if ('fields' in schema) {
            fields.push(
              ...extractFieldSchemas((schema as FormGroupSchema<T>).fields)
            )
          } else if ('children' in schema) {
            fields.push(
              ...extractFieldSchemas(
                (schema as FormContainerSchema<T>).children
              )
            )
          }
        })

        return fields
      }

      const allFields = extractFieldSchemas(actualSchemas)
      // 只返回第一行的字段（根据collapsedRows配置，默认为1行）
      const firstRowCount = props.collapsedRows || 3 // 默认第一行显示3个字段
      return allFields.slice(0, firstRowCount)
    }

    // 高级搜索按钮逻辑
    if (props.showAdvancedButton) {
      if (collapsed.value) {
        return actualSchemas?.slice(0, props.collapsedRows || 1)
      }
    }

    return actualSchemas
  })

  // 获取提交按钮属性
  const getSubmitBtnOptions = computed(() => {
    return {
      type: 'primary' as const,
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

  // 新增布局相关计算属性
  const getFlexStyle = computed(() => {
    const config: Record<string, any> = props.layoutConfig?.flex || {}
    return {
      display: 'flex',
      flexWrap: config.wrap || 'wrap',
      gap: config.gap || '16px',
      alignItems: config.alignItems || 'flex-start',
      justifyContent: config.justifyContent || 'flex-start'
    }
  })

  const getFlexItemStyle = (schema: FormFieldSchema) => {
    const config: Record<string, any> = props.layoutConfig?.flex || {}

    return {
      flex: config.itemFlex || '1 1 auto',
      minWidth: config.itemMinWidth || '200px',
      maxWidth: config.itemMaxWidth || 'none'
    }
  }

  const getGroupedSchemas = computed(() => {
    const groups = new Map()

    // 递归提取所有字段schema
    const extractFieldSchemas = (
      schemas: FormSchema<T>[]
    ): FormFieldSchema<T>[] => {
      const fields: FormFieldSchema<T>[] = []

      schemas.forEach((schema: FormSchema<T>) => {
        if ('field' in schema) {
          fields.push(schema as FormFieldSchema<T>)
        } else if ('fields' in schema) {
          fields.push(
            ...extractFieldSchemas((schema as FormGroupSchema<T>).fields)
          )
        } else if ('children' in schema) {
          fields.push(
            ...extractFieldSchemas((schema as FormContainerSchema<T>).children)
          )
        }
      })

      return fields
    }

    const fieldSchemas = extractFieldSchemas(
      (props.schemas as FormSchema<T>[]) || []
    )

    fieldSchemas.forEach(schema => {
      const groupName = schema.group || 'default'
      if (!groups.has(groupName)) {
        groups.set(groupName, {
          name: groupName,
          title: groupName === 'default' ? '基本信息' : groupName,
          fields: []
        })
      }
      groups.get(groupName).fields.push(schema)
    })

    return Array.from(groups.values())
  })

  const getFormComponent = (schema: FormSchema<T>) => {
    // 只有FormFieldSchema才有component属性
    if (!('field' in schema)) {
      return 'div' // 容器类型返回div
    }

    const fieldSchema = schema as FormFieldSchema<T>

    // 组件名映射
    const componentMap: Record<string, string> = {
      input: 'NInput',
      textarea: 'NInputTextArea',
      'input-number': 'NInputNumber',
      select: 'NSelect',
      'checkbox-group': 'NCheckbox',
      'radio-group': 'NRadioGroup',
      'date-picker': 'NDatePicker',
      'time-picker': 'NTimePicker',
      switch: 'NSwitch',
      slider: 'NSlider',
      rate: 'NRate',
      'dynamic-tags': 'NDynamicTags'
    }

    // 根据schema.component返回对应的组件名
    const component = fieldSchema.component || 'NInput'
    return componentMap[component] || component
  }

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
    formRef,
    formModel: formModel as Ref<T>,
    formItemFieldKeys,
    loading,
    collapsed,
    setFieldValue,
    getFieldValue,
    setFormData,
    getFormData,
    getActualSchemas: () => getActualSchemas(),
    getActualLayoutConfig,
    resetFields,
    clearValidate,
    validate,
    handleSubmit,
    handleReset,
    unfoldToggle,
    getComponentProps,
    getFormItemProps,
    getProps: () => getProps.value,
    getGrid: () => getGrid.value,
    getSchema: () => getSchema.value,
    isOnlyShowOneRow: () => isOnlyShowOneRow.value,
    getSubmitBtnOptions: () => getSubmitBtnOptions.value,
    getResetBtnOptions: () => getResetBtnOptions.value,
    getFlexStyle: () => getFlexStyle.value,
    getFlexItemStyle,
    getGroupedSchemas: () => getGroupedSchemas.value,
    getFormComponent,
    ifShowFormItem,
    handleFieldChange: () => {},
    isFormFieldSchema: () => true,
    getActualComponent: () => null,
    methods
  }
}
