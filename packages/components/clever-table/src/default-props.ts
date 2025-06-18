import type { PropType } from 'vue'
import type { CleverTableProps, TableColumn, TableAction, HeaderAction, SearchConfig, ApiConfig, PaginationConfig } from './types'

export const defaultCleverTableProps = {
  // 表格列配置
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true
  },
  // 表格数据
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 是否自动加载数据
  autoLoad: {
    type: Boolean,
    default: true
  },
  // 行操作配置
  actions: {
    type: Array as PropType<TableAction[]>,
    default: () => []
  },
  // 表头操作配置
  headerActions: {
    type: Array as PropType<HeaderAction[]>,
    default: () => []
  },
  // 搜索配置
  searchConfig: {
    type: Object as PropType<SearchConfig>,
    default: () => ({
      schemas: [],
      show: false,
      collapsible: true,
      collapsed: false,
      searchText: '搜索',
      resetText: '重置',
      expandText: '展开',
      collapseText: '收起'
    })
  },
  // API配置
  apiConfig: {
    type: Object as PropType<ApiConfig>,
    default: () => ({})
  },
  // 分页配置
  paginationConfig: {
    type: Object as PropType<PaginationConfig>,
    default: () => ({
      page: 1,
      pageSize: 10,
      total: 0,
      show: true,
      pageSizes: [10, 20, 50, 100],
      showQuickJumper: true,
      showSizePicker: true
    })
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
  // 选中的行键
  checkedRowKeys: {
    type: Array as PropType<(string | number)[]>,
    default: () => []
  },
  // 行键字段
  rowKey: {
    type: String,
    default: 'id'
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
  // 空数据提示
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 最大高度
  maxHeight: {
    type: Number,
    default: undefined
  },
  // 滚动配置
  scrollX: {
    type: Number,
    default: undefined
  },
  // 数据处理钩子
  beforeLoad: {
    type: Function as PropType<(params: any) => any>,
    default: undefined
  },
  afterLoad: {
    type: Function as PropType<(data: any) => any>,
    default: undefined
  },
  // 表格属性
  tableProps: {
    type: Object,
    default: () => ({})
  }
}

export default defaultCleverTableProps

export function getDefaultCleverTableProps(): CleverTableProps {
  return {
    columns: [],
    data: [],
    loading: false,
    autoLoad: true,
    actions: [],
    headerActions: [],
    searchConfig: {
      schemas: [],
      show: false,
      collapsible: true,
      collapsed: false,
      searchText: '搜索',
      resetText: '重置',
      expandText: '展开',
      collapseText: '收起'
    },
    apiConfig: {},
    paginationConfig: {
      page: 1,
      pageSize: 10,
      total: 0,
      show: true,
      pageSizes: [10, 20, 50, 100],
      showQuickJumper: true,
      showSizePicker: true
    },
    showActionColumn: true,
    actionColumnTitle: '操作',
    actionColumnWidth: 150,
    showIndexColumn: false,
    indexColumnTitle: '序号',
    indexColumnWidth: 60,
    showSelectionColumn: false,
    checkedRowKeys: [],
    rowKey: 'id',
    size: 'medium',
    bordered: true,
    striped: false,
    emptyText: '暂无数据',
    tableProps: {}
  }
}