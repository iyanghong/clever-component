<template>
  <div class="clever-form" :class="formClass" :style="formStyle">
    <NForm
      ref="formRef"
      v-bind="formProps"
      :model="formData"
      @submit.prevent="handleSubmit"
    >
      <!-- 表单内容区域 -->
      <div class="clever-form-content">
        <!-- 可折叠表单 -->
        <template v-if="config.collapsible">
          <!-- 始终显示的字段 -->
          <CleverFormLayout
            v-if="alwaysVisibleSchemas.length"
            :visible-schemas="alwaysVisibleSchemas"
            :form-data="formData"
            :methods="formMethods"
            :layout-config="layoutConfig"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </CleverFormLayout>
          
          <!-- 可折叠的字段 -->
          <NCollapse v-if="collapsibleSchemas.length" :expanded-names="expanded ? ['collapsible'] : []">
            <NCollapseItem name="collapsible" :title="collapseTitle">
              <CleverFormLayout
                :visible-schemas="collapsibleSchemas"
                :form-data="formData"
                :methods="formMethods"
                :layout-config="layoutConfig"
              >
                <!-- 透传所有插槽 -->
                <template
                  v-for="(_, slotName) in $slots"
                  #[slotName]="slotProps"
                >
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </CleverFormLayout>
            </NCollapseItem>
          </NCollapse>
        </template>
        
        <!-- 普通表单 -->
        <template v-else>
          <CleverFormLayout
            :visible-schemas="visibleSchemas"
            :form-data="formData"
            :methods="formMethods"
            :layout-config="layoutConfig"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </CleverFormLayout>
        </template>
      </div>
      
      <!-- 操作按钮区域 -->
      <CleverFormActions
        v-if="config.showActions"
        v-bind="actionProps"
        :expanded="expanded"
        @reset="handleReset"
        @submit="handleSubmit"
        @toggle="handleToggle"
        @custom-action="handleCustomAction"
      >
        <!-- 透传操作按钮插槽 -->
        <template #actions="slotProps">
          <slot name="actions" v-bind="slotProps" />
        </template>
      </CleverFormActions>
    </NForm>
    
    <!-- 加载遮罩 -->
    <NSpin v-if="loading" class="clever-form-loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { NForm, NCollapse, NCollapseItem, NSpin } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import type {
  FormFieldSchema,
  FormConfig,
  FormModel,
  FormMethods
} from '../types/core'
import { useCleverForm } from '../composables/useCleverForm'
import { isFormFieldSchema } from '../composables/useFormField'
import CleverFormLayout from './CleverFormLayout.vue'
import CleverFormActions from './CleverFormActions.vue'

// ============= 组件属性 =============

interface Props {
  /** 表单字段配置 */
  schemas: FormFieldSchema[]
  /** 表单配置 */
  config?: Partial<FormConfig>
  /** 表单数据 */
  modelValue?: FormModel
  /** 是否加载中 */
  loading?: boolean
  /** 容器类名 */
  class?: string | string[] | Record<string, boolean>
  /** 容器样式 */
  style?: string | Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  schemas: () => [],
  config: () => ({}),
  modelValue: () => ({}),
  loading: false
})

// ============= 事件定义 =============

interface Emits {
  /** 表单数据更新 */
  'update:modelValue': [value: FormModel]
  /** 表单提交 */
  submit: [data: FormModel, isValid: boolean]
  /** 表单重置 */
  reset: []
  /** 字段值变化 */
  fieldChange: [field: string, value: any, oldValue: any]
  /** 表单验证 */
  validate: [errors: any[] | null]
  /** 展开/收起切换 */
  toggle: [expanded: boolean]
  /** 自定义操作 */
  customAction: [action: any, index: number]
}

const emit = defineEmits<Emits>()

// ============= 响应式数据 =============

const formRef = ref<FormInst>()
const expanded = ref(false)

// ============= 使用组合式函数 =============

const {
  formData,
  loading: formLoading,
  formProps,
  layoutConfig,
  visibleSchemas,
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  resetFields,
  clearValidate,
  validate,
  submit,
  initializeForm,
  updateConfig
} = useCleverForm({
  schemas: props.schemas,
  config: props.config,
  modelValue: props.modelValue,
  emit
})

// ============= 计算属性 =============

/** 表单类名 */
const formClass = computed(() => {
  const classes = ['clever-form']
  
  if (props.class) {
    if (typeof props.class === 'string') {
      classes.push(props.class)
    } else if (Array.isArray(props.class)) {
      classes.push(...props.class)
    } else {
      Object.entries(props.class).forEach(([key, value]) => {
        if (value) classes.push(key)
      })
    }
  }
  
  return classes
})

