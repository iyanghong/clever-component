<template>
  <!-- 选择器 -->
  <n-select
      v-model:value="fieldState.value"
      @update:value="handleNaiveUpdate"
      :placeholder="config.placeholder || `请选择${config.label || ''}`"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="config.clearable !== false"
      :multiple="config.multiple"
      :filterable="config.filterable"
      :remote="config.remote"
      :loading="loading"
      :size="config.size || 'medium'"
      :max-tag-count="config.maxTagCount"
      :options="computedOptions"
      :value-field="config.valueField || 'value'"
      :label-field="config.labelField || 'label'"
      :children-field="config.childrenField || 'children'"
      :disabled-field="config.disabledField || 'disabled'"
      :status="validationStatus"
      :consistent-menu-width="config.consistentMenuWidth !== false"
      :virtual-scroll="config.virtualScroll"
      :fallback-option="config.fallbackOption"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
      @clear="handleNaiveClear"
      @search="handleNaiveSearch"
      @scroll="handleNaiveScroll"
    >
      <!-- 自定义选项渲染 -->
      <template v-if="config.renderOption" #option="{ node, option }">
        <component :is="config.renderOption" :node="node" :option="option" />
      </template>
      
      <!-- 自定义标签渲染 -->
      <template v-if="config.renderTag" #tag="{ option, handleClose }">
        <component :is="config.renderTag" :option="option" :handle-close="handleClose" />
      </template>
      
      <!-- 自定义标签渲染 -->
      <template v-if="config.renderLabel" #label="{ option }">
        <component :is="config.renderLabel" :option="option" />
      </template>
      
      <!-- 空状态 -->
      <template v-if="config.renderEmpty" #empty>
        <component :is="config.renderEmpty" />
      </template>
  </n-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NSelect } from 'naive-ui'
import type {
  SelectFieldConfig,
  ValidationConfig,
  ValidationResult,
  SelectOption
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.SELECT_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: SelectFieldConfig
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
  'search': [query: string]
  'scroll': [event: Event]
}

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const options = ref<SelectOption[]>([])

// 使用字段hook
const {
  fieldState,
  validationResult,
  handleFocus,
  handleBlur,
  handleChange,
  setValue,
  validate,
  clearValidation
} = useField(props.config, props.modelValue)

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
  
  // 如果是远程搜索，使用响应式选项
  if (props.config.remote) {
    return options.value
  }
  
  return []
})

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

// Naive UI 事件处理
const handleNaiveUpdate = (value: any) => {
  handleChange(value)
  emit('update:modelValue', value)
  emit('change', value)
}

const handleNaiveFocus = () => {
  handleFocus()
  emit('focus')
}

const handleNaiveBlur = () => {
  handleBlur()
  emit('blur')
}

const handleNaiveClear = () => {
  const clearValue = props.config.multiple ? [] : null
  handleChange(clearValue)
  emit('update:modelValue', clearValue)
  emit('change', clearValue)
}

const handleNaiveSearch = async (query: string) => {
  emit('search', query)
  
  // 远程搜索
  if (props.config.remote && props.config.onSearch) {
    loading.value = true
    try {
      const result = await props.config.onSearch(query)
      options.value = result
    } catch (error) {
      console.error('Failed to search options:', error)
      options.value = []
    } finally {
      loading.value = false
    }
  }
}

const handleNaiveScroll = (event: Event) => {
  emit('scroll', event)
  
  // 滚动加载更多
  if (props.config.onScroll) {
    props.config.onScroll(event)
  }
}

// 暴露方法
defineExpose({
  validate,
  clearValidation,
  setValue,
  loadOptions: initOptions
})
</script>

<style lang="less">
.select-field {
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