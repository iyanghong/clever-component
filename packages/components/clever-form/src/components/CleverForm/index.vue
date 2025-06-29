<template>
  <div
    :class="[
      'clever-form',
      `clever-form--${formState.mode}`,
      `clever-form--${formState.status}`,
      {
        'clever-form--loading': loading,
        'clever-form--submitting': submitting,
        'clever-form--disabled': disabled,
        'clever-form--readonly': readonly,
        'clever-form--has-errors': hasErrors
      }
    ]"
    :style="customStyle"
  >
    <!-- 表单标题 -->
    <div v-if="showTitle" class="clever-form__header">
      <h3 class="clever-form__title">{{ config.title }}</h3>
      <p v-if="config.description" class="clever-form__description">
        {{ config.description }}
      </p>
    </div>

    <!-- 表单内容 -->
    <n-form
      ref="formRef"
      :model="modelValue"
      :rules="validationRules"
      v-bind="formProps"
      @submit="handleSubmit"
    >
      <!-- 表单引擎渲染 -->
      <FormEngine
        ref="engineRef"
        :config="config"
        :disabled="disabled"
        :readonly="readonly"
        @field:change="handleFieldChange"
        @field:focus="handleFieldFocus"
        @field:blur="handleFieldBlur"
        @validate="handleValidate"
      />

      <!-- 表单操作按钮 -->
      <div v-if="showActions" class="clever-form__actions">
        <slot name="actions" :form="formMethods">
          <n-space>
            <n-button
              v-if="showResetButton"
              :disabled="disabled || submitting"
              @click="handleReset"
            >
              {{ resetButtonText }}
            </n-button>
            <n-button
              v-if="showSubmitButton"
              type="primary"
              :loading="submitting"
              :disabled="disabled || !isValid"
              @click="handleSubmit"
            >
              {{ submitButtonText }}
            </n-button>
          </n-space>
        </slot>
      </div>
    </n-form>

    <!-- 加载遮罩 -->
    <div v-if="loading" class="clever-form__loading">
      <n-spin size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  provide
} from 'vue'
import {
  NForm,
  NButton,
  NSpace,
  NSpin,
  type FormInst,
  type FormRules
} from 'naive-ui'
import FormEngine from '../form-engine/index.vue'
import { useForm } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'
import type {
  FormConfig,
  FormData,
  FormState,
  FormMode,
  FormStatus,
  FormEvents,
  FormMethods,
  ValidationResult
} from '../../types'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.CLEVER_FORM
})
console.log('CLEVER_FORM')
// Props定义
interface CleverFormProps {
  // 表单配置
  config: FormConfig
  // 表单数据
  modelValue?: FormData
  // 是否禁用
  disabled?: boolean
  // 是否只读
  readonly?: boolean
  // 是否显示标题
  showTitle?: boolean
  // 是否显示操作按钮
  showActions?: boolean
  // 是否显示重置按钮
  showResetButton?: boolean
  // 是否显示提交按钮
  showSubmitButton?: boolean
  // 重置按钮文本
  resetButtonText?: string
  // 提交按钮文本
  submitButtonText?: string
  // 自定义样式
  customStyle?: string | Record<string, any>
}

const props = withDefaults(defineProps<CleverFormProps>(), {
  disabled: false,
  readonly: false,
  showTitle: true,
  showActions: true,
  showResetButton: true,
  showSubmitButton: true,
  resetButtonText: '重置',
  submitButtonText: '提交'
})

