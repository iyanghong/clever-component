<script setup lang="ts">
import { ref, computed, watch, nextTick, useAttrs } from 'vue'
import { useMessage } from 'naive-ui'
import CleverPopup from '@/components/clever-popup/index.vue'
import { isAsyncFunction, isFunction, isObject } from '@/utils/is'
import CleverForm from './src/form.vue'
import defaultCleverFormProps from './src/default-props'

type GetApiFn<T> = ((record: T) => ResponseBaseModel<T>) | ((record: T) => Promise<ResponseBaseModel<T>>)

const cleverPopupFormRef = ref()
const cleverFormRef = ref()
const attrs = useAttrs()
const props = defineProps(defaultCleverFormProps)
const formKey = ref(`form-key-${new Date().getTime()}`)
const message = useMessage()
const visiblePopup = defineModel<boolean>('visiblePopup', {
  default: false
})

watch(
  () => visiblePopup.value,
  newValue => {
    if (newValue) {
      formKey.value = `form-key-${new Date().getTime()}`
    }
  }
)

function showPopup() {
  visiblePopup.value = true
}

function hidePopup() {
  visiblePopup.value = false
}

function resetFields() {
  if (props.isPopup) {
    return cleverPopupFormRef.value ? cleverPopupFormRef.value.resetFields() : ''
  }
  return cleverFormRef.value ? cleverFormRef.value.resetFields() : ''
}

function setFieldValue(field: string, value: any) {
  if (props.isPopup) {
    return cleverPopupFormRef.value ? cleverPopupFormRef.value.setFieldValue(field, value) : ''
  }
  return cleverFormRef.value ? cleverFormRef.value.setFieldValue(field, value) : ''
}

function getFieldValue(field: string) {
  if (props.isPopup) {
    return cleverPopupFormRef.value ? cleverPopupFormRef.value.getFieldValue(field) : ''
  }
  return cleverFormRef.value ? cleverFormRef.value.getFieldValue(field) : ''
}

function setFormData(values: Record<string, any>) {
  if (props.isPopup) {
    return cleverPopupFormRef.value ? cleverPopupFormRef.value.setFormData(values) : ''
  }
  return cleverFormRef.value ? cleverFormRef.value.setFormData(values) : ''
}

function getFormData(): Record<string, any> {
  if (props.isPopup) {
    return cleverPopupFormRef.value ? cleverPopupFormRef.value.getFormData() : {}
  }
  return cleverFormRef.value ? cleverFormRef.value.getFormData() : {}
}

const getProps = computed(() => {
  return { ...props, ...attrs }
})

function open(data: Record<string, any>, apiFn?: GetApiFn<Record<string, any>>) {
  visiblePopup.value = true
  nextTick(async () => {
    if (isObject(data)) {
      if (apiFn && (isFunction(apiFn) || isAsyncFunction(apiFn))) {
        try {
          const response = await apiFn(data)
          if (response.code === 0) {
            setFormData(response.data)
          } else {
            message.error(response.message)
          }
        } catch (error) {
          console.error('Failed to fetch data:', error)
          message.error('获取数据失败')
        }
      } else {
        setFormData(data)
      }
    }
  })
}

defineExpose({
  resetFields,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  open,
  showPopup,
  hidePopup
})
</script>

<template>
  <CleverPopup v-if="props.isPopup" v-bind="props.popupOption" v-model:visible="visiblePopup">
    <CleverForm ref="cleverPopupFormRef" v-bind="getProps" :key="formKey" />
  </CleverPopup>
  
  <CleverForm v-else ref="cleverFormRef" v-bind="getProps" />
</template>

<style scoped></style>