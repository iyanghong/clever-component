<template>
  <div class="form-renderer">
    <!-- 混合布局模式：最外层使用Grid布局 -->
    <template v-if="isMixedLayout && !isNestedContainer">
      <n-grid v-bind="getOuterGridConfig()" class="mixed-layout-grid">
        <template v-for="(schema, index) in schemas" :key="getSchemaKey(schema, index)">
          <n-gi v-bind="getOuterGridItemProps(schema)">
            <FormRenderer
              :schemas="[schema]"
              :form-model="formModel"
              :form-methods="formMethods"
              :layout-config="layoutConfig"
              :is-nested-container="true"
            />
          </n-gi>
        </template>
      </n-grid>
    </template>

    <!-- 普通渲染模式 -->
    <template v-else>
      <template v-for="(schema, index) in schemas" :key="getSchemaKey(schema, index)">
        <!-- 容器类型渲染 -->
        <template v-if="schema.type === 'container'">
          <!-- Tabs 容器 -->
          <n-tabs
            v-if="schema.containerType === 'tabs'"
            v-bind="getContainerConfig(schema, 'tabs')"
            :class="schema.className"
            :style="schema.style"
          >
            <n-tab-pane
              v-for="child in schema.children"
              :key="child.name || child.field"
              :name="child.name || child.field"
              :tab="child.title || child.label"
            >
              <FormRenderer
                :schemas="child.children || [child]"
                :form-model="formModel"
                :form-methods="formMethods"
                :layout-config="layoutConfig"
                :is-nested-container="true"
              />
            </n-tab-pane>
          </n-tabs>

          <!-- Accordion 容器 -->
          <n-collapse
            v-else-if="schema.containerType === 'accordion'"
            v-bind="getAccordionConfig(schema)"
            :class="schema.className"
            :style="schema.style"
          >
            <n-collapse-item
              v-for="child in schema.children"
              :key="child.name || child.field"
              :name="child.name || child.field"
              :title="child.title || child.label"
            >
              <FormRenderer
                :schemas="child.children || [child]"
                :form-model="formModel"
                :form-methods="formMethods"
                :layout-config="layoutConfig"
                :is-nested-container="true"
              />
            </n-collapse-item>
          </n-collapse>

          <!-- Grid 容器 -->
          <n-grid
            v-else-if="schema.containerType === 'grid'"
            v-bind="getContainerConfig(schema, 'grid')"
            :class="schema.className"
            :style="schema.style"
          >
            <FormRenderer
              :schemas="schema.children"
              :form-model="formModel"
              :form-methods="formMethods"
              :layout-config="layoutConfig"
              :is-grid-container="true"
              :is-nested-container="true"
            />
          </n-grid>

          <!-- Flex 容器 -->
          <n-flex
            v-else-if="schema.containerType === 'flex'"
            v-bind="getContainerConfig(schema, 'flex')"
            :class="schema.className"
            :style="schema.style"
          >
            <FormRenderer
              :schemas="schema.children"
              :form-model="formModel"
              :form-methods="formMethods"
              :layout-config="layoutConfig"
              :is-flex-container="true"
              :is-nested-container="true"
            />
          </n-flex>

          <!-- Card 容器 -->
          <n-card
            v-else-if="schema.containerType === 'card'"
            v-bind="getContainerConfig(schema, 'card')"
            :class="schema.className"
            :style="schema.style"
            :title="schema.title"
          >
            <FormRenderer
              :schemas="schema.children"
              :form-model="formModel"
              :form-methods="formMethods"
              :layout-config="layoutConfig"
              :is-nested-container="true"
            />
          </n-card>

          <!-- Divider 容器 -->
          <template v-else-if="schema.containerType === 'divider'">
            <n-divider
            v-if="schema.title"
            :title-placement="schema.config?.titlePlacement || 'center'"
          >
            {{ schema.title }}
          </n-divider>
          <FormRenderer
            :schemas="schema.children"
            :form-model="formModel"
            :form-methods="formMethods"
            :layout-config="layoutConfig"
          />
        </template>
      </template>

      <!-- 字段类型渲染 -->
      <template v-else>
        <!-- Grid 容器中的字段 -->
        <n-gi
          v-if="isGridContainer"
          v-bind="formMethods.getFormItemProps(schema)"
          v-show="formMethods.getComponentProps(schema).show"
        >
          <n-form-item
            :path="schema.field"
            :label="schema.label"
            :label-width="schema.labelWidth"
            :label-placement="schema.labelPlacement"
            :rule="schema.rules"
            :show-require-mark="schema.required"
            :show-label="schema.showLabel !== false"
            :label-style="schema.labelStyle"
            :feedback="schema.feedback"
            :validation-status="schema.validationStatus"
          >
            <component
              :is="formMethods.getFormComponent(schema)"
              v-bind="formMethods.getComponentProps(schema)"
              v-model:value="formModel[schema.field]"
              @update:value="(val) => formMethods.setFieldValue(schema.field, val)"
            />
          </n-form-item>
        </n-gi>

        <!-- Flex 容器中的字段 -->
        <div
          v-else-if="isFlexContainer"
          :style="getFlexItemStyle(schema)"
          v-show="formMethods.getComponentProps(schema).show"
        >
          <n-form-item
            :path="schema.field"
            :label="schema.label"
            :label-width="schema.labelWidth"
            :label-placement="schema.labelPlacement"
            :rule="schema.rules"
            :show-require-mark="schema.required"
            :show-label="schema.showLabel !== false"
            :label-style="schema.labelStyle"
            :feedback="schema.feedback"
            :validation-status="schema.validationStatus"
          >
            <component
              :is="formMethods.getFormComponent(schema)"
              v-bind="formMethods.getComponentProps(schema)"
              v-model:value="formModel[schema.field]"
              @update:value="(val) => formMethods.setFieldValue(schema.field, val)"
            />
          </n-form-item>
        </div>

        <!-- 普通字段 -->
        <n-form-item
          v-else
          :path="schema.field"
          :label="schema.label"
          :label-width="schema.labelWidth"
          :label-placement="schema.labelPlacement"
          :rule="schema.rules"
          :show-require-mark="schema.required"
          :show-label="schema.showLabel !== false"
          :label-style="schema.labelStyle"
          :feedback="schema.feedback"
          :validation-status="schema.validationStatus"
          v-show="formMethods.getComponentProps(schema).show"
        >
          <component
            :is="formMethods.getFormComponent(schema)"
            v-bind="formMethods.getComponentProps(schema)"
            v-model:value="formModel[schema.field]"
            @update:value="(val) => formMethods.setFieldValue(schema.field, val)"
          />
        </n-form-item>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NTabs,
  NTabPane,
  NCollapse,
  NCollapseItem,
  NGrid,
  NGi,
  NFlex,
  NCard,
  NDivider,
  NFormItem
} from 'naive-ui'
import type { FormSchema, FormContainerSchema, LayoutConfig } from './form'

