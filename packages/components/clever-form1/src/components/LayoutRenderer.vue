<template>
  <div class="layout-renderer">
    <!-- Mixed Layout -->
    <template v-if="layoutMode === 'mixed'">
      <!-- 使用 FormRenderer 来处理混合布局 -->
      <FormRenderer
        :schemas="schemas"
        :form-model="formModel"
        :methods="{
          getFormItemProps: getFormItemPropsMethod,
          getComponentProps: getComponentPropsMethod,
          getFormComponent: getFormComponent,
          setFieldValue: setFieldValue,
          handleFieldChange: handleFieldChangeMethod,
          ifShowFormItem: ifShowFormItemMethod
        }"
        :layout-config="layoutConfig"
        :is-only-show-one-row="isOnlyShowOneRow"
        :is-mixed-layout="true"
      />
      
      <!-- 操作按钮组 -->
      <ActionButtons
        v-if="showActionButtonGroup"
        v-bind="actionButtonProps"
        container-class="clever-form-action"
        :container-style="{ marginTop: '16px' }"
        @reset="$emit('reset')"
        @submit="$emit('submit')"
        @toggle="$emit('unfold-toggle')"
      />
    </template>

    <!-- Grid Layout -->
    <template v-else-if="layoutMode === 'grid'">
      <!-- 只显示一行模式 -->
      <template v-if="isOnlyShowOneRow">
        <div class="one-row-layout">
          <!-- 表单字段区域 -->
          <div class="form-fields">
            <template v-for="schema in schemas" :key="getSchemaKey(schema)">
              <div v-if="ifShowFormItemMethod?.(schema) ?? true" class="field-item">
                <FormFieldRenderer
                  :schema="schema"
                  :form-model="formModel"
                  :get-form-item-props="getFormItemPropsMethod"
                  :get-component-props="getComponentPropsMethod"
                  :handle-field-change="handleFieldChangeMethod"
                >
                  <template
                    v-for="(_, slotName) in $slots"
                    #[slotName]="slotProps"
                  >
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FormFieldRenderer>
              </div>
            </template>
          </div>

          <!-- 操作按钮区域 -->
          <ActionButtons
            v-bind="actionButtonProps"
            @reset="$emit('reset')"
            @submit="$emit('submit')"
            @toggle="$emit('unfold-toggle')"
          />
        </div>
      </template>

      <!-- 正常网格模式 -->
      <template v-else>
        <NGrid v-bind="gridProps">
          <template v-for="schema in schemas" :key="getSchemaKey(schema)">
            <NGi
              v-if="ifShowFormItemMethod?.(schema) ?? true"
              v-bind="getGridItemProps(schema)"
            >
              <FormFieldRenderer
                :schema="schema"
                :form-model="formModel"
                :get-form-item-props="getFormItemPropsMethod"
                :get-component-props="getComponentPropsMethod"
                :handle-field-change="handleFieldChangeMethod"
              >
                <template
                  v-for="(_, slotName) in $slots"
                  #[slotName]="slotProps"
                >
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FormFieldRenderer>
            </NGi>
          </template>
        </NGrid>
      </template>
    </template>

    <!-- Flex Layout -->
    <template v-else-if="layoutMode === 'flex'">
      <!-- 只显示一行模式 -->
      <template v-if="isOnlyShowOneRow">
        <div class="one-row-layout">
          <!-- 表单字段区域 -->
          <div class="form-fields">
            <template v-for="schema in schemas" :key="getSchemaKey(schema)">
              <div v-if="ifShowFormItemMethod?.(schema) ?? true" class="field-item">
                <FormFieldRenderer
                  :key="getSchemaKey(schema)"
                  :schema="schema"
                  :form-model="formModel"
                  :get-form-item-props="getFormItemPropsMethod"
                  :get-component-props="getComponentPropsMethod"
                  :handle-field-change="handleFieldChangeMethod"
                >
                  <template
                    v-for="(_, slotName) in $slots"
                    :key="slotName"
                    #[slotName]="slotProps"
                  >
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FormFieldRenderer>
              </div>
            </template>
          </div>

          <!-- 操作按钮区域 -->
          <ActionButtons
            v-bind="actionButtonProps"
            @reset="$emit('reset')"
            @submit="$emit('submit')"
            @toggle="$emit('unfold-toggle')"
          />
        </div>
      </template>

      <!-- 正常Flex模式 -->
      <template v-else>
        <div class="clever-form-flex" :style="flexStyle">
          <template v-for="schema in schemas" :key="getSchemaKey(schema)">
            <div
              v-if="ifShowFormItemMethod?.(schema) ?? true"
              class="clever-form-flex-item"
              :style="getFlexItemStyleMethod?.(schema) ?? {}"
            >
              <FormFieldRenderer
                :schema="schema"
                :form-model="formModel"
                :get-form-item-props="getFormItemPropsMethod"
                :get-component-props="getComponentPropsMethod"
                :handle-field-change="handleFieldChangeMethod"
              >
                <template
                  v-for="(_, slotName) in $slots"
                  #[slotName]="slotProps"
                >
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FormFieldRenderer>
            </div>
          </template>
        </div>

        <!-- 操作按钮组 -->
        <ActionButtons
          v-bind="actionButtonProps"
          container-class="clever-form-action"
          :container-style="{ marginTop: '16px' }"
          @reset="$emit('reset')"
          @submit="$emit('submit')"
          @toggle="$emit('unfold-toggle')"
        />
      </template>
    </template>

    <!-- Tabs Layout -->
    <template v-else-if="layoutMode === 'tabs'">
      <!-- 只显示一行模式 -->
      <template v-if="isOnlyShowOneRow">
        <div class="one-row-layout">
          <!-- 表单字段区域 -->
          <div class="form-fields">
            <template v-for="schema in schemas" :key="getSchemaKey(schema)">
              <div v-if="ifShowFormItemMethod?.(schema) ?? true" class="field-item">
                <FormFieldRenderer
                  :schema="schema"
                  :form-model="formModel"
                  :get-form-item-props="getFormItemProps"
                  :get-component-props="getComponentProps"
                  :handle-field-change="handleFieldChange"
                >
                  <template
                    v-for="(_, slotName) in $slots"
                    #[slotName]="slotProps"
                  >
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FormFieldRenderer>
              </div>
            </template>
          </div>

          <!-- 操作按钮区域 -->
          <ActionButtons
            v-bind="actionButtonProps"
            @reset="$emit('reset')"
            @submit="$emit('submit')"
            @toggle="$emit('toggle')"
          />
        </div>
      </template>

      <!-- 正常Tabs模式 -->
      <template v-else>
        <NTabs type="line" animated>
          <NTabPane
            v-for="group in getGroupedSchemasMethod?.()"
            :key="group.name"
            :name="group.name"
            :tab="group.title"
          >
            <NGrid v-bind="gridProps">
              <template
                v-for="schema in group.fields"
                :key="getSchemaKey(schema)"
              >
                <NGi
                  v-if="ifShowFormItemMethod?.(schema) ?? true"
                  v-bind="getGridItemProps(schema)"
                >
                  <FormFieldRenderer
                    :key="getSchemaKey(schema)"
                    :schema="schema"
                    :form-model="formModel"
                    :get-form-item-props="getFormItemPropsMethod"
                    :get-component-props="getComponentPropsMethod"
                    :handle-field-change="handleFieldChangeMethod"
                  >
                    <template
                      v-for="(_, slotName) in $slots"
                      :key="slotName"
                      #[slotName]="slotProps"
                    >
                      <slot :name="slotName" v-bind="slotProps" />
                    </template>
                  </FormFieldRenderer>
                </NGi>
              </template>
            </NGrid>
          </NTabPane>
        </NTabs>

        <!-- 操作按钮组 -->
        <ActionButtons
          v-bind="actionButtonProps"
          container-class="clever-form-action"
          :container-style="{ marginTop: '16px' }"
          @reset="$emit('reset')"
          @submit="$emit('submit')"
          @toggle="$emit('toggle')"
        />
      </template>
    </template>

    <!-- Accordion Layout -->
    <template v-else-if="layoutMode === 'accordion'">
      <!-- 只显示一行模式 -->
      <template v-if="isOnlyShowOneRow">
        <NSpace
          :wrap="false"
          align="center"
          justify="space-between"
          style="width: 100%"
        >
          <!-- 表单字段区域 -->
          <div style="flex: 1; min-width: 0">
            <NSpace :wrap="false" align="center">
              <template v-for="schema in schemas" :key="getSchemaKey(schema)">
                <div
                  v-if="ifShowFormItemMethod?.(schema) ?? true"
                  style="min-width: 200px"
                >
                  <FormFieldRenderer
                    :schema="schema"
                    :form-model="formModel"
                    :get-form-item-props="getFormItemPropsMethod"
                    :get-component-props="getComponentPropsMethod"
                    :handle-field-change="handleFieldChangeMethod"
                  >
                    <template
                      v-for="(_, slotName) in $slots"
                      #[slotName]="slotProps"
                    >
                      <slot :name="slotName" v-bind="slotProps" />
                    </template>
                  </FormFieldRenderer>
                </div>
              </template>
            </NSpace>
          </div>

          <!-- 操作按钮区域 -->
          <ActionButtons
            v-bind="actionButtonProps"
            :container-style="{ flexShrink: 0, marginLeft: '16px' }"
            @reset="$emit('reset')"
            @submit="$emit('submit')"
            @toggle="$emit('toggle')"
          />
        </NSpace>
      </template>

      <!-- 正常Accordion模式 -->
      <template v-else>
        <NCollapse>
          <NCollapseItem
            v-for="group in getGroupedSchemasMethod?.()"
            :key="group.name"
            :title="group.title"
            :name="group.name"
          >
            <NGrid v-bind="gridProps">
              <template
                v-for="schema in group.fields"
                :key="getSchemaKey(schema)"
              >
                <NGi
                  v-if="ifShowFormItemMethod?.(schema) ?? true"
                  v-bind="getGridItemProps(schema)"
                >
                  <FormFieldRenderer
                    :schema="schema"
                    :form-model="formModel"
                    :get-form-item-props="getFormItemPropsMethod"
                    :get-component-props="getComponentPropsMethod"
                    :handle-field-change="handleFieldChangeMethod"
                  >
                    <template
                      v-for="(_, slotName) in $slots"
                      #[slotName]="slotProps"
                    >
                      <slot :name="slotName" v-bind="slotProps" />
                    </template>
                  </FormFieldRenderer>
                </NGi>
              </template>
            </NGrid>
          </NCollapseItem>
        </NCollapse>

        <!-- 操作按钮组 -->
        <ActionButtons
          v-bind="actionButtonProps"
          container-class="clever-form-action"
          :container-style="{ marginTop: '16px' }"
          @reset="$emit('reset')"
          @submit="$emit('submit')"
          @toggle="$emit('toggle')"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NGrid,
  NGi,
  NTabs,
  NTabPane,
  NCollapse,
  NCollapseItem,
  NSpace
} from 'naive-ui'
import FormFieldRenderer from './FormFieldRenderer.vue'
import FormRenderer from './FormRenderer.vue'
import ActionButtons from './ActionButtons.vue'
import type { FormFieldSchema, CleverFormMethods, LayoutConfig } from '../types/form'
import type { ButtonProps } from 'naive-ui'

