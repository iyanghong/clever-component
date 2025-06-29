<template>
  <NGrid v-bind="gridProps" class="grid-container">
    <NGridItem
      v-for="(item, index) in normalizedChildren"
      :key="item.id || index"
      :span="item.span || 24"
      :offset="item.offset || 0"
      :push="item.push || 0"
      :pull="item.pull || 0"
      :order="item.order"
      :suffix="item.suffix"
    >
      <!-- 字段组件 -->
      <CleverFormItem
        v-if="item.type === 'field'"
        :config="item"
        :disabled="disabled || item.disabled"
        :readonly="readonly || item.readonly"
        :loading="loading"
        @field:change="handleFieldChange"
        @field:focus="handleFieldFocus"
        @field:blur="handleFieldBlur"
        @validate="handleValidate"
      />
      
      <!-- 容器组件 -->
      <ContainerRenderer
        v-else-if="item.type === 'container'"
        :config="item"
        :disabled="disabled || item.disabled"
        :readonly="readonly || item.readonly"
        :loading="loading"
        @field:change="handleFieldChange"
        @field:focus="handleFieldFocus"
        @field:blur="handleFieldBlur"
        @validate="handleValidate"
      >
        <!-- 透传所有插槽 -->
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </ContainerRenderer>
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'
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
  name: COMPONENT_NAMES.GRID_CONTAINER
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



// 计算网格属性
const gridProps = computed(() => {
  const props_config = props.config as any
  return {
    cols: props_config.cols || 24,
    xGap: props_config.xGap || 0,
    yGap: props_config.yGap || 0,
    responsive: props_config.responsive || 'screen',
    itemResponsive: props_config.itemResponsive || false
  }
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
.grid-container {
  width: 100%;
  
  &__item {
    min-width: 0; // 防止网格项溢出
  }
  
  // 状态样式
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--readonly {
    .grid-container__item {
      pointer-events: none;
    }
  }
}
</style>