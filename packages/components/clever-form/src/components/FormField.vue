<template>
  <NFormItem v-bind="getFormItemProps(schema)">
    <!-- 标签名右侧温馨提示 -->
    <template v-if="schema.labelMessage" #label>
      {{ schema.label }}
      <NTooltip trigger="hover" :style="schema.labelMessageStyle">
        <template #trigger>
          <NIcon size="18" class="cursor-pointer text-gray-400 ml-1">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"
                fill="currentColor" />
            </svg>
          </NIcon>
        </template>
        {{ schema.labelMessage }}
      </NTooltip>
    </template>

    <!-- 判断插槽 -->
    <template v-if="schema.slot">
      <slot :name="schema.slot" :model="formModel" :field="schema.field"
        :value="formModel[schema.field as string]"></slot>
    </template>

    <!-- NCheckbox -->
    <template v-else-if="getActualComponent(schema.component) === 'NCheckbox'">
      <NCheckboxGroup v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])">
        <NSpace>
          <NCheckbox v-for="item in schema.componentProps?.options || schema.props?.options || []" :key="item.value"
            :value="item.value" :label="item.label" />
        </NSpace>
      </NCheckboxGroup>
    </template>

    <!-- NRadioGroup -->
    <template v-else-if="getActualComponent(schema.component) === 'NRadioGroup'">
      <NRadioGroup v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])">
        <NSpace>
          <NRadio v-for="item in schema.componentProps?.options || schema.props?.options || []" :key="item.value"
            :value="item.value">
            {{ item.label }}
          </NRadio>
        </NSpace>
      </NRadioGroup>
    </template>

    <!-- NSelect -->
    <template v-else-if="getActualComponent(schema.component) === 'NSelect'">
      <NSelect v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NDatePicker -->
    <template v-else-if="getActualComponent(schema.component) === 'NDatePicker'">
      <NDatePicker v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NTimePicker -->
    <template v-else-if="getActualComponent(schema.component) === 'NTimePicker'">
      <NTimePicker v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NInputNumber -->
    <template v-else-if="getActualComponent(schema.component) === 'NInputNumber'">
      <NInputNumber v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NSwitch -->
    <template v-else-if="getActualComponent(schema.component) === 'NSwitch'">
      <NSwitch v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NSlider -->
    <template v-else-if="getActualComponent(schema.component) === 'NSlider'">
      <NSlider v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NRate -->
    <template v-else-if="getActualComponent(schema.component) === 'NRate'">
      <NRate v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NDynamicTags -->
    <template v-else-if="getActualComponent(schema.component) === 'NDynamicTags'">
      <NDynamicTags v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- NInputTextArea -->
    <template v-else-if="getActualComponent(schema.component) === 'NInputTextArea'">
      <NInput v-model:value="formModel[schema.field as string]" type="textarea"
        v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- 默认 NInput -->
    <template v-else>
      <NInput v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
        @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
    </template>

    <!-- 后缀 -->
    <template v-if="schema.suffix">
      <span class="ml-2 text-gray-500">{{ schema.suffix }}</span>
    </template>
  </NFormItem>
</template>

<script setup lang="ts">
import {
  NFormItem,
  NCheckbox,
  NCheckboxGroup,
  NRadio,
  NRadioGroup,
  NSelect,
  NDatePicker,
  NTimePicker,
  NInputNumber,
  NSwitch,
  NSlider,
  NRate,
  NDynamicTags,
  NInput,
  NSpace,
  NTooltip,
  NIcon
} from 'naive-ui'
import type { FormSchema, CleverFormMethods } from '../types/form'

interface Props {
  schema: FormSchema
  formModel: Record<string, any>
  methods: CleverFormMethods
}

const props = defineProps<Props>()

// 组件名映射
const componentMap: Record<string, string> = {
  'input': 'NInput',
  'textarea': 'NInputTextArea', 
  'input-number': 'NInputNumber',
  'select': 'NSelect',
  'checkbox-group': 'NCheckbox',
  'radio-group': 'NRadioGroup',
  'date-picker': 'NDatePicker',
  'time-picker': 'NTimePicker',
  'switch': 'NSwitch',
  'slider': 'NSlider',
  'rate': 'NRate',
  'dynamic-tags': 'NDynamicTags'
}

// 获取实际组件名
const getActualComponent = (component: string) => {
  return componentMap[component] || component
}

// 获取表单项属性
const getFormItemProps = (schema: FormSchema) => {
  const baseProps = {
    label: schema.label,
    path: schema.field,
    rule: schema.rules,
    labelWidth: schema.labelWidth,
    showRequiredMark: schema.required
  }
  
  // 过滤掉undefined的属性
  return Object.fromEntries(
    Object.entries(baseProps).filter(([_, value]) => value !== undefined)
  )
}

// 获取组件属性
const getComponentProps = (schema: FormSchema) => {
  // 兼容 props 和 componentProps 两种写法
  const schemaProps = schema.componentProps || schema.props || {}
  
  const baseProps = {
    placeholder: schemaProps.placeholder || `请输入${schema.label}`,
    disabled: schemaProps.disabled || false,
    ...schemaProps
  }
  
  // 移除不需要传递给组件的属性
  const { options, ...componentProps } = baseProps
  return componentProps
}

// 处理字段值变化
const handleFieldChange = (schema: FormSchema, newValue: any, oldValue: any) => {
  if (schema.onChange) {
    schema.onChange(newValue, oldValue, props.methods)
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.ml-1 {
  margin-left: 0.25rem;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>