import type { UseFormReturn, LayoutRendererFormProps } from '../types/use-form'

interface Props {
  layoutMode: 'grid' | 'flex' | 'tabs' | 'accordion' | 'mixed'
  schemas: FormFieldSchema[]
  formModel: Record<string, any>
  layoutConfig?: LayoutConfig
  isOnlyShowOneRow?: boolean
  showActionButtonGroup?: boolean
  showResetButton?: boolean
  showSubmitButton?: boolean
  showAdvancedButton?: boolean
  resetButtonText?: string
  submitButtonText?: string
  collapsed?: boolean
  // 使用专门的类型来接收 useForm 返回的方法
  formMethods?: LayoutRendererFormProps
  // 保持向后兼容，单独传递的方法（可选）
  getFormItemProps?: (schema: FormFieldSchema) => Record<string, any>
  getComponentProps?: (schema: FormFieldSchema) => Record<string, any>
  getGrid?: () => Record<string, any>
  getResetBtnOptions?: () => ButtonProps
  getSubmitBtnOptions?: () => ButtonProps
  getGroupedSchemas?: () => Array<{
    name: string
    title: string
    fields: FormFieldSchema[]
  }>
  ifShowFormItem?: (schema: FormFieldSchema) => boolean
  handleFieldChange?: (
    schema: FormFieldSchema,
    newValue: any,
    oldValue: any
  ) => void
  getFlexItemStyle?: (schema: FormFieldSchema) => Record<string, any>
  getFlexStyle?: () => Record<string, any>
  getFormComponent?: (schema: FormFieldSchema) => any
  setFieldValue?: (field: string, value: any) => void
}

