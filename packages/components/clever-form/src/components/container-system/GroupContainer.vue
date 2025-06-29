<template>
  <div class="group-container">
    <n-collapse
      v-if="config.props?.collapsible"
      :value="expandedValue"
      :arrow-placement="config.props?.showArrow !== false ? 'left' : undefined"
      :display-directive="'show'"
      @update:value="handleExpandedChange"
    >
      <n-collapse-item
        :name="groupKey"
        :title="config.title"
        :disabled="disabled"
      >
        <template v-if="config.props?.titleIcon" #header-extra>
          <component :is="config.props.titleIcon" />
        </template>
        
        <div class="group-container__content">
          <div
            v-for="(child, index) in normalizedChildren"
            :key="child.id || index"
            class="group-container__item"
          >
            <!-- 字段渲染 -->
            <CleverFormItem
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
      </n-collapse-item>
    </n-collapse>
    
    <!-- 非折叠模式 -->
    <div v-else class="group-container__static">
      <div 
        v-if="config.title"
        class="group-container__header"
        :style="headerStyle"
      >
        <component v-if="config.props?.titleIcon" :is="config.props.titleIcon" class="group-container__icon" />
        <span class="group-container__title">{{ config.title }}</span>
        <div v-if="config.props?.titleExtra" class="group-container__extra">
          <component :is="config.props.titleExtra" />
        </div>
      </div>
      
      <div 
        class="group-container__content"
        :class="{
          'group-container__content--bordered': config.props?.bordered
        }"
      >
        <div
          v-for="(child, index) in normalizedChildren"
          :key="child.id || index"
          class="group-container__item"
        >
          <!-- 字段渲染 -->
          <CleverFormItem
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCollapse, NCollapseItem } from 'naive-ui'
import type { GroupContainerConfig } from '../../types/layout'

import type { ValidationResult } from '../../types/validation'
import CleverFormItem from '../CleverFormItem.vue'
import ContainerRenderer from './ContainerRenderer.vue'
import { normalizeChildren } from '@/components/clever-form'

// Props定义
interface Props {
  /** 分组容器配置 */
  config: GroupContainerConfig
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
}

const emit = defineEmits<Emits>()

// 分组键值
const groupKey = computed(() => props.config.title || 'group')

// 展开状态
const expandedValue = ref<string[]>(
  props.config.props?.defaultExpanded !== false ? [groupKey.value] : []
)

const normalizedChildren = computed(() => {
  return normalizeChildren(props.config.children || [])
})

// 头部样式
const headerStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontWeight: '500'
  }
  
  const { titleAlign } = props.config.props || {}
  
  if (titleAlign) {
    style.justifyContent = titleAlign === 'start' ? 'flex-start' : 
                          titleAlign === 'end' ? 'flex-end' : 'center'
  }
  
  return style
})

// 处理展开状态变化
const handleExpandedChange = (value: string[]) => {
  expandedValue.value = value
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
.group-container {
  &__static {
    width: 100%;
  }
  
  &__header {
    padding-bottom: 8px;
    border-bottom: 1px solid var(--n-border-color);
  }
  
  &__icon {
    font-size: 16px;
    color: var(--n-text-color-2);
  }
  
  &__title {
    font-size: 14px;
    color: var(--n-text-color-1);
  }
  
  &__extra {
    margin-left: auto;
  }
  
  &__content {
    padding: 16px 0;
    
    &--bordered {
      border: 1px solid var(--n-border-color);
      border-radius: 6px;
      padding: 16px;
    }
  }
  
  &__item {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>