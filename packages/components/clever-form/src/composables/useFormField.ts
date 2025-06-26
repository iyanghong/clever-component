/**
 * 表单字段渲染器组合式函数
 * 重构后的字段渲染逻辑，提供更好的类型安全和扩展性
 */

import { computed, type Component } from 'vue'
import {
  NInput,
  NInputNumber,
  NSelect,
  NCheckbox,
  NCheckboxGroup,
  NRadio,
  NRadioGroup,
  NDatePicker,
  NTimePicker,
  NSwitch,
  NSlider,
  NRate,
  NUpload,
  NCascader,
  NTreeSelect,
  NAutoComplete,
  NMention,
  NColorPicker,
  NTransfer,
  NDynamicTags
} from 'naive-ui'
import type {
  FormFieldSchema,
  ComponentType,
  ComponentPropsMap,
  FormMethods,
  FieldPath
} from '../types/core'

// ============= 组件映射 =============

/** 组件映射表 */
const COMPONENT_MAP: Record<ComponentType, Component | string> = {
  input: NInput,
  textarea: NInput,
  'input-number': NInputNumber,
  select: NSelect,
  checkbox: NCheckbox,
  'checkbox-group': NCheckboxGroup,
  radio: NRadio,
  'radio-group': NRadioGroup,
  'date-picker': NDatePicker,
  'time-picker': NTimePicker,
  'datetime-picker': NDatePicker,
  switch: NSwitch,
  slider: NSlider,
  rate: NRate,
  upload: NUpload,
  cascader: NCascader,
  'tree-select': NTreeSelect,
  'auto-complete': NAutoComplete,
  mention: NMention,
  'color-picker': NColorPicker,
  transfer: NTransfer,
  'dynamic-tags': NDynamicTags,
  custom: 'div'
}

/** 需要特殊处理的组件类型 */
const SPECIAL_COMPONENTS = {
  textarea: { type: 'textarea' },
  'datetime-picker': { type: 'datetime' }
}

// ============= 组合式函数 =============

export interface UseFormFieldOptions<T = Record<string, any>> {
  schema: FormFieldSchema<T>
  formData: T
  methods: FormMethods<T>
}

