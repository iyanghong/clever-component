<template>
  <NButton
    :size="size"
    :type="type"
    :ghost="ghost"
    :disabled="disabled"
    :loading="loading"
    @click="handleClick"
  >

    <template v-if="icon" #icon>
      <NIcon>
        <component :is="icon" />
      </NIcon>
    </template>
    {{ label }}
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon, useDialog } from 'naive-ui'
import type { Component } from 'vue'

interface Props {
  label: string
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default'
  size?: 'tiny' | 'small' | 'medium' | 'large'
  ghost?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: Component
  confirm?: {
    title?: string
    content?: string
  }
}

interface Emits {
  click: []
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'small',
  ghost: false,
  disabled: false,
  loading: false
})

const emit = defineEmits<Emits>()
const dialog = useDialog()

function handleClick() {
  if (props.confirm) {
    dialog.warning({
      title: props.confirm.title || '确认操作',
      content: props.confirm.content || '确定要执行此操作吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        emit('click')
      }
    })
  } else {
    emit('click')
  }
}
</script>
