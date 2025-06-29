<template>
  <!-- 时间选择器 -->
    <n-time-picker
      :value="fieldValue"
      @update:value="handleUpdateValue"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="config.clearable ?? true"
      :placeholder="config.placeholder"
      :size="config.size || 'medium'"
      :format="config.format || 'HH:mm:ss'"
      :value-format="config.valueFormat"
      :hours="config.hours"
      :minutes="config.minutes"
      :seconds="config.seconds"
      :show-icon="config.showIcon ?? true"
      :use12-hours="config.use12Hours"
      :input-readonly="config.inputReadonly"
      :actions="config.actions"
      :status="validationStatus"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @clear="handleClear"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NTimePicker } from 'naive-ui'
import type {
  TimeFieldConfig,
  ValidationConfig,
  ValidationResult
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.TIME_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: TimeFieldConfig
  /** 字段值 */
  modelValue?: any
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 验证配置 */
  // validation?: ValidationConfig
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false
})

// Events定义
interface Emits {
  'update:modelValue': [value: any]
  'change': [value: any]
  'focus': []
  'blur': []
  'confirm': [value: any]
  'clear': []
  'validate': [result: ValidationResult]
}

const emit = defineEmits<Emits>()

// 使用字段hook
const {
  fieldValue,
  fieldState,
  validationResult,
  setValue,
  validate,
  clearValidation,
  focus,
  blur
} = useField({
  config: computed(() => props.config),
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly)
  // validation: computed(() => props.validation)
})

// 计算属性
const isRequired = computed(() => {
  return props.config.required || 
    (props.config.rules && props.config.rules.some(rule => rule.required))
})

const validationStatus = computed(() => {
  if (!validationResult.value) return undefined
  return validationResult.value.valid ? undefined : 'error'
})

const errorMessage = computed(() => {
  if (!validationResult.value || validationResult.value.valid) return ''
  return validationResult.value.message
})

// 事件处理
const handleUpdateValue = (value: any) => {
  setValue(value)
  emit('update:modelValue', value)
  emit('change', value)
  
  // 触发验证
  if (props.config.validateTrigger === 'change') {
    validate()
  }
}

const handleFocus = () => {
  focus()
  emit('focus')
}

const handleBlur = () => {
  blur()
  emit('blur')
  
  // 触发验证
  if (props.config.validateTrigger === 'blur') {
    validate()
  }
}

const handleConfirm = (value: any) => {
  emit('confirm', value)
  
  // 确认时触发验证
  if (props.config.validateTrigger === 'confirm') {
    validate()
  }
}

const handleClear = () => {
  emit('clear')
  
  // 清空时触发验证
  if (props.config.validateTrigger === 'change') {
    validate()
  }
}

// 暴露方法
defineExpose({
  focus,
  blur,
  validate,
  clearValidation,
  setValue
})
</script>

<style lang="less">
.time-field {
  width: 100%;
  
  &__label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    &-text {
      color: var(--n-text-color-1);
      font-size: 14px;
      font-weight: 500;
    }
    
    &-required {
      color: var(--n-error-color);
      margin-left: 4px;
      font-size: 14px;
    }
  }
  
  &__error {
    margin-top: 6px;
    color: var(--n-error-color);
    font-size: 12px;
    line-height: 1.4;
  }
  
  &__help {
    margin-top: 6px;
    color: var(--n-text-color-3);
    font-size: 12px;
    line-height: 1.4;
  }
}
</style>