<template>
  <!-- 文本域 -->
  <n-input
      type="textarea"
      :value="fieldValue"
      @update:value="handleUpdateValue"
      :placeholder="config.placeholder || `请输入${config.label || ''}`"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="config.clearable !== false"
      :size="config.size || 'medium'"
      :maxlength="config.maxlength"
      :minlength="config.minlength"
      :show-count="config.showCount"
      :rows="config.rows || 3"
      :autosize="config.autosize"
      :resizable="config.resizable !== false"
      :status="validationStatus"
      :input-props="config.inputProps"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @input="handleInput"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInput } from 'naive-ui'
import type {
  TextareaFieldConfig,
  ValidationConfig,
  ValidationResult
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.TEXTAREA_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: TextareaFieldConfig
  /** 字段值 */
  modelValue?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 验证配置 */
  // validation?: ValidationConfig
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  readonly: false
})

// Events定义
interface Emits {
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': []
  'blur': []
  'validate': [result: ValidationResult]
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
  'input': [value: string]
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
const handleUpdateValue = (value: string) => {
  setValue(value)
  emit('update:modelValue', value)
}

const handleChange = (value: string) => {
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
  if (props.config.validateTrigger === 'blur' || !props.config.validateTrigger) {
    validate()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
  
  // 处理快捷键
  if (props.config.onKeydown) {
    props.config.onKeydown(fieldValue.value, event)
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}

const handleInput = (value: string) => {
  emit('input', value)
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
.textarea-field {
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