// 按钮组件
// CleverForm组件
export { default as CleverForm } from './clever-form/index.vue'
export type {
  CleverFormProps,
  FormSchema,
  CleverFormMethods,
  FormActionType,
  UseFormReturnType,
  FormApiConfig,
  FormFieldSchema,
  FormGroupSchema,
  FormContainerSchema,
  LayoutConfig
} from './clever-form/src/types/form'
export type { ComponentType } from './clever-form/src/types/index'

// CleverForm辅助工具
export {
  createField,
  GridLayoutBuilder,
  FlexLayoutBuilder,
  TabsLayoutBuilder,
  AccordionLayoutBuilder,
  MixedLayoutBuilder,
  createGridLayout,
  createFlexLayout,
  createTabsLayout,
  createAccordionLayout,
  FieldPresets
} from './clever-form/src/utils/schema-helpers'
export type { QuickFieldOptions } from './clever-form/src/utils/schema-helpers'

// CleverPopup组件
export { default as CleverPopup } from './clever-popup/index.vue'
export type { CleverPopupProps } from './clever-popup/types'

// CleverTable组件
export { default as CleverTable } from './clever-table/index.vue'
export type {
  CleverTableProps,
  TableColumn,
  TableAction,
  HeaderAction,
  SearchConfig,
  ApiConfig,
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
export { FormMode } from './clever-table/src/types/index'

// CleverTable增强搜索组合式函数
export { useEnhancedSearch } from './clever-table/src/hook/use-enhanced-search'

// CleverSearch组件
export { default as CleverSearch } from './clever-table/src/components/CleverSearch.vue'

// 这里可以继续添加更多组件的导出