// Emits定义
interface CleverFormEmits {
  'update:modelValue': [data: FormData]
  'data:change': [data: FormData, field?: string, value?: any]
  'field:change': [field: string, value: any, oldValue?: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'submit:before': [data: FormData]
  submit: [data: FormData]
  'submit:success': [result: any]
  'submit:error': [error: Error]
  'reset:before': []
  reset: []
  'reset:after': []
  validate: [results: ValidationResult[]]
  'status:change': [status: FormStatus, prevStatus: FormStatus]
  'load:start': []
  'load:complete': [data: FormData]
  'load:error': [error: Error]
}

const emit = defineEmits<CleverFormEmits>()

// 表单引用
const formRef = ref<FormInst>()
const engineRef = ref<InstanceType<typeof FormEngine>>()
const modelValue = defineModel<FormData>({})
console.log('CLEVER_FORM', modelValue.value)
// 使用表单Hook - 传入 modelValue 作为外部数据引用
const {
  formState,
  loading,
  submitting,
  isValid,
  hasErrors,
  validationRules,
  initialize,
  updateData,
  validate,
  clearValidation,
  submit,
  reset,
  destroy
} = useForm({
  config: props.config,
  externalData: modelValue, // 传入外部数据引用
  onDataChange: (data, field, value) => {
    emit('update:modelValue', data)
    emit('data:change', data, field, value)
  },
  onFieldChange: (field, value, oldValue) => {
    emit('field:change', field, value, oldValue)
  },
  onFieldFocus: field => {
    emit('field:focus', field)
  },
  onFieldBlur: field => {
    emit('field:blur', field)
  },
  onSubmitBefore: data => {
    emit('submit:before', data)
  },
  onSubmit: data => {
    emit('submit', data)
  },
  onSubmitSuccess: result => {
    emit('submit:success', result)
  },
  onSubmitError: error => {
    emit('submit:error', error)
  },
  onReset: () => {
    emit('reset')
  },
  onValidate: results => {
    emit('validate', results)
  },
  onStatusChange: (status, prevStatus) => {
    emit('status:change', status, prevStatus)
  }
})

// 现在 formData 就是 modelValue 的引用
const formData = modelValue

// 计算属性
const formProps = computed(() => ({
  size: props.config.options?.size || 'medium',
  labelPlacement: props.config.options?.labelPlacement || 'left',
  labelWidth: props.config.options?.labelWidth || 'auto',
  labelAlign: props.config.options?.labelAlign || 'left',
  showLabel: props.config.options?.showLabel ?? true,
  showRequiredMark: props.config.options?.showRequiredMark ?? true,
  showFeedback: props.config.options?.showFeedback ?? true,
  inline: props.config.options?.inline || false,
  disabled: props.disabled || props.config.options?.disabled || false,
  readonly: props.readonly || props.config.options?.readonly || false,
  ...props.config.props
}))

// 事件处理
const handleFieldChange = (field: string, value: any, oldValue?: any) => {
  emit('field:change', field, value, oldValue)
}

const handleFieldFocus = (field: string) => {
  emit('field:focus', field)
}

const handleFieldBlur = (field: string) => {
  emit('field:blur', field)
}

const handleSubmit = async () => {
  try {
    // 🔥 传递formRef进行提交前校验
    await submit(formRef.value)
  } catch (error) {
    if (error.message?.includes('校验失败')) {
      console.warn('表单校验失败:', error.message)
    } else {
      console.error('表单提交失败:', error)
    }
  }
}

const handleReset = async () => {
  try {
    emit('reset:before')
    await reset()
    emit('reset:after')
  } catch (error) {
    console.error('表单重置失败:', error)
  }
}

const handleValidate = (results: ValidationResult[]) => {
  // 验证结果已在useForm中处理
}

// 移除 modelValue 监听器 - 不再需要同步数据
// modelValue 和 formData 现在是同一个引用

// 监听配置变化
watch(
  () => props.config,
  async newConfig => {
    await initialize(newConfig)
  },
  { deep: true }
)

// 创建表单方法对象
const formMethods = {
  updateData,
  getData: () => formData.value, // 直接返回 modelValue
  setData: (data: FormData) => {
    // 直接设置 modelValue
    Object.assign(formData.value, data)
  },
  validate,
  clearValidation,
  submit: () => submit(formRef.value),
  reset
}

// 提供表单上下文
provide('cleverForm', {
  formData: modelValue,
  formConfig: computed(() => props.config),
  formStatus: computed(() => formState.value.status),
  formErrors: computed(() => formState.value.errors),
  loading: computed(() => loading.value),
  submitting: computed(() => submitting.value),
  hasErrors: computed(() => hasErrors.value),
  isValid: computed(() => isValid.value),
  isDirty: computed(() => formState.value.isDirty),
  getFieldValue: (field: string) => {
    return modelValue.value?.[field]
  },
  setFieldValue: (field: string, value: any) => {
    if (modelValue.value) {
      modelValue.value[field] = value
    }
  },
  setFieldValues: (values: Record<string, any>) => {
    if (modelValue.value) {
      Object.assign(modelValue.value, values)
    }
  },
  updateData: (data: FormData) => {
    if (modelValue.value) {
      Object.assign(modelValue.value, data)
    }
  },
  reset: () => reset(),
  clear: () => {
    if (modelValue.value) {
      Object.keys(modelValue.value).forEach(key => {
        delete modelValue.value![key]
      })
    }
  },
  validateForm: () => validate(),
  submit: () => submit(formRef.value)
})

// 暴露方法
defineExpose({
  ...formMethods,
  formRef,
  engineRef,
  formData,
  formState
})

// 生命周期
onMounted(async () => {
  await initialize(props.config)

  // 如果有初始数据，直接设置到 modelValue
  if (props.modelValue) {
    Object.assign(formData.value, props.modelValue)
  }
})

onUnmounted(() => {
  destroy()
})
</script>

<style scoped>
.clever-form {
  position: relative;
  width: 100%;
}

.clever-form__header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--n-border-color);
}

.clever-form__title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-text-color);
}

.clever-form__description {
  margin: 0;
  font-size: 14px;
  color: var(--n-text-color-2);
  line-height: 1.6;
}

.clever-form__actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
  text-align: right;
}

.clever-form__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.clever-form--loading {
  pointer-events: none;
}

.clever-form--submitting .clever-form__actions {
  opacity: 0.6;
}

.clever-form--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.clever-form--readonly {
  pointer-events: none;
}

.clever-form--has-errors {
  /* 可以添加错误状态的样式 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .clever-form__actions {
    text-align: center;
  }

  .clever-form__actions .n-space {
    justify-content: center;
  }
}
</style>
