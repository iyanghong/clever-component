<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { NDataTable, NPagination, NSpace, NButton, NCard, NCollapse, NCollapseItem, NIcon, NModal, NDrawer } from 'naive-ui'
import { ChevronDownOutline, ChevronUpOutline, AddOutline, CreateOutline, TrashOutline } from '@vicons/ionicons5'
import CleverForm from '../../clever-form/index.vue'
import { useDataTable } from './hook/use-data-table'
import defaultCleverDataTableProps from './default-props'
import type { CleverDataTableMethods, TableColumn } from './types'

const props = defineProps(defaultCleverDataTableProps)
const emit = defineEmits<{
  'update:checkedRowKeys': [keys: (string | number)[]]
  'action-click': [action: string, record: any, index: number]
  'header-action-click': [action: string]
  'row-click': [record: any, index: number]
  'selection-change': [keys: (string | number)[]]
  'form-submit': [values: Record<string, any>, type: 'create' | 'update']
  'form-cancel': []
  'data-change': [data: any[]]
}>()

const {
  tableData,
  loading,
  searchParams,
  pagination,
  checkedRowKeys,
  formVisible,
  formMode,
  currentRecord,
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
} = useDataTable(props)

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
  if (props.showActionColumn) {
    const defaultActions = []
    
    // 默认编辑操作
    if (props.apiConfig?.updateApi && props.formConfig?.schemas) {
      defaultActions.push({
        key: 'edit',
        label: '编辑',
        type: 'primary',
        icon: CreateOutline,
        onClick: (record: any) => handleEdit(record)
      })
    }
    
    // 默认删除操作
    if (props.apiConfig?.deleteApi) {
      defaultActions.push({
        key: 'delete',
        label: '删除',
        type: 'error',
        icon: TrashOutline,
        onClick: (record: any) => handleDelete(record)
      })
    }
    
    // 合并用户自定义操作
    const allActions = [...defaultActions, ...(props.actions || [])]
    
    if (allActions.length > 0) {
      columns.push({
        key: 'action',
        title: props.actionColumnTitle || '操作',
        width: props.actionColumnWidth || 150,
        render: (record, index) => {
          return h('div', { class: 'flex gap-2' }, 
            allActions.map(action => {
              const show = typeof action.show === 'function' ? action.show(record) : action.show !== false
              const disabled = typeof action.disabled === 'function' ? action.disabled(record) : action.disabled
              
              if (!show) return null
              
              return h(NButton, {
                size: 'small',
                type: action.type || 'primary',
                disabled,
                onClick: () => {
                  action.onClick?.(record, index)
                  emit('action-click', action.key, record, index)
                }
              }, {
                default: () => action.label,
                icon: action.icon ? () => h(NIcon, null, { default: () => h(action.icon!) }) : undefined
              })
            }).filter(Boolean)
          )
        }
      })
    }
  }
  
  return columns
})

// 计算属性：表格属性
const tableProps = computed(() => {
  return {
    columns: processedColumns.value,
    data: tableData.value,
    loading: loading.value,
    bordered: props.bordered,
    striped: props.striped,
    size: props.size,
    rowKey: (row: any) => row[props.rowKey || 'id'],
    checkedRowKeys: checkedRowKeys.value,
    maxHeight: props.maxHeight,
    scrollX: props.scrollX,
    emptyText: props.emptyText,
    onUpdateCheckedRowKeys: (keys: (string | number)[]) => {
      checkedRowKeys.value = keys
      emit('update:checkedRowKeys', keys)
      emit('selection-change', keys)
    },
    onRowClick: (record: any, index: number) => {
      emit('row-click', record, index)
    },
    ...props.tableProps
  }
})

// 计算属性：分页属性
const paginationProps = computed(() => {
  if (!props.paginationConfig?.show) {
    return false
  }
  
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    itemCount: pagination.total,
    pageSizes: props.paginationConfig?.pageSizes || [10, 20, 50, 100],
    showQuickJumper: props.paginationConfig?.showQuickJumper,
    showSizePicker: props.paginationConfig?.showSizePicker,
    onUpdatePage: (page: number) => {
      pagination.page = page
      loadData()
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
      loadData()
    }
  }
})

// 计算属性：表头操作
const computedHeaderActions = computed(() => {
  const defaultActions = []
  
  // 默认新增操作
  if (props.apiConfig?.createApi && props.formConfig?.schemas) {
    defaultActions.push({
      key: 'create',
      label: '新增',
      type: 'primary',
      icon: AddOutline,
      onClick: () => handleCreate()
    })
  }
  
  // 默认批量删除操作
  if (props.apiConfig?.batchDeleteApi && props.showSelectionColumn) {
    defaultActions.push({
      key: 'batchDelete',
      label: '批量删除',
      type: 'error',
      icon: TrashOutline,
      disabled: checkedRowKeys.value.length === 0,
      onClick: () => handleBatchDelete()
    })
  }
  
  return [...defaultActions, ...(props.headerActions || [])]
})

// 处理表头操作点击
function handleHeaderActionClick(action: any) {
  action.onClick?.()
  emit('header-action-click', action.key)
}

// 处理搜索表单提交
function handleSearchSubmit(values: Record<string, any>) {
  updateSearchParams(values)
}

