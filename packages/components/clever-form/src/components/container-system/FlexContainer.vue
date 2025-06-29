<template>
  <NFlex
    v-bind="flexProps"
    :class="[
      'clever-flex-container',
      props.config.class
    ]"
  >
    <template v-for="(item, index) in normalizedChildren" :key="item.field || `container-${index}`">
      <CleverFormItem
        v-if="item.type === 'field'"
        :config="item"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :loading="props.loading"
        @field:change="handleFieldChange"
        @field:focus="handleFieldFocus"
        @field:blur="handleFieldBlur"
        @validate="handleValidate"
      />
      <ContainerRenderer
        v-else-if="item.type === 'container'"
        :config="item"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :loading="props.loading"
        @field:change="handleFieldChange"
        @field:focus="handleFieldFocus"
        @field:blur="handleFieldBlur"
        @validate="handleValidate"
      />
    </template>
  </NFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex } from 'naive-ui'
import type {
  ContainerConfig,
  ValidationResult
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'
import { normalizeChildren } from '../../utils'
import CleverFormItem from '../CleverFormItem.vue'
import ContainerRenderer from './ContainerRenderer.vue'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.FLEX_CONTAINER
})

// Props定义
interface Props {
  /** 容器配置 */
  config: ContainerConfig
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否加载中 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  loading: false
})

// 规范化children配置，确保字段项有type: 'field'
const normalizedChildren = computed(() => {
  return normalizeChildren(props.config.children || [])
})

// Events定义
interface Emits {
  'field:change': [field: string, value: any, oldValue: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [result: ValidationResult]
}

const emit = defineEmits<Emits>()



// 计算 NFlex 组件的 props
const flexProps = computed(() => {
  const flexConfig: Record<string, any> = {}
  
  if (props.config.direction) {
    flexConfig.vertical = props.config.direction === 'column'
  }
  
  if (props.config.wrap !== undefined) {
    flexConfig.wrap = props.config.wrap
  }
  
  if (props.config.justify) {
    flexConfig.justify = props.config.justify
  }
  
  if (props.config.align) {
    flexConfig.align = props.config.align
  }
  
  if (props.config.gap !== undefined) {
    flexConfig.size = props.config.gap
  }
  
  return flexConfig
})

// 事件处理
const handleFieldChange = (field: string, value: any, oldValue: any) => {
  emit('field:change', field, value, oldValue)
}

const handleFieldFocus = (field: string) => {
  emit('field:focus', field)
}

const handleFieldBlur = (field: string) => {
  emit('field:blur', field)
}

const handleValidate = (result: ValidationResult) => {
  emit('validate', result)
}
</script>

<style lang="less">
.flex-container {
  width: 100%;
  
  &__item {
    min-width: 0; // 防止弹性项溢出
  }
  
  // 换行样式
  &--wrap {
    flex-wrap: wrap;
  }
  
  // 状态样式
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--readonly {
    .flex-container__item {
      pointer-events: none;
    }
  }
}
</style>