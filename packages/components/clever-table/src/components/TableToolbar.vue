<template>
  <div class="table-toolbar flex justify-between items-center mb-4">
    <!-- 左侧操作按钮 -->
    <div class="toolbar-left flex gap-2">
      <slot name="left">
        <!-- 自定义操作按钮 -->
        <ActionButton
          v-for="action in headerActions"
          :key="action.key"
          :label="action.label"
          :type="action.type"
          :icon="action.icon"
          :disabled="getHeaderActionDisabled(action)"
          @click="handleHeaderActionClick(action)"
        />

        <!-- 默认新增按钮 -->
        <ActionButton
          v-if="showAddButton"
          label="新增"
          type="primary"
          :icon="AddOutline"
          @click="$emit('add')"
        />

        <!-- 批量删除按钮 -->
        <ActionButton
          v-if="showBatchDelete && hasCheckedRows"
          label="批量删除"
          type="error"
          :icon="TrashOutline"
          :confirm="{
            title: '确认批量删除',
            content: `确定要删除选中的 ${checkedCount} 条记录吗？删除后无法恢复。`
          }"
          @click="$emit('batchDelete')"
        />
      </slot>
    </div>

    <!-- 右侧工具按钮 -->
    <div class="toolbar-right flex gap-2">
      <slot name="right">
        <!-- 刷新按钮 -->
        <ActionButton
          v-if="showRefresh"
          label="刷新"
          type="default"
          :icon="RefreshOutline"
          @click="$emit('refresh')"
        />

        <!-- 表格样式切换 -->
        <NTooltip v-if="showStyleToggle">
          <template #trigger>
            <NButton
              size="small"
              :type="striped ? 'primary' : 'default'"
              @click="$emit('toggleStriped')"
            >
              <template #icon>
                <NIcon>
                  <GridOutline />
                </NIcon>
              </template>
            </NButton>
          </template>
          {{ striped ? '取消斑马纹' : '开启斑马纹' }}
        </NTooltip>

        <NTooltip v-if="showStyleToggle">
          <template #trigger>
            <NButton
              size="small"
              :type="bordered ? 'primary' : 'default'"
              @click="$emit('toggleBordered')"
            >
              <template #icon>
                <NIcon>
                  <AppsOutline />
                </NIcon>
              </template>
            </NButton>
          </template>
          {{ bordered ? '取消边框' : '显示边框' }}
        </NTooltip>

        <!-- 列设置 -->
        <NPopover trigger="click" placement="bottom-end" :show-arrow="false">
          <template #trigger>
            <ActionButton
              label="列设置"
              :icon="SettingsOutline"
              type="default"
              size="small"
            />
          </template>
          <slot name="column-settings" />
        </NPopover>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon, NTooltip, NPopover } from 'naive-ui'
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

import ActionButton from './ActionButton.vue'
import type { HeaderAction } from '../types'

interface Props {
  headerActions?: HeaderAction[]
  showAdd?: boolean
  showBatchDelete?: boolean
  checkedCount?: number
  checkedRowKeys?: (string | number)[]
  striped?: boolean
  bordered?: boolean
  showStyleToggle?: boolean
  showRefresh?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerActions: () => [],
  showAdd: false,
  showBatchDelete: false,
  checkedCount: 0,
  checkedRowKeys: () => [],
  striped: false,
  bordered: false,
  showStyleToggle: true,
  showRefresh: true
})

interface Emits {
  add: []
  batchDelete: []
  refresh: []
  toggleStriped: []
  toggleBordered: []
  headerActionClick: [action: HeaderAction]
}

const emit = defineEmits<Emits>()

// 是否显示新增按钮
const showAddButton = computed(() => {
  return props.showAdd
})

// 是否有选中的行
const hasCheckedRows = computed(() => {
  return props.checkedRowKeys.length > 0
})

// 获取头部操作按钮的禁用状态
function getHeaderActionDisabled(action: HeaderAction): boolean {
  if (typeof action.disabled === 'function') {
    return action.disabled(props.checkedRowKeys)
  }
  return action.disabled || false
}

// 处理头部操作点击
function handleHeaderActionClick(action: HeaderAction) {
  const handler = action.handler || action.onClick
  handler?.(props.checkedRowKeys)
  emit('headerActionClick', action)
}
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
