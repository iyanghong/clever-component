import { isFunction } from '@/utils/is'
import { useDialog, useMessage } from 'naive-ui'
import { computed, h, nextTick, onMounted, reactive, ref } from 'vue'
import type { CleverTableMethods, CleverTableProps, TableColumn, UseTableReturnType } from '../types'

export function useTable(props: CleverTableProps): CleverTableMethods {
  const message = useMessage()
  const dialog = useDialog()
  
  // 表格数据
  const tableData = ref<any[]>(props.data || [])
  // 加载状态
  const loading = ref(false)
  // 搜索参数
  const searchParams = reactive<Record<string, any>>({})
  // 分页参数
  const pagination = reactive({
    page: props.paginationConfig?.page || 1,
    pageSize: props.paginationConfig?.pageSize || 10,
    total: props.paginationConfig?.total || 0
  })
  // 选中的行键
  const checkedRowKeys = ref<(string | number)[]>(props.checkedRowKeys || [])
  // 搜索表单折叠状态
  const searchCollapsed = ref(props.searchConfig?.collapsed || false)

  // 计算属性：处理后的列配置
  const processedColumns = computed(() => {
    const columns: TableColumn[] = []
    
    // 序号列
    if (props.showIndexColumn) {
      columns.push({
        key: 'index',
        title: props.indexColumnTitle || '序号',
        width: props.indexColumnWidth || 60,
        render: (_, index) => {
          return (pagination.page - 1) * pagination.pageSize + index + 1
        }
      })
    }
    
    // 选择列
    if (props.showSelectionColumn) {
      columns.push({
        type: 'selection',
        key: 'selection'
      })
    }
    
    // 数据列
    const dataColumns = props.columns.filter(col => col.show !== false)
    columns.push(...dataColumns)
    
    // 操作列
    if (props.showActionColumn && props.actions && props.actions.length > 0) {
      columns.push({
        key: 'action',
        title: props.actionColumnTitle || '操作',
        width: props.actionColumnWidth || 150,
        render: (record, index) => {
          return h('div', { class: 'flex gap-2' }, 
            props.actions?.map(action => {
              const show = typeof action.show === 'function' ? action.show(record) : action.show !== false
              const disabled = typeof action.disabled === 'function' ? action.disabled(record) : action.disabled
              
              if (!show) return null
              
              return h('n-button', {
                size: 'small',
                type: action.type || 'primary',
                disabled,
                onClick: () => handleActionClick(action, record, index)
              }, () => action.label)
            }).filter(Boolean)
          )
        }
      })
    }
    
    return columns
  })

  // 处理操作点击
  function handleActionClick(action: any, record: any, index: number) {
    if (action.confirm) {
      dialog.warning({
        title: action.confirm.title || '确认操作',
        content: action.confirm.content || '确定要执行此操作吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          action.onClick?.(record, index)
        }
      })
    } else {
      action.onClick?.(record, index)
    }
  }

  // 加载数据
  async function loadData() {
    if (!props.apiConfig?.listApi) {
      return
    }
    
    try {
      loading.value = true
      
      let params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchParams
      }
      
      // 数据加载前处理
      if (props.beforeLoad && isFunction(props.beforeLoad)) {
        params = props.beforeLoad(params) || params
      }
      
      const response = await props.apiConfig.listApi(params)
      
      if (response.code === 0) {
        let data = response.data
        
        // 数据加载后处理
        if (props.afterLoad && isFunction(props.afterLoad)) {
          data = props.afterLoad(data) || data
        }
        
        if (Array.isArray(data)) {
          tableData.value = data
          pagination.total = response.total || data.length
        } else if (data && Array.isArray(data.list)) {
          tableData.value = data.list
          pagination.total = data.total || data.list.length
        } else {
          tableData.value = []
          pagination.total = 0
        }
      } else {
        message.error(response.message || '获取数据失败')
        tableData.value = []
        pagination.total = 0
      }
    } catch (error) {
      console.error('Load data error:', error)
      message.error('获取数据失败')
      tableData.value = []
      pagination.total = 0
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  function handleRefresh() {
    pagination.page = 1
    loadData()
  }

  // 打开表单
  function handleOpenForm(record?: any) {
    // 这里需要与CleverForm组件配合使用
    // 可以通过事件或者回调函数来处理
    console.log('Open form with record:', record)
  }

  // 删除数据
  async function handleDelete(record: any) {
    if (!props.apiConfig?.deleteApi) {
      message.warning('未配置删除API')
      return
    }
    
    dialog.warning({
      title: '确认删除',
      content: '确定要删除这条数据吗？删除后无法恢复。',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          loading.value = true
          const response = await props.apiConfig.deleteApi!(record[props.rowKey || 'id'])
          
          if (response.code === 0) {
            message.success('删除成功')
            await loadData()
          } else {
            message.error(response.message || '删除失败')
          }
        } catch (error) {
          console.error('Delete error:', error)
          message.error('删除失败')
        } finally {
          loading.value = false
        }
      }
    })
  }

  // 设置选中行
  function setCheckedRowKeys(keys: (string | number)[]) {
    checkedRowKeys.value = keys
  }

  // 获取选中行
  function getCheckedRowKeys(): (string | number)[] {
    return checkedRowKeys.value
  }

  // 更新搜索参数
  function updateSearchParams(params: any) {
    Object.assign(searchParams, params)
    pagination.page = 1
    loadData()
  }

  // 获取表格数据
  function getTableData(): any[] {
    return tableData.value
  }

  // 设置表格数据
  function setTableData(data: any[]) {
    tableData.value = data
  }

  // 处理分页变化
  function handlePageChange(page: number) {
    pagination.page = page
    loadData()
  }

  // 处理每页条数变化
  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadData()
  }

  // 处理搜索
  function handleSearch(values: Record<string, any>) {
    updateSearchParams(values)
  }

  // 处理重置搜索
  function handleResetSearch() {
    Object.keys(searchParams).forEach(key => {
      delete searchParams[key]
    })
    pagination.page = 1
    loadData()
  }

  // 切换搜索表单折叠状态
  function toggleSearchCollapsed() {
    searchCollapsed.value = !searchCollapsed.value
  }

  // 组件挂载时自动加载数据
  onMounted(() => {
    if (props.autoLoad) {
      nextTick(() => {
        loadData()
      })
    }
  })

  return {
    // 数据
    tableData,
    loading,
    searchParams,
    pagination,
    checkedRowKeys,
    searchCollapsed,
    processedColumns,
    
    // 方法
    handleRefresh,
    handleOpenForm,
    handleDelete,
    setCheckedRowKeys,
    getCheckedRowKeys,
    updateSearchParams,
    getTableData,
    setTableData,
    loadData,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleResetSearch,
    toggleSearchCollapsed
  }
}

export function createTable(): UseTableReturnType {
  let tableInstance: CleverTableMethods | null = null
  
  const register = (instance: CleverTableMethods) => {
    tableInstance = instance
  }
  
  const methods: CleverTableMethods = {
    handleRefresh: () => tableInstance?.handleRefresh(),
    handleOpenForm: (record?: any) => tableInstance?.handleOpenForm(record),
    handleDelete: (record: any) => tableInstance?.handleDelete(record),
    setCheckedRowKeys: (keys: (string | number)[]) => tableInstance?.setCheckedRowKeys(keys),
    getCheckedRowKeys: () => tableInstance?.getCheckedRowKeys() || [],
    updateSearchParams: (params: any) => tableInstance?.updateSearchParams(params),
    getTableData: () => tableInstance?.getTableData() || [],
    setTableData: (data: any[]) => tableInstance?.setTableData(data)
  }
  
  return [methods, { register, methods }]
}