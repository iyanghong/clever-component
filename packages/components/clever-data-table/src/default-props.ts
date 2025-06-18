import type { PropType } from 'vue'
import type { CleverDataTableProps, DataTableApiConfig, DataTableFormConfig } from './types'
import type { TableColumn, TableAction, HeaderAction, SearchConfig, PaginationConfig } from '../../clever-table/src/types'

export default {
  // 表格配置
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true
  },
  
  // 表格数据
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  
  // 是否自动加载数据
  autoLoad: {
    type: Boolean,
    default: true
  },
  
  // API配置
  apiConfig: {
    type: Object as PropType<DataTableApiConfig>,
    default: () => ({})
  },
  
  // 表单配置
  formConfig: {
    type: Object as PropType<DataTableFormConfig>,
    default: () => ({})
  },
  
  // 搜索配置
  searchConfig: {
    type: Object as PropType<SearchConfig>,
    default: () => ({})
  },
  
  // 分页配置
  paginationConfig: {
    type: Object as PropType<PaginationConfig>,
    default: () => ({
      show: true,
      page: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50, 100],
      showQuickJumper: true,
      showSizePicker: true
    })
  },
  
  // 表头操作
  headerActions: {
    type: Array as PropType<HeaderAction[]>,
    default: () => []
  },
  
  // 行操作
  actions: {
    type: Array as PropType<TableAction[]>,
    default: () => []
  },
  
  // 选中的行键
  checkedRowKeys: {
    type: Array as PropType<(string | number)[]>,
    default: () => []
  },
  
  // 行键字段名
  rowKey: {
    type: String,
    default: 'id'
  },
  
  // ID字段名
  idField: {
    type: String,
    default: 'id'
  },
  
  // 是否显示序号列
  showIndexColumn: {
    type: Boolean,
    default: false
  },
  
  // 序号列标题
  indexColumnTitle: {
    type: String,
    default: '序号'
  },
  
  // 序号列宽度
  indexColumnWidth: {
    type: Number,
    default: 60
  },
  
  // 是否显示选择列
  showSelectionColumn: {
    type: Boolean,
    default: false
  },
  
  // 是否显示操作列
  showActionColumn: {
    type: Boolean,
    default: true
  },
  
  // 操作列标题
  actionColumnTitle: {
    type: String,
    default: '操作'
  },
  
  // 操作列宽度
  actionColumnWidth: {
    type: Number,
    default: 150
  },
  
  // 表格大小
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  
  // 是否显示边框
  bordered: {
    type: Boolean,
    default: true
  },
  
  // 是否显示斑马纹
  striped: {
    type: Boolean,
    default: false
  },
  
  // 空数据文本
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  
  // 最大高度
  maxHeight: {
    type: Number
  },
  
  // 横向滚动宽度
  scrollX: {
    type: Number
  },
  
  // 表格属性
  tableProps: {
    type: Object,
    default: () => ({})
  },
  
  // 数据加载前处理
  beforeLoad: {
    type: Function as PropType<(params: any) => any>
  },
  
  // 数据加载后处理
  afterLoad: {
    type: Function as PropType<(data: any) => any>
  },
  
  // 表单提交前处理
  beforeSubmit: {
    type: Function as PropType<(values: Record<string, any>, type: 'create' | 'update') => Record<string, any> | Promise<Record<string, any>>>
  },
  
  // 表单提交后处理
  afterSubmit: {
    type: Function as PropType<(response: any, type: 'create' | 'update') => void>
  },
  
  // 删除前确认
  beforeDelete: {
    type: Function as PropType<(record: any) => boolean | Promise<boolean>>
  },
  
  // 删除后处理
  afterDelete: {
    type: Function as PropType<(response: any) => void>
  }
} as const