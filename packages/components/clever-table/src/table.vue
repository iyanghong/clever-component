<template>
  <NSpace class="clever-table" vertical>
    <!-- 搜索组件 -->
    <NCard>
      <CleverForm
        :schemas="searchConfig.schemas"
        :onlyShowOneRow="true"
        :showActionButtonGroup="true"
        :showAdvancedButton="true"
        submit-button-text="搜索"
        @submit="handleRefresh"
      ></CleverForm>
    </NCard>
    <NCard>
      <NSpace vertical>
        <!-- 表头操作 -->
        <NSpace class="mb-4" justify="space-between" align="center">
          <NSpace>
            <template v-if="shouldShowHeaderActions">
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
            </template>
          </NSpace>

          <!-- 表格工具栏 -->
          <NSpace justify="end" align="center">
            <!-- 刷新按钮 -->
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton
                  text
                  type="primary"
                  size="small"
                  @click="handleTableRefresh"
                >
                  <template #icon>
                    <NIcon>
                      <RefreshOutline />
                    </NIcon>
                  </template>
                </NButton>
              </template>
              刷新数据
            </NTooltip>

            <!-- 斑马纹切换 -->
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton
                  text
                  :type="tableStriped ? 'primary' : 'default'"
                  size="small"
                  @click="toggleTableStriped"
                >
                  <template #icon>
                    <NIcon>
                      <GridOutline />
                    </NIcon>
                  </template>
                </NButton>
              </template>
              {{ tableStriped ? '取消斑马纹' : '显示斑马纹' }}
            </NTooltip>

            <!-- 边框切换 -->
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton
                  text
                  :type="tableBordered ? 'primary' : 'default'"
                  size="small"
                  @click="toggleTableBordered"
                >
                  <template #icon>
                    <NIcon>
                      <AppsOutline />
                    </NIcon>
                  </template>
                </NButton>
              </template>
              {{ tableBordered ? '取消边框' : '显示边框' }}
            </NTooltip>

            <!-- 列设置 -->
            <NDropdown
              trigger="click"
              :options="columnSettingsOptions"
              placement="bottom-end"
            >
              <NTooltip trigger="hover">
                <template #trigger>
                  <NButton text type="primary" size="small">
                    <template #icon>
                      <NIcon>
                        <SettingsOutline />
                      </NIcon>
                    </template>
                  </NButton>
                </template>
                列设置
              </NTooltip>
            </NDropdown>
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
import { computed, h, ref, nextTick } from 'vue'
import {
  NDataTable,
  NPagination,
  NSpace,
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NIcon,
  NTooltip,
  NDropdown,
  NCheckbox,
  NCheckboxGroup,
  NDivider
} from 'naive-ui'
import Sortable from 'sortablejs'
import type { SortableEvent } from 'sortablejs'
import {
  ChevronDownOutline,
  ChevronUpOutline,
  AddOutline,
  TrashOutline,
  CreateOutline,
  EyeOutline,
  RefreshOutline,
  SettingsOutline,
  GridOutline,
  AppsOutline
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

// 表格工具栏状态
const tableStriped = ref(props.striped)
const tableBordered = ref(props.bordered)
const visibleColumns = ref<string[]>([])
const columnSettingsVisible = ref(false)
const columnOrder = ref<string[]>([])
const sortableInstance = ref<Sortable | null>(null)

// 初始化可见列和列顺序
const initVisibleColumns = () => {
  const allColumns = props.columns
    .filter(col => col.key)
    .map(col => col.key as string)
    .filter(Boolean)

  visibleColumns.value = props.columns
    .filter(col => col.show !== false)
    .map(col => col.key as string)
    .filter(Boolean)

  columnOrder.value = allColumns
}

// 初始化时设置可见列
initVisibleColumns()

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

// 计算属性：过滤后的列配置（按照排序顺序）
const filteredColumns = computed(() => {
  // 先按照columnOrder排序，然后过滤可见列
  const orderedColumns = columnOrder.value
    .map(key => processedColumns.value.find(col => col.key === key))
    .filter(Boolean)

  // 添加没有key或不在order中的列
  const remainingColumns = processedColumns.value.filter(
    col => !col.key || !columnOrder.value.includes(col.key as string)
  )

  const allOrderedColumns = [...orderedColumns, ...remainingColumns]

  // 获取可见列
  const visibleOrderedColumns = allOrderedColumns.filter(col => {
    if (!col.key) return true
    return visibleColumns.value.includes(col.key as string)
  })
  
  // 如果启用了显示左边未勾选列
  if (showLeftUncheckedColumns.value) {
    // 获取未勾选的列
    const uncheckedColumns = allOrderedColumns.filter(col => {
      return col.key && !visibleColumns.value.includes(col.key as string)
    }).map(col => ({
      ...col,
      fixed: 'left' as const, // 固定到左侧
      className: 'unchecked-column' // 添加样式类名用于区分
    }))
    
    // 将未勾选的列放在最前面
    return [...uncheckedColumns, ...visibleOrderedColumns]
  }
  
  return visibleOrderedColumns
})

// 计算属性：表格属性
const tableProps = computed(() => {
  return {
    columns: filteredColumns.value,
    data: tableData.value,
    loading: loading.value,
    bordered: tableBordered.value,
    striped: tableStriped.value,
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

// 表格工具栏操作方法
function handleTableRefresh() {
  handleRefresh()
}

function toggleTableStriped() {
  tableStriped.value = !tableStriped.value
}

function toggleTableBordered() {
  tableBordered.value = !tableBordered.value
}

function handleColumnSettingsChange(value: string[]) {
  visibleColumns.value = value
}

function resetColumnSettings() {
  initVisibleColumns()
}

// 初始化拖拽排序
const initSortable = (element: HTMLElement) => {
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }

  sortableInstance.value = new Sortable(element, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: (evt: SortableEvent) => {
      const { oldIndex, newIndex } = evt
      if (
        oldIndex !== undefined &&
        newIndex !== undefined &&
        oldIndex !== newIndex
      ) {
        const newOrder = [...columnOrder.value]
        const [movedItem] = newOrder.splice(oldIndex, 1)
        newOrder.splice(newIndex, 0, movedItem)
        columnOrder.value = newOrder
      }
    }
  })
}

// 处理列顺序重置
function resetColumnOrder() {
  columnOrder.value = props.columns
    .filter(col => col.key)
    .map(col => col.key as string)
    .filter(Boolean)
}

// 列设置选项（按照当前排序顺序）
const columnOptions = computed(() => {
  const orderedOptions = columnOrder.value
    .map(key => {
      const col = props.columns.find(c => c.key === key)
      if (col && col.hideable !== false) {
        return {
          label: col.title || col.key,
          value: col.key as string
        }
      }
      return null
    })
    .filter(Boolean)

  return orderedOptions
})

// 显示左边未勾选列的状态
const showLeftUncheckedColumns = ref(false)

// 切换显示左边未勾选列
function toggleShowLeftUncheckedColumns() {
  showLeftUncheckedColumns.value = !showLeftUncheckedColumns.value
}

// 列设置下拉菜单选项
const columnSettingsOptions = computed(() => {
  return [
    {
      type: 'render',
      key: 'column-settings',
      render: () =>
        h(
          'div',
          {
            style: {
              padding: '12px',
              minWidth: '240px'
            }
          },
          [
            h(
              'div',
              {
                style: {
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }
              },
              '列设置'
            ),
            h(NDivider, { style: { margin: '8px 0' } }),
            h(
              'div',
              {
                style: {
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'var(--n-text-color-disabled)'
                }
              },
              '拖拽调整列顺序，勾选控制列显示'
            ),
            // 显示左边未勾选列的开关
            h(
              'div',
              {
                style: {
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }
              },
              [
                h(
                  NCheckbox,
                  {
                    checked: showLeftUncheckedColumns.value,
                    onUpdateChecked: toggleShowLeftUncheckedColumns,
                    style: {
                      fontSize: '12px'
                    }
                  },
                  {
                    default: () => '显示左边未勾选列（固定左侧）'
                  }
                )
              ]
            ),
            h(
              'div',
              {
                ref: el => {
                  if (el) {
                    nextTick(() => {
                      initSortable(el as HTMLElement)
                    })
                  }
                },
                class: 'column-sortable-list'
              },
              columnOptions.value.map(option =>
                h(
                  'div',
                  {
                    key: option.value,
                    class: 'column-sortable-item',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 8px',
                      marginBottom: '2px',
                      backgroundColor: 'var(--n-color-embedded)',
                      borderRadius: '4px',
                      cursor: 'move',
                      userSelect: 'none'
                    }
                  },
                  [
                    h(
                      'div',
                      {
                        style: {
                          marginRight: '8px',
                          color: 'var(--n-text-color-disabled)',
                          fontSize: '12px'
                        }
                      },
                      '⋮⋮'
                    ),
                    h(
                      NCheckbox,
                      {
                        checked: visibleColumns.value.includes(option.value),
                        onUpdateChecked: (checked: boolean) => {
                          if (checked) {
                            if (!visibleColumns.value.includes(option.value)) {
                              visibleColumns.value = [
                                ...visibleColumns.value,
                                option.value
                              ]
                            }
                          } else {
                            visibleColumns.value = visibleColumns.value.filter(
                              v => v !== option.value
                            )
                          }
                        },
                        style: {
                          flex: 1
                        }
                      },
                      {
                        default: () => option.label
                      }
                    )
                  ]
                )
              )
            ),
            h(NDivider, { style: { margin: '12px 0 8px 0' } }),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between'
                }
              },
              [
                h(
                  NButton,
                  {
                    size: 'small',
                    onClick: resetColumnOrder
                  },
                  () => '重置顺序'
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    onClick: resetColumnSettings
                  },
                  () => '重置显示'
                )
              ]
            )
          ]
        )
    }
  ]
})

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

