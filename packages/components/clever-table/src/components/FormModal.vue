<template>
  <CleverPopup
    ref="popupRef"
    v-model:visible="visible"
    :title="modalTitle"
    :width="formConfig?.width || '800px'"
    :disabled="disabled"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <CleverForm
      v-if="formConfig"
      ref="formRef"
      v-model="formData"
      :schemas="formConfig.schemas"
      :label-width="formConfig.labelWidth"
      :label-placement="formConfig.labelPlacement"
      :size="formConfig.size"
      :disabled="disabled"
    />
  </CleverPopup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormConfig } from '../types'
import {FormMode} from '../types'
import CleverForm from '../../../clever-form/index.vue'
import CleverPopup from '../../../clever-popup/index.vue'

interface Props {
  formConfig?: FormConfig
  mode?: FormMode
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: FormMode.CREATE,
  disabled: false
})

interface Emits {
  save: [data: any]
  cancel: []
  open: [record?: any]
}

const emit = defineEmits<Emits>()

// 引用
const popupRef = ref()
const formRef = ref()

// 弹窗显示状态
const visible = ref(false)

// 表单数据
const formData = ref<Record<string, any>>({})

// 计算属性：弹窗标题
const modalTitle = computed(() => {
  if (!props.formConfig) return ''

  switch (props.mode) {
    case 'create':
      return props.formConfig.createTitle || '新增'
    case 'edit':
      return props.formConfig.editTitle || '编辑'
    case 'detail':
      return props.formConfig.detailTitle || '详情'
    default:
      return '表单'
  }
})

// 打开弹窗
const open = (record?: any) => {
  if (record) {
    formData.value = { ...record }
  } else {
    formData.value = {}
  }

  visible.value = true
  emit('open', record)
}

// 关闭弹窗
const close = () => {
  visible.value = false
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return false

  try {
    // 验证表单
    const valid = await formRef.value.validate()
    if (!valid) return false

    // 触发保存事件
    emit('save', formData.value)
    return true
  } catch (error) {
    console.error('表单验证失败:', error)
    return false
  }
}

// 处理取消
const handleCancel = () => {
  close()
  emit('cancel')
}

// 暴露方法
defineExpose({
  open,
  close,
  showPopup: open,
  hidePopup: close
})
</script>

<style scoped>
/* 组件样式 */
</style>
