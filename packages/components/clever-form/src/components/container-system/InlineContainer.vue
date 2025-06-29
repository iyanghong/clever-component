<template>
  <div 
    class="inline-container"
    :style="containerStyle"
  >
    <div
      v-for="(child, index) in normalizedChildren"
      :key="child.id || index"
      class="inline-container__item"
    >
      <!-- 字段渲染 -->
        <CleverFormItem
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InlineContainerConfig } from '../../types/layout'
import type { FieldConfig, ContainerConfig } from '../../types'
import type { ValidationResult } from '../../types/validation'
import CleverFormItem from '../CleverFormItem.vue'
import ContainerRenderer from './ContainerRenderer.vue'
import { normalizeChildren } from '@/components/clever-form'

// Props定义
interface Props {
  /** 行内容器配置 */
  config: InlineContainerConfig
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

const normalizedChildren = computed(() => {
  return normalizeChildren(props.config.children || [])
})

// 容器样式
const containerStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'flex',
    flexDirection: 'row'
  }
  
  const { gap, align, wrap } = props.config.props || {}
  
  if (gap) {
    style.gap = typeof gap === 'number' ? `${gap}px` : gap
  }
  
  if (align) {
    style.alignItems = align === 'start' ? 'flex-start' : 
                      align === 'end' ? 'flex-end' : 
                      align === 'baseline' ? 'baseline' : 'center'
  }
  
  if (wrap) {
    style.flexWrap = 'wrap'
  }
  
  // 合并自定义样式
  if (props.config.containerStyle) {
    if (typeof props.config.containerStyle === 'string') {
      // 处理字符串样式
      const customStyles = props.config.containerStyle.split(';')
        .filter(style => style.trim())
        .reduce((acc, style) => {
          const [key, value] = style.split(':').map(s => s.trim())
          if (key && value) {
            acc[key] = value
          }
          return acc
        }, {} as Record<string, any>)
      Object.assign(style, customStyles)
    } else {
      Object.assign(style, props.config.containerStyle)
    }
  }
  
  return style
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
.inline-container {
  &__item {
    flex-shrink: 0;
  }
}
</style>