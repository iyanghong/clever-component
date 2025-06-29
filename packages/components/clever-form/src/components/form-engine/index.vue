<template>
  <div
    :class="[
      'form-engine',
      `form-engine--${engineState.status}`,
      {
        'form-engine--loading': loading,
        'form-engine--disabled': disabled,
        'form-engine--readonly': readonly
      }
    ]"
  >
    <!-- 容器渲染器 -->
    <ContainerRenderer
      :config="config.layout"
      :disabled="disabled"
      :readonly="readonly"
      :loading="loading"
      @field:change="handleFieldChange"
      @field:focus="handleFieldFocus"
      @field:blur="handleFieldBlur"
      @validate="handleValidate"
    />

    <!-- 弹窗渲染器 -->
    <PopupRenderer
      v-if="config.popup"
      :config="config.popup"
      :show="showPopup"
      @update:show="handlePopupShow"
      @confirm="handlePopupConfirm"
      @cancel="handlePopupCancel"
      @close="handlePopupClose"
    >
      <template #default>
        <ContainerRenderer
          :config="config.layout"
          :disabled="disabled"
          :readonly="readonly"
          :loading="loading"
          @field:change="handleFieldChange"
          @field:focus="handleFieldFocus"
          @field:blur="handleFieldBlur"
          @validate="handleValidate"
        />
      </template>
    </PopupRenderer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import ContainerRenderer from '../container-system/ContainerRenderer.vue'
import PopupRenderer from '../popup-system/PopupRenderer.vue'
import { useFormEngine, useValidation, useApi } from '../../hooks'
import { useFormContext } from '../../hooks/useForm'
import { COMPONENT_NAMES } from '../../constants'
import type {
  FormConfig,
  FormData,
  FormState,
  FormStatus,
  ValidationResult,
  ApiResult
} from '../../types'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.FORM_ENGINE
})
console.log('FORM_ENGINE')
// Props定义
interface FormEngineProps {
  // 表单配置
  config: FormConfig
  // 是否禁用
  disabled?: boolean
  // 是否只读
  readonly?: boolean
  // 是否显示弹窗
  showPopup?: boolean
}

const props = withDefaults(defineProps<FormEngineProps>(), {
  disabled: false,
  readonly: false,
  showPopup: false
})

