<template>
  <div
    v-if="showActionButtonGroup"
    :class="containerClass"
    :style="containerStyle"
  >
    <NSpace :justify="justify">
      <NButton
        v-if="showResetButton"
        v-bind="resetButtonOptions"
        @click="handleReset"
      >
        {{ resetButtonText }}
      </NButton>
      <NButton
        v-if="showSubmitButton"
        v-bind="submitButtonOptions"
        @click="handleSubmit"
      >
        {{ submitButtonText }}
      </NButton>
      <NButton v-if="showAdvancedButton" text @click="handleToggle">
        {{ collapsed ? '展开' : '收起' }}
        <template #icon>
          <NIcon>
            <ExpandIcon v-if="collapsed" />
            <CollapseIcon v-else />
          </NIcon>
        </template>
      </NButton>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace, NIcon } from 'naive-ui'
import { ExpandIcon, CollapseIcon } from '../icons'
import type { ButtonProps } from 'naive-ui'

interface Props {
  showActionButtonGroup?: boolean
  showResetButton?: boolean
  showSubmitButton?: boolean
  showAdvancedButton?: boolean
  resetButtonText?: string
  submitButtonText?: string
  resetButtonOptions?: ButtonProps
  submitButtonOptions?: ButtonProps
  collapsed?: boolean
  containerClass?: string
  containerStyle?: Record<string, any>
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
}

const props = withDefaults(defineProps<Props>(), {
  showActionButtonGroup: true,
  showResetButton: true,
  showSubmitButton: true,
  showAdvancedButton: false,
  resetButtonText: '重置',
  submitButtonText: '提交',
  collapsed: true,
  justify: 'end'
})

const emit = defineEmits<{
  reset: []
  submit: []
  toggle: []
}>()

const handleReset = () => {
  emit('reset')
}

const handleSubmit = () => {
  emit('submit')
}

const handleToggle = () => {
  emit('toggle')
}
</script>