interface Props {
  schemas: (FormSchema | FormContainerSchema)[]
  formModel: Record<string, any>
  formMethods: any
  layoutConfig?: LayoutConfig
  isGridContainer?: boolean
  isFlexContainer?: boolean
  isMixedLayout?: boolean
  isNestedContainer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layoutConfig: () => ({}),
  isGridContainer: false,
  isFlexContainer: false,
  isMixedLayout: false,
  isNestedContainer: false
})

// 获取 Schema 的唯一键
const getSchemaKey = (schema: FormSchema | FormContainerSchema, index: number) => {
  if (schema.type === 'container') {
    return schema.name || `container-${index}`
  }
  return schema.field || `field-${index}`
}

// 获取容器配置
const getContainerConfig = (schema: FormContainerSchema, containerType: string) => {
  const config = schema.config || {}
  const layoutTypeConfig = props.layoutConfig?.[containerType] || {}
  
  return {
    ...layoutTypeConfig,
    ...config
  }
}

// 获取 Accordion 特殊配置
const getAccordionConfig = (schema: FormContainerSchema) => {
  const config = schema.config || {}
  const layoutTypeConfig = props.layoutConfig?.accordion || {}
  
  // 默认配置
  const defaultConfig = {
    accordion: false, // 默认允许多个同时展开
    defaultExpandedNames: schema.children?.map(child => child.name || child.field) || [] // 默认全部展开
  }
  
  return {
    ...defaultConfig,
    ...layoutTypeConfig,
    ...config
  }
}

// 获取 Flex 项目样式
const getFlexItemStyle = (schema: FormSchema) => {
  const layout = schema.layout || {}
  return {
    flex: layout.flex || '1',
    minWidth: layout.minWidth || 'auto',
    maxWidth: layout.maxWidth || 'none',
    ...layout.style
  }
}

// 获取外层Grid配置（混合布局模式）
const getOuterGridConfig = () => {
  const defaultConfig = {
    cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  }
  
  const gridConfig = props.layoutConfig?.grid || {}
  return {
    ...defaultConfig,
    ...gridConfig
  }
}

// 获取外层Grid项属性（混合布局模式）
const getOuterGridItemProps = (schema: FormSchema | FormContainerSchema) => {
  // 容器类型默认占用更多空间
  if (schema.type === 'container') {
    const containerSpan = getContainerSpan(schema.containerType)
    return {
      span: containerSpan,
      ...schema.gridProps
    }
  }
  
  // 普通字段使用默认span
  const layout = (schema as FormSchema).layout || {}
  return {
    span: layout.span || 1,
    offset: layout.offset || 0,
    ...schema.gridProps
  }
}

// 获取容器类型的默认span值
const getContainerSpan = (containerType?: string) => {
  switch (containerType) {
    case 'tabs':
    case 'accordion':
    case 'card':
      return '1 s:1 m:2 l:3 xl:4 2xl:4' // 占满整行
    case 'grid':
    case 'flex':
      return '1 s:1 m:2 l:2 xl:2 2xl:2' // 占半行
    case 'divider':
      return '1 s:1 m:2 l:3 xl:4 2xl:4' // 占满整行
    default:
      return 1
  }
}
</script>

<style scoped>
.form-renderer {
  width: 100%;
}
</style>