<template>
  <!-- 单个复选框 -->
    <template v-if="!config.options">
      <n-checkbox
        :checked="fieldValue"
        @update:checked="handleUpdateValue"
        :disabled="disabled"
        :size="config.size || 'medium'"
        :indeterminate="config.indeterminate"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        {{ config.checkboxLabel || config.label }}
      </n-checkbox>
    </template>
    
    <!-- 复选框组 -->
    <template v-else>
      <n-checkbox-group
        :value="fieldValue"
        @update:value="handleUpdateValue"
        :disabled="disabled"
        :min="config.min"
        :max="config.max"
        @change="handleChange"
      >
        <!-- 垂直布局 -->
        <n-space v-if="config.direction === 'vertical'" vertical>
          <n-checkbox
            v-for="option in computedOptions"
            :key="getOptionValue(option)"
            :value="getOptionValue(option)"
            :disabled="disabled || getOptionDisabled(option)"
            :label="getOptionLabel(option)"
            :size="config.size || 'medium'"
          >
            <!-- 自定义选项渲染 -->
            <template v-if="config.renderOption">
              <component :is="config.renderOption" :option="option" />
            </template>
            <template v-else>
              {{ getOptionLabel(option) }}
            </template>
          </n-checkbox>
        </n-space>
        
        <!-- 水平布局 -->
        <n-space v-else>
          <n-checkbox
            v-for="option in computedOptions"
            :key="getOptionValue(option)"
            :value="getOptionValue(option)"
            :disabled="disabled || getOptionDisabled(option)"
            :label="getOptionLabel(option)"
            :size="config.size || 'medium'"
          >
            <!-- 自定义选项渲染 -->
            <template v-if="config.renderOption">
              <component :is="config.renderOption" :option="option" />
            </template>
            <template v-else>
              {{ getOptionLabel(option) }}
            </template>
          </n-checkbox>
        </n-space>
      </n-checkbox-group>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NCheckbox, NCheckboxGroup, NSpace } from 'naive-ui'
import type {
  CheckboxFieldConfig,
  ValidationConfig,
  ValidationResult,
  SelectOption
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.CHECKBOX_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: CheckboxFieldConfig
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
const options = ref<SelectOption[]>([])

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

const computedOptions = computed(() => {
  // 如果配置了选项，直接使用
  if (props.config.options) {
    return props.config.options
  }
  
  // 使用响应式选项
  return options.value
})

// 选项工具函数
const getOptionValue = (option: SelectOption): any => {
  if (typeof option === 'object' && option !== null) {
    const valueField = props.config.valueField || 'value'
    return option[valueField]
  }
  return option
}

const getOptionLabel = (option: SelectOption): string => {
  if (typeof option === 'object' && option !== null) {
    const labelField = props.config.labelField || 'label'
    return option[labelField] || String(option.value || option)
  }
  return String(option)
}

const getOptionDisabled = (option: SelectOption): boolean => {
  if (typeof option === 'object' && option !== null) {
    const disabledField = props.config.disabledField || 'disabled'
    return Boolean(option[disabledField])
  }
  return false
}

// 初始化选项
const initOptions = async () => {
  if (props.config.options) {
    // 静态选项
    if (Array.isArray(props.config.options)) {
      options.value = props.config.options
    } else if (typeof props.config.options === 'function') {
      // 动态选项
      loading.value = true
      try {
        const result = await props.config.options()
        options.value = result
      } catch (error) {
        console.error('Failed to load options:', error)
        options.value = []
      } finally {
        loading.value = false
      }
    }
  }
}

// 监听配置变化
watch(
  () => props.config.options,
  () => {
    initOptions()
  },
  { immediate: true }
)

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

// 暴露方法
defineExpose({
  focus,
  blur,
  validate,
  clearValidation,
  setValue,
  loadOptions: initOptions
})
</script>

<style lang="less">
.checkbox-field {
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