const props = defineProps<Props>()

defineEmits<{
  reset: []
  submit: []
  'unfold-toggle': []
}>()

// 计算属性：优先使用 formMethods 中的方法，否则使用单独传递的方法
const getFormItemPropsMethod = computed(() => {
  return props.formMethods?.getFormItemProps || props.getFormItemProps
})

const getComponentPropsMethod = computed(() => {
  return props.formMethods?.getComponentProps || props.getComponentProps
})

const getGridMethod = computed(() => {
  return props.formMethods?.getGrid || props.getGrid
})

const getResetBtnOptionsMethod = computed(() => {
  return props.formMethods?.getResetBtnOptions || props.getResetBtnOptions
})

const getSubmitBtnOptionsMethod = computed(() => {
  return props.formMethods?.getSubmitBtnOptions || props.getSubmitBtnOptions
})

const getGroupedSchemasMethod = computed(() => {
  return props.formMethods?.getGroupedSchemas || props.getGroupedSchemas
})

const ifShowFormItemMethod = computed(() => {
  return props.formMethods?.ifShowFormItem || props.ifShowFormItem
})

const handleFieldChangeMethod = computed(() => {
  return props.formMethods?.handleFieldChange || props.handleFieldChange
})

const getFlexItemStyleMethod = computed(() => {
  return props.formMethods?.getFlexItemStyle || props.getFlexItemStyle
})

