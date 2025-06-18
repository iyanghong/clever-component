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
  />
</template>

<style scoped></style>