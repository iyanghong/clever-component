<template>
  <div
    :class="[
      'clever-form-item',
      `clever-form-item--${fieldConfig.type}`,
      {
        'clever-form-item--required': isRequired,
        'clever-form-item--error': hasError,
        'clever-form-item--disabled': disabled,
        'clever-form-item--readonly': readonly,
        'clever-form-item--loading': loading
      }
    ]"
  >
    <!-- 字段标签 -->
    <div
      v-if="showLabel"
      :class="[
        'clever-form-item__label',
        {
          'clever-form-item__label--required': isRequired && showRequiredMark
        }
      ]"
      :style="labelStyle"
    >
      <span class="clever-form-item__label-text">{{ fieldConfig.label }}</span>
      <span v-if="isRequired && showRequiredMark" class="clever-form-item__required-mark">*</span>
    </div>

    <!-- 字段内容 -->
    <div class="clever-form-item__content" :style="contentStyle">
      <!-- 字段渲染器 -->
      <FieldRenderer
        :config="fieldConfig"
        :model-value="fieldValue"
        :disabled="disabled"
        :readonly="readonly"
        :loading="loading"
        @update:model-value="handleValueChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @validate="handleValidate"
      />

      <!-- 错误信息 -->
      <div
        v-if="hasError && showFeedback"
        class="clever-form-item__error"
      >
        {{ errorMessage }}
      </div>

      <!-- 帮助信息 -->
      <div
        v-if="fieldConfig.help && showFeedback"
        class="clever-form-item__help"
      >
        {{ fieldConfig.help }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FieldRenderer } from './field-components'
import type { FieldConfig, FormData, ValidationResult } from '../types'
import { COMPONENT_NAMES } from '../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.CLEVER_FORM_ITEM + 1
})

// Props 定义
export interface CleverFormItemProps {
  /** 字段配置 */
  config: FieldConfig
  /** 字段值 */
  modelValue?: any
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 是否显示标签 */
  showLabel?: boolean
  /** 是否显示必填标记 */
  showRequiredMark?: boolean
  /** 是否显示反馈信息 */
  showFeedback?: boolean
  /** 标签宽度 */
  labelWidth?: string | number
  /** 标签位置 */
  labelPlacement?: 'left' | 'top'
}

const props = withDefaults(defineProps<CleverFormItemProps>(), {
  disabled: false,
  readonly: false,
  loading: false,
  showLabel: true,
  showRequiredMark: true,
  showFeedback: true,
  labelPlacement: 'left'
})

// Emits 定义
export interface CleverFormItemEmits {
  'update:modelValue': [value: any]
  'field:change': [field: string, value: any, oldValue: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [field: string, result: ValidationResult]
}

const emit = defineEmits<CleverFormItemEmits>()

// 注入表单上下文
const formContext = inject('formContext', null)

// 计算属性
const fieldConfig = computed(() => props.config)
const fieldValue = computed(() => props.modelValue)

// 是否必填
const isRequired = computed(() => {
  return fieldConfig.value.required || 
    (fieldConfig.value.rules?.some(rule => rule.required) ?? false)
})

// 是否有错误
const hasError = computed(() => {
  // 这里可以从表单上下文获取验证结果
  return false // 临时返回false，实际应该从验证结果中获取
})

// 错误信息
const errorMessage = computed(() => {
  // 这里可以从表单上下文获取错误信息
  return '' // 临时返回空字符串，实际应该从验证结果中获取
})

// 标签样式
const labelStyle = computed(() => {
  const style: Record<string, any> = {}
  
  if (props.labelWidth) {
    style.width = typeof props.labelWidth === 'number' 
      ? `${props.labelWidth}px` 
      : props.labelWidth
  }
  
  return style
})

// 内容样式
const contentStyle = computed(() => {
  const style: Record<string, any> = {}
  
  if (props.labelPlacement === 'left' && props.labelWidth) {
    const labelWidth = typeof props.labelWidth === 'number' 
      ? `${props.labelWidth}px` 
      : props.labelWidth
    style.marginLeft = labelWidth
  }
  
  return style
})

// 事件处理
const handleValueChange = (value: any) => {
  const oldValue = fieldValue.value
  emit('update:modelValue', value)
  emit('field:change', fieldConfig.value.field, value, oldValue)
}

const handleFocus = () => {
  emit('field:focus', fieldConfig.value.field)
}

const handleBlur = () => {
  emit('field:blur', fieldConfig.value.field)
}

const handleValidate = (result: ValidationResult) => {
  emit('validate', fieldConfig.value.field, result)
}
</script>

<style scoped>
.clever-form-item {
  position: relative;
  margin-bottom: 16px;
}

.clever-form-item--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.clever-form-item--readonly {
  pointer-events: none;
}

.clever-form-item--loading {
  opacity: 0.8;
}

.clever-form-item__label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--n-text-color);
}

.clever-form-item__label--required .clever-form-item__label-text {
  position: relative;
}

.clever-form-item__required-mark {
  color: var(--n-error-color);
  margin-left: 4px;
}

.clever-form-item__content {
  position: relative;
}

.clever-form-item__error {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--n-error-color);
}

.clever-form-item__help {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--n-text-color-3);
}

/* 水平布局 */
.clever-form-item--horizontal {
  display: flex;
  align-items: flex-start;
}

.clever-form-item--horizontal .clever-form-item__label {
  margin-bottom: 0;
  margin-right: 12px;
  flex-shrink: 0;
}

.clever-form-item--horizontal .clever-form-item__content {
  flex: 1;
  margin-left: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .clever-form-item {
    margin-bottom: 12px;
  }
  
  .clever-form-item__label {
    font-size: 13px;
  }
  
  .clever-form-item__error,
  .clever-form-item__help {
    font-size: 11px;
  }
}
</style>