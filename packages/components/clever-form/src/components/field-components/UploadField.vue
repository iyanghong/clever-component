<template>
  <!-- 文件上传 -->
    <n-upload
      :file-list="fileList"
      :action="config.action"
      :data="config.data"
      :headers="config.headers"
      :with-credentials="config.withCredentials"
      :multiple="config.multiple"
      :directory="config.directory"
      :accept="config.accept"
      :max="config.max"
      :disabled="disabled"
      :show-file-list="config.showFileList ?? true"
      :show-cancel-button="config.showCancelButton ?? true"
      :show-remove-button="config.showRemoveButton ?? true"
      :show-retry-button="config.showRetryButton ?? true"
      :show-download-button="config.showDownloadButton"
      :show-preview-button="config.showPreviewButton"
      :list-type="config.listType || 'text'"
      :image-group-props="config.imageGroupProps"
      :create-thumbnail-url="config.createThumbnailUrl"
      :on-before-upload="handleBeforeUpload"
      :on-upload="handleUpload"
      :on-finish="handleFinish"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-download="handleDownload"
      :on-preview="handlePreview"
      @update:file-list="handleUpdateFileList"
      @change="handleChange"
    >
      <!-- 自定义触发器 -->
      <template v-if="config.trigger">
        <component :is="config.trigger" />
      </template>
      <template v-else-if="config.listType === 'image-card'">
        <n-upload-dragger v-if="config.dragger">
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <component :is="config.uploadIcon || 'CloudUploadOutline'" />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            {{ config.dragText || '点击或者拖动文件到该区域来上传' }}
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ config.dragHint || '请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码' }}
          </n-p>
        </n-upload-dragger>
        <n-button v-else>
          <n-icon><component :is="config.uploadIcon || 'CloudUploadOutline'" /></n-icon>
          {{ config.buttonText || '上传文件' }}
        </n-button>
      </template>
      <template v-else>
        <n-upload-dragger v-if="config.dragger">
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <component :is="config.uploadIcon || 'CloudUploadOutline'" />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            {{ config.dragText || '点击或者拖动文件到该区域来上传' }}
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ config.dragHint || '请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码' }}
          </n-p>
        </n-upload-dragger>
        <n-button v-else>
          <n-icon><component :is="config.uploadIcon || 'CloudUploadOutline'" /></n-icon>
          {{ config.buttonText || '上传文件' }}
        </n-button>
      </template>
      
      <!-- 自定义文件列表项 -->
      <template v-if="config.renderFileList" #file-list="{ fileList }">
        <component :is="config.renderFileList" :file-list="fileList" />
      </template>
  </n-upload>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { 
  NUpload, 
  NUploadDragger, 
  NButton, 
  NIcon, 
  NText, 
  NP,
  type UploadFileInfo
} from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'
import type {
  UploadFieldConfig,
  ValidationConfig,
  ValidationResult
} from '../../types'
import { useField } from '../../hooks'
import { COMPONENT_NAMES } from '../../constants'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.UPLOAD_FIELD
})

// Props定义
interface Props {
  /** 字段配置 */
  config: UploadFieldConfig
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
  'upload': [file: UploadFileInfo]
  'finish': [file: UploadFileInfo]
  'error': [file: UploadFileInfo]
  'remove': [file: UploadFileInfo]
  'download': [file: UploadFileInfo]
  'preview': [file: UploadFileInfo]
  'validate': [result: ValidationResult]
}

const emit = defineEmits<Emits>()

// 响应式数据
const fileList = ref<UploadFileInfo[]>([])

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

// 监听值变化，同步文件列表
watch(
  () => props.value,
  (newValue) => {
    if (Array.isArray(newValue)) {
      fileList.value = newValue
    } else if (newValue) {
      fileList.value = [newValue]
    } else {
      fileList.value = []
    }
  },
  { immediate: true }
)

// 事件处理
const handleBeforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (props.config.beforeUpload) {
    return await props.config.beforeUpload(data)
  }
  return true
}

const handleUpload = (data: { file: UploadFileInfo; event?: ProgressEvent }) => {
  emit('upload', data.file)
  
  if (props.config.onUpload) {
    props.config.onUpload(data)
  }
}

const handleFinish = (data: { file: UploadFileInfo; event?: ProgressEvent }) => {
  emit('finish', data.file)
  
  if (props.config.onFinish) {
    props.config.onFinish(data)
  }
  
  // 上传完成后触发验证
  if (props.config.validateTrigger === 'change') {
    validate()
  }
}

const handleError = (data: { file: UploadFileInfo; event?: ProgressEvent }) => {
  emit('error', data.file)
  
  if (props.config.onError) {
    props.config.onError(data)
  }
}

const handleRemove = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  emit('remove', data.file)
  
  if (props.config.onRemove) {
    return props.config.onRemove(data)
  }
  return true
}

const handleDownload = (file: UploadFileInfo) => {
  emit('download', file)
  
  if (props.config.onDownload) {
    props.config.onDownload(file)
  }
}

const handlePreview = (file: UploadFileInfo) => {
  emit('preview', file)
  
  if (props.config.onPreview) {
    props.config.onPreview(file)
  }
}

const handleUpdateFileList = (newFileList: UploadFileInfo[]) => {
  fileList.value = newFileList
  
  // 根据配置决定返回值格式
  let value: any
  if (props.config.multiple) {
    value = newFileList
  } else {
    value = newFileList.length > 0 ? newFileList[0] : null
  }
  
  setValue(value)
  emit('update:modelValue', value)
}

const handleChange = (data: { file: UploadFileInfo; fileList: UploadFileInfo[]; event?: Event }) => {
  emit('change', data.fileList)
  
  // 触发验证
  if (props.config.validateTrigger === 'change') {
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
  getFileList: () => fileList.value,
  clearFiles: () => {
    fileList.value = []
    setValue(props.config.multiple ? [] : null)
    emit('update:modelValue', props.config.multiple ? [] : null)
  }
})
</script>

<style lang="less">
.upload-field {
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