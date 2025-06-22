<template>
  <NFormItem v-bind="getFormItemProps(schema)">
    <!-- 标签名右侧温馨提示 -->
    <template v-if="schema.labelMessage" #label>
      {{ schema.label }}
      <NTooltip trigger="hover" :style="schema.labelMessageStyle">
        <template #trigger>
          <NIcon size="18" class="cursor-pointer text-gray-400 ml-1">
            <InfoIcon />
          </NIcon>
        </template>
        {{ schema.labelMessage }}
      </NTooltip>
    </template>

    <!-- 判断插槽 -->
    <template v-if="schema.slot">
      <slot
        :name="schema.slot"
        :model="formModel"
        :field="schema.field"
        :value="formModel[schema.field as string]"
      />
    </template>

    <!-- 动态组件渲染 -->
    <component
      v-else
      :is="getFormComponent(schema)"
      v-model:value="formModel[schema.field as string]"
      v-bind="getComponentProps(schema)"
      @update:value="
        val => handleFieldChange(schema, val, formModel[schema.field as string])
      "
    >
      <!-- 选项类组件的子元素渲染 -->
      <template v-if="needsOptionsRendering(schema)">
        <NSpace v-if="getActualComponent(schema.component) === 'NCheckbox'">
          <NCheckbox
            v-for="item in getOptions(schema)"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </NSpace>
        <NSpace
          v-else-if="getActualComponent(schema.component) === 'NRadioGroup'"
        >
          <NRadio
            v-for="item in getOptions(schema)"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </NRadio>
        </NSpace>
      </template>
    </component>

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
import { InfoIcon } from '../icons'
import type { FormFieldSchema, CleverFormMethods } from '../types/form'
import { useFormFieldRenderer } from '../composables/useFormFieldRenderer'

interface Props {
  schema: FormFieldSchema
  formModel: Record<string, any>
  getFormItemProps?: (schema: FormFieldSchema) => Record<string, any>
  getComponentProps?: (schema: FormFieldSchema) => Record<string, any>
  handleFieldChange?: (
    schema: FormFieldSchema,
    newValue: any,
    oldValue: any
  ) => void
}

const props = defineProps<Props>()

const {
  getActualComponent,
  getFormItemProps: defaultGetFormItemProps,
  getComponentProps: defaultGetComponentProps,
  getFormComponent,
  getOptions,
  needsOptionsRendering,
  handleFieldChange: defaultHandleFieldChange
} = useFormFieldRenderer({ schema: props.schema, formModel: props.formModel })

// 使用传入的函数或默认函数
const getFormItemProps = props.getFormItemProps || defaultGetFormItemProps
const getComponentProps = props.getComponentProps || defaultGetComponentProps
const handleFieldChange = props.handleFieldChange || defaultHandleFieldChange
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
