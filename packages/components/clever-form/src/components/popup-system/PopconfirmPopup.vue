<template>
  <n-popconfirm
    :show="show"
    :trigger="config.trigger || 'click'"
    :placement="config.placement || 'top'"
    :positive-text="config.confirmText || '确定'"
    :negative-text="config.cancelText || '取消'"
    :show-icon="config.showIcon ?? true"
    :icon="config.icon"
    :icon-color="config.iconColor"
    :to="config.to"
    :width="config.width"
    :overlap="config.overlap"
    :keep-alive-on-hover="config.keepAliveOnHover ?? true"
    :z-index="config.zIndex"
    :arrow-style="config.arrowStyle"
    :delay="config.delay"
    :duration="config.duration"
    :disabled="config.disabled"
    :get-disabled="config.getDisabled"
    :display-directive="config.displayDirective || 'if'"
    :show-arrow="config.showArrow ?? true"
    :flip="config.flip ?? true"
    :animated="config.animated ?? true"
    @update:show="handleUpdateShow"
    @positive-click="handleConfirm"
    @negative-click="handleCancel"
    @clickoutside="handleClickOutside"
  >
    <!-- 触发器内容 -->
    <template #trigger>
      <!-- 自定义触发器渲染 -->
      <template v-if="config.renderTrigger">
        <component :is="config.renderTrigger" />
      </template>
      
      <!-- 默认触发器插槽 -->
      <template v-else>
        <slot name="trigger">
          <n-button
            :type="config.triggerType || 'default'"
            :size="config.triggerSize"
            :disabled="config.triggerDisabled"
            :loading="config.triggerLoading"
          >
            {{ config.triggerText || '点击确认' }}
          </n-button>
        </slot>
      </template>
    </template>
    
    <!-- 自定义图标 -->
    <template v-if="config.renderIcon" #icon>
      <component :is="config.renderIcon" />
    </template>
    
    <!-- 确认框内容 -->
    <template #default>
      <!-- 自定义内容渲染 -->
      <template v-if="config.renderContent">
        <component :is="config.renderContent" />
      </template>
      
      <!-- 默认内容 -->
      <template v-else>
        {{ config.content || '确定要执行此操作吗？' }}
      </template>
    </template>
    
    <!-- 自定义操作按钮 -->
    <template v-if="config.renderAction" #action>
      <component :is="config.renderAction" />
    </template>
  </n-popconfirm>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopconfirm, NButton } from 'naive-ui'
import type {
  PopconfirmPopupConfig
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.POPCONFIRM_POPUP
})

// Props定义
interface Props {
  /** 弹窗配置 */
  config: PopconfirmPopupConfig
  /** 是否显示 */
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

// Events定义
interface Emits {
  'update:show': [show: boolean]
  'confirm': [data?: any]
  'cancel': []
  'clickoutside': []
}

const emit = defineEmits<Emits>()

// 响应式数据
const confirmLoading = ref(false)
const cancelLoading = ref(false)

// 事件处理
const handleUpdateShow = (show: boolean) => {
  emit('update:show', show)
}

const handleConfirm = async () => {
  if (props.config.beforeConfirm) {
    confirmLoading.value = true
    try {
      const result = await props.config.beforeConfirm()
      if (result !== false) {
        emit('confirm', result)
        emit('update:show', false)
        return true
      }
      return false
    } catch (error) {
      console.error('Popconfirm confirm error:', error)
      return false
    } finally {
      confirmLoading.value = false
    }
  } else {
    emit('confirm')
    emit('update:show', false)
    return true
  }
}

const handleCancel = async () => {
  if (props.config.beforeCancel) {
    cancelLoading.value = true
    try {
      const result = await props.config.beforeCancel()
      if (result !== false) {
        emit('cancel')
        emit('update:show', false)
        return true
      }
      return false
    } catch (error) {
      console.error('Popconfirm cancel error:', error)
      return false
    } finally {
      cancelLoading.value = false
    }
  } else {
    emit('cancel')
    emit('update:show', false)
    return true
  }
}

const handleClickOutside = () => {
  emit('clickoutside')
}

// 暴露方法
defineExpose({
  confirmLoading: computed(() => confirmLoading.value),
  cancelLoading: computed(() => cancelLoading.value),
  setConfirmLoading: (loading: boolean) => {
    confirmLoading.value = loading
  },
  setCancelLoading: (loading: boolean) => {
    cancelLoading.value = loading
  }
})
</script>

<style lang="less">
.popconfirm-popup {
  // 可以添加自定义样式
}
</style>