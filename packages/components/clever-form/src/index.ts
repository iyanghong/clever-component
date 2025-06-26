// 组件导出
export { default as CleverForm } from './components/CleverForm.vue'
export { default as CleverFormField } from './components/CleverFormField.vue'
export { default as CleverFormLayout } from './components/CleverFormLayout.vue'
export { default as CleverFormActions } from './components/CleverFormActions.vue'

// 类型导出
export type {
  // 核心类型
  FormFieldValue,
  FormModel,
  FieldPath,
  ComponentType,
  ComponentPropsMap,
  OptionItem,
  CascaderOption,
  TreeSelectOption,
  TransferOption,
  UploadFileInfo,
  
  // 布局类型
  LayoutMode,
  ResponsiveConfig,
  GridLayoutConfig,
  FlexLayoutConfig,
  LayoutConfig,
  
  // 字段类型
  FieldShowMode,
  FieldLayoutConfig,
  FormFieldSchema,
  
  // 表单类型
  FormMethods,
  FormConfig,
  ActionConfig,
  ValidationConfig,
  
  // 组件属性类型
  InputProps,
  InputNumberProps,
  SelectProps,
  DatePickerProps,
  TimePickerProps,
  SwitchProps,
  CheckboxProps,
  RadioProps,
  SliderProps,
  RateProps,
  ColorPickerProps,
  UploadProps,
  CascaderProps,
  TreeSelectProps,
  TransferProps,
  AutoCompleteProps,
  MentionProps
} from './types/core'

// 组合式函数导出
export { useCleverForm } from './composables/useCleverForm'
export { useFormField } from './composables/useFormField'

// 工具函数导出
export {
  getFieldKey,
  isFormFieldSchema,
  createDefaultFieldValue,
  createFormConfig,
  mergeFormConfig
} from './composables/useFormField'

export {
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_FORM_CONFIG
} from './types/core'

// 安装函数
import type { App } from 'vue'
import CleverForm from './components/CleverForm.vue'
import CleverFormField from './components/CleverFormField.vue'
import CleverFormLayout from './components/CleverFormLayout.vue'
import CleverFormActions from './components/CleverFormActions.vue'

const components = [
  CleverForm,
  CleverFormField,
  CleverFormLayout,
  CleverFormActions
]

/**
 * 安装 CleverForm 组件
 * @param app Vue应用实例
 */
export const install = (app: App) => {
  components.forEach(component => {
    app.component(component.name || component.__name, component)
  })
}

/**
 * 默认导出
 */
export default {
  install,
  CleverForm,
  CleverFormField,
  CleverFormLayout,
  CleverFormActions
}

/**
 * 版本信息
 */
export const version = '2.0.0'