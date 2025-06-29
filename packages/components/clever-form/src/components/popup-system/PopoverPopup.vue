<template>
  <n-popover
    :show="show"
    :trigger="config.trigger || 'hover'"
    :placement="config.placement || 'top'"
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
    :raw="config.raw"
    :x="config.x"
    :y="config.y"
    :style="config.style"
    :header-style="config.headerStyle"
    :content-style="config.contentStyle"
    :arrow-point-to-center="config.arrowPointToCenter"
    :arrow-wrapper-style="config.arrowWrapperStyle"
    :flip-behavior="config.flipBehavior"
    :internal-trap-focus="config.internalTrapFocus"
    :internal-deactivate-immediate="config.internalDeactivateImmediate"
    @update:show="handleUpdateShow"
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
            {{ config.triggerText || '悬停显示' }}
          </n-button>
        </slot>
      </template>
    </template>
    
    <!-- 标题 -->
    <template v-if="config.title || config.renderHeader" #header>
      <!-- 自定义标题渲染 -->
      <template v-if="config.renderHeader">
        <component :is="config.renderHeader" />
      </template>
      
      <!-- 默认标题 -->
      <template v-else>
        {{ config.title }}
      </template>
    </template>
    
    <!-- 弹窗内容 -->
    <template #default>
      <!-- 自定义内容渲染 -->
      <template v-if="config.renderContent">
        <component :is="config.renderContent" />
      </template>
      
      <!-- 默认内容 -->
      <template v-else>
        <div class="popover-popup__content">
          {{ config.content || '这是一个气泡弹窗' }}
        </div>
      </template>
    </template>
    
    <!-- 底部操作 -->
    <template v-if="config.showFooter" #footer>
      <!-- 自定义底部渲染 -->
      <template v-if="config.renderFooter">
        <component :is="config.renderFooter" />
      </template>
      
      <!-- 自定义底部插槽 -->
      <template v-else-if="$slots.footer">
        <slot name="footer" />
      </template>
      
      <!-- 默认底部按钮 -->
      <template v-else>
        <n-space justify="end" size="small">
          <n-button
            v-if="config.showCancel"
            size="small"
            :loading="cancelLoading"
            :disabled="config.cancelDisabled"
            @click="handleCancel"
          >
            {{ config.cancelText || '取消' }}
          </n-button>
          <n-button
            v-if="config.showConfirm"
            type="primary"
            size="small"
            :loading="confirmLoading"
            :disabled="config.confirmDisabled"
            @click="handleConfirm"
          >
            {{ config.confirmText || '确定' }}
          </n-button>
        </n-space>
      </template>
    </template>
  </n-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopover, NButton, NSpace } from 'naive-ui'
import type {
  PopoverPopupConfig
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.POPOVER_POPUP
})

// Props定义
interface Props {
  /** 弹窗配置 */
  config: PopoverPopupConfig
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
        if (props.config.closeOnConfirm !== false) {
          emit('update:show', false)
        }
      }
    } catch (error) {
      console.error('Popover confirm error:', error)
    } finally {
      confirmLoading.value = false
    }
  } else {
    emit('confirm')
    if (props.config.closeOnConfirm !== false) {
      emit('update:show', false)
    }
  }
}

const handleCancel = async () => {
  if (props.config.beforeCancel) {
    cancelLoading.value = true
    try {
      const result = await props.config.beforeCancel()
      if (result !== false) {
        emit('cancel')
        if (props.config.closeOnCancel !== false) {
          emit('update:show', false)
        }
      }
    } catch (error) {
      console.error('Popover cancel error:', error)
    } finally {
      cancelLoading.value = false
    }
  } else {
    emit('cancel')
    if (props.config.closeOnCancel !== false) {
      emit('update:show', false)
    }
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
.popover-popup {
  &__content {
    max-width: var(--popover-content-max-width, 300px);
    word-wrap: break-word;
    line-height: 1.6;
  }
}
</style>