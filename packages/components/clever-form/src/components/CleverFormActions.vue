<template>
  <div
    v-if="showActionGroup"
    class="clever-form-actions"
    :class="actionClass"
    :style="actionStyle"
  >
    <NSpace :justify="justify" :wrap="wrap" :size="size">
      <!-- 重置按钮 -->
      <NButton
        v-if="showReset"
        v-bind="resetButtonProps"
        @click="handleReset"
      >
        {{ resetText }}
      </NButton>
      
      <!-- 提交按钮 -->
      <NButton
        v-if="showSubmit"
        v-bind="submitButtonProps"
        @click="handleSubmit"
      >
        {{ submitText }}
      </NButton>
      
      <!-- 展开/收起按钮 -->
      <NButton
        v-if="showToggle"
        v-bind="toggleButtonProps"
        @click="handleToggle"
      >
        {{ toggleText }}
        <template #icon>
          <NIcon>
            <component :is="toggleIcon" />
          </NIcon>
        </template>
      </NButton>
      
      <!-- 自定义操作按钮 -->
      <template v-if="customActions?.length">
        <NButton
          v-for="(action, index) in customActions"
          :key="action.key || index"
          v-bind="action.props"
          @click="handleCustomAction(action, index)"
        >
          {{ action.text }}
          <template v-if="action.icon" #icon>
            <NIcon>
              <component :is="action.icon" />
            </NIcon>
          </template>
        </NButton>
      </template>
      
      <!-- 自定义插槽 -->
      <slot name="actions" :methods="{ reset: handleReset, submit: handleSubmit, toggle: handleToggle }" />
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import type { ButtonProps } from 'naive-ui'

// ============= 类型定义 =============

interface CustomAction {
  /** 唯一标识 */
  key?: string
  /** 按钮文本 */
  text: string
  /** 按钮图标 */
  icon?: any
  /** 按钮属性 */
  props?: ButtonProps
  /** 点击处理函数 */
  onClick?: (action: CustomAction, index: number) => void
}

interface Props {
  /** 是否显示操作按钮组 */
  showActionGroup?: boolean
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 是否显示提交按钮 */
  showSubmit?: boolean
  /** 是否显示展开/收起按钮 */
  showToggle?: boolean
  /** 重置按钮文本 */
  resetText?: string
  /** 提交按钮文本 */
  submitText?: string
  /** 展开按钮文本 */
  expandText?: string
  /** 收起按钮文本 */
  collapseText?: string
  /** 重置按钮属性 */
  resetButtonProps?: ButtonProps
  /** 提交按钮属性 */
  submitButtonProps?: ButtonProps
  /** 展开/收起按钮属性 */
  toggleButtonProps?: ButtonProps
  /** 是否展开状态 */
  expanded?: boolean
  /** 自定义操作按钮 */
  customActions?: CustomAction[]
  /** 按钮对齐方式 */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  /** 是否换行 */
  wrap?: boolean
  /** 按钮间距 */
  size?: number | 'small' | 'medium' | 'large'
  /** 容器类名 */
  class?: string | string[] | Record<string, boolean>
  /** 容器样式 */
  style?: string | Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  showActionGroup: true,
  showReset: true,
  showSubmit: true,
  showToggle: false,
  resetText: '重置',
  submitText: '提交',
  expandText: '展开',
  collapseText: '收起',
  expanded: false,
  justify: 'start',
  wrap: true,
  size: 'medium'
})

// ============= 事件定义 =============

interface Emits {
  /** 重置事件 */
  reset: []
  /** 提交事件 */
  submit: []
  /** 展开/收起切换事件 */
  toggle: [expanded: boolean]
  /** 自定义操作事件 */
  customAction: [action: CustomAction, index: number]
}

const emit = defineEmits<Emits>()

// ============= 计算属性 =============

/** 操作按钮组类名 */
const actionClass = computed(() => {
  const classes = ['clever-form-actions']
  
  if (props.class) {
    if (typeof props.class === 'string') {
      classes.push(props.class)
    } else if (Array.isArray(props.class)) {
      classes.push(...props.class)
    } else {
      Object.entries(props.class).forEach(([key, value]) => {
        if (value) classes.push(key)
      })
    }
  }
  
  return classes
})

/** 操作按钮组样式 */
const actionStyle = computed(() => {
  if (typeof props.style === 'string') {
    return props.style
  }
  return props.style || {}
})

/** 展开/收起按钮文本 */
const toggleText = computed(() => {
  return props.expanded ? props.collapseText : props.expandText
})

/** 展开/收起按钮图标 */
const toggleIcon = computed(() => {
  return props.expanded ? ChevronUpOutline : ChevronDownOutline
})

// ============= 事件处理 =============

/** 处理重置 */
const handleReset = () => {
  emit('reset')
}

/** 处理提交 */
const handleSubmit = () => {
  emit('submit')
}

/** 处理展开/收起切换 */
const handleToggle = () => {
  emit('toggle', !props.expanded)
}

/** 处理自定义操作 */
const handleCustomAction = (action: CustomAction, index: number) => {
  // 优先调用action自身的onClick
  if (action.onClick) {
    action.onClick(action, index)
  }
  
  // 触发组件事件
  emit('customAction', action, index)
}
</script>

<style scoped>
.clever-form-actions {
  margin-top: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .clever-form-actions {
    margin-top: 12px;
  }
  
  .clever-form-actions :deep(.n-space) {
    justify-content: center;
  }
}
</style>