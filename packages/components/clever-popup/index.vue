<script setup lang="ts">
import { computed } from 'vue'
import { isNumber } from '@/utils/is'
import type { CleverPopupProps } from './types'

const props = withDefaults(defineProps<CleverPopupProps>(), {
  title: '',
  width: 520,
  placement: 'right',
  mode: 'modal'
})

const visible = defineModel<boolean>('visible', {
  default: false
})

const width = computed(() => {
  if (isNumber(props.width)) {
    return `${props.width}px`
  }
  return props.width
})
</script>

<template>
  <NModal
    v-if="props.mode === 'modal'"
    v-model:show="visible"
    :title="props.title"
    preset="card"
    :style="{ width: width }"
    v-bind="$attrs"
  >
    <NScrollbar class="pr-20px">
      <slot></slot>
    </NScrollbar>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </NModal>
  
  <NDrawer
    v-else
    v-model:show="visible"
    :placement="props.placement"
    display-directive="show"
    :width="width"
    v-bind="$attrs"
  >
    <NDrawerContent :title="props.title" :native-scrollbar="false" closable>
      <slot></slot>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>