// Emits定义
interface FormEngineEmits {
  'field:change': [field: string, value: any, oldValue?: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [results: ValidationResult[]]
  'api:start': [operation: string]
  'api:success': [operation: string, result: any]
  'api:error': [operation: string, error: Error]
  'popup:show': [show: boolean]
  'popup:confirm': [data: FormData]
  'popup:cancel': []
  'popup:close': []
  'status:change': [status: FormStatus, prevStatus: FormStatus]
}

const emit = defineEmits<FormEngineEmits>()

// 注入表单上下文
const formContext = useFormContext()

// 使用表单引擎Hook
const {
  engineState,
  loading,
  initialize: initializeEngine,
  destroy: destroyEngine,
  updateData,
  updateField,
  getFieldValue,
  setFieldValue,
  validateForm,
  validateField,
  clearValidation
} = useFormEngine(props.config)

// 使用验证Hook
const {
  validationResults,
  isValidating,
  validate,
  validateSingle,
  clearValidationResults
} = useValidation(props.config.validation)

// 使用API Hook
const {
  apiState,
  isLoading: apiLoading,
  execute: executeApi,
  cancel: cancelApi
} = useApi(props.config.api)

// 计算属性
const showPopup = computed({
  get: () => props.showPopup,
  set: (value) => emit('popup:show', value)
})

// 事件处理
const handleFieldChange = (field: string, value: any, oldValue?: any) => {
  emit('field:change', field, value, oldValue)
  
  // 如果配置了字段级验证，触发单个字段验证
  if (props.config.validation?.validateOnChange) {
    validateSingle(field, value)
  }
}

const handleFieldFocus = (field: string) => {
  emit('field:focus', field)
}

const handleFieldBlur = (field: string) => {
  emit('field:blur', field)
  
  // 如果配置了失焦验证，触发单个字段验证
  if (props.config.validation?.validateOnBlur && formContext) {
    const value = formContext.getFieldValue(field)
    validateSingle(field, value)
  }
}

const handleValidate = async () => {
  try {
    if (!formContext) {
      console.warn('FormContext not available')
      return []
    }
    const results = await validate(formContext.formData)
    emit('validate', results)
    return results
  } catch (error) {
    console.error('验证失败:', error)
    return []
  }
}

const handlePopupShow = (show: boolean) => {
  emit('popup:show', show)
}

const handlePopupConfirm = (data: FormData) => {
  emit('popup:confirm', data)
}

const handlePopupCancel = () => {
  emit('popup:cancel')
}

const handlePopupClose = () => {
  emit('popup:close')
}

// API操作
const handleApiOperation = async (operation: string, params?: any) => {
  try {
    emit('api:start', operation)
    const result = await executeApi(operation, params)
    emit('api:success', operation, result)
    return result
  } catch (error) {
    emit('api:error', operation, error as Error)
    throw error
  }
}

// 加载表单数据
const loadFormData = async () => {
  if (props.config.api?.load && formContext) {
    try {
      const result = await handleApiOperation('load')
      if (result?.data) {
        formContext.updateData(result.data)
      }
    } catch (error) {
      console.error('加载表单数据失败:', error)
    }
  }
}

// 提交表单数据
const submitFormData = async (data: FormData) => {
  if (props.config.api?.submit) {
    try {
      const result = await handleApiOperation('submit', data)
      return result
    } catch (error) {
      console.error('提交表单数据失败:', error)
      throw error
    }
  }
}

// 监听表单数据变化
watch(
  () => formContext?.formData,
  (newValue) => {
    if (newValue && newValue !== engineState.value.formData) {
      engineState.value.formData = { ...newValue }
    }
  },
  { deep: true }
)

// 监听配置变化
watch(
  () => props.config,
  (newConfig) => {
    if (newConfig) {
      engineState.value.config = newConfig
      // 重新初始化引擎
      initializeEngine()
    }
  },
  { deep: true }
)

// 监听引擎状态变化
watch(
  () => engineState.value.status,
  (newStatus, oldStatus) => {
    console.log('引擎状态变化:', { newStatus, oldStatus })
  }
)

// 暴露给父组件的方法和状态
defineExpose({
  // 数据操作
  getData: () => formContext?.formData || {},
  setData: (data: Record<string, any>) => {
    formContext?.updateData(data)
  },
  updateData: (data: Partial<Record<string, any>>) => {
    formContext?.updateData(data)
  },
  resetData: () => {
    formContext?.reset()
  },
  
  // 验证操作
  validate: handleValidate,
  validateField: (field: string) => formContext ? validateSingle(field, formContext.getFieldValue(field)) : Promise.resolve({ valid: false, errors: [] }),
  clearValidation: clearValidationResults,
  
  // API 操作
  loadData: loadFormData,
  submitData: submitFormData,
  executeApi: handleApiOperation,
  
  // 状态
  isLoading: computed(() => engineState.value.loading),
  isSubmitting: computed(() => engineState.value.submitting),
  hasErrors: computed(() => validationResults.value.some(result => !result.valid)),
  errors: computed(() => validationResults.value.filter(result => !result.valid)),
  status: computed(() => engineState.value.status)
})

// 生命周期
onMounted(async () => {
  // 初始化引擎
  await initializeEngine(props.config)
  
  // 如果有初始数据，设置到表单
  if (formContext?.formData && Object.keys(formContext.formData).length > 0) {
    engineState.value.formData = { ...formContext.formData }
  }
  
  // 如果配置了自动加载，则加载数据
  if (props.config.api?.load) {
    await loadFormData()
  }
})

onUnmounted(() => {
  // 清理引擎状态
  destroyEngine()
  
  // 清理验证状态
  clearValidationResults()
  
  // 取消API请求
  cancelApi()
})
</script>

<style scoped>
.form-engine {
  position: relative;
  width: 100%;
}

.form-engine--loading {
  opacity: 0.6;
  pointer-events: none;
}

.form-engine--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.form-engine--readonly {
  pointer-events: none;
}

.form-engine--idle {
  /* 空闲状态样式 */
}

.form-engine--loading {
  /* 加载状态样式 */
}

.form-engine--submitting {
  /* 提交状态样式 */
}

.form-engine--validating {
  /* 验证状态样式 */
}

.form-engine--success {
  /* 成功状态样式 */
}

.form-engine--error {
  /* 错误状态样式 */
}
</style>