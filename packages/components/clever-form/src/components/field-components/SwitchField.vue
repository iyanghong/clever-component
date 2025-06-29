<template>
  <!-- 开关 -->
    <div class="switch-field__control">
      <n-switch
        :value="fieldValue"
      @update:value="handleUpdateValue"
        :disabled="disabled"
        :loading="loading"
        :size="config.size || 'medium'"
        :checked-value="config.checkedValue ?? true"
        :unchecked-value="config.uncheckedValue ?? false"
        :round="config.round ?? true"
      @focus="handleFocus"
      @blur="handleBlur"
      >
        <!-- 选中状态图标 -->
        <template v-if="config.checkedIcon" #checked-icon>
          <component :is="config.checkedIcon" />
        </template>
        
        <!-- 未选中状态图标 -->
        <template v-if="config.uncheckedIcon" #unchecked-icon>
          <component :is="config.uncheckedIcon" />
        </template>
        
        <!-- 选中状态文本 -->
        <template v-if="config.checkedText" #checked>
          {{ config.checkedText }}
        </template>
        
        <!-- 未选中状态文本 -->
        <template v-if="config.uncheckedText" #unchecked>
          {{ config.uncheckedText }}
        </template>
      </n-switch>
      
      <!-- 开关标签 -->
      <span v-if="config.switchLabel" class="switch-field__switch-label">
        {{ config.switchLabel }}
      </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NSwitch } from 'naive-ui'
import type {
  SwitchFieldConfig,
  ValidationConfig,
  ValidationResult
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.SWITCH_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: SwitchFieldConfig
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
  'validate': [result: ValidationResult]
}

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)

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
const handleUpdateValue = async (value: any) => {
  // 如果配置了异步处理
  if (props.config.beforeChange) {
    loading.value = true
    try {
      const shouldChange = await props.config.beforeChange(value, props.value)
      if (shouldChange !== false) {
        setValue(value)
        emit('update:modelValue', value)
        emit('change', value)
        
        // 触发验证
        if (props.config.validateTrigger === 'change') {
          validate()
        }
      }
    } catch (error) {
      console.error('Switch beforeChange error:', error)
    } finally {
      loading.value = false
    }
  } else {
    setValue(value)
    emit('update:modelValue', value)
    emit('change', value)
    
    // 触发验证
    if (props.config.validateTrigger === 'change') {
      validate()
    }
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
.switch-field {
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
  
  &__control {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__switch-label {
    color: var(--n-text-color-2);
    font-size: 14px;
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