export function useFormField<T = Record<string, any>>(options: UseFormFieldOptions<T>) {
  const { schema, formData, methods } = options

  // ============= 组件相关 =============

  /** 获取实际组件 */
  const getComponent = computed(() => {
    if (schema.customComponent) {
      return schema.customComponent
    }
    return COMPONENT_MAP[schema.component] || COMPONENT_MAP.input
  })

  /** 获取组件属性 */
  const getComponentProps = computed(() => {
    const baseProps: Record<string, any> = {
      placeholder: `请输入${schema.label}`,
      disabled: schema.showMode === 'disabled',
      ...schema.componentProps
    }

    // 处理特殊组件属性
    const specialProps = SPECIAL_COMPONENTS[schema.component as keyof typeof SPECIAL_COMPONENTS]
    if (specialProps) {
      Object.assign(baseProps, specialProps)
    }

    // 处理只读模式
    if (schema.showMode === 'view') {
      baseProps.readonly = true
    }

    return baseProps
  })

  // ============= 表单项相关 =============

  /** 获取表单项属性 */
  const getFormItemProps = computed(() => {
    const props: Record<string, any> = {
      label: schema.label,
      path: schema.field as string,
      showRequiredMark: schema.required
    }

    // 添加验证规则
    if (schema.rules) {
      props.rule = schema.rules
    }

    // 添加标签宽度
    if (schema.labelWidth) {
      props.labelWidth = schema.labelWidth
    }

    return props
  })

  // ============= 布局相关 =============

  /** 获取网格项属性 */
  const getGridItemProps = computed(() => {
    const props: Record<string, any> = {}

    if (schema.layout?.span) {
      props.span = schema.layout.span
    }

    if (schema.layout?.offset) {
      props.offset = schema.layout.offset
    }

    if (schema.fullWidth) {
      props.span = 24
    }

    // 响应式配置
    if (schema.layout?.responsive) {
      Object.assign(props, schema.layout.responsive)
    }

    return props
  })

  /** 获取字段样式 */
  const getFieldStyle = computed(() => {
    const style: Record<string, any> = {}

    if (schema.layout?.style) {
      Object.assign(style, schema.layout.style)
    }

    return style
  })

  /** 获取字段类名 */
  const getFieldClass = computed(() => {
    const classes: string[] = ['clever-form-field']

    if (schema.layout?.className) {
      classes.push(schema.layout.className)
    }

    if (schema.showMode) {
      classes.push(`clever-form-field--${schema.showMode}`)
    }

    if (schema.fullWidth) {
      classes.push('clever-form-field--full-width')
    }

    return classes.join(' ')
  })

  // ============= 显示控制 =============

  /** 是否显示字段 */
  const isVisible = computed(() => {
    if (schema.showMode === 'hidden') {
      return false
    }

    if (schema.ifShow) {
      return schema.ifShow(formData, methods)
    }

    return true
  })

  // ============= 值处理 =============

  /** 当前字段值 */
  const fieldValue = computed({
    get() {
      return methods.getFieldValue(schema.field)
    },
    set(value: any) {
      methods.setFieldValue(schema.field, value)
    }
  })

  /** 处理值变化 */
  const handleValueChange = (newValue: any, oldValue: any) => {
    // 触发字段变化回调
    if (schema.onChange) {
      schema.onChange(newValue, oldValue, formData, methods)
    }
  }

  /** 处理失焦事件 */
  const handleBlur = (value: any) => {
    if (schema.onBlur) {
      schema.onBlur(value, formData, methods)
    }
  }

  /** 处理聚焦事件 */
  const handleFocus = (value: any) => {
    if (schema.onFocus) {
      schema.onFocus(value, formData, methods)
    }
  }

  // ============= 工具函数 =============

  /** 是否为选项类组件 */
  const isOptionsComponent = computed(() => {
    return ['select', 'checkbox-group', 'radio-group', 'cascader', 'tree-select', 'auto-complete', 'mention', 'transfer'].includes(schema.component)
  })

  /** 是否为上传组件 */
  const isUploadComponent = computed(() => {
    return schema.component === 'upload'
  })

  /** 是否为自定义组件 */
  const isCustomComponent = computed(() => {
    return schema.component === 'custom' || !!schema.customComponent
  })

  return {
    // 组件相关
    getComponent,
    getComponentProps,
    
    // 表单项相关
    getFormItemProps,
    
    // 布局相关
    getGridItemProps,
    getFieldStyle,
    getFieldClass,
    
    // 显示控制
    isVisible,
    
    // 值处理
    fieldValue,
    handleValueChange,
    handleBlur,
    handleFocus,
    
    // 工具函数
    isOptionsComponent,
    isUploadComponent,
    isCustomComponent
  }
}

// ============= 工具函数 =============

/** 获取字段的唯一键 */
export function getFieldKey<T>(schema: FormFieldSchema<T>): string {
  return String(schema.field)
}

/** 检查是否为表单字段Schema */
export function isFormFieldSchema<T>(schema: any): schema is FormFieldSchema<T> {
  return schema && typeof schema === 'object' && 'field' in schema && 'component' in schema
}

/** 创建默认字段值 */
export function createDefaultFieldValue(component: ComponentType): any {
  switch (component) {
    case 'input':
    case 'textarea':
      return ''
    case 'input-number':
    case 'slider':
    case 'rate':
      return 0
    case 'switch':
      return false
    case 'checkbox-group':
    case 'dynamic-tags':
      return []
    case 'date-picker':
    case 'time-picker':
    case 'datetime-picker':
      return null
    case 'upload':
      return []
    default:
      return undefined
  }
}