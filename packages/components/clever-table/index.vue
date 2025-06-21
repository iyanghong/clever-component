<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import CleverTable from './src/table.vue'
import defaultCleverTableProps from './src/default-props'
import type { CleverTableMethods } from './src/types'


const cleverTableRef = ref<CleverTableMethods>()
const attrs = useAttrs()
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

// 获取合并后的属性
const getProps = computed(() => {
  return { ...props, ...attrs }
})

// 刷新表格数据
function handleRefresh() {
  return cleverTableRef.value?.handleRefresh()
}

// 打开表单
function handleOpenForm(record?: any) {
  return cleverTableRef.value?.handleOpenForm(record)
}

// 删除数据
function handleDelete(record: any) {
  return cleverTableRef.value?.handleDelete(record)
}

// 批量删除数据
function handleBatchDelete(records: any[]) {
  return cleverTableRef.value?.handleBatchDelete(records)
}

// 保存数据
function handleSave(data: any, isEdit?: boolean) {
  return cleverTableRef.value?.handleSave(data, isEdit)
}

// 设置选中行
function setCheckedRowKeys(keys: (string | number)[]) {
  return cleverTableRef.value?.setCheckedRowKeys(keys)
}

// 获取选中行
function getCheckedRowKeys(): (string | number)[] {
  return cleverTableRef.value?.getCheckedRowKeys() || []
}

// 更新搜索参数
function updateSearchParams(params: any) {
  return cleverTableRef.value?.updateSearchParams(params)
}

// 获取表格数据
function getTableData(): any[] {
  return cleverTableRef.value?.getTableData() || []
}

// 设置表格数据
function setTableData(data: any[]) {
  return cleverTableRef.value?.setTableData(data)
}

// 暴露方法
defineExpose({
  handleRefresh,
  handleOpenForm,
  handleDelete,
  handleBatchDelete,
  handleSave,
  setCheckedRowKeys,
  getCheckedRowKeys,
  updateSearchParams,
  getTableData,
  setTableData
})
</script>

<template>
  <CleverTable
    ref="cleverTableRef"
    v-bind="getProps"
    @update:checked-row-keys="emit('update:checkedRowKeys', $event)"
    @action-click="emit('action-click', $event)"
    @header-action-click="emit('header-action-click', $event)"
    @row-click="emit('row-click', $event)"
    @selection-change="emit('selection-change', $event)"
    @form-open="emit('form-open', $event)"
    @save-success="emit('save-success', $event)"
    @save-error="emit('save-error', $event)"
    @delete-success="emit('delete-success', $event)"
    @delete-error="emit('delete-error', $event)"
  />
</template>

<style scoped></style>