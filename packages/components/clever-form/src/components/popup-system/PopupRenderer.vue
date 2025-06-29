<template>
  <component
    :is="popupComponent"
    v-if="popupComponent"
    v-bind="popupProps"
    @update:show="handleUpdateShow"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- 传递所有插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type {
  PopupConfig,
  PopupType
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.POPUP_RENDERER
})

// Props定义
interface Props {
  /** 弹窗配置 */
  config: PopupConfig
  /** 是否显示 */
  show?: boolean
  /** 额外属性 */
  [key: string]: any
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

// 弹窗组件映射
const POPUP_COMPONENT_MAP: Record<PopupType, string> = {
  modal: 'ModalPopup',
  drawer: 'DrawerPopup',
  dialog: 'DialogPopup'
}

// 计算属性
const popupComponent = computed(() => {
  const componentName = POPUP_COMPONENT_MAP[props.config.type]
  if (!componentName) {
    console.warn(`Unknown popup type: ${props.config.type}`)
    return null
  }
  
  try {
    return resolveComponent(componentName)
  } catch (error) {
    console.warn(`Failed to resolve popup component: ${componentName}`, error)
    return null
  }
})

const popupProps = computed(() => {
  const { type, ...restConfig } = props.config
  return {
    ...restConfig,
    show: props.show,
    // 传递其他 props
    ...Object.fromEntries(
      Object.entries(props).filter(([key]) => key !== 'config' && key !== 'show')
    )
  }
})

// 事件处理
const handleUpdateShow = (show: boolean) => {
  emit('update:show', show)
}

const handleConfirm = (data?: any) => {
  emit('confirm', data)
  
  // 调用配置的回调
  if (props.config.onConfirm) {
    props.config.onConfirm(data)
  }
}

const handleCancel = () => {
  emit('cancel')
  
  // 调用配置的回调
  if (props.config.onCancel) {
    props.config.onCancel()
  }
}

const handleClose = () => {
  emit('close')
  
  // 调用配置的回调
  if (props.config.onClose) {
    props.config.onClose()
  }
}
</script>