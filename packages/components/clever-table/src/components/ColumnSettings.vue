<template>
  <div class="column-settings">
    <div class="column-settings-header mb-3">
      <span class="text-sm font-medium">列设置</span>
      <div class="flex gap-2">
        <NButton size="tiny" @click="selectAll">全选</NButton>
        <NButton size="tiny" @click="selectNone">全不选</NButton>
        <NButton size="tiny" @click="resetOrder">重置</NButton>
      </div>
    </div>
    
    <div class="mb-3">
      <NCheckbox :checked="props.showLeftUnchecked" @update:checked="toggleLeftUnchecked">
        <span class="text-sm">显示未选中列在左侧</span>
      </NCheckbox>
    </div>
    
    <div ref="sortableContainer" class="column-list">
      <div
        v-for="column in sortableColumns"
        :key="column.key"
        :data-key="column.key"
        class="column-item"
      >
        <div class="column-item-content">
          <!-- 拖拽手柄 -->
          <div class="drag-handle cursor-move">
            <NIcon size="14">
              <ReorderThreeOutline />
            </NIcon>
          </div>
          
          <!-- 列显示复选框 -->
          <NCheckbox
            :checked="column.visible"
            :disabled="!column.hideable"
            @update:checked="(checked) => handleColumnToggle(column.key, checked)"
          >
            <span class="column-title">{{ column.title }}</span>
          </NCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { NButton, NIcon, NCheckbox } from 'naive-ui'
import { ReorderThreeOutline } from '@vicons/ionicons5'
import Sortable from 'sortablejs'
import type { TableColumn } from '../types'

interface ColumnItem {
  key: string
  title: string
  visible: boolean
  hideable: boolean
  order: number
}

interface Props {
  columns: TableColumn[]
  visibleColumns: string[]
  columnOrder: string[]
  showLeftUnchecked?: boolean
}

interface Emits {
  updateVisible: [columns: string[]]
  updateOrder: [order: string[]]
  toggleLeftUnchecked: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const sortableContainer = ref<HTMLElement>()
let sortableInstance: Sortable | null = null

// 可排序的列数据
const sortableColumns = computed<ColumnItem[]>(() => {
  const orderMap = new Map(props.columnOrder.map((key, index) => [key, index]))
  
  return props.columns
    .filter(col => col.key && col.key !== 'selection' && col.key !== 'index')
    .map(col => ({
      key: col.key!,
      title: col.title || col.key!,
      visible: props.visibleColumns.includes(col.key!),
      hideable: col.hideable !== false,
      order: orderMap.get(col.key!) ?? 999
    }))
    .sort((a, b) => a.order - b.order)
})

// 初始化拖拽排序
function initSortable() {
  if (!sortableContainer.value) return
  
  sortableInstance = new Sortable(sortableContainer.value, {
    handle: '.drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: (evt) => {
      if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
        const newOrder = [...props.columnOrder]
        const [movedItem] = newOrder.splice(evt.oldIndex, 1)
        newOrder.splice(evt.newIndex, 0, movedItem)
        emit('updateOrder', newOrder)
      }
    }
  })
}

// 销毁拖拽排序
function destroySortable() {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
}

// 处理列显示切换
function handleColumnToggle(key: string, checked: boolean) {
  const newVisible = checked
    ? [...props.visibleColumns, key]
    : props.visibleColumns.filter(k => k !== key)
  
  emit('updateVisible', newVisible)
}

// 全选
function selectAll() {
  const allKeys = sortableColumns.value
    .filter(col => col.hideable)
    .map(col => col.key)
  emit('updateVisible', allKeys)
}

// 全不选
function selectNone() {
  const requiredKeys = sortableColumns.value
    .filter(col => !col.hideable)
    .map(col => col.key)
  emit('updateVisible', requiredKeys)
}

// 重置排序
function resetOrder() {
  const defaultOrder = props.columns
    .filter(col => col.key && col.key !== 'selection' && col.key !== 'index')
    .map(col => col.key!)
  emit('updateOrder', defaultOrder)
}

// 切换显示未选中列在左侧
function toggleLeftUnchecked() {
  emit('toggleLeftUnchecked')
}

// 监听列变化，重新初始化排序
watch(
  () => props.columns.length,
  () => {
    destroySortable()
    setTimeout(initSortable, 0)
  }
)

onMounted(() => {
  setTimeout(initSortable, 0)
})

onUnmounted(() => {
  destroySortable()
})
</script>

<style scoped>
.column-settings {
  min-width: 200px;
  max-width: 300px;
  padding: 12px;
}

.column-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.column-list {
  max-height: 300px;
  overflow-y: auto;
}

.column-item {
  margin-bottom: 8px;
}

.column-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.column-item-content:hover {
  background-color: var(--n-color-hover);
}

.drag-handle {
  display: flex;
  align-items: center;
  color: var(--n-text-color-disabled);
  cursor: move;
}

.column-title {
  font-size: 13px;
}

/* Sortable样式 */
:deep(.sortable-ghost) {
  opacity: 0.5;
}

:deep(.sortable-chosen) {
  background-color: var(--n-color-pressed);
}

:deep(.sortable-drag) {
  background-color: var(--n-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>