.header-actions {
  margin-bottom: 16px;
}

.table-toolbar {
  margin-bottom: 8px;
  padding: 8px 0;
}

.clever-table :deep(.n-data-table-th) {
  background-color: var(--n-th-color);
}

/* 边框样式 - 使用边框折叠模式避免宽度问题 */
.clever-table :deep(.n-data-table--bordered) {
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--n-border-color);
}

.clever-table :deep(.n-data-table--bordered .n-data-table-td),
.clever-table :deep(.n-data-table--bordered .n-data-table-th) {
  border-right: 1px solid var(--n-border-color);
  border-bottom: 1px solid var(--n-border-color);
  box-sizing: border-box;
  padding: 11.5px 12px;
}

.clever-table :deep(.n-data-table--bordered .n-data-table-td:last-child),
.clever-table :deep(.n-data-table--bordered .n-data-table-th:last-child) {
  border-right: none;
}

.clever-table
  :deep(.n-data-table--bordered .n-data-table-tr:last-child .n-data-table-td) {
  border-bottom: none;
}

/* 确保表格容器不会被撑大 */
.clever-table :deep(.n-data-table--bordered .n-data-table-wrapper) {
  overflow: hidden;
}

.clever-table :deep(.n-data-table--bordered .n-data-table-base-table) {
  width: 100%;
  table-layout: fixed;
}

/* 列设置拖拽样式 */
.column-sortable-list {
  max-height: 300px;
  overflow-y: auto;
}

.column-sortable-item {
  transition: all 0.2s ease;
}

.column-sortable-item:hover {
  background-color: var(--n-color-embedded-popover) !important;
  transform: translateX(2px);
}

/* 未勾选列的样式 */
:deep(.unchecked-column) {
  background-color: var(--n-color-warning-light) !important;
  opacity: 0.7;
}

:deep(.unchecked-column .n-data-table-th) {
  background-color: var(--n-color-warning-light) !important;
  border-right: 2px solid var(--n-color-warning) !important;
}

:deep(.unchecked-column .n-data-table-td) {
  background-color: var(--n-color-warning-light) !important;
  border-right: 2px solid var(--n-color-warning) !important;
}

/* Sortable.js 拖拽样式 */
.sortable-ghost {
  opacity: 0.5;
  background-color: var(--n-color-primary) !important;
  transform: rotate(2deg);
}

.sortable-chosen {
  background-color: var(--n-color-primary-hover) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sortable-drag {
  background-color: var(--n-color-primary) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: rotate(3deg);
}
</style>
