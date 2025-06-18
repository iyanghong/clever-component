<script setup lang="ts">
import { computed, h } from 'vue'
import { NDataTable, NPagination, NSpace, NButton, NCard, NCollapse, NCollapseItem, NIcon } from 'naive-ui'
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import CleverForm from '../../clever-form/index.vue'
import { useTable } from './hook/use-table'
import defaultCleverTableProps from './default-props'
import type { CleverTableMethods } from './types'

const props = defineProps(defaultCleverTableProps)
const emit = defineEmits<{
  'update:checkedRowKeys': [keys: (string | number)[]]
  'action-click': [action: string, record: any, index: number]
  'header-action-click': [action: string]
  'row-click': [record: any, index: number]
  'selection-change': [keys: (string | number)[]]
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
} = useTable(props)

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
  setCheckedRowKeys,
  getCheckedRowKeys,
  updateSearchParams,
  getTableData,
  setTableData
}

defineExpose(methods)
</script>

<template>
  <div class="clever-table">
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
    <div v-if="props.headerActions && props.headerActions.length > 0" class="mb-4">
      <NSpace>
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
      </NSpace>
    </div>

    <!-- 数据表格 -->
    <NDataTable v-bind="tableProps" />

    <!-- 分页 -->
    <div v-if="paginationProps" class="mt-4 flex justify-end">
      <NPagination v-bind="paginationProps" />
    </div>
  </div>
</template>

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