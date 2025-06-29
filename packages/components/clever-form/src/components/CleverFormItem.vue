<template>
  <NFormItem
    :label="showLabel ? config.label : undefined"
    :path="config.field"
    :rule="validationRule"
    :show-require-mark="showRequiredMark"
    :show-feedback="showFeedback"
    :validation-status="validationStatus"
    :feedback="validationFeedback"
    :label-width="labelWidth"
    :label-align="labelAlign"
    :class="itemClass"
    :style="itemStyle"
  >
    <FieldRenderer
      :config="config"
      :disabled="disabled || config.disabled"
      :readonly="readonly || config.readonly"
      :loading="loading"
      @field:change="handleFieldChange"
      @field:focus="handleFieldFocus"
      @field:blur="handleFieldBlur"
      @validate="handleFieldValidate"
    />
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem } from 'naive-ui'
import type { FieldConfig, ValidationResult } from '../types'
import { COMPONENT_NAMES } from '../constants'
import FieldRenderer from './field-components/FieldRenderer.vue'
import { useFormContext } from '../hooks/useForm'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.CLEVER_FORM_ITEM
})

// Props定义
interface Props {
  /** 字段配置 */
  config: FieldConfig
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

// 注入表单上下文
const formContext = useFormContext()

// Events定义
interface Emits {
  'field:change': [field: string, value: any, oldValue: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  validate: [result: ValidationResult]
}

const emit = defineEmits<Emits>()
console.log('CLEVER_FORM_ITEM')
// 计算表单项属性
const showLabel = computed(() => props.config.label !== undefined)
const labelWidth = computed(() => props.config.labelWidth)
const labelAlign = computed(() => props.config.labelAlign || 'left')
const showRequiredMark = computed(() => props.config.required || false)
const showFeedback = computed(() => true)

// 验证规则
const validationRule = computed(() => {
  if (!props.config.rules) return undefined
  return props.config.rules
})

// 验证状态
const validationStatus = computed(() => {
  if (!formContext || !formContext.formErrors?.value) return undefined
  const error = formContext.formErrors.value[props.config.field]
  if (!error) return undefined
  return error.valid ? 'success' : 'error'
})

// 验证反馈
const validationFeedback = computed(() => {
  if (!formContext || !formContext.formErrors?.value) return undefined
  const error = formContext.formErrors.value[props.config.field]
  if (!error || error.valid) return undefined
  return error.errors[0]?.message || '验证失败'
})

// 表单项样式类
const itemClass = computed(() => {
  const classes = ['clever-form-item']
  if (props.config.className) {
    classes.push(props.config.className)
  }
  if (props.disabled || props.config.disabled) {
    classes.push('clever-form-item--disabled')
  }
  if (props.readonly || props.config.readonly) {
    classes.push('clever-form-item--readonly')
  }
  if (props.loading) {
    classes.push('clever-form-item--loading')
  }
  return classes
})

// 表单项样式
const itemStyle = computed(() => {
  return props.config.style || {}
})

// 处理字段变化
const handleFieldChange = (value: any) => {
  const oldValue = formContext?.getFieldValue?.(props.config.field)
  emit('field:change', props.config.field, value, oldValue)
}

// 处理字段聚焦
const handleFieldFocus = () => {
  emit('field:focus', props.config.field)
}

// 处理字段失焦
const handleFieldBlur = () => {
  emit('field:blur', props.config.field)
}

// 处理字段验证
const handleFieldValidate = (result: ValidationResult) => {
  emit('validate', result)
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
  position: relative;
  opacity: 0.8;
  pointer-events: none;
}

.clever-form-item--loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  z-index: 1;
}

.clever-form-item--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: clever-form-item-loading-spin 1s linear infinite;
  z-index: 2;
}

@keyframes clever-form-item-loading-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
