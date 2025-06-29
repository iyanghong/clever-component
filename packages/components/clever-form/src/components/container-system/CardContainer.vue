<template>
  <n-card
    class="card-container"
    :title="config.title"
    :bordered="config.props?.bordered !== false"
    :hoverable="config.props?.hoverable"
    :size="config.props?.size || 'medium'"
  >
    <!-- 头部额外内容 -->
    <template v-if="config.props?.header?.extra" #header-extra>
      <component :is="config.props.header.extra" />
    </template>
    
    <!-- 卡片内容 -->
    <div class="card-container__content">
      <div
        v-for="(child, index) in normalizedChildren"
        :key="child.id || index"
        class="card-container__item"
      >
        <!-- 字段渲染 -->
        <FieldRenderer
          v-if="child.type === 'field'"
          :config="child"
          :disabled="disabled"
          :readonly="readonly"
          :loading="loading"
          @field:change="(field, value, oldValue) => handleFieldChange(field, value, oldValue)"
          @field:focus="(field) => handleFieldFocus(field)"
          @field:blur="(field) => handleFieldBlur(field)"
          @validate="(field, result) => handleFieldValidate(field, result)"
        />
        
        <!-- 容器渲染 -->
        <ContainerRenderer
          v-else
          :config="child"
          :disabled="disabled"
          :readonly="readonly"
          :loading="loading"
          @field:change="(field, value, oldValue) => handleFieldChange(field, value, oldValue)"
          @field:focus="(field) => handleFieldFocus(field)"
          @field:blur="(field) => handleFieldBlur(field)"
          @validate="(field, result) => handleFieldValidate(field, result)"
        />
      </div>
    </div>
    
    <!-- 底部内容 -->
    <template v-if="config.props?.footer" #footer>
      <component :is="config.props.footer" />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard } from 'naive-ui'
import type { CardContainerConfig } from '../../types/layout'
import type { FieldConfig, ContainerConfig } from '../../types'
import type { ValidationResult } from '../../types/validation'
import FieldRenderer from '../field-components/FieldRenderer.vue'
import ContainerRenderer from './ContainerRenderer.vue'

// Props定义
interface Props {
  /** 卡片容器配置 */
  config: CardContainerConfig
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
  'validate': [field: string, result: ValidationResult]
}

const emit = defineEmits<Emits>()

// 标准化子项配置
const normalizedChildren = computed(() => {
  return props.config.children.map((child, index) => {
    if ('field' in child) {
      return {
        ...child,
        type: 'field' as const,
        id: child.field || `field-${index}`
      }
    } else {
      return {
        ...child,
        type: 'container' as const,
        id: child.title || `container-${index}`
      }
    }
  })
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

const handleFieldValidate = (field: string, result: ValidationResult) => {
  emit('validate', field, result)
}
</script>

<style lang="less">
.card-container {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  &__item {
    flex-shrink: 0;
  }
}
</style>