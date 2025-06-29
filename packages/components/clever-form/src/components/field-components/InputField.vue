<template>
  <!-- 输入框 -->
  <n-input
      v-model:value="modelValue"
      :placeholder="config.placeholder || `请输入${config.label || ''}`"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="config.clearable !== false"
      :show-password-on="config.type === 'password' ? 'click' : undefined"
      :type="inputType"
      :size="config.size || 'medium'"
      :maxlength="config.maxlength"
      :minlength="config.minlength"
      :show-count="config.showCount"
      :status="validationStatus"
      :input-props="config.inputProps"
      @input="handleNaiveInput"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
      @keydown="handleNaiveKeydown"
      @keyup="handleNaiveKeyup"
    >
      <!-- 前缀插槽 -->
      <template v-if="config.prefix || $slots.prefix" #prefix>
        <slot name="prefix">
          <component :is="config.prefix" v-if="config.prefix" />
        </slot>
      </template>
      
      <!-- 后缀插槽 -->
      <template v-if="config.suffix || $slots.suffix" #suffix>
        <slot name="suffix">
          <component :is="config.suffix" v-if="config.suffix" />
        </slot>
      </template>
  </n-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NInput } from 'naive-ui'
import type {
  InputFieldConfig,
  ValidationConfig,
  ValidationResult
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.INPUT_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: InputFieldConfig
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

// 使用 defineModel 定义双向绑定
const modelValue = defineModel<string>({ default: '' })

// Events定义
interface Emits {
  'change': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'validate': [result: ValidationResult]
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
  'input': [value: string]
}

const emit = defineEmits<Emits>()

// 使用字段hook
const {
  fieldState,
  validationResult,
  validate,
  clearValidation,
  focus,
  blur,
  handleFocus,
  handleBlur,
  handleChange
} = useField({
  config: computed(() => props.config),
  modelValue,
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly)
  // validation: computed(() => props.validation)
})

// 计算属性
const inputType = computed(() => {
  // 优先使用 inputType，然后是 type
  const inputType = props.config.inputType || props.config.type
  
  if (inputType === 'password' || props.config.type === 'password') {
    return 'password'
  }
  if (inputType === 'email') return 'email'
  if (inputType === 'url') return 'url'
  if (inputType === 'tel') return 'tel'
  if (inputType === 'number') return 'number'
  
  return 'text'
})

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

// Naive UI 事件处理
const handleNaiveFocus = (e: FocusEvent) => {
  handleFocus()
  emit('focus', e)
}

const handleNaiveBlur = (e: FocusEvent) => {
  handleBlur()
  emit('blur', e)
}

const handleNaiveKeydown = (e: KeyboardEvent) => {
  emit('keydown', e)
  
  // 处理回车事件
  if (e.key === 'Enter' && props.config.onEnter) {
    props.config.onEnter(e)
  }
}

const handleNaiveKeyup = (e: KeyboardEvent) => {
  emit('keyup', e)
}

const handleNaiveInput = (value: string) => {
  // 触发字段变更逻辑
  handleChange(value)
  emit('input', value)
  emit('change', value)
}

// 暴露方法
defineExpose({
  focus,
  blur,
  validate,
  clearValidation
})
</script>

<style lang="less">
.input-field {
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