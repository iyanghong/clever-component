import type { DataTableColumn, DataTableProps } from 'naive-ui'
import type { FormSchema } from '../../../clever-form/src/types/form.ts'
import type {
  GetPageApiFn,
  GetApiFn,
  CreateApiFn,
  UpdateApiFn,
  DeleteApiFn,
  ResponseBaseModel,
  PageResponseModel
} from '../../../../types/response'

// 获取全量数据的API函数类型
export type GetAllApiFn<T = any> = (
  params?: Record<string, any>
) => Promise<ResponseBaseModel<T[]>>

// 表单模式枚举
export enum FormMode {
  CREATE = 'create', // 新增模式
  EDIT = 'edit', // 编辑模式
  DETAIL = 'detail' // 详情模式（只读）
}

// 自定义操作按钮配置
export interface CustomAction {
  label: string
  icon?: string
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  onClick: (record: any, index: number) => void
  show?: (record: any) => boolean // 动态显示条件
  disabled?: (record: any) => boolean // 动态禁用条件
}

// 操作列配置
export interface ActionConfig {
  width?: number // 操作列宽度
  fixed?: 'left' | 'right' // 固定位置
  title?: string // 操作列标题
  show?: boolean // 是否显示操作列
  showView?: boolean // 是否显示查看按钮
  showEdit?: boolean // 是否显示编辑按钮
  showDelete?: boolean // 是否显示删除按钮
  customButtons?: TableAction[] // 自定义操作按钮
  // 按钮文本配置
  viewText?: string // 查看按钮文本
  editText?: string // 编辑按钮文本
  deleteText?: string // 删除按钮文本
  // 按钮属性配置
  viewProps?: Partial<any> // 查看按钮属性
  editProps?: Partial<any> // 编辑按钮属性
  deleteProps?: Partial<any> // 删除按钮属性
}

export type TableColumn = DataTableColumn & {
  // 是否显示在表格中
  show?: boolean
  // 是否可以隐藏
  hideable?: boolean
  // 自定义渲染
  customRender?: (record: any, index: number) => any
  // 条件显示
  ifShow?: (record: any) => boolean

  key?: string
}

export interface TableAction {
  // 操作标识
  key: string
  // 操作文本
  label: string
  // 操作类型
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  // 图标
  icon?: string
  // 按钮大小
  size?: 'tiny' | 'small' | 'medium' | 'large'
  // 是否为幽灵按钮
  ghost?: boolean
  // 是否显示
  show?: boolean | ((record: any) => boolean)
  // 是否禁用
  disabled?: boolean | ((record: any) => boolean)
  // 点击事件（兼容旧版本）
  onClick?: (record: any, index: number) => void
  // 处理函数（新版本推荐）
  handler?: (record: any, index: number) => void
  // 确认提示
  confirm?: {
    title?: string
    content?: string
  }
}

export interface HeaderAction {
  // 操作标识
  key: string
  // 操作文本
  label: string
  // 操作类型
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  // 图标
  icon?: string
  // 是否显示
  show?: boolean
  // 是否禁用
  disabled?: boolean
  // 点击事件
  onClick?: () => void
}

export interface SearchConfig<T extends Record<string, any> = any> {
  // 搜索表单配置
  schemas: FormSchema<T>[]
  // 是否显示搜索表单
  show?: boolean
  // 是否可折叠
  collapsible?: boolean
  // 默认是否折叠
  collapsed?: boolean
  // 搜索按钮文本
  searchText?: string
  // 重置按钮文本
  resetText?: string
  // 展开按钮文本
  expandText?: string
  // 收起按钮文本
  collapseText?: string
}

export interface ApiConfig<T extends Record<string, any> = any> {
  // 获取全量数据的API（不分页）
  getAllApi?: GetAllApiFn<T>
  // 获取分页列表数据的API
  getPageApi?: GetPageApiFn<T>
  // 获取单条数据的API
  getApi?: GetApiFn<Record<string, any>>
  // 新增数据的API
  createApi?: CreateApiFn<T>
  // 更新数据的API
  updateApi?: UpdateApiFn<T>
  // 删除数据的API
  deleteApi?: DeleteApiFn<Record<string, any>>
  // 批量删除数据的API
  batchDeleteApi?: DeleteApiFn<Record<string, any>>
}

// 表单配置
export interface FormConfig {
  // 表单标题
  title?: string
  // 表单宽度
  width?: number | string
  // 是否显示在弹窗中
  modal?: boolean
  // 表单字段配置
  schemas?: FormSchema[]
  // 表单布局配置
  layout?: {
    labelWidth?: string | number
    labelPlacement?: 'left' | 'top'
    cols?: number
    xGap?: number
    yGap?: number
  }
  // 弹窗配置
  popupProps?: Record<string, any>
}

