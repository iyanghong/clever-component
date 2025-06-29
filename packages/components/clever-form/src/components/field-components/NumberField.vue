<template>
  <!-- 数字输入框 -->
  <n-input-number
      :value="fieldValue"
      @update:value="handleUpdateValue"
      :placeholder="config.placeholder || `请输入${config.label || ''}`"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="config.clearable !== false"
      :size="config.size || 'medium'"
      :min="config.min"
      :max="config.max"
      :step="config.step || 1"
      :precision="config.precision"
      :show-button="config.showButton !== false"
      :button-placement="config.buttonPlacement || 'right'"
      :keyboard="config.keyboard === false ? false : (typeof config.keyboard === 'object' ? config.keyboard : {})"
      :status="validationStatus"
      :input-props="config.inputProps"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
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
  </n-input-number>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInputNumber } from 'naive-ui'
import type {
  NumberInputFieldConfig,
  ValidationConfig,
  ValidationResult
} from '../../types'

// 数字字段配置类型
type NumberFieldConfig = NumberInputFieldConfig & {
  keyboard?: boolean | object
  [key: string]: any
}
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.NUMBER_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: NumberFieldConfig
  /** 字段值 */
  modelValue?: number | null
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 验证配置 */
  // validation?: ValidationConfig
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
  readonly: false
})

// Events定义
interface Emits {
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
  'focus': []
  'blur': []
  'validate': [result: ValidationResult]
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
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
const handleUpdateValue = (value: number | null) => {
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
  if (props.config.validateTrigger === 'blur' || !props.config.validateTrigger) {
    validate()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
  
  // 处理回车事件
  if (event.key === 'Enter' && props.config.onEnter) {
    props.config.onEnter(fieldValue.value, event)
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
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
.number-field {
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