// 按钮组件
// CleverForm组件
export { default as CleverForm } from './clever-form/src/components/CleverForm/index.vue'

// CleverForm核心类型
export type {
  // 组件属性和事件
  CleverFormProps,
  CleverFormEvents,
  CleverFormExposed,
  // 表单配置和状态
  FormConfig,
  FormState,
  FormData,
  FormMode,
  FormStatus,
  FormOptions,
  FormEvents,
  FormMethods,
  FormEngine,
  FormBuilder,
  FormFactory,
  FormRenderer,
  FormMiddleware,
  FormPlugin,
  FormContext
} from './clever-form/src/types/form'

// CleverForm字段类型
export type {
  FieldConfig,
  FieldComponentType,
  BaseFieldConfig,
  InputFieldConfig,
  SelectFieldConfig,
  SwitchFieldConfig,
  UploadFieldConfig,
  CustomFieldConfig
} from './clever-form/src/types/field'

// CleverForm布局类型
export type {
  ContainerConfig,
  ContainerType,
  GridContainerConfig,
  FlexContainerConfig,
  TabsContainerConfig,
  CollapseContainerConfig
} from './clever-form/src/types/layout'

// CleverForm验证类型
export type {
  ValidationConfig,
  ValidationResult,
  ValidationEngine
} from './clever-form/src/types/validation'

// CleverForm API类型
export type {
  ApiConfig,
  ApiManager,
  ApiResponse,
  ApiError
} from './clever-form/src/types/api'

// CleverForm事件类型
export type {
  Event,
  EventHandler,
  FormEvent,
  FieldEvent,
  ValidationEvent,
  EventBus,
  EventListenerConfig
} from './clever-form/src/types/events'

// CleverForm通用类型
export type {
  Size,
  Status,
  BaseComponentProps,
  ConditionalFunction,
  DynamicValue,
  FieldEventHandler,
  OptionItem
} from './clever-form/src/types/common'

// CleverForm辅助工具
export {
  is,
  validate,
  format,
  error
} from './clever-form/src/utils/index'

// CleverPopup组件
export { default as CleverPopup } from './clever-popup/index.vue'
export type { CleverPopupProps } from './clever-popup/types'

// CleverTable组件
export { default as CleverTable } from './clever-table/src/table.vue'
export type {
  CleverTableProps,
  TableColumn,
  TableAction,
  HeaderAction,
  SearchConfig,
  PaginationConfig,
  CleverTableMethods,
  UseTableReturnType,
  ActionConfig,
  // 增强搜索相关类型
  SearchMode,
  SearchPreset,
  SearchHistory,
  SearchState,
  SearchStats,
  QuickSearchConfig,
  AdvancedSearchConfig,
  SearchCacheConfig,
  SearchExportConfig,
  EnhancedSearchConfig,
  UseSearchReturnType,
  SearchComponentProps,
  SearchComponentEmits
} from './clever-table/src/types/index'

// CleverTable增强搜索组合式函数
export { useEnhancedSearch } from './clever-table/src/hook/use-enhanced-search'

// CleverSearch组件
export { default as CleverSearch } from './clever-table/src/components/CleverSearch.vue'

// 这里可以继续添加更多组件的导出
