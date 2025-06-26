<template>
  <NFormItem
    v-if="isVisible"
    v-bind="formItemProps"
    :class="fieldClass"
    :style="fieldStyle"
  >
    <!-- 自定义标签插槽 -->
    <template v-if="schema.labelSlot || schema.labelMessage" #label>
      <div class="clever-form-field-label">
        <span>{{ schema.label }}</span>
        <NTooltip v-if="schema.labelMessage" trigger="hover">
          <template #trigger>
            <NIcon class="clever-form-field-label-icon" :size="16">
              <InformationCircleOutline />
            </NIcon>
          </template>
          <span>{{ schema.labelMessage }}</span>
        </NTooltip>
      </div>
      <slot
        v-if="schema.labelSlot"
        :name="`label-${schema.field}`"
        :schema="schema"
        :form-data="formData"
      />
    </template>
    
    <!-- 前缀内容 -->
    <template v-if="schema.prefix || schema.prefixSlot">
      <div class="clever-form-field-prefix">
        <template v-if="schema.prefix">{{ schema.prefix }}</template>
        <slot
          v-if="schema.prefixSlot"
          :name="`prefix-${schema.field}`"
          :schema="schema"
          :form-data="formData"
        />
      </div>
    </template>
    
    <!-- 字段内容 -->
    <div class="clever-form-field-content">
      <!-- 自定义插槽渲染 -->
      <slot
        v-if="schema.slot"
        :name="schema.field"
        :schema="schema"
        :form-data="formData"
        :methods="methods"
      />
      
      <!-- 自定义渲染函数 -->
      <template v-else-if="schema.render">
        <component
          :is="schema.render"
          :schema="schema"
          :form-data="formData"
          :methods="methods"
        />
      </template>
      
      <!-- 查看模式 -->
      <template v-else-if="schema.showMode === 'view'">
        <div class="clever-form-field-view">
          {{ displayValue }}
        </div>
      </template>
      
      <!-- 正常编辑模式 -->
      <template v-else>
        <!-- 选项类组件 -->
        <template v-if="isOptionsComponent(schema.component)">
          <component
            :is="component"
            v-model:value="fieldValue"
            v-bind="componentProps"
            @update:value="handleValueChange"
            @blur="handleBlur"
            @focus="handleFocus"
          >
            <!-- 选项渲染 -->
            <template v-if="schema.options?.length">
              <component
                :is="getOptionComponent(schema.component)"
                v-for="option in schema.options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </component>
            </template>
            
            <!-- 自定义选项插槽 -->
            <slot
              v-if="schema.optionsSlot"
              :name="`options-${schema.field}`"
              :schema="schema"
              :form-data="formData"
            />
          </component>
        </template>
        
        <!-- 上传组件 -->
        <template v-else-if="isUploadComponent(schema.component)">
          <component
            :is="component"
            v-model:file-list="fieldValue"
            v-bind="componentProps"
            @update:file-list="handleValueChange"
          >
            <slot
              v-if="schema.uploadSlot"
              :name="`upload-${schema.field}`"
              :schema="schema"
              :form-data="formData"
            >
              <NButton>{{ schema.uploadText || '点击上传' }}</NButton>
            </slot>
          </component>
        </template>
        
        <!-- 自定义组件 -->
        <template v-else-if="isCustomComponent(schema.component)">
          <component
            :is="schema.component"
            v-model:value="fieldValue"
            v-bind="componentProps"
            @update:value="handleValueChange"
            @blur="handleBlur"
            @focus="handleFocus"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </component>
        </template>
        
        <!-- 普通组件 -->
        <template v-else>
          <component
            :is="component"
            v-model:value="fieldValue"
            v-bind="componentProps"
            @update:value="handleValueChange"
            @blur="handleBlur"
            @focus="handleFocus"
          />
        </template>
      </template>
    </div>
    
    <!-- 后缀内容 -->
    <template v-if="schema.suffix || schema.suffixSlot">
      <div class="clever-form-field-suffix">
        <template v-if="schema.suffix">{{ schema.suffix }}</template>
        <slot
          v-if="schema.suffixSlot"
          :name="`suffix-${schema.field}`"
          :schema="schema"
          :form-data="formData"
        />
      </div>
    </template>
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NTooltip, NIcon, NButton } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'
import type {
  FormFieldSchema,
  FormMethods
} from '../types/core'
import {
  useFormField,
  isOptionsComponent,
  isUploadComponent,
  isCustomComponent
} from '../composables/useFormField'

// ============= 组件属性 =============

interface Props {
  /** 字段配置 */
  schema: FormFieldSchema
  /** 表单数据 */
  formData: Record<string, any>
  /** 表单方法 */
  methods: FormMethods
}

const props = defineProps<Props>()

// ============= 使用组合式函数 =============

const {
  component,
  componentProps,
  formItemProps,
  fieldClass,
  fieldStyle,
  isVisible,
  fieldValue,
  displayValue,
  handleValueChange,
  handleBlur,
  handleFocus
} = useFormField(props)

// ============= 方法 =============

/** 获取选项组件名称 */
const getOptionComponent = (componentName: string) => {
  const componentMap: Record<string, string> = {
    'n-checkbox-group': 'n-checkbox',
    'n-radio-group': 'n-radio',
    'n-select': 'n-option',
    'n-cascader': 'n-cascader-option',
    'n-transfer': 'n-transfer-item'
  }
  
  return componentMap[componentName] || ''
}
</script>

<style scoped>
.clever-form-field-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.clever-form-field-label-icon {
  color: var(--n-text-color-disabled);
  cursor: pointer;
}

.clever-form-field-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.clever-form-field-prefix,
.clever-form-field-suffix {
  display: flex;
  align-items: center;
  margin: 0 8px;
  color: var(--n-text-color-disabled);
  font-size: 14px;
}

.clever-form-field-view {
  min-height: 34px;
  padding: 4px 0;
  display: flex;
  align-items: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .clever-form-field-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .clever-form-field-prefix,
  .clever-form-field-suffix {
    margin: 4px 0;
  }
}
</style>