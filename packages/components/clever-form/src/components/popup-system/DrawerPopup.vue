<template>
  <n-drawer
    :show="show"
    :width="config.width || 378"
    :height="config.height"
    :placement="config.placement || 'right'"
    :mask-closable="config.maskClosable ?? true"
    :close-on-esc="config.closeOnEsc ?? true"
    :auto-focus="config.autoFocus ?? true"
    :trap-focus="config.trapFocus ?? true"
    :block-scroll="config.blockScroll ?? true"
    :show-mask="config.showMask ?? true"
    :to="config.to"
    :display-directive="config.displayDirective || 'if'"
    :z-index="config.zIndex"
    @update:show="handleUpdateShow"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
    @esc="handleEsc"
    @mask-click="handleMaskClick"
  >
    <n-drawer-content
      :title="config.title"
      :closable="config.closable ?? true"
      :native-scrollbar="config.nativeScrollbar ?? true"
      :footer-style="config.footerStyle"
      :header-style="config.headerStyle"
      :body-style="config.bodyStyle"
      :body-content-style="config.bodyContentStyle"
    >
      <!-- 自定义标题 -->
      <template v-if="config.renderHeader" #header>
        <component :is="config.renderHeader" />
      </template>
      
      <!-- 内容 -->
      <div class="drawer-popup__content">
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
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NDrawer, NDrawerContent, NButton, NSpace } from 'naive-ui'
import type {
  DrawerPopupConfig
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.DRAWER_POPUP
})

// Props定义
interface Props {
  /** 弹窗配置 */
  config: DrawerPopupConfig
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
      console.error('Drawer confirm error:', error)
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
      console.error('Drawer cancel error:', error)
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
.drawer-popup {
  &__content {
    min-height: var(--drawer-content-min-height, 100px);
  }
}
</style>