// 处理搜索表单重置
function handleSearchReset() {
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

// 处理表单提交
function onFormSubmit(values: Record<string, any>) {
  emit('form-submit', values, formMode.value)
  handleFormSubmit(values)
}

// 处理表单取消
function onFormCancel() {
  formVisible.value = false
  emit('form-cancel')
}

// 暴露方法
const methods: CleverDataTableMethods = {
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
  handleEdit
}

defineExpose(methods)
</script>

<template>
  <div class="clever-data-table">
    <!-- 搜索表单 -->
    <NCard v-if="props.searchConfig?.show && props.searchConfig.schemas?.length > 0" class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span>搜索条件</span>
          <NButton
            v-if="props.searchConfig.collapsible"
            text
            @click="toggleSearchCollapsed"
          >
            <template #icon>
              <NIcon>
                <ChevronUpOutline v-if="!searchCollapsed" />
                <ChevronDownOutline v-else />
              </NIcon>
            </template>
            {{ searchCollapsed ? props.searchConfig.expandText : props.searchConfig.collapseText }}
          </NButton>
        </div>
      </template>
      
      <NCollapse v-if="props.searchConfig.collapsible" :expanded-names="searchCollapsed ? [] : ['search']">
        <NCollapseItem name="search">
          <CleverForm
            :schemas="props.searchConfig.schemas"
            :show-action-button-group="true"
            :submit-button-options="{ text: props.searchConfig.searchText }"
            :reset-button-options="{ text: props.searchConfig.resetText }"
            :grid-props="{ cols: 4, xGap: 16, yGap: 16 }"
            @submit="handleSearchSubmit"
            @reset="handleSearchReset"
          />
        </NCollapseItem>
      </NCollapse>
      
      <CleverForm
        v-else
        :schemas="props.searchConfig.schemas"
        :show-action-button-group="true"
        :submit-button-options="{ text: props.searchConfig.searchText }"
        :reset-button-options="{ text: props.searchConfig.resetText }"
        :grid-props="{ cols: 4, xGap: 16, yGap: 16 }"
        @submit="handleSearchSubmit"
        @reset="handleSearchReset"
      />
    </NCard>

    <!-- 表头操作 -->
    <div v-if="computedHeaderActions.length > 0" class="mb-4">
      <NSpace>
        <NButton
          v-for="action in computedHeaderActions"
          :key="action.key"
          :type="action.type || 'primary'"
          :disabled="action.disabled"
          @click="handleHeaderActionClick(action)"
        >
          <template v-if="action.icon" #icon>
            <NIcon>
              <component :is="action.icon" />
            </NIcon>
          </template>
          {{ action.label }}
        </NButton>
      </NSpace>
    </div>

    <!-- 数据表格 -->
    <NDataTable v-bind="tableProps" />

    <!-- 分页 -->
    <div v-if="paginationProps" class="mt-4 flex justify-end">
      <NPagination v-bind="paginationProps" />
    </div>

    <!-- 表单弹窗/抽屉 -->
    <NModal
      v-if="props.formConfig?.mode !== 'drawer'"
      v-model:show="formVisible"
      :title="formMode === 'create' ? (props.formConfig?.createTitle || props.formConfig?.title || '新增') : (props.formConfig?.editTitle || props.formConfig?.title || '编辑')"
      :style="{ width: props.formConfig?.width || '600px' }"
      preset="card"
      :mask-closable="false"
    >
      <CleverForm
        v-if="formVisible && props.formConfig?.schemas"
        :key="`form-${formMode}-${currentRecord?.[props.idField || 'id'] || 'new'}`"
        :schemas="props.formConfig.schemas"
        :model-value="currentRecord"
        :show-action-button-group="true"
        :submit-button-options="{ text: formMode === 'create' ? '创建' : '更新' }"
        :reset-button-options="{ text: '取消' }"
        v-bind="props.formConfig?.formProps"
        @submit="onFormSubmit"
        @reset="onFormCancel"
      />
    </NModal>

    <NDrawer
      v-else
      v-model:show="formVisible"
      :width="props.formConfig?.width || 600"
      :height="props.formConfig?.height"
      placement="right"
    >
      <template #header>
        {{ formMode === 'create' ? (props.formConfig?.createTitle || props.formConfig?.title || '新增') : (props.formConfig?.editTitle || props.formConfig?.title || '编辑') }}
      </template>
      
      <CleverForm
        v-if="formVisible && props.formConfig?.schemas"
        :key="`form-${formMode}-${currentRecord?.[props.idField || 'id'] || 'new'}`"
        :schemas="props.formConfig.schemas"
        :model-value="currentRecord"
        :show-action-button-group="true"
        :submit-button-options="{ text: formMode === 'create' ? '创建' : '更新' }"
        :reset-button-options="{ text: '取消' }"
        v-bind="props.formConfig?.formProps"
        @submit="onFormSubmit"
        @reset="onFormCancel"
      />
    </NDrawer>
  </div>
</template>

<style scoped>
.clever-data-table {
  width: 100%;
}

.clever-data-table :deep(.n-data-table-th) {
  background-color: var(--n-th-color);
}

.clever-data-table :deep(.n-data-table-td) {
  border-bottom: 1px solid var(--n-border-color);
}

.clever-data-table :deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: var(--n-th-color-hover);
}
</style>