// 删除配置
export interface DeleteConfig {
  // 删除确认标题
  title?: string
  // 删除确认内容
  content?: string
  // 删除成功提示
  successMessage?: string
  // 删除失败提示
  errorMessage?: string
  // 批量删除确认标题
  batchTitle?: string
  // 批量删除确认内容
  batchContent?: string
  // 批量删除成功提示
  batchSuccessMessage?: string
  // 批量删除失败提示
  batchErrorMessage?: string
}

// 保存配置
export interface SaveConfig {
  // 新增成功提示
  createSuccessMessage?: string
  // 新增失败提示
  createErrorMessage?: string
  // 更新成功提示
  updateSuccessMessage?: string
  // 更新失败提示
  updateErrorMessage?: string
}

export interface PaginationConfig {
  // 当前页码
  page?: number
  // 每页条数
  pageSize?: number
  // 总条数
  total?: number
  // 是否显示分页
  show?: boolean
  // 每页条数选项
  pageSizes?: number[]
  // 是否显示快速跳转
  showQuickJumper?: boolean
  // 是否显示总条数
  showSizePicker?: boolean
}

export interface CleverTableProps<T extends Record<string, any> = any> {
  // 表格列配置
  columns: TableColumn[]
  // 表格数据
  data?: T[]
  // 是否加载中
  loading?: boolean
  // 是否自动加载数据
  autoLoad?: boolean
  // 自定义ID字段名，默认为'id'
  idField?: string
  // 行操作配置（已废弃，请使用 actionConfig）
  actions?: TableAction[]
  // 表头操作配置
  headerActions?: HeaderAction[]
  // 搜索配置
  searchConfig?: SearchConfig<T>
  // API配置
  apiConfig?: ApiConfig<T>
  // 表单配置
  formConfig?: FormConfig
  // 删除配置
  deleteConfig?: DeleteConfig
  // 保存配置
  saveConfig?: SaveConfig
  // 分页配置
  paginationConfig?: PaginationConfig
  // 操作列配置
  actionConfig?: ActionConfig
  // 是否自动显示操作列（根据 API 配置智能判断）
  autoShowActions?: boolean
  // 是否显示操作列（已废弃，请使用 actionConfig）
  showActionColumn?: boolean
  // 操作列标题（已废弃，请使用 actionConfig）
  actionColumnTitle?: string
  // 操作列宽度（已废弃，请使用 actionConfig）
  actionColumnWidth?: number
  // 是否显示序号列
  showIndexColumn?: boolean
  // 序号列标题
  indexColumnTitle?: string
  // 序号列宽度
  indexColumnWidth?: number
  // 是否显示选择列
  showSelectionColumn?: boolean
  // 选中的行键
  checkedRowKeys?: (string | number)[]
  // 行键字段
  rowKey?: string
  // 表格大小
  size?: 'small' | 'medium' | 'large'
  // 是否显示边框
  bordered?: boolean
  // 是否显示斑马纹
  striped?: boolean
  // 空数据提示
  emptyText?: string
  // 最大高度
  maxHeight?: number
  // 滚动配置
  scrollX?: number
  // 数据处理钩子
  beforeLoad?: (params: any) => any
  afterLoad?: (data: any) => any
  beforeSave?: (data: any, isEdit: boolean) => any
  afterSave?: (data: any, isEdit: boolean) => void
  // 事件回调
  onFormOpen?: (mode: FormMode, record?: any) => void
  // 表格属性
  tableProps?: Partial<DataTableProps>
}

export interface CleverTableMethods {
  // 刷新表格数据
  handleRefresh: () => void
  // 打开表单
  handleOpenForm: (mode: FormMode, record?: any) => void
  // 删除数据
  handleDelete: (record: any) => void
  // 批量删除数据
  handleBatchDelete: (records: any[]) => void
  // 保存数据
  handleSave: (data: any, isEdit?: boolean) => Promise<boolean>
  // 设置选中行
  setCheckedRowKeys: (keys: (string | number)[]) => void
  // 获取选中行
  getCheckedRowKeys: () => (string | number)[]
  // 获取选中的记录
  getSelectedRecords: () => any[]
  // 更新搜索参数
  updateSearchParams: (params: any) => void
  // 获取表格数据
  getTableData: () => any[]
  // 设置表格数据
  setTableData: (data: any[]) => void
}

export type UseTableReturnType = [
  CleverTableMethods,
  {
    register: (instance: CleverTableMethods) => void
    methods: CleverTableMethods
  }
]

// 导出增强搜索相关类型
export type {
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
} from './search'
