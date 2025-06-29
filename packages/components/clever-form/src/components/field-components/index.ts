/**
 * 字段组件导出
 * 提供各种表单字段组件的统一导出
 */

// 字段渲染器
export { default as FieldRenderer } from './FieldRenderer.vue'

// 基础输入字段
export { default as InputField } from './InputField.vue'
export { default as TextareaField } from './TextareaField.vue'
export { default as NumberField } from './NumberField.vue'

// 选择字段
export { default as SelectField } from './SelectField.vue'
export { default as RadioField } from './RadioField.vue'
export { default as CheckboxField } from './CheckboxField.vue'
export { default as SwitchField } from './SwitchField.vue'

// 日期时间字段
export { default as DateField } from './DateField.vue'
export { default as TimeField } from './TimeField.vue'

// 文件上传字段
export { default as UploadField } from './UploadField.vue'

// 字段组件类型映射
export const FIELD_COMPONENT_MAP = {
  // 基础输入
  input: 'InputField',
  textarea: 'TextareaField',
  number: 'NumberField',
  
  // 选择
  select: 'SelectField',
  radio: 'RadioField',
  checkbox: 'CheckboxField',
  switch: 'SwitchField',
  
  // 日期时间
  date: 'DateField',
  datetime: 'DateField',
  daterange: 'DateField',
  datetimerange: 'DateField',
  time: 'TimeField',
  
  // 文件上传
  upload: 'UploadField',
  
  // 其他
  password: 'InputField',
  email: 'InputField',
  url: 'InputField',
  tel: 'InputField',
  search: 'InputField'
} as const

// 字段组件类型
export type FieldComponentType = keyof typeof FIELD_COMPONENT_MAP

// 字段组件名称
export type FieldComponentName = typeof FIELD_COMPONENT_MAP[FieldComponentType]