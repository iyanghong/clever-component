<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import CleverDataTable from './src/data-table.vue'
import defaultCleverDataTableProps from './src/default-props'
import type { CleverDataTableMethods } from './src/types'

const cleverDataTableRef = ref<CleverDataTableMethods>()
const attrs = useAttrs()
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

// 获取合并后的属性
const getProps = computed(() => {
  return { ...props, ...attrs }
})

// 刷新表格数据
function handleRefresh() {
  return cleverDataTableRef.value?.handleRefresh()
}

// 打开表单
function handleOpenForm(record?: any) {
  return cleverDataTableRef.value?.handleOpenForm(record)
}

// 删除数据
function handleDelete(record: any) {
  return cleverDataTableRef.value?.handleDelete(record)
}

// 批量删除
function handleBatchDelete() {
  return cleverDataTableRef.value?.handleBatchDelete()
}

// 设置选中行
function setCheckedRowKeys(keys: (string | number)[]) {
  return cleverDataTableRef.value?.setCheckedRowKeys(keys)
}

// 获取选中行
function getCheckedRowKeys(): (string | number)[] {
  return cleverDataTableRef.value?.getCheckedRowKeys() || []
}

// 更新搜索参数
function updateSearchParams(params: any) {
  return cleverDataTableRef.value?.updateSearchParams(params)
}

// 获取表格数据
function getTableData(): any[] {
  return cleverDataTableRef.value?.getTableData() || []
}

// 设置表格数据
function setTableData(data: any[]) {
  return cleverDataTableRef.value?.setTableData(data)
}

// 创建数据
function handleCreate() {
  return cleverDataTableRef.value?.handleCreate()
}

// 编辑数据
function handleEdit(record: any) {
  return cleverDataTableRef.value?.handleEdit(record)
}

// 暴露方法
defineExpose({
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
})
</script>

<template>
  <CleverDataTable
    ref="cleverDataTableRef"
    v-bind="getProps"
    @update:checked-row-keys="emit('update:checkedRowKeys', $event)"
    @action-click="emit('action-click', $event)"
    @header-action-click="emit('header-action-click', $event)"
    @row-click="emit('row-click', $event)"
    @selection-change="emit('selection-change', $event)"
    @form-submit="emit('form-submit', $event)"
    @form-cancel="emit('form-cancel')"
    @data-change="emit('data-change', $event)"
  />
</template>

<style scoped></style>