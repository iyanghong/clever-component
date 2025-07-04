import { ref, reactive, computed, watch, nextTick, h, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { FormMode } from '../types'
import type {
  CleverTableMethods,
  CleverTableProps,
  TableColumn,
  UseTableReturnType,
  TableAction,
  ActionConfig
} from '../types'
import { useEnhancedSearch } from './use-enhanced-search'
import type { EnhancedSearchConfig } from '../types/search'
import { SearchMode } from '../types/search'
import TableActions from '../components/TableActions.vue'
// 工具函数：判断是否为函数
function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export function useTable(props: CleverTableProps, emit?: any) {
  const message = useMessage()
  const dialog = useDialog()

  // 表格数据
  const tableData = ref<any[]>(props.data || [])
  // 加载状态
  const loading = ref(false)
  // 搜索参数
  const searchParams = reactive<Record<string, any>>({})

  // 增强搜索配置
  const enhancedSearchConfig: EnhancedSearchConfig = {
    schemas: props.searchConfig?.schemas || [],
    show: props.searchConfig?.show ?? true,
    collapsible: props.searchConfig?.collapsible ?? false,
    mode: SearchMode.SIMPLE,
    performance: {
      debounceDelay: 300,
      smartSearch: true,
      cache: { enabled: true, maxSize: 50, expireTime: 5 * 60 * 1000 }
    },
    quickSearch: {
      enabled: true,
      placeholder: '请输入关键词快速搜索',
      fields: ['keyword'],
      realtime: false
    },
    advancedSearch: {
      enabled: (props.searchConfig?.schemas?.length || 0) > 4,
      schemas: props.searchConfig?.schemas || []
    },
    presets: { enabled: true, allowSave: true, list: [] },
    history: { enabled: true, maxRecords: 10, showInDropdown: true },
    export: { enabled: true, formats: ['json', 'csv', 'url'] },
    ui: {
      showSearchStatus: true,
      showResultStats: true,
      showActiveConditions: true,
      showClearAll: true
    },
    text: {
      searchText: '搜索',
      resetText: '重置',
      clearAllText: '清空所有',
      expandText: '展开',
      collapseText: '收起',
      simpleSearchText: '简单搜索',
      advancedSearchText: '高级搜索',
      quickSearchPlaceholder: '请输入关键词快速搜索'
    }
  }

  // 使用增强搜索功能
  const {
    searchMode,
    searchState,
    activeConditionsCount,
    hasActiveConditions,
    canClearAll,
    handleSearch: enhancedHandleSearch,
    handleReset: enhancedHandleReset,
    handleClearAll: enhancedHandleClearAll,
    handleQuickSearch,
    handleModeChange,
    updateSearchParams: enhancedUpdateSearchParams,
    savePreset,
    deletePreset,
    applyPreset,
    getSearchHistory,
    clearSearchHistory,
    applyHistoryItem,
    exportSearchParams,
    importSearchParams
  } = useEnhancedSearch(enhancedSearchConfig, loadData)
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

    // 智能操作列配置
    const shouldShowActions = computed(() => {
      // 如果明确设置了 actionConfig.show，则以此为准
      if (props.actionConfig?.show !== undefined) {
        return props.actionConfig.show
      }
      
      // 如果设置了 autoShowActions，则自动判断
      if (props.autoShowActions) {
        const hasBuiltInActions = !!(props.apiConfig?.getApi || props.apiConfig?.updateApi || props.apiConfig?.deleteApi)
        const hasCustomActions = !!(props.actionConfig?.customButtons?.length || props.actions?.length)
        return hasBuiltInActions || hasCustomActions
      }
      
      // 兼容旧版本：如果有 actions 配置，则显示
      return !!(props.actions?.length)
    })

    // 操作列
    if (shouldShowActions.value) {
      const actionConfig = props.actionConfig || {}
      const actions = getActionButtons(actionConfig)

      if (actions.length > 0) {
        columns.push({
          key: 'action',
          title: actionConfig.title || props.actionColumnTitle || '操作',
          width: actionConfig.width || props.actionColumnWidth || 150,
          render: (record, index) => {
            return h(TableActions, {
              actions,
              record,
              index,
              onActionClick: (action, record, index) => {
                handleActionClick(action, record, index)
                emit?.('action-click', action.key, record, index)
              }
            })
          }
        })
      }
    }

    return columns
  })

  // 获取操作按钮配置
  function getActionButtons(actionConfig: ActionConfig) {
    const buttons: TableAction[] = []
    const { getApi, updateApi, deleteApi } = props.apiConfig || {}
    const { formConfig } = props

    // 详情按钮 - 当传入 getApi 并配置 formConfig 时显示
    if (actionConfig.showView !== false && getApi && formConfig) {
      buttons.push({
        key: 'view',
        label: actionConfig.viewText || '详情',
        type: 'info',
        ghost: true,
        handler: record => handleOpenForm(FormMode.DETAIL, record),
        ...actionConfig.viewProps
      })
    }

    // 编辑按钮 - 当传入 updateApi 并配置 formConfig 时显示
    if (actionConfig.showEdit !== false && updateApi && formConfig) {
      buttons.push({
        key: 'edit',
        label: actionConfig.editText || '编辑',
        type: 'primary',
        handler: record => handleOpenForm(FormMode.EDIT, record),
        ...actionConfig.editProps
      })
    }

    // 删除按钮 - 当传入 deleteApi 时显示
    if (actionConfig.showDelete !== false && deleteApi) {
      buttons.push({
        key: 'delete',
        label: actionConfig.deleteText || '删除',
        type: 'error',
        ghost: true,
        confirm: {
          title: props.deleteConfig?.title || '确认删除',
          content:
            props.deleteConfig?.content ||
            '确定要删除这条记录吗？删除后无法恢复。'
        },
        handler: record => handleDelete(record),
        ...actionConfig.deleteProps
      })
    }

    // 自定义按钮
    if (actionConfig.customButtons) {
      buttons.push(...actionConfig.customButtons)
    }

    // 兼容旧版本 actions 配置
    if (props.actions) {
      buttons.push(...props.actions)
    }

    return buttons
  }

  // 处理操作点击
  function handleActionClick(action: any, record: any, index: number) {
    const handler = action.handler || action.onClick
    handler?.(record, index)
  }

  // 加载数据
  async function loadData() {
    const { getAllApi, getPageApi } = props.apiConfig || {}

    // 根据配置选择合适的API
    let api: any = null
    let isPagedApi = false

    if (getPageApi) {
      // 优先使用分页API
      api = getPageApi
      isPagedApi = true
    } else if (getAllApi) {
      // 使用全量API
      api = getAllApi
      isPagedApi = false
    }

    if (!api) {
      return
    }

    try {
      loading.value = true

      let params: any = { ...searchParams }

      // 如果使用分页API，添加分页参数
      if (isPagedApi) {
        params.page = pagination.page
        params.pageSize = pagination.pageSize
      }

      // 数据加载前处理
      if (props.beforeLoad && isFunction(props.beforeLoad)) {
        params = props.beforeLoad(params) || params
      }

      const response = await api(params)

      if (response.code === 0) {
        let data = response.data

        // 数据加载后处理
        if (props.afterLoad && isFunction(props.afterLoad)) {
          data = props.afterLoad(data) || data
        }

        if (isPagedApi) {
          // 分页API的数据处理
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
          // 全量API的数据处理
          if (Array.isArray(data)) {
            tableData.value = data
            pagination.total = data.length
          } else {
            tableData.value = []
            pagination.total = 0
          }
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
  async function handleOpenForm(mode: FormMode, record?: any) {
    const isEdit = mode === FormMode.EDIT
    const isView = mode === FormMode.DETAIL
    let formData = {}

    if ((isEdit || isView) && record) {
      if (props.apiConfig?.getApi) {
        try {
          const response = await props.apiConfig.getApi(
            record[props.idField || 'id']
          )
          if (response.code === 0) {
            formData = response.data
          } else {
            message.error(response.message || '获取详情失败')
            return
          }
        } catch (error) {
          console.error('Get detail error:', error)
          message.error('获取详情失败')
          return
        }
      } else {
        formData = record
      }
    }

    // 触发表单打开事件
    if (props.onFormOpen && isFunction(props.onFormOpen)) {
      props.onFormOpen(mode, formData)
    }
  }

  // 删除数据
  async function handleDelete(record: any) {
    if (!props.apiConfig?.deleteApi) {
      message.warning('未配置删除API')
      return
    }

    const deleteTitle = props.deleteConfig?.title || '确认删除'
    const deleteContent =
      props.deleteConfig?.content || '确定要删除这条数据吗？删除后无法恢复。'

    dialog.warning({
      title: deleteTitle,
      content: deleteContent,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          if (!props.apiConfig?.deleteApi) {
            return
          }
          loading.value = true
          const response = await props.apiConfig.deleteApi!(
            record[props.rowKey || 'id']
          )

          if (response.code === 0) {
            message.success(props.deleteConfig?.successMessage || '删除成功')
            emit?.('delete-success', record)
            await loadData()
          } else {
            message.error(
              response.message || props.deleteConfig?.errorMessage || '删除失败'
            )
          }
        } catch (error) {
          console.error('Delete error:', error)
          message.error(props.deleteConfig?.errorMessage || '删除失败')
          emit?.('delete-error', error, record)
        } finally {
          loading.value = false
        }
      }
    })
  }

  // 批量删除数据
  async function handleBatchDelete(records: any[]) {
    if (!props.apiConfig?.batchDeleteApi) {
      message.warning('未配置批量删除API')
      return
    }

    if (records.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }

    const deleteTitle = props.deleteConfig?.batchTitle || '确认批量删除'
    const deleteContent =
      props.deleteConfig?.batchContent ||
      `确定要删除选中的 ${records.length} 条数据吗？删除后无法恢复。`

    dialog.warning({
      title: deleteTitle,
      content: deleteContent,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          if (!props.apiConfig?.batchDeleteApi) {
            return
          }
          loading.value = true
          const ids = records.map(record => record[props.rowKey || 'id'])
          const response = await props.apiConfig.batchDeleteApi!(ids)

          if (response.code === 0) {
            message.success(
              props.deleteConfig?.batchSuccessMessage || '批量删除成功'
            )
            emit?.('delete-success', records)
            checkedRowKeys.value = []
            await loadData()
          } else {
            message.error(
              response.message ||
                props.deleteConfig?.batchErrorMessage ||
                '批量删除失败'
            )
          }
        } catch (error) {
          console.error('Batch delete error:', error)
          message.error(props.deleteConfig?.batchErrorMessage || '批量删除失败')
          emit?.('delete-error', error, records)
        } finally {
          loading.value = false
        }
      }
    })
  }

  // 保存数据（新增或更新）
  async function handleSave(data: any, isEdit: boolean = false) {
    const api = isEdit ? props.apiConfig?.updateApi : props.apiConfig?.createApi

    if (!api) {
      message.warning(`未配置${isEdit ? '更新' : '新增'}API`)
      return false
    }

    try {
      loading.value = true

      // 数据保存前处理
      if (props.beforeSave && isFunction(props.beforeSave)) {
        data = props.beforeSave(data, isEdit) || data
      }

      const response = await api(data)

      if (response.code === 0) {
        const successMessage = isEdit
          ? props.saveConfig?.updateSuccessMessage || '更新成功'
          : props.saveConfig?.createSuccessMessage || '新增成功'
        message.success(successMessage)

        // 数据保存后处理
        if (props.afterSave && isFunction(props.afterSave)) {
          props.afterSave(response.data, isEdit)
        }

        emit?.('save-success', response.data, isEdit)

        await loadData()
        return true
      } else {
        const errorMessage = isEdit
          ? props.saveConfig?.updateErrorMessage || '更新失败'
          : props.saveConfig?.createErrorMessage || '新增失败'
        message.error(response.message || errorMessage)
        return false
      }
    } catch (error) {
      console.error('Save error:', error)
      const errorMessage = isEdit
        ? props.saveConfig?.updateErrorMessage || '更新失败'
        : props.saveConfig?.createErrorMessage || '新增失败'
      message.error(errorMessage)
      emit?.('save-error', error, isEdit)
      return false
    } finally {
      loading.value = false
    }
  }

  // 设置选中行
  function setCheckedRowKeys(keys: (string | number)[]) {
    checkedRowKeys.value = keys
  }

  // 获取选中行
  function getCheckedRowKeys(): (string | number)[] {
    return checkedRowKeys.value
  }

  // 获取选中的记录
  function getSelectedRecords() {
    const rowKey = props.rowKey || props.idField || 'id'
    return tableData.value.filter(item =>
      checkedRowKeys.value.includes(item[rowKey])
    )
  }

  // 更新搜索参数
  function updateSearchParams(params: any) {
    Object.assign(searchParams, params)
    pagination.page = 1
    enhancedUpdateSearchParams(params)
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

  // 处理搜索 - 使用增强搜索功能
  function handleSearch(values: Record<string, any>) {
    Object.assign(searchParams, values)
    pagination.page = 1
    enhancedHandleSearch(values)
  }

  // 处理重置搜索
  function handleResetSearch() {
    Object.keys(searchParams).forEach(key => {
      delete searchParams[key]
    })
    pagination.page = 1
    enhancedHandleReset()
  }

  // 切换搜索表单折叠状态
  function toggleSearchCollapsed() {
    searchCollapsed.value = !searchCollapsed.value
  }

  // 增强搜索方法
  function handleClearAllSearch() {
    Object.keys(searchParams).forEach(key => {
      delete searchParams[key]
    })
    pagination.page = 1
    enhancedHandleClearAll()
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
    handleBatchDelete,
    handleSave,
    setCheckedRowKeys,
    getCheckedRowKeys,
    getSelectedRecords,
    updateSearchParams,
    getTableData,
    setTableData,
    loadData,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleResetSearch,
    handleClearAllSearch,
    toggleSearchCollapsed,
    // 增强搜索功能
    searchMode,
    searchState,
    activeConditionsCount,
    hasActiveConditions,
    canClearAll,
    handleQuickSearch,
    handleModeChange,
    savePreset,
    deletePreset,
    applyPreset,
    getSearchHistory,
    clearSearchHistory,
    applyHistoryItem,
    exportSearchParams,
    importSearchParams
  }
}

export function createTable(): UseTableReturnType {
  let tableInstance: CleverTableMethods | null = null

  const register = (instance: CleverTableMethods) => {
    tableInstance = instance
  }
  const methods: CleverTableMethods = {
    handleRefresh: () => tableInstance?.handleRefresh(),
    handleOpenForm: (mode: FormMode, record?: any) =>
      tableInstance?.handleOpenForm(mode, record),
    handleDelete: (record: any) => tableInstance?.handleDelete(record),
    handleBatchDelete: (records: any[]) =>
      tableInstance?.handleBatchDelete(records),
    handleSave: (data: any, isEdit?: boolean) =>
      tableInstance?.handleSave(data, isEdit) as any,
    setCheckedRowKeys: (keys: (string | number)[]) =>
      tableInstance?.setCheckedRowKeys(keys),
    getCheckedRowKeys: () => tableInstance?.getCheckedRowKeys() || [],
    getSelectedRecords: () => tableInstance?.getSelectedRecords() || [],
    updateSearchParams: (params: any) =>
      tableInstance?.updateSearchParams(params),
    getTableData: () => tableInstance?.getTableData() || [],
    setTableData: (data: any[]) => tableInstance?.setTableData(data)
  }

  return [methods, { register, methods }]
}
