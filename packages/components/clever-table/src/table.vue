<template>
  <NSpace class="clever-table">
    <!-- 搜索组件 -->
    <NCard>
<!--      <CleverSearch-->
<!--        v-if="searchConfig.show"-->
<!--        ref="searchRef"-->
<!--        :config="enhancedSearchConfig"-->
<!--        :loading="loading"-->
<!--        @search="handleSearch"-->
<!--        @reset="handleResetSearch"-->
<!--        @clear-all="handleClearAllSearch"-->
<!--        @mode-change="handleSearchModeChange"-->
<!--        @params-change="handleSearchParamsChange"-->
<!--        @preset-save="handlePresetSave"-->
<!--        class="mb-4"-->
<!--      />-->
      <CleverForm  :schemas="searchConfig.schemas" :inline="true" :showActionButtonGroup="true" :showAdvancedButton="true"></CleverForm>
    </NCard>
    <NCard>
      <NSpace vertical>
        <!-- 表头操作 -->
        <NSpace v-if="shouldShowHeaderActions" class="mb-4">
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
              v-if="
                props.apiConfig?.batchDeleteApi && checkedRowKeys.length > 0
              "
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
        </NSpace>

        <!-- 数据表格 -->

        <NDataTable v-bind="tableProps" />

        <!-- 分页 -->
        <NSpace v-if="paginationProps" justify="end">
          <NPagination v-bind="paginationProps" />
        </NSpace>
      </NSpace>
    </NCard>
    <!-- 表单弹窗 -->
    <CleverForm
      v-if="formConfig"
      ref="formPopupRef"
      :schemas="formConfig.schemas"
      :is-popup="true"
      :disabled="formPopupDisabled"
      :popup-option="{
        title: formConfig.title || '表单',
        width: formConfig.width || '600px',
        ...formConfig.popupProps
      }"
      @submit="handleFormSave"
    />
  </NSpace>
</template>
<script setup lang="ts">
import { computed, h, ref } from 'vue'
import {
  NDataTable,
  NPagination,
  NSpace,
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NIcon
} from 'naive-ui'
import {
  ChevronDownOutline,
  ChevronUpOutline,
  AddOutline,
  TrashOutline
} from '@vicons/ionicons5'
import CleverSearch from './components/CleverSearch.vue'
import CleverForm from '../../clever-form/index.vue'
import { useTable } from './hook/use-table'
import defaultCleverTableProps from './default-props'
import { FormMode } from './types'
import type { CleverTableMethods, CleverTableProps } from './types'
import type {
  EnhancedSearchConfig,
  SearchMode,
  SearchPreset
} from './types/search'

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

// 导入必要的依赖
import { useMessage, useDialog } from 'naive-ui'

const {
  tableData,
  loading,
  searchParams,
  pagination,
  checkedRowKeys,
  searchCollapsed,
  processedColumns,
  handleRefresh,
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
}: Record<string, any> = useTable(
  { ...props, onFormOpen: handleOpenForm } as CleverTableProps,
  emit
)

const formPopupRef = ref()
const formPopupDisabled = ref<boolean>(false)
const searchRef = ref()

// 增强搜索配置
const enhancedSearchConfig = computed<EnhancedSearchConfig>(() => {
  const baseConfig = props.searchConfig || {}

  return {
    // 基础配置
    schemas: baseConfig.schemas || [],
    show: baseConfig.show ?? true,
    collapsible: baseConfig.collapsible ?? false,

    // 性能优化配置
    debounce: {
      enabled: true,
      delay: 300
    },
    cache: {
      enabled: true,
      maxSize: 50,
      ttl: 5 * 60 * 1000 // 5分钟
    },

    // 快速搜索配置
    quickSearch: {
      enabled: true,
      placeholder: '请输入关键词快速搜索',
      field: 'keyword',
      realtime: false,
      suggestions: []
    },

    // 高级搜索配置
    advancedSearch: {
      enabled: baseConfig.schemas && baseConfig.schemas.length > 4,
      schemas: baseConfig.schemas || []
    },

    // 搜索预设配置
    presets: {
      enabled: true,
      allowSave: true,
      list: []
    },

    // 搜索历史配置
    history: {
      enabled: true,
      maxCount: 10,
      showInDropdown: true
    },

    // 搜索导出配置
    export: {
      enabled: true,
      formats: ['json', 'csv', 'url']
    },

    // UI配置
    ui: {
      showSearchStatus: true,
      showResultStats: true,
      showActiveConditions: true,
      showClearAll: true,
      emptyResultTip: '未找到匹配的结果，请尝试调整搜索条件'
    },

    // 文本配置
    text: {
      searchText: baseConfig.searchText || '搜索',
      resetText: baseConfig.resetText || '重置',
      clearAllText: '清空所有',
      expandText: baseConfig.expandText || '展开',
      collapseText: baseConfig.collapseText || '收起',
      simpleSearchText: '简单搜索',
      quickSearchText: '快速搜索',
      advancedSearchText: '高级搜索',
      quickSearchPlaceholder: '请输入关键词搜索',
      savePresetText: '保存搜索预设'
    }
  }
})

// 自定义的表单打开方法
async function handleOpenForm(mode: FormMode, record?: any) {
  if (!props.formConfig || !formPopupRef.value) {
    console.warn('表单配置或表单引用不存在')
    return
  }

  try {
    formPopupDisabled.value = mode == 'detail'
    // 打开表单弹窗
    formPopupRef.value.open(record)

    // 触发表单打开事件
    emit('form-open', record)
  } catch (error) {
    console.error('打开表单失败:', error)
    const message = useMessage()
    message.error('打开表单失败')
  }
}

// 处理表单保存
async function handleFormSave(formData: any) {
  if (!props.formConfig) return

  // 判断是否为编辑模式（如果有 id 字段则认为是编辑）
  const idField = props.rowKey || 'id'
  const isEdit = !!formData[idField]

  try {
    const success = await handleSave(formData, isEdit)
    if (success) {
      // 保存成功，关闭弹窗
      formPopupRef.value?.hidePopup()
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

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
  const hasBatchDeleteButton = !!(
    props.apiConfig?.batchDeleteApi && checkedRowKeys.value.length > 0
  )

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

// 处理清空所有搜索条件
function handleClearAllSearch() {
  handleResetSearch()
  emit('search-clear-all')
}

// 处理搜索模式变化
function handleSearchModeChange(mode: SearchMode) {
  emit('search-mode-change', mode)
}

// 处理搜索参数变化
function handleSearchParamsChange(params: Record<string, any>) {
  emit('search-params-change', params)
}

// 处理搜索预设保存
function handlePresetSave(preset: SearchPreset) {
  emit('search-preset-save', preset)
}

// 暴露方法
const methods: CleverTableMethods = {
  handleRefresh,
  handleOpenForm, // 使用我们自定义的方法
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
