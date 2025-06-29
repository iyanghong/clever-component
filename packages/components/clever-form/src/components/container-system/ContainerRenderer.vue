<template>
  <component
    :is="containerComponent"
    v-if="containerComponent"
    :config="config"
    :disabled="disabled"
    :readonly="readonly"
    :loading="loading"
    @field:change="$emit('field:change', $event)"
    @field:focus="$emit('field:focus', $event)"
    @field:blur="$emit('field:blur', $event)"
    @validate="$emit('validate', $event)"
  >
    <!-- 透传所有插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </component>
  
  <!-- 未知容器类型 -->
  <div v-else class="container-renderer__unknown">
    <slot name="unknown-container" :config="config">
      <div class="container-renderer__unknown-content">
        <div class="container-renderer__unknown-icon">⚠️</div>
        <div class="container-renderer__unknown-text">
          未知的容器类型: {{ config.type }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  ContainerConfig,
  ValidationResult
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 导入容器组件
import GridContainer from './GridContainer.vue'
import FlexContainer from './FlexContainer.vue'
import TabsContainer from './TabsContainer.vue'
import CollapseContainer from './CollapseContainer.vue'
// 其他容器组件暂未实现

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.CONTAINER_RENDERER
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

// Events定义
interface Emits {
  'field:change': [field: string, value: any, oldValue: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [result: ValidationResult]
}

defineEmits<Emits>()

// 容器组件映射
const containerComponents = {
  grid: GridContainer,
  flex: FlexContainer,
  tabs: TabsContainer,
  collapse: CollapseContainer
  // 其他容器类型暂未实现
} as const

// 计算当前容器组件
const containerComponent = computed(() => {
  const type = props.config.type
  return containerComponents[type as keyof typeof containerComponents]
})
console.log('containerComponent',containerComponent.value)
</script>

<style lang="less">
.container-renderer {
  &__unknown {
    padding: 20px;
    border: 2px dashed var(--n-border-color);
    border-radius: 6px;
    text-align: center;
    
    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    &-icon {
      font-size: 24px;
    }
    
    &-text {
      color: var(--n-text-color-3);
      font-size: 14px;
    }
  }
}
</style>