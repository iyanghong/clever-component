import type { ApiFn } from '@/types/response'
import type { CleverTableProps, TableColumn, TableAction, HeaderAction, SearchConfig, PaginationConfig } from '../../clever-table/src/types'
import type { CleverFormProps, FormSchema } from '../../clever-form/src/types/form'

// 数据表格API配置
export interface DataTableApiConfig<T extends Record<string, any> = any> {
  // 列表查询API
  listApi?: ApiFn<{
    page?: number
    pageSize?: number
    [key: string]: any
  }, {
    list: T[]
    total: number
  } | T[]>
  
  // 创建API
  createApi?: ApiFn<Partial<T>, T>
  
  // 更新API
  updateApi?: ApiFn<Partial<T>, T>
  
  // 删除API
  deleteApi?: ApiFn<string | number, boolean>
  
  // 批量删除API
  batchDeleteApi?: ApiFn<(string | number)[], boolean>
  
  // 详情查询API
  getApi?: ApiFn<string | number, T>
}

// 表单配置
export interface DataTableFormConfig {
  // 表单标题
  title?: string
  // 创建时的标题
  createTitle?: string
  // 编辑时的标题
  editTitle?: string
  // 表单模式：弹窗或抽屉
  mode?: 'modal' | 'drawer'
  // 表单宽度
  width?: string | number
  // 表单高度
  height?: string | number
  // 表单配置
  schemas: FormSchema[]
  // 表单属性
  formProps?: Partial<CleverFormProps>
  // 是否显示表单
  show?: boolean
  // 表单验证规则
  rules?: Record<string, any>
  // 表单布局
  layout?: 'horizontal' | 'vertical' | 'inline'
  // 标签宽度
  labelWidth?: string | number
  // 表单项间距
  gutter?: number
  // 每行显示的表单项数量
  span?: number
}

// 数据表格属性
export interface CleverDataTableProps<T extends Record<string, any> = any> {
  // 表格配置
  columns: TableColumn[]
  // 表格数据
  data?: T[]
  // 加载状态
  loading?: boolean
  // 是否自动加载数据
  autoLoad?: boolean
  // API配置
  apiConfig?: DataTableApiConfig<T>
  // 表单配置
  formConfig?: DataTableFormConfig
  // 搜索配置
  searchConfig?: SearchConfig
  // 分页配置
  paginationConfig?: PaginationConfig
  // 表头操作
  headerActions?: HeaderAction[]
  // 行操作
  actions?: TableAction[]
  // 选中的行键
  checkedRowKeys?: (string | number)[]
  // 行键字段名
  rowKey?: string
  // ID字段名
  idField?: string
  // 是否显示序号列
  showIndexColumn?: boolean
  // 序号列标题
  indexColumnTitle?: string
  // 序号列宽度
  indexColumnWidth?: number
  // 是否显示选择列
  showSelectionColumn?: boolean
  // 是否显示操作列
  showActionColumn?: boolean
  // 操作列标题
  actionColumnTitle?: string
  // 操作列宽度
  actionColumnWidth?: number
  // 表格大小
  size?: 'small' | 'medium' | 'large'
  // 是否显示边框
  bordered?: boolean
  // 是否显示斑马纹
  striped?: boolean
  // 空数据文本
  emptyText?: string
  // 最大高度
  maxHeight?: number
  // 横向滚动宽度
  scrollX?: number
  // 表格属性
  tableProps?: Record<string, any>
  // 数据加载前处理
  beforeLoad?: (params: any) => any
  // 数据加载后处理
  afterLoad?: (data: any) => any
  // 表单提交前处理
  beforeSubmit?: (values: Record<string, any>, type: 'create' | 'update') => Record<string, any> | Promise<Record<string, any>>
  // 表单提交后处理
  afterSubmit?: (response: any, type: 'create' | 'update') => void
  // 删除前确认
  beforeDelete?: (record: any) => boolean | Promise<boolean>
  // 删除后处理
  afterDelete?: (response: any) => void
}

// 数据表格方法
export interface CleverDataTableMethods {
  // 刷新数据
  handleRefresh: () => Promise<void>
  // 打开表单
  handleOpenForm: (record?: any) => void
  // 删除数据
  handleDelete: (record: any) => Promise<void>
  // 批量删除
  handleBatchDelete: () => Promise<void>
  // 设置选中行
  setCheckedRowKeys: (keys: (string | number)[]) => void
  // 获取选中行
  getCheckedRowKeys: () => (string | number)[]
  // 更新搜索参数
  updateSearchParams: (params: any) => void
  // 获取表格数据
  getTableData: () => any[]
  // 设置表格数据
  setTableData: (data: any[]) => void
  // 创建数据
  handleCreate: () => void
  // 编辑数据
  handleEdit: (record: any) => void
}

// 使用数据表格返回类型
export type UseDataTableReturnType = [
  CleverDataTableMethods,
  {
    register: (instance: CleverDataTableMethods) => void
    methods: CleverDataTableMethods
  }
]