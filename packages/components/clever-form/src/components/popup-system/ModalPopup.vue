<template>
  <n-modal
    :show="show"
    :mask-closable="config.maskClosable ?? true"
    :close-on-esc="config.closeOnEsc ?? true"
    :auto-focus="config.autoFocus ?? true"
    :trap-focus="config.trapFocus ?? true"
    :block-scroll="config.blockScroll ?? true"
    :z-index="config.zIndex"
    :to="config.to"
    :transform-origin="config.transformOrigin"
    :preset="config.preset || 'card'"
    @update:show="handleUpdateShow"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
    @esc="handleEsc"
    @mask-click="handleMaskClick"
  >
    <!-- 卡片预设 -->
    <n-card
      v-if="config.preset === 'card' || !config.preset"
      :style="cardStyle"
      :title="config.title"
      :closable="config.closable ?? true"
      :bordered="config.bordered"
      :size="config.size"
      :role="config.role"
      :aria-modal="true"
      @close="handleClose"
    >
      <!-- 自定义标题 -->
      <template v-if="config.renderHeader" #header>
        <component :is="config.renderHeader" />
      </template>
      
      <!-- 自定义标题额外内容 -->
      <template v-if="config.renderHeaderExtra" #header-extra>
        <component :is="config.renderHeaderExtra" />
      </template>
      
      <!-- 内容 -->
      <div class="modal-popup__content">
        <!-- 自定义内容渲染 -->
        <template v-if="config.renderContent">
          <component :is="config.renderContent" />
        </template>
        
        <!-- 默认插槽内容 -->
        <template v-else>
          <slot />
        </template>
      </div>
      
      <!-- 底部操作 -->
      <template v-if="config.showFooter !== false" #footer>
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
          <n-space justify="end">
            <n-button
              v-if="config.showCancel !== false"
              :loading="cancelLoading"
              :disabled="config.cancelDisabled"
              @click="handleCancel"
            >
              {{ config.cancelText || '取消' }}
            </n-button>
            <n-button
              v-if="config.showConfirm !== false"
              type="primary"
              :loading="confirmLoading"
              :disabled="config.confirmDisabled"
              @click="handleConfirm"
            >
              {{ config.confirmText || '确定' }}
            </n-button>
          </n-space>
        </template>
      </template>
    </n-card>
    
    <!-- 对话框预设 -->
    <n-dialog
      v-else-if="config.preset === 'dialog'"
      :title="config.title"
      :content="config.content"
      :type="config.dialogType"
      :icon="config.icon"
      :icon-placement="config.iconPlacement"
      :show-icon="config.showIcon"
      :loading="confirmLoading"
      :closable="config.closable"
      :positive-text="config.confirmText"
      :negative-text="config.cancelText"
      :on-positive-click="handleConfirm"
      :on-negative-click="handleCancel"
      :on-close="handleClose"
    />
    
    <!-- 自定义预设 -->
    <div v-else class="modal-popup__custom">
      <slot />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NModal, NCard, NDialog, NButton, NSpace } from 'naive-ui'
import type {
  ModalPopupConfig
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.MODAL_POPUP
})

// Props定义
interface Props {
  /** 弹窗配置 */
  config: ModalPopupConfig
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
  'close': []
  'after-enter': []
  'after-leave': []
  'esc': []
  'mask-click': []
}

const emit = defineEmits<Emits>()

// 响应式数据
const confirmLoading = ref(false)
const cancelLoading = ref(false)

// 计算属性
const cardStyle = computed(() => {
  const style: Record<string, any> = {}
  
  if (props.config.width) {
    style.width = typeof props.config.width === 'number' 
      ? `${props.config.width}px` 
      : props.config.width
  }
  
  if (props.config.maxWidth) {
    style.maxWidth = typeof props.config.maxWidth === 'number' 
      ? `${props.config.maxWidth}px` 
      : props.config.maxWidth
  }
  
  if (props.config.height) {
    style.height = typeof props.config.height === 'number' 
      ? `${props.config.height}px` 
      : props.config.height
  }
  
  if (props.config.maxHeight) {
    style.maxHeight = typeof props.config.maxHeight === 'number' 
      ? `${props.config.maxHeight}px` 
      : props.config.maxHeight
  }
  
  return style
})

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
      }
    } catch (error) {
      console.error('Modal confirm error:', error)
    } finally {
      confirmLoading.value = false
    }
  } else {
    emit('confirm')
  }
}

const handleCancel = async () => {
  if (props.config.beforeCancel) {
    cancelLoading.value = true
    try {
      const result = await props.config.beforeCancel()
      if (result !== false) {
        emit('cancel')
      }
    } catch (error) {
      console.error('Modal cancel error:', error)
    } finally {
      cancelLoading.value = false
    }
  } else {
    emit('cancel')
  }
}

const handleClose = () => {
  emit('close')
}

const handleAfterEnter = () => {
  emit('after-enter')
}

const handleAfterLeave = () => {
  emit('after-leave')
}

const handleEsc = () => {
  emit('esc')
}

const handleMaskClick = () => {
  emit('mask-click')
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
.modal-popup {
  &__content {
    min-height: var(--modal-content-min-height, 100px);
    max-height: var(--modal-content-max-height, 60vh);
    overflow-y: auto;
  }
  
  &__custom {
    background: var(--n-color);
    border-radius: var(--n-border-radius);
    padding: var(--n-padding);
    box-shadow: var(--n-box-shadow);
  }
}
</style>