<template>
  <div 
    :class="[
      'field-renderer',
      {
        'field-renderer--loading': loading,
        'field-renderer--disabled': disabled,
        'field-renderer--readonly': readonly
      }
    ]"
  >
    <!-- 复选框组 -->
    <n-checkbox-group
      v-if="getActualComponent(config.component) === 'NCheckboxGroup'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    >
      <n-checkbox
        v-for="option in getOptions(config)"
        :key="option.value"
        :value="option.value"
        :label="option.label"
        :disabled="option.disabled"
      />
    </n-checkbox-group>

    <!-- 单选框组 -->
    <n-radio-group
      v-else-if="getActualComponent(config.component) === 'NRadioGroup'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    >
      <n-radio
        v-for="option in getOptions(config)"
        :key="option.value"
        :value="option.value"
        :label="option.label"
        :disabled="option.disabled"
      />
    </n-radio-group>

    <!-- 选择器 -->
    <n-select
      v-else-if="getActualComponent(config.component) === 'NSelect'"
      v-model:value="fieldValue"
      :options="getOptions(config)"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 日期选择器 -->
    <n-date-picker
      v-else-if="getActualComponent(config.component) === 'NDatePicker'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 时间选择器 -->
    <n-time-picker
      v-else-if="getActualComponent(config.component) === 'NTimePicker'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 开关 -->
    <n-switch
      v-else-if="getActualComponent(config.component) === 'NSwitch'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 滑块 -->
    <n-slider
      v-else-if="getActualComponent(config.component) === 'NSlider'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 评分 -->
    <n-rate
      v-else-if="getActualComponent(config.component) === 'NRate'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 上传 -->
    <n-upload
      v-else-if="getActualComponent(config.component) === 'NUpload'"
      v-model:file-list="fieldValue"
      v-bind="getComponentProps(config)"
      @update:file-list="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 数字输入框 -->
    <n-input-number
      v-else-if="getActualComponent(config.component) === 'NInputNumber'"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 文本域 -->
    <n-input
      v-else-if="getActualComponent(config.component) === 'NInputTextArea'"
      type="textarea"
      v-model:value="fieldValue"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 输入框 -->
    <n-input
      v-else-if="isInputComponent(config.component)"
      v-model:value="fieldValue"
      :type="config.component === 'password' ? 'password' : 'text'"
      v-bind="getComponentProps(config)"
      @update:value="handleNaiveUpdate"
      @focus="handleNaiveFocus"
      @blur="handleNaiveBlur"
    />

    <!-- 未知组件类型 -->
    <div v-else class="field-renderer__unknown">
      <div class="field-renderer__unknown-content">
        <n-icon class="field-renderer__unknown-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </n-icon>
        <div class="field-renderer__unknown-text">未知组件类型</div>
        <div class="field-renderer__unknown-field">{{ config.component }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NSelect,
  NDatePicker,
  NTimePicker,
  NSwitch,
  NSlider,
  NRate,
  NUpload,
  NInputNumber,
  NInput,
  NIcon
} from 'naive-ui'
import type { FieldConfig, ValidationResult, OptionItem } from '../../types'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.FIELD_RENDERER
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
import { useFormContext } from '../../hooks/useForm'

const formContext = useFormContext()

// Events定义
interface Emits {
  change: [value: any]
  focus: []
  blur: []
  validate: [result: ValidationResult]
}

const emit = defineEmits<Emits>()

// 计算当前字段值
const fieldValue = computed({
  get: () => formContext?.getFieldValue?.(props.config.field),
  set: (value) => formContext?.setFieldValue?.(props.config.field, value)
})

// 组件名映射
const componentMap: Record<string, string> = {
  'input': 'NInput',
  'textarea': 'NInputTextArea',
  'number': 'NInputNumber',
  'number-input': 'NInputNumber',
  'select': 'NSelect',
  'checkbox': 'NCheckboxGroup',
  'checkbox-group': 'NCheckboxGroup',
  'radio': 'NRadioGroup',
  'radio-group': 'NRadioGroup',
  'date': 'NDatePicker',
  'date-picker': 'NDatePicker',
  'time': 'NTimePicker',
  'time-picker': 'NTimePicker',
  'switch': 'NSwitch',
  'slider': 'NSlider',
  'rate': 'NRate',
  'upload': 'NUpload',
  'password': 'NInput',
  'search': 'NInput'
}

// 获取实际组件名
const getActualComponent = (component: string) => {
  return componentMap[component] || component
}

// 判断是否为输入组件
const isInputComponent = (component: string) => {
  const inputTypes = ['input', 'password', 'search']
  return inputTypes.includes(component) || getActualComponent(component) === 'NInput'
}

// 获取组件属性
const getComponentProps = (config: FieldConfig) => {
  const configProps = config.props || {}
  
  const baseProps = {
    placeholder: configProps.placeholder || `请输入${config.label}`,
    disabled: props.disabled || configProps.disabled || false,
    readonly: props.readonly || configProps.readonly || false,
    loading: props.loading || configProps.loading || false,
    ...configProps
  }
  
  // 移除不需要传递给组件的属性
  const { 
    options, 
    field, 
    ...componentProps 
  } = baseProps
  return componentProps
}

// 获取选项数据
const getOptions = (config: FieldConfig): OptionItem[] => {
  const configProps = config.props || {}
  return configProps.options || []
}

// 处理值变化
const handleValueChange = (value: any) => {
  const oldValue = fieldValue.value
  fieldValue.value = value
  emit('change', value)
  
  // 如果配置了 onChange 回调，则调用
  if (props.config.events?.change) {
    props.config.events.change(value, oldValue)
  }
}

// 处理 Naive UI 组件的更新事件
const handleNaiveUpdate = (value: any) => {
  handleValueChange(value)
}

// 处理 Naive UI 组件的焦点事件
const handleNaiveFocus = () => {
  emit('focus')
}

// 处理 Naive UI 组件的失焦事件
const handleNaiveBlur = () => {
  emit('blur')
}
</script>

<style lang="less">
.field-renderer {
  width: 100%;
  position: relative;
  
  &--loading {
    opacity: 0.8;
    pointer-events: none;
  }
  
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--readonly {
    pointer-events: none;
  }
  
  &__unknown {
    padding: 16px;
    border: 2px dashed var(--n-border-color);
    border-radius: 6px;
    background-color: var(--n-color-target);
    
    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
    }
    
    &-icon {
      font-size: 20px;
    }
    
    &-text {
      color: var(--n-text-color-2);
      font-size: 14px;
      font-weight: 500;
    }
    
    &-field {
      color: var(--n-text-color-3);
      font-size: 12px;
    }
  }
}
</style>
