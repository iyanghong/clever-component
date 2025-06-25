<template>
  <div class="table-actions flex gap-2">
    <ActionButton
      v-for="action in visibleActions"
      :key="action.key"
      :label="action.label"
      :type="action.type"
      :size="action.size"
      :ghost="action.ghost"
      :disabled="getActionDisabled(action)"
      :icon="action.icon"
      :confirm="action.confirm"
      @click="handleActionClick(action)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActionButton from './ActionButton.vue'
import type { TableAction } from '../types'

interface Props {
  actions: TableAction[]
  record: any
  index: number
}

interface Emits {
  actionClick: [action: TableAction, record: any, index: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算可见的操作按钮
const visibleActions = computed(() => {
  return props.actions.filter(action => {
    if (typeof action.show === 'function') {
      return action.show(props.record)
    }
    return action.show !== false
  })
})

// 获取操作按钮的禁用状态
function getActionDisabled(action: TableAction): boolean {
  if (typeof action.disabled === 'function') {
    return action.disabled(props.record)
  }
  return action.disabled || false
}

// 处理操作点击
function handleActionClick(action: TableAction) {
  // 调用操作的处理函数
  const handler = action.handler || action.onClick
  handler?.(props.record, props.index)
  
  // 触发事件
  emit('actionClick', action, props.record, props.index)
}
</script>

<style scoped>
.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>