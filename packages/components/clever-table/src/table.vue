<template>
  <NSpace class="clever-table">
    <!-- 搜索表单 -->
    <NCard v-if="props.searchConfig?.show && props.searchConfig.schemas.length > 0" class="mb-4">
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
    <div v-if="shouldShowHeaderActions" class="mb-4">
      <NSpace>
        <!-- 自定义头部操作按钮 -->
        <NButton
          v-for="action in props.headerActions"
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
        
        <!-- 新增按钮 - 当传入 createApi 并配置 formConfig 时显示 -->
        <NButton
          v-if="props.apiConfig?.createApi && props.formConfig"
          type="primary"
          @click="handleOpenForm(FormMode.CREATE)"
        >
          <template #icon>
            <NIcon>
              <AddOutline />
            </NIcon>
          </template>
          新增
        </NButton>
        
        <!-- 批量删除按钮 - 当传入 batchDeleteApi 时显示 -->
        <NButton
          v-if="props.apiConfig?.batchDeleteApi && checkedRowKeys.length > 0"
          type="error"
          @click="handleBatchDelete(getSelectedRecords())"
        >
          <template #icon>
            <NIcon>
              <TrashOutline />
            </NIcon>
          </template>
          批量删除 ({{ checkedRowKeys.length }})
        </NButton>
      </NSpace>
    </div>

    <!-- 数据表格 -->
    <NDataTable v-bind="tableProps" />

    <!-- 分页 -->
    <NSpace v-if="paginationProps"  justify="end">
      <NPagination v-bind="paginationProps" />
    </NSpace>
  </NSpace>
</template>
<script setup lang="ts">
import { computed, h } from 'vue'
import { NDataTable, NPagination, NSpace, NButton, NCard, NCollapse, NCollapseItem, NIcon } from 'naive-ui'
import { ChevronDownOutline, ChevronUpOutline, AddOutline, TrashOutline } from '@vicons/ionicons5'
import CleverForm from '../../clever-form/index.vue'
import { useTable } from './hook/use-table'
import defaultCleverTableProps from './default-props'
import { FormMode } from './types'
import type { CleverTableMethods } from './types'

const props = defineProps(defaultCleverTableProps)
const emit = defineEmits<{
  'update:checkedRowKeys': [keys: (string | number)[]]
  'action-click': [action: string, record: any, index: number]
  'header-action-click': [action: string]
  'row-click': [record: any, index: number]
  'selection-change': [keys: (string | number)[]]
  'form-open': [record?: any]
  'save-success': [data: any, isEdit: boolean]
  'save-error': [error: any, isEdit: boolean]
  'delete-success': [record: any]
  'delete-error': [error: any, record: any]
}>()

const {
  tableData,
  loading,
  searchParams,
  pagination,
  checkedRowKeys,
  searchCollapsed,
  processedColumns,
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
  toggleSearchCollapsed
} = useTable(props, emit)

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
    onUpdatePage: handlePageChange,
    onUpdatePageSize: handlePageSizeChange
  }
})

// 计算属性：是否显示头部操作区域
const shouldShowHeaderActions = computed(() => {
  // 有自定义头部操作按钮
  const hasCustomActions = props.headerActions && props.headerActions.length > 0
  // 有新增按钮（需要 createApi 和 formConfig）
  const hasCreateButton = !!(props.apiConfig?.createApi && props.formConfig)
  // 有批量删除按钮（需要 batchDeleteApi 和选中的数据）
  const hasBatchDeleteButton = !!(props.apiConfig?.batchDeleteApi && checkedRowKeys.value.length > 0)
  
  return hasCustomActions || hasCreateButton || hasBatchDeleteButton
})

// 处理表头操作点击
function handleHeaderActionClick(action: any) {
  action.onClick?.()
  emit('header-action-click', action.key)
}



// 处理搜索表单提交
function handleSearchSubmit(values: Record<string, any>) {
  handleSearch(values)
}

// 处理搜索表单重置
function handleSearchReset() {
  handleResetSearch()
}

// 暴露方法
const methods: CleverTableMethods = {
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
  setTableData
}

defineExpose(methods)
</script>
<style scoped>
.clever-table {
  width: 100%;
}

.clever-table :deep(.n-data-table-th) {
  background-color: var(--n-th-color);
}

.clever-table :deep(.n-data-table-td) {
  border-bottom: 1px solid var(--n-border-color);
}

.clever-table :deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: var(--n-th-color-hover);
}
</style>