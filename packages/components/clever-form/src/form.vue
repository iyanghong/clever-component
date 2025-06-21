<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '@/components/clever-form/src/hook/use-form'
import { isArray } from '@/utils/is'
import defaultCleverFormProps from './default-props'
import FormRenderer from './components/FormRenderer.vue'
import type { FormSchema, FormFieldSchema, FormGroupSchema, FormContainerSchema } from './types/form'
import {
  NButton,
  NCheckbox,
  NCollapse,
  NCollapseItem,
  NDatePicker,
  NDynamicTags,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NInputNumber,
  NInputTextArea,
  NRadio,
  NRadioGroup,
  NRate,
  NSelect,
  NSlider,
  NSpace,
  NSwitch,
  NTabPane,
  NTabs,
  NTimePicker,
  NTooltip
} from 'naive-ui'

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
  collapsed,
  getProps,
  getGrid,
  getSchema,
  resetFields,
  clearValidate,
  getSubmitBtnOptions,
  getResetBtnOptions,
  getFlexStyle,
  getFlexItemStyle,
  getGroupedSchemas,
  getFormComponent,
  isInline,
  handleSubmit,
  handleReset,
  methods
} = useForm(props as any, formRef, emit)

// 从methods中解构submit方法
const { submit } = methods

// 构建传递给FormRenderer的methods对象
const formMethods = computed(() => ({
  resetFields,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  clearValidate,
  validate: async (nameList?: any[]) => {
    return await formRef.value?.validate(nameList)
  },
  submit
}))

// 从props中获取layoutMode，支持mixed模式
const layoutMode = computed(() => props.layoutMode || 'grid')

// 类型守卫函数
const isFormFieldSchema = (schema: FormSchema): schema is FormFieldSchema => {
  return 'field' in schema && 'component' in schema
}

const isFormGroupSchema = (schema: FormSchema): schema is FormGroupSchema => {
  return 'title' in schema && 'fields' in schema && !('type' in schema)
}

const isFormContainerSchema = (schema: FormSchema): schema is FormContainerSchema => {
  return 'type' in schema && schema.type === 'container'
}

const ifShowFormItem = (schema: FormSchema) => {
  if (!isFormFieldSchema(schema)) {
    return true
  }
  
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
  if (isFormFieldSchema(schema) && schema.onChange) {
    schema.onChange(newValue, oldValue, methods)
  }
}

defineExpose({
  resetFields,
  loading,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  submit
})
</script>

