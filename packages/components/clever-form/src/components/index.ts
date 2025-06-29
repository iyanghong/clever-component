/**
 * 表单组件统一导出
 */

// 核心组件
export { default as CleverForm } from './CleverForm/index.vue'
export { default as CleverFormItem } from './CleverFormItem.vue'

// 字段组件系统
export * from './field-components'

// 容器组件系统
export * from './container-system'

// 弹窗组件系统
export * from './popup-system'

// 类型导出
export type {
  // 核心类型
  FormConfig,
  FormItemConfig,
  FormData,
  FormValidationResult,
  FormInstance,
  FormItemInstance,
  
  // 字段类型
  FieldConfig,
  FieldType,
  FieldValue,
  FieldValidationRule,
  FieldValidationResult,
  FieldInstance,
  
  // 容器类型
  ContainerConfig,
  ContainerType,
  GridContainerConfig,
  FlexContainerConfig,
  TabsContainerConfig,
  CollapseContainerConfig,
  
  // 弹窗类型
  PopupConfig,
  PopupType,
  ModalPopupConfig,
  DrawerPopupConfig,
  DialogPopupConfig,
  PopconfirmPopupConfig,
  PopoverPopupConfig,
  
  // 组件映射类型
  FieldComponentType,
  FieldComponentName,
  ContainerComponentType,
  ContainerComponentName,
  PopupComponentType,
  PopupComponentName
} from '../types'

// 常量导出
export {
  COMPONENT_NAMES,
  FIELD_TYPES,
  CONTAINER_TYPES,
  POPUP_TYPES,
  VALIDATION_TRIGGERS,
  SIZES,
  DEFAULT_CONFIG
} from '../constants'

// 工具函数导出
export {
  createFormConfig,
  createFieldConfig,
  createContainerConfig,
  createPopupConfig,
  validateField,
  validateForm,
  formatFieldValue,
  parseFieldValue,
  normalizeChildren
} from '../utils'

// Hooks导出
export {
  useForm,
  useField,
  useFormValidation,
  useFormData,
  useFormConfig
} from '../hooks'