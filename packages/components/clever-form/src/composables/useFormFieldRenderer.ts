import { computed } from 'vue'
import type { FormFieldSchema, CleverFormMethods } from '../types/form'

// 组件名映射
const componentMap: Record<string, string> = {
  input: 'NInput',
  textarea: 'NInput', // textarea 使用 NInput 组件，通过 type="textarea" 区分
  'input-number': 'NInputNumber',
  select: 'NSelect',
  'checkbox-group': 'NCheckboxGroup',
  'radio-group': 'NRadioGroup',
  'date-picker': 'NDatePicker',
  'time-picker': 'NTimePicker',
  switch: 'NSwitch',
  slider: 'NSlider',
  rate: 'NRate',
  'dynamic-tags': 'NDynamicTags'
}

// 需要特殊处理选项渲染的组件
const optionsComponents = ['NCheckboxGroup', 'NRadioGroup']

interface UseFormFieldRendererProps {
  schema: FormFieldSchema
  formModel: Record<string, any>
  methods: CleverFormMethods
}

export function useFormFieldRenderer(props: UseFormFieldRendererProps) {
  // 获取实际组件名
  const getActualComponent = (component: string) => {
    return componentMap[component] || component
  }

  // 获取表单项属性
  const getFormItemProps = (schema: FormFieldSchema) => {
    const baseProps = {
      label: schema.label,
      path: schema.field,
      rule: schema.rules,
      labelWidth: schema.labelWidth,
      showRequiredMark: schema.required
    }

    // 过滤掉undefined的属性
    return Object.fromEntries(
      Object.entries(baseProps).filter(([_, value]) => value !== undefined)
    )
  }

  // 获取组件属性
  const getComponentProps = (schema: FormFieldSchema) => {
    // 兼容 props 和 componentProps 两种写法
    const schemaProps = schema.componentProps || schema.props || {}

    const baseProps = {
      placeholder: schemaProps.placeholder || `请输入${schema.label}`,
      disabled: schemaProps.disabled || schema.showMode === 'disable',
      ...schemaProps
    }

    // 特殊处理 textarea 类型
    if (schema.component === 'textarea') {
      baseProps.type = 'textarea'
    }

    // 移除不需要传递给组件的属性
    const { options, ...componentProps } = baseProps
    return componentProps
  }

  // 获取表单组件
  const getFormComponent = (schema: FormFieldSchema) => {
    const component = schema.component || 'input'
    return getActualComponent(component)
  }

  // 获取选项数据
  const getOptions = (schema: FormFieldSchema) => {
    const schemaProps = schema.componentProps || schema.props || {}
    return schemaProps.options || []
  }

  // 判断是否需要选项渲染
  const needsOptionsRendering = (schema: FormFieldSchema) => {
    const actualComponent = getActualComponent(schema.component)
    return optionsComponents.includes(actualComponent)
  }

  // 处理字段值变化
  const handleFieldChange = (
    schema: FormFieldSchema,
    newValue: any,
    oldValue: any
  ) => {
    if (schema.onChange) {
      schema.onChange(newValue, oldValue, props.methods)
    }
  }

  return {
    getActualComponent,
    getFormItemProps,
    getComponentProps,
    getFormComponent,
    getOptions,
    needsOptionsRendering,
    handleFieldChange
  }
}