<template>
  <div class="clever-form">
    <NForm ref="formRef" v-bind="getProps" :model="formModel" @keydown.enter="handleSubmit" :disabled="true">
      <!-- 混合布局模式 -->
      <template v-if="layoutMode === 'mixed'">
        <FormRenderer 
          :schemas="schemas"
          :form-model="formModel"
          :methods="formMethods"
          :layout-config="layoutConfig"
        />
      </template>
      <!-- Grid Layout -->
      <template v-if="layoutMode === 'grid'">
        <NGrid v-bind="getGrid">
          <template v-for="schema in getSchema" :key="isFormFieldSchema(schema) ? schema.field : `group-${Math.random()}`">
            <NGi v-if="ifShowFormItem(schema) && isFormFieldSchema(schema)" v-bind="getComponentProps(schema)">
              <NFormItem v-bind="getFormItemProps(schema)">
                <!-- 标签名右侧温馨提示 -->
                <template v-if="isFormFieldSchema(schema) && schema.labelMessage" #label>
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
                <template v-if="isFormFieldSchema(schema) && schema.slot">
                  <slot :name="schema.slot" :model="formModel" :field="schema.field"
                    :value="formModel[schema.field as string]"></slot>
                </template>

                <!-- NCheckbox -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NCheckbox'">
                  <NCheckboxGroup v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val:any) => handleFieldChange(schema, val, formModel[schema.field as string])">
                    <NSpace>
                      <NCheckbox v-for="item in schema.componentProps?.options || []" :key="item.value"
                        :value="item.value" :label="item.label" />
                    </NSpace>
                  </NCheckboxGroup>
                </template>

                <!-- NRadioGroup -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NRadioGroup'">
                  <NRadioGroup v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])">
                    <NSpace>
                      <NRadio v-for="item in schema.componentProps?.options || []" :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                      </NRadio>
                    </NSpace>
                  </NRadioGroup>
                </template>

                <!-- NSelect -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NSelect'">
                  <NSelect v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NDatePicker -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NDatePicker'">
                  <NDatePicker v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NTimePicker -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NTimePicker'">
                  <NTimePicker v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NInputNumber -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NInputNumber'">
                  <NInputNumber v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NSwitch -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NSwitch'">
                  <NSwitch v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NSlider -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NSlider'">
                  <NSlider v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NRate -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NRate'">
                  <NRate v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NDynamicTags -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NDynamicTags'">
                  <NDynamicTags v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val:any) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- NInputTextArea -->
                <template v-else-if="isFormFieldSchema(schema) && schema.component === 'NInputTextArea'">
                  <NInput v-model:value="formModel[schema.field as string]" type="textarea"
                    v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- 默认 NInput -->
                <template v-else-if="isFormFieldSchema(schema)">
                  <NInput v-model:value="formModel[schema.field as string]" v-bind="getComponentProps(schema)"
                    @update:value="(val) => handleFieldChange(schema, val, formModel[schema.field as string])" />
                </template>

                <!-- 后缀 -->
                <template v-if="isFormFieldSchema(schema) && schema.suffix">
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
                      <path d="M7 10l5 5 5-5z" fill="currentColor" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14l5-5 5 5z" fill="currentColor" />
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
      </template>

      <!-- Flex Layout -->
      <template v-else-if="layoutMode === 'flex'">
        <div class="clever-form-flex" :style="getFlexStyle">
          <template v-for="schema in getSchema" :key="schema.field">
            <div v-if="ifShowFormItem(schema)" class="clever-form-flex-item" :style="getFlexItemStyle(schema)">
              <NFormItem v-bind="getFormItemProps(schema)">
                <!-- 表单组件内容保持不变 -->
                <component :is="getFormComponent(schema)" v-bind="getComponentProps(schema)" />
              </NFormItem>
            </div>
          </template>
        </div>

        <!-- 操作按钮组 -->
        <div v-if="showActionButtonGroup" class="clever-form-action" style="margin-top: 16px;">
          <NSpace justify="end">
            <NButton v-if="showResetButton" v-bind="getResetBtnOptions" @click="handleReset">
              {{ resetButtonText }}
            </NButton>
            <NButton v-if="showSubmitButton" v-bind="getSubmitBtnOptions" @click="handleSubmit">
              {{ submitButtonText }}
            </NButton>
          </NSpace>
        </div>
      </template>

      <!-- Tabs Layout -->
      <template v-else-if="layoutMode === 'tabs'">
        <NTabs type="line" animated>
          <NTabPane v-for="group in getGroupedSchemas" :key="group.name" :name="group.name" :tab="group.title">
            <NGrid v-bind="getGrid">
              <template v-for="schema in group.fields" :key="schema.field">
                <NGi v-if="ifShowFormItem(schema)" v-bind="getComponentProps(schema, 'gi')">
                  <NFormItem v-bind="getFormItemProps(schema)">
                    <component :is="getFormComponent(schema)" v-bind="getComponentProps(schema)" />
                  </NFormItem>
                </NGi>
              </template>
            </NGrid>
          </NTabPane>
        </NTabs>

        <!-- 操作按钮组 -->
        <div v-if="showActionButtonGroup" class="clever-form-action" style="margin-top: 16px;">
          <NSpace justify="end">
            <NButton v-if="showResetButton" v-bind="getResetBtnOptions" @click="handleReset">
              {{ resetButtonText }}
            </NButton>
            <NButton v-if="showSubmitButton" v-bind="getSubmitBtnOptions" @click="handleSubmit">
              {{ submitButtonText }}
            </NButton>
          </NSpace>
        </div>
      </template>

      <!-- Accordion Layout -->
      <template v-else-if="layoutMode === 'accordion'">
        <NCollapse>
          <NCollapseItem v-for="group in getGroupedSchemas" :key="group.name" :title="group.title" :name="group.name">
            <NGrid v-bind="getGrid">
              <template v-for="schema in group.fields" :key="schema.field">
                <NGi v-if="ifShowFormItem(schema)" v-bind="getComponentProps(schema, 'gi')">
                  <NFormItem v-bind="getFormItemProps(schema)">
                    <component :is="getFormComponent(schema)" v-bind="getComponentProps(schema)" />
                  </NFormItem>
                </NGi>
              </template>
            </NGrid>
          </NCollapseItem>
        </NCollapse>

        <!-- 操作按钮组 -->
        <div v-if="showActionButtonGroup" class="clever-form-action" style="margin-top: 16px;">
          <NSpace justify="end">
            <NButton v-if="showResetButton" v-bind="getResetBtnOptions" @click="handleReset">
              {{ resetButtonText }}
            </NButton>
            <NButton v-if="showSubmitButton" v-bind="getSubmitBtnOptions" @click="handleSubmit">
              {{ submitButtonText }}
            </NButton>
          </NSpace>
        </div>
      </template>
    </NForm>
  </div>
</template>

<style scoped>
.clever-form-item-detail :deep(.n-form-item-label) {
  font-weight: normal;
}

.clever-form-item-detail :deep(.n-form-item-blank) {
  min-height: auto;
}
</style>