const getFlexStyleMethod = computed(() => {
  return props.formMethods?.getFlexStyle || props.getFlexStyle
})

const getFormComponent = computed(() => {
  return props.formMethods?.getFormComponent || props.getFormComponent
})

const setFieldValue = computed(() => {
  return props.formMethods?.setFieldValue || props.setFieldValue
})

// 网格属性
const gridProps = computed(() => {
  return getGridMethod.value?.()
})

// Flex样式
const flexStyle = computed(() => {
  return getFlexStyleMethod.value?.() || {}
})

// 操作按钮属性
const actionButtonProps = computed(() => {
  return {
    showActionButtonGroup: props.showActionButtonGroup,
    showResetButton: props.showResetButton,
    showSubmitButton: props.showSubmitButton,
    showAdvancedButton: props.showAdvancedButton,
    resetButtonText: props.resetButtonText,
    submitButtonText: props.submitButtonText,
    collapsed: props.collapsed,
    resetButtonOptions: getResetBtnOptionsMethod.value?.(),
    submitButtonOptions: getSubmitBtnOptionsMethod.value?.()
  }
})

// 获取schema的唯一key
const getSchemaKey = (schema: FormFieldSchema) => {
  return schema.field as string
}

// 获取网格项属性
const getGridItemProps = (schema: FormFieldSchema) => {
  return schema.layout || {}
}
</script>

<style scoped>
.one-row-layout {
  display: flex;
  align-items: flex-end;
  width: 100%;
  gap: 16px;
}

.form-fields {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.field-item {
  flex: 1;
  min-width: 200px;
}

.clever-form-flex {
  display: flex;
}

.clever-form-flex-item {
  /* 样式由getFlexItemStyle动态设置 */
}
</style>
