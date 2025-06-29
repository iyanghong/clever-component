<template>
  <div class="steps-container">
    <n-steps
      :current="currentStep"
      :status="config.props?.status || 'process'"
      :vertical="config.props?.direction === 'vertical'"
      :size="config.props?.size || 'medium'"
    >
      <n-step
        v-for="(step, index) in normalizedSteps"
        :key="step.key || index"
        :title="step.title"
        :description="step.description"
        :status="step.status"
        :disabled="step.disabled"
      >
        <template v-if="step.icon" #icon>
          <component :is="step.icon" />
        </template>
      </n-step>
    </n-steps>
    
    <!-- 步骤内容 -->
    <div class="steps-container__content">
      <div
        v-for="(step, stepIndex) in normalizedSteps"
        v-show="stepIndex === currentStep"
        :key="step.key || stepIndex"
        class="steps-container__step-content"
      >
        <div
          v-for="(child, index) in step.normalizedChildren"
          :key="child.id || index"
          class="steps-container__item"
        >
          <!-- 字段渲染 -->
          <FieldRenderer
            v-if="child.type === 'field'"
            :config="child"
            :disabled="disabled"
            :readonly="readonly"
            :loading="loading"
            @field:change="(field, value, oldValue) => handleFieldChange(field, value, oldValue)"
            @field:focus="(field) => handleFieldFocus(field)"
            @field:blur="(field) => handleFieldBlur(field)"
            @validate="(field, result) => handleFieldValidate(field, result)"
          />
          
          <!-- 容器渲染 -->
          <ContainerRenderer
            v-else
            :config="child"
            :disabled="disabled"
            :readonly="readonly"
            :loading="loading"
            @field:change="(field, value, oldValue) => handleFieldChange(field, value, oldValue)"
            @field:focus="(field) => handleFieldFocus(field)"
            @field:blur="(field) => handleFieldBlur(field)"
            @validate="(field, result) => handleFieldValidate(field, result)"
          />
        </div>
      </div>
    </div>
    
    <!-- 步骤操作按钮 -->
    <div class="steps-container__actions">
      <n-space>
        <n-button
          v-if="currentStep > 0"
          @click="handlePrevStep"
        >
          上一步
        </n-button>
        <n-button
          v-if="currentStep < normalizedSteps.length - 1"
          type="primary"
          @click="handleNextStep"
        >
          下一步
        </n-button>
        <n-button
          v-if="currentStep === normalizedSteps.length - 1"
          type="primary"
          @click="handleFinish"
        >
          完成
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NSteps, NStep, NButton, NSpace } from 'naive-ui'
import type { StepsContainerConfig } from '../../types/layout'
import type { FieldConfig, ContainerConfig } from '../../types'
import type { ValidationResult } from '../../types/validation'
import FieldRenderer from '../field-components/FieldRenderer.vue'
import ContainerRenderer from './ContainerRenderer.vue'

// Props定义
interface Props {
  /** 步骤容器配置 */
  config: StepsContainerConfig
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

// Events定义
interface Emits {
  'field:change': [field: string, value: any, oldValue: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [field: string, result: ValidationResult]
  'step:change': [step: number]
  'step:finish': []
}

const emit = defineEmits<Emits>()

// 当前步骤
const currentStep = ref(props.config.props?.current || 0)

// 监听配置变化
watch(
  () => props.config.props?.current,
  (newCurrent) => {
    if (typeof newCurrent === 'number') {
      currentStep.value = newCurrent
    }
  }
)

// 标准化步骤配置
const normalizedSteps = computed(() => {
  const steps = props.config.props?.steps || []
  return steps.map((step, index) => {
    const normalizedChildren = step.children.map((child, childIndex) => {
      if ('field' in child) {
        return {
          ...child,
          type: 'field' as const,
          id: child.field || `step-${index}-field-${childIndex}`
        }
      } else {
        return {
          ...child,
          type: 'container' as const,
          id: child.title || `step-${index}-container-${childIndex}`
        }
      }
    })
    
    return {
      ...step,
      key: step.title || `step-${index}`,
      normalizedChildren
    }
  })
})

// 步骤操作
const handlePrevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('step:change', currentStep.value)
  }
}

const handleNextStep = () => {
  if (currentStep.value < normalizedSteps.value.length - 1) {
    currentStep.value++
    emit('step:change', currentStep.value)
  }
}

const handleFinish = () => {
  emit('step:finish')
}

// 事件处理
const handleFieldChange = (field: string, value: any, oldValue: any) => {
  emit('field:change', field, value, oldValue)
}

const handleFieldFocus = (field: string) => {
  emit('field:focus', field)
}

const handleFieldBlur = (field: string) => {
  emit('field:blur', field)
}

const handleFieldValidate = (field: string, result: ValidationResult) => {
  emit('validate', field, result)
}
</script>

<style lang="less">
.steps-container {
  &__content {
    margin: 24px 0;
    min-height: 200px;
  }
  
  &__step-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  &__item {
    flex-shrink: 0;
  }
  
  &__actions {
    padding-top: 16px;
    border-top: 1px solid var(--n-border-color);
    text-align: right;
  }
}
</style>