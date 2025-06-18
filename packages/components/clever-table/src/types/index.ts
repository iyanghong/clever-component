import type { DataTableColumn, DataTableProps } from 'naive-ui'
import type { FormSchema } from '../../clever-form/src/types/form'
import type {
  GetPageApiFn,
  GetApiFn,
  CreateApiFn,
  UpdateApiFn,
  DeleteApiFn,
  ResponseBaseModel,
  PageResponseModel
} from '../../../types/response'

export type TableColumn = DataTableColumn & {
  // 是否显示在表格中
  show?: boolean
  // 是否可以隐藏
  hideable?: boolean
  // 自定义渲染
  customRender?: (record: any, index: number) => any
  // 条件显示
  ifShow?: (record: any) => boolean
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
  // 是否显示
  show?: boolean | ((record: any) => boolean)
  // 是否禁用
  disabled?: boolean | ((record: any) => boolean)
  // 点击事件
  onClick?: (record: any, index: number) => void
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
  // 获取分页列表数据的API
  listApi?: GetPageApiFn<T>
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
  // 行操作配置
  actions?: TableAction[]
  // 表头操作配置
  headerActions?: HeaderAction[]
  // 搜索配置
  searchConfig?: SearchConfig<T>
  // API配置
  apiConfig?: ApiConfig<T>
  // 分页配置
  paginationConfig?: PaginationConfig
  // 是否显示操作列
  showActionColumn?: boolean
  // 操作列标题
  actionColumnTitle?: string
  // 操作列宽度
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
  // 表格属性
  tableProps?: Partial<DataTableProps>
}

export interface CleverTableMethods {
  // 刷新表格数据
  handleRefresh: () => void
  // 打开表单
  handleOpenForm: (record?: any) => void
  // 删除数据
  handleDelete: (record: any) => void
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
}

export type UseTableReturnType = [
  CleverTableMethods,
  {
    register: (instance: CleverTableMethods) => void
    methods: CleverTableMethods
  }
]