/** 表单样式 */
const formStyle = computed(() => {
  if (typeof props.style === 'string') {
    return props.style
  }
  return props.style || {}
})

/** 表单配置 */
const config = computed(() => {
  return {
    collapsible: false,
    showActions: true,
    collapseTitle: '更多选项',
    maxVisibleFields: 6,
    ...props.config
  }
})

/** 始终显示的字段 */
const alwaysVisibleSchemas = computed(() => {
  if (!config.value.collapsible) return []
  
  return visibleSchemas.value.slice(0, config.value.maxVisibleFields || 6)
})

/** 可折叠的字段 */
const collapsibleSchemas = computed(() => {
  if (!config.value.collapsible) return []
  
  return visibleSchemas.value.slice(config.value.maxVisibleFields || 6)
})

/** 折叠标题 */
const collapseTitle = computed(() => {
  const count = collapsibleSchemas.value.length
  return count > 0 ? `${config.value.collapseTitle} (${count})` : config.value.collapseTitle
})

/** 操作按钮属性 */
const actionProps = computed(() => {
  const actions = config.value.actions || {}
  return {
    showActionGroup: config.value.showActions,
    showReset: actions.showReset !== false,
    showSubmit: actions.showSubmit !== false,
    showToggle: config.value.collapsible && collapsibleSchemas.value.length > 0,
    resetText: actions.resetText || '重置',
    submitText: actions.submitText || '提交',
    expandText: actions.expandText || '展开',
    collapseText: actions.collapseText || '收起',
    resetButtonProps: actions.resetButtonProps,
    submitButtonProps: actions.submitButtonProps,
    toggleButtonProps: actions.toggleButtonProps,
    customActions: actions.customActions,
    justify: actions.justify || 'start',
    wrap: actions.wrap !== false,
    size: actions.size || 'medium',
    class: actions.class,
    style: actions.style
  }
})

/** 表单方法 */
const formMethods: FormMethods = {
  setFieldValue,
  getFieldValue,
  setFormData,
  getFormData,
  resetFields,
  clearValidate,
  validate: async () => {
    try {
      await formRef.value?.validate()
      return { valid: true, errors: null }
    } catch (errors) {
      return { valid: false, errors }
    }
  },
  submit
}

// ============= 事件处理 =============

/** 处理提交 */
const handleSubmit = async () => {
  const result = await submit()
  emit('submit', result.data, result.valid)
}

/** 处理重置 */
const handleReset = () => {
  resetFields()
  emit('reset')
}

/** 处理展开/收起切换 */
const handleToggle = (isExpanded: boolean) => {
  expanded.value = isExpanded
  emit('toggle', isExpanded)
}

/** 处理自定义操作 */
const handleCustomAction = (action: any, index: number) => {
  emit('customAction', action, index)
}

// ============= 监听器 =============

// 监听schemas变化
watch(
  () => props.schemas,
  (newSchemas) => {
    initializeForm(newSchemas, props.config)
  },
  { deep: true }
)

// 监听config变化
watch(
  () => props.config,
  (newConfig) => {
    updateConfig(newConfig)
  },
  { deep: true }
)

// 监听modelValue变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      setFormData(newValue)
    }
  },
  { deep: true, immediate: true }
)

// ============= 暴露的方法 =============

defineExpose({
  /** 表单实例 */
  formRef,
  /** 表单数据 */
  formData,
  /** 设置字段值 */
  setFieldValue,
  /** 获取字段值 */
  getFieldValue,
  /** 设置表单数据 */
  setFormData,
  /** 获取表单数据 */
  getFormData,
  /** 重置表单 */
  resetFields,
  /** 清除验证 */
  clearValidate,
  /** 验证表单 */
  validate: formMethods.validate,
  /** 提交表单 */
  submit,
  /** 初始化表单 */
  initializeForm,
  /** 更新配置 */
  updateConfig
})
</script>

<style scoped>
.clever-form {
  position: relative;
  width: 100%;
}

.clever-form-content {
  width: 100%;
}

.clever-form-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 折叠面板样式调整 */
.clever-form :deep(.n-collapse) {
  margin-top: 16px;
}

.clever-form :deep(.n-collapse-item__header) {
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .clever-form {
    padding: 0;
  }
  
  .clever-form :deep(.n-collapse) {
    margin-top: 12px;
  }
}
</style>