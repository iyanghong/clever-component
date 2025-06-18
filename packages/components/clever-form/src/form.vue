<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '@/components/clever-form/src/hook/use-form'
import { isArray } from '@/utils/is'
import defaultCleverFormProps from './default-props'
import type { FormSchema } from './types/form'

const props = defineProps(defaultCleverFormProps)
const formRef = ref()
const emit = defineEmits(['reset', 'submit'])

const {
  formModel,
  formItemFieldKeys,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  unfoldToggle,
  getComponentProps,
  getFormItemProps,
  loading,
  getProps,
  getGrid,
  getSchema,
  resetFields,
  clearValidate,
  getSubmitBtnOptions,
  getResetBtnOptions,
  isInline,
  handleSubmit,
  handleReset,
  methods
} = useForm(props as any, formRef, emit)

const ifShowFormItem = (schema: FormSchema) => {
  if (schema.ifShow) {
    const isShow = schema.ifShow(formModel.value, formModel.value[schema.field as string] || '', methods)
    if (isShow && schema.component === 'NDynamicTags') {
      try {
        formModel.value[schema.field as string] = isArray(formModel.value[schema.field as string])
          ? formModel.value[schema.field as string]
          : JSON.parse(formModel.value[schema.field as string])
      } catch (e) {
        formModel.value[schema.field as string] = schema.defaultValue || []
      }
    }
    return isShow
  }
  return true
}

// 处理字段值变化
const handleFieldChange = (schema: FormSchema, newValue: any, oldValue: any) => {
  if (schema.onChange) {
    schema.onChange(newValue, oldValue, methods)
  }
}

defineExpose({
  resetFields,
  loading,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData
})
</script>

<template>
  <NForm v-bind="getProps" ref="formRef" :model="formModel">
    <NGrid v-bind="getGrid">
      <template v-for="schema in getSchema" :key="schema.field">
        <NGi v-if="ifShowFormItem(schema)" v-bind="schema.giProps">
          <NFormItem
            :key="formItemFieldKeys[schema.field as string]"
            :class="schema.showMode === 'detail' ? 'clever-form-item-detail' : ''"
            v-bind="getFormItemProps(schema)"
          >
            <!-- 标签名右侧温馨提示 -->
            <template v-if="schema.labelMessage" #label>
              {{ schema.label }}
              <NTooltip trigger="hover" :style="schema.labelMessageStyle">
                <template #trigger>
                  <NIcon size="18" class="cursor-pointer text-gray-400 ml-1">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z" fill="currentColor"/>
                    </svg>
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
              ></slot>
            </template>

            <!-- NCheckbox -->
            <template v-else-if="schema.component === 'NCheckbox'">
              <NCheckboxGroup 
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              >
                <NSpace>
                  <NCheckbox
                    v-for="item in schema.componentProps?.options || []"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </NSpace>
              </NCheckboxGroup>
            </template>

            <!-- NRadioGroup -->
            <template v-else-if="schema.component === 'NRadioGroup'">
              <NRadioGroup 
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              >
                <NSpace>
                  <NRadio
                    v-for="item in schema.componentProps?.options || []"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </NRadio>
                </NSpace>
              </NRadioGroup>
            </template>

            <!-- NSelect -->
            <template v-else-if="schema.component === 'NSelect'">
              <NSelect
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NDatePicker -->
            <template v-else-if="schema.component === 'NDatePicker'">
              <NDatePicker
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NTimePicker -->
            <template v-else-if="schema.component === 'NTimePicker'">
              <NTimePicker
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NInputNumber -->
            <template v-else-if="schema.component === 'NInputNumber'">
              <NInputNumber
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NSwitch -->
            <template v-else-if="schema.component === 'NSwitch'">
              <NSwitch
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NSlider -->
            <template v-else-if="schema.component === 'NSlider'">
              <NSlider
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NRate -->
            <template v-else-if="schema.component === 'NRate'">
              <NRate
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NDynamicTags -->
            <template v-else-if="schema.component === 'NDynamicTags'">
              <NDynamicTags
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- NInputTextArea -->
            <template v-else-if="schema.component === 'NInputTextArea'">
              <NInput
                v-model:value="formModel[schema.field as string]"
                type="textarea"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- 默认 NInput -->
            <template v-else>
              <NInput
                v-model:value="formModel[schema.field as string]"
                v-bind="getComponentProps(schema)"
                @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])"
              />
            </template>

            <!-- 后缀 -->
            <template v-if="schema.suffix">
              <span class="ml-2 text-gray-500">{{ schema.suffix }}</span>
            </template>
          </NFormItem>
        </NGi>
      </template>

      <!-- 操作按钮组 -->
      <NGi v-if="showActionButtonGroup" :span="24">
        <NSpace justify="end">
          <!-- 展开收起按钮 -->
          <NButton v-if="showAdvancedButton" text @click="unfoldToggle">
            {{ collapsed ? '展开' : '收起' }}
            <template #icon>
              <NIcon>
                <svg v-if="collapsed" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14l5-5 5 5z" fill="currentColor"/>
                </svg>
              </NIcon>
            </template>
          </NButton>
          
          <!-- 重置按钮 -->
          <NButton v-if="showResetButton" v-bind="getResetBtnOptions" @click="handleReset">
            {{ resetButtonText }}
          </NButton>
          
          <!-- 提交按钮 -->
          <NButton v-if="showSubmitButton" v-bind="getSubmitBtnOptions" @click="handleSubmit">
            {{ submitButtonText }}
          </NButton>
        </NSpace>
      </NGi>
    </NGrid>
  </NForm>
</template>

<style scoped>
.clever-form-item-detail :deep(.n-form-item-label) {
  font-weight: normal;
}

.clever-form-item-detail :deep(.n-form-item-blank) {
  min-height: auto;
}
</style>