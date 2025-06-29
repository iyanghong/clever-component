<template>
  <component
    :is="dialogComponent"
    v-bind="dialogProps"
    @positive-click="handleConfirm"
    @negative-click="handleCancel"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDialog } from 'naive-ui'
import type {
  DialogPopupConfig
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.DIALOG_POPUP
})

// Props定义
interface Props {
  /** 弹窗配置 */
  config: DialogPopupConfig
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
}

const emit = defineEmits<Emits>()

// 响应式数据
const confirmLoading = ref(false)
const cancelLoading = ref(false)
const dialog = useDialog()

// 计算属性
const dialogComponent = computed(() => {
  // 根据配置返回不同的对话框组件
  return 'div' // 占位符，实际使用 useDialog 的方法
})

const dialogProps = computed(() => {
  const baseProps = {
    title: props.config.title,
    content: props.config.content,
    positiveText: props.config.confirmText || '确定',
    negativeText: props.config.cancelText || '取消',
    showIcon: props.config.showIcon ?? true,
    icon: props.config.icon,
    iconPlacement: props.config.iconPlacement || 'left',
    closable: props.config.closable ?? true,
    maskClosable: props.config.maskClosable ?? true,
    closeOnEsc: props.config.closeOnEsc ?? true,
    autoFocus: props.config.autoFocus ?? true,
    transformOrigin: props.config.transformOrigin,
    blockScroll: props.config.blockScroll ?? true,
    loading: confirmLoading.value,
    style: props.config.style,
    class: props.config.class
  }
  
  return baseProps
})

// 事件处理
const handleConfirm = async () => {
  if (props.config.beforeConfirm) {
    confirmLoading.value = true
    try {
      const result = await props.config.beforeConfirm()
      if (result !== false) {
        emit('confirm', result)
        emit('update:show', false)
      }
    } catch (error) {
      console.error('Dialog confirm error:', error)
    } finally {
      confirmLoading.value = false
    }
  } else {
    emit('confirm')
    emit('update:show', false)
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
      }
    } catch (error) {
      console.error('Dialog cancel error:', error)
    } finally {
      cancelLoading.value = false
    }
  } else {
    emit('cancel')
    emit('update:show', false)
  }
}

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

// 对话框方法
const showInfo = () => {
  return dialog.info({
    ...dialogProps.value,
    onPositiveClick: handleConfirm,
    onNegativeClick: handleCancel,
    onClose: handleClose
  })
}

const showSuccess = () => {
  return dialog.success({
    ...dialogProps.value,
    onPositiveClick: handleConfirm,
    onNegativeClick: handleCancel,
    onClose: handleClose
  })
}

const showWarning = () => {
  return dialog.warning({
    ...dialogProps.value,
    onPositiveClick: handleConfirm,
    onNegativeClick: handleCancel,
    onClose: handleClose
  })
}

const showError = () => {
  return dialog.error({
    ...dialogProps.value,
    onPositiveClick: handleConfirm,
    onNegativeClick: handleCancel,
    onClose: handleClose
  })
}

const showCreate = () => {
  return dialog.create({
    ...dialogProps.value,
    type: props.config.type,
    onPositiveClick: handleConfirm,
    onNegativeClick: handleCancel,
    onClose: handleClose
  })
}

// 根据显示状态和类型自动显示对话框
const showDialog = () => {
  if (!props.show) return
  
  switch (props.config.type) {
    case 'info':
      return showInfo()
    case 'success':
      return showSuccess()
    case 'warning':
      return showWarning()
    case 'error':
      return showError()
    default:
      return showCreate()
  }
}

// 监听显示状态变化
watch(() => props.show, (newShow) => {
  if (newShow) {
    showDialog()
  }
}, { immediate: true })

// 暴露方法
defineExpose({
  confirmLoading: computed(() => confirmLoading.value),
  cancelLoading: computed(() => cancelLoading.value),
  showInfo,
  showSuccess,
  showWarning,
  showError,
  showCreate,
  setConfirmLoading: (loading: boolean) => {
    confirmLoading.value = loading
  },
  setCancelLoading: (loading: boolean) => {
    cancelLoading.value = loading
  }
})
</script>

<style lang="less">
// 对话框样式可以通过全局样式或主题定制
</style>