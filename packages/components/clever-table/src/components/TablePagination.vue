<template>
  <div v-if="showPagination" class="table-pagination mt-4">
    <NPagination
      v-model:page="currentPage"
      v-model:page-size="currentPageSize"
      :total="total"
      :page-sizes="pageSizes"
      :show-size-picker="showSizePicker"
      :show-quick-jumper="showQuickJumper"
      :disabled="disabled"
      show-size-picker
      show-quick-jumper
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    >
      <template #prefix>
        <span class="text-sm text-gray-500">
          共 {{ total }} 条记录
        </span>
      </template>
    </NPagination>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NPagination } from 'naive-ui'

interface Props {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  showSizePicker?: boolean
  showQuickJumper?: boolean
  disabled?: boolean
  show?: boolean
}

interface Emits {
  updatePage: [page: number]
  updatePageSize: [pageSize: number]
  change: [page: number, pageSize: number]
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
  showSizePicker: true,
  showQuickJumper: true,
  disabled: false,
  show: true
})

const emit = defineEmits<Emits>()

// 当前页码
const currentPage = computed({
  get: () => props.page,
  set: (value) => emit('updatePage', value)
})

// 当前页大小
const currentPageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit('updatePageSize', value)
})

// 是否显示分页
const showPagination = computed(() => {
  return props.show && props.total > 0
})

// 处理页码变化
function handlePageChange(page: number) {
  emit('updatePage', page)
  emit('change', page, props.pageSize)
}

// 处理页大小变化
function handlePageSizeChange(pageSize: number) {
  emit('updatePageSize', pageSize)
  emit('change', props.page, pageSize)
}
</script>

<style scoped>
.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

:deep(.n-pagination-prefix) {
  margin-right: 16px;
}
</style>