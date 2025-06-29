<template>
  <!-- 日期选择器 -->
    <n-date-picker
      :value="fieldValue"
      @update:value="handleUpdateValue"
      :type="config.type || 'date'"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="config.clearable ?? true"
      :placeholder="config.placeholder"
      :size="config.size || 'medium'"
      :format="config.format"
      :value-format="config.valueFormat"
      :separator="config.separator"
      :start-placeholder="config.startPlaceholder"
      :end-placeholder="config.endPlaceholder"
      :shortcuts="config.shortcuts"
      :is-date-disabled="config.isDateDisabled"
      :is-time-disabled="config.isTimeDisabled"
      :time-picker-props="config.timePickerProps"
      :actions="config.actions"
      :first-day-of-week="config.firstDayOfWeek"
      :panel-count="config.panelCount"
      :default-time="config.defaultTime"
      :default-calendar-start-time="config.defaultCalendarStartTime"
      :default-calendar-end-time="config.defaultCalendarEndTime"
      :close-on-select="config.closeOnSelect"
      :update-value-on-close="config.updateValueOnClose"
      :status="validationStatus"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @clear="handleClear"
    >
      <!-- 自定义日期渲染 -->
      <template v-if="config.renderDate" #date-icon="{ date }">
        <component :is="config.renderDate" :date="date" />
      </template>
      
      <!-- 自定义面板额外内容 -->
      <template v-if="config.renderExtra" #panel-extra>
        <component :is="config.renderExtra" />
      </template>
  </n-date-picker>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NDatePicker } from 'naive-ui'
import type {
  DateFieldConfig,
  ValidationResult
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.DATE_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: DateFieldConfig
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
.date-field {
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