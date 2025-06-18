import { useDialog, useMessage } from 'naive-ui'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { isFunction, isAsyncFunction } from '@/utils/is'
import type { CleverDataTableMethods, CleverDataTableProps, UseDataTableReturnType } from '../types'

export function useDataTable(props: CleverDataTableProps): CleverDataTableMethods {
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
  // 表单显示状态
  const formVisible = ref(false)
  // 表单模式
  const formMode = ref<'create' | 'update'>('create')
  // 当前编辑的记录
  const currentRecord = ref<any>(null)

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
  async function handleRefresh() {
    pagination.page = 1
    await loadData()
  }

  // 打开表单
  function handleOpenForm(record?: any) {
    if (record) {
      formMode.value = 'update'
      currentRecord.value = record
    } else {
      formMode.value = 'create'
      currentRecord.value = null
    }
    formVisible.value = true
  }

  // 创建数据
  function handleCreate() {
    handleOpenForm()
  }

  // 编辑数据
  function handleEdit(record: any) {
    handleOpenForm(record)
  }

  // 表单提交
  async function handleFormSubmit(values: Record<string, any>) {
    try {
      loading.value = true
      
      let submitData = { ...values }
      
      // 表单提交前处理
      if (props.beforeSubmit) {
        if (isAsyncFunction(props.beforeSubmit)) {
          submitData = await props.beforeSubmit(submitData, formMode.value)
        } else if (isFunction(props.beforeSubmit)) {
          submitData = props.beforeSubmit(submitData, formMode.value) || submitData
        }
      }
      
      let response: any
      
      if (formMode.value === 'create') {
        if (!props.apiConfig?.createApi) {
          message.warning('未配置创建API')
          return
        }
        response = await props.apiConfig.createApi(submitData)
      } else {
        if (!props.apiConfig?.updateApi) {
          message.warning('未配置更新API')
          return
        }
        // 添加ID字段
        const idField = props.idField || 'id'
        if (currentRecord.value && currentRecord.value[idField]) {
          submitData[idField] = currentRecord.value[idField]
        }
        response = await props.apiConfig.updateApi(submitData)
      }
      
      if (response.code === 0) {
        message.success(formMode.value === 'create' ? '创建成功' : '更新成功')
        formVisible.value = false
        
        // 表单提交后处理
        if (props.afterSubmit && isFunction(props.afterSubmit)) {
          props.afterSubmit(response, formMode.value)
        }
        
        // 刷新数据
        await loadData()
      } else {
        message.error(response.message || (formMode.value === 'create' ? '创建失败' : '更新失败'))
      }
    } catch (error) {
      console.error('Form submit error:', error)
      message.error(formMode.value === 'create' ? '创建失败' : '更新失败')
    } finally {
      loading.value = false
    }
  }

  // 删除数据
  async function handleDelete(record: any) {
    if (!props.apiConfig?.deleteApi) {
      message.warning('未配置删除API')
      return
    }
    
    // 删除前确认
    if (props.beforeDelete) {
      let canDelete: boolean
      if (isAsyncFunction(props.beforeDelete)) {
        canDelete = await props.beforeDelete(record)
      } else if (isFunction(props.beforeDelete)) {
        canDelete = props.beforeDelete(record)
      } else {
        canDelete = true
      }
      
      if (!canDelete) {
        return
      }
    }
    
    dialog.warning({
      title: '确认删除',
      content: '确定要删除这条数据吗？删除后无法恢复。',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          loading.value = true
          const idField = props.idField || 'id'
          const response = await props.apiConfig.deleteApi!(record[idField])
          
          if (response.code === 0) {
            message.success('删除成功')
            
            // 删除后处理
            if (props.afterDelete && isFunction(props.afterDelete)) {
              props.afterDelete(response)
            }
            
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

  // 批量删除
  async function handleBatchDelete() {
    if (!props.apiConfig?.batchDeleteApi) {
      message.warning('未配置批量删除API')
      return
    }
    
    if (checkedRowKeys.value.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }
    
    dialog.warning({
      title: '确认批量删除',
      content: `确定要删除选中的 ${checkedRowKeys.value.length} 条数据吗？删除后无法恢复。`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          loading.value = true
          const response = await props.apiConfig.batchDeleteApi!(checkedRowKeys.value)
          
          if (response.code === 0) {
            message.success('批量删除成功')
            checkedRowKeys.value = []
            await loadData()
          } else {
            message.error(response.message || '批量删除失败')
          }
        } catch (error) {
          console.error('Batch delete error:', error)
          message.error('批量删除失败')
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
    formVisible,
    formMode,
    currentRecord,
    
    // 方法
    handleRefresh,
    handleOpenForm,
    handleDelete,
    handleBatchDelete,
    setCheckedRowKeys,
    getCheckedRowKeys,
    updateSearchParams,
    getTableData,
    setTableData,
    handleCreate,
    handleEdit,
    handleFormSubmit,
    loadData
  }
}

export function createDataTable(): UseDataTableReturnType {
  let tableInstance: CleverDataTableMethods | null = null
  
  const register = (instance: CleverDataTableMethods) => {
    tableInstance = instance
  }
  
  const methods: CleverDataTableMethods = {
    handleRefresh: () => tableInstance?.handleRefresh() || Promise.resolve(),
    handleOpenForm: (record?: any) => tableInstance?.handleOpenForm(record),
    handleDelete: (record: any) => tableInstance?.handleDelete(record) || Promise.resolve(),
    handleBatchDelete: () => tableInstance?.handleBatchDelete() || Promise.resolve(),
    setCheckedRowKeys: (keys: (string | number)[]) => tableInstance?.setCheckedRowKeys(keys),
    getCheckedRowKeys: () => tableInstance?.getCheckedRowKeys() || [],
    updateSearchParams: (params: any) => tableInstance?.updateSearchParams(params),
    getTableData: () => tableInstance?.getTableData() || [],
    setTableData: (data: any[]) => tableInstance?.setTableData(data),
    handleCreate: () => tableInstance?.handleCreate(),
    handleEdit: (record: any) => tableInstance?.handleEdit(record)
  }
  
  return [methods, { register, methods }]
}