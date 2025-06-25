<template>
  <div class="clever-form">
    <NForm
      ref="formRef"
      v-bind="getProps"
      :model="formModel"
      @keydown.enter="handleSubmit"
    >
      <!-- 混合布局模式 -->
      <template v-if="layoutMode === 'mixed'">
        <LayoutRenderer
          :layout-mode="layoutMode"
          :schemas="getActualSchemas()"
          :form-model="formModel"
          :form-item-field-keys="formItemFieldKeys"
          :loading="loading"
          :collapsed="collapsed"
          :is-only-show-one-row="isOnlyShowOneRow()"
          :show-action-button-group="showActionButtonGroup"
          :show-reset-button="showResetButton"
          :show-submit-button="showSubmitButton"
          :show-advanced-button="showAdvancedButton"
          :reset-button-text="resetButtonText"
          :submit-button-text="submitButtonText"
          :form-methods="formMethods"
          :set-field-value="setFieldValue"
          :get-field-value="getFieldValue"
          :set-form-data="setFormData"
          :get-form-data="getFormData"
          :get-actual-schemas="getActualSchemas"
          :get-actual-layout-config="getActualLayoutConfig"
          :reset-fields="resetFields"
          :clear-validate="clearValidate"
          :validate="validate"
          :get-component-props="getComponentProps"
          :get-form-item-props="getFormItemProps"
          :get-props="getProps"
          :get-grid="getGrid"
          :get-schema="getSchema"
          :get-submit-btn-options="getSubmitBtnOptions"
          :get-reset-btn-options="getResetBtnOptions"
          :get-flex-style="getFlexStyle"
          :get-flex-item-style="getFlexItemStyle"
          :get-grouped-schemas="getGroupedSchemas"
          :get-form-component="getFormComponent"
          :if-show-form-item="ifShowFormItem"
          :handle-field-change="handleFieldChange"
          :is-form-field-schema="isFormFieldSchema"
          :get-actual-component="getActualComponent"
          :methods="methods"
          @reset="handleReset"
          @submit="handleSubmit"
          @unfold-toggle="unfoldToggle"
        >
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps"></slot>
          </template>
        </LayoutRenderer>
      </template>

      <!-- 传统布局模式 -->
      <template v-else>
        <LayoutRenderer
          :layout-mode="layoutMode"
          :schemas="getActualSchemas()"
          :form-model="formModel"
          :is-only-show-one-row="isOnlyShowOneRow()"
          :show-action-button-group="showActionButtonGroup"
          :show-reset-button="showResetButton"
          :show-submit-button="showSubmitButton"
          :show-advanced-button="showAdvancedButton"
          :reset-button-text="resetButtonText"
          :submit-button-text="submitButtonText"
          :collapsed="collapsed"
          :form-methods="formMethods"
          @reset="handleReset"
          @submit="handleSubmit"
          @unfold-toggle="unfoldToggle"
        >
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps"></slot>
          </template>
        </LayoutRenderer>
      </template>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { NForm } from 'naive-ui'
import { ref } from 'vue'
import LayoutRenderer from './components/LayoutRenderer.vue'
import { useForm } from './hook/use-form'
import type { CleverFormProps } from './types/form'

defineOptions({
  name: 'CleverForm'
})

const props = withDefaults(defineProps<CleverFormProps>(), {
  layoutMode: 'mixed',
  showActionButtonGroup: true,
  showResetButton: true,
  showSubmitButton: true,
  showAdvancedButton: true,
  resetButtonText: '重置',
  submitButtonText: '查询',
  collapsed: false,
  isOnlyShowOneRow: false
})

const emit = defineEmits<{
  register: [methods: any]
  reset: []
  submit: [formData: any]
}>()

// 创建表单引用
const formRef = ref()

const {
  formModel,
  formItemFieldKeys,
  loading,
  collapsed,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  getActualSchemas,
  getActualLayoutConfig,
  resetFields,
  clearValidate,
  validate,
  handleSubmit,
  handleReset,
  unfoldToggle,
  getComponentProps,
  getFormItemProps,
  getProps,
  getGrid,
  getSchema,
  isOnlyShowOneRow,
  getSubmitBtnOptions,
  getResetBtnOptions,
  getFlexStyle,
  getFlexItemStyle,
  getGroupedSchemas,
  getFormComponent,
  ifShowFormItem,
  handleFieldChange,
  isFormFieldSchema,
  getActualComponent,
  methods
} = useForm(props, formRef, emit)

// 创建 formMethods 对象
const formMethods = {
  getFormItemProps,
  getComponentProps,
  getGrid,
  getResetBtnOptions,
  getSubmitBtnOptions,
  getGroupedSchemas,
  ifShowFormItem,
  getFlexItemStyle,
  handleFieldChange
}

defineExpose(methods)
</script>
<style scoped>
.clever-form-item-detail :deep(.n-form-item-label) {
  font-weight: normal;
}

.clever-form-item-detail :deep(.n-form-item-blank) {
  min-height: auto;
}
</style>
