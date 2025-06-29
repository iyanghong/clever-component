<template>
  <div 
    class="vertical-container"
    :style="containerStyle"
  >
    <div
      v-for="(child, index) in normalizedChildren"
      :key="child.id || index"
      class="vertical-container__item"
      :style="itemStyle"
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
import type { VerticalContainerConfig } from '../../types/layout'
import type { FieldConfig, ContainerConfig } from '../../types'
import type { ValidationResult } from '../../types/validation'
import CleverFormItem from '../CleverFormItem.vue'
import ContainerRenderer from './ContainerRenderer.vue'

// Props定义
interface Props {
  /** 垂直容器配置 */
  config: VerticalContainerConfig
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
    if ('container' in child) {

      return {
        ...child,
        type: 'container' as const,
        id: child.title || `container-${index}`
      }
    } else {
      return {
        ...child,
        type: 'field' as const,
        id: child.field || `field-${index}`
      }
    }
  })
})

// 容器样式
const containerStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'flex',
    flexDirection: 'column'
  }
  
  const { gap, align } = props.config.props || {}
  
  if (gap) {
    style.gap = typeof gap === 'number' ? `${gap}px` : gap
  }
  
  if (align) {
    style.alignItems = align === 'start' ? 'flex-start' : 
                      align === 'end' ? 'flex-end' : 
                      align === 'stretch' ? 'stretch' : 'center'
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

// 子项样式
const itemStyle = computed(() => {
  const style: Record<string, any> = {}
  
  const { align } = props.config.props || {}
  
  if (align === 'stretch') {
    style.width = '100%'
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
.vertical-container {
  &__item {
    flex-shrink: 0;
  }
}
</style>