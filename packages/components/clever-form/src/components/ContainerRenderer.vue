<template>
  <div class="container-renderer">
    <!-- Tabs 容器 -->
    <template v-if="schema.containerType === 'tabs'">
      <NTabs
        v-bind="schema.componentProps"
        :type="schema.componentProps?.type || 'line'"
        :tab-style="schema.componentProps?.tabStyle"
        :pane-style="schema.componentProps?.paneStyle"
      >
        <template v-for="(item, index) in schema.children" :key="`tab-${index}`">
          <NTabPane :name="item.name || `tab-${index}`" :tab="item.title || `Tab ${index + 1}`">
            <FormRenderer
              :schemas="item.children || []"
              :form-model="formModel"
              :methods="methods"
              :layout-config="layoutConfig"
              :is-only-show-one-row="isOnlyShowOneRow"
            />
          </NTabPane>
        </template>
      </NTabs>
    </template>
    
    <!-- Accordion 容器 -->
    <template v-else-if="schema.containerType === 'accordion'">
      <NCollapse
        v-bind="schema.componentProps"
        :default-expanded-names="schema.componentProps?.defaultExpandedNames"
        :accordion="schema.componentProps?.accordion"
      >
        <template v-for="(item, index) in schema.children" :key="`collapse-${index}`">
          <NCollapseItem :name="item.name || `collapse-${index}`" :title="item.title || `Panel ${index + 1}`">
            <FormRenderer
              :schemas="item.children || []"
              :form-model="formModel"
              :methods="methods"
              :layout-config="layoutConfig"
              :is-only-show-one-row="isOnlyShowOneRow"
            />
          </NCollapseItem>
        </template>
      </NCollapse>
    </template>
    
    <!-- Grid 容器 -->
    <template v-else-if="schema.containerType === 'grid'">
      <NGrid v-bind="{ ...getGridConfig(), ...schema.componentProps }">
        <template v-for="(item, index) in schema.children" :key="`grid-${index}`">
          <NGi v-bind="item.giProps || {}">
            <template v-if="isFormContainerSchema(item)">
              <ContainerRenderer
                :schema="item"
                :form-model="formModel"
                :methods="methods"
                :layout-config="layoutConfig"
                :is-only-show-one-row="isOnlyShowOneRow"
              />
            </template>
            <template v-else-if="isFormGroupSchema(item)">
              <div class="form-group" :style="item.style" :class="item.className">
                <h3 v-if="item.title" class="form-group-title">{{ item.title }}</h3>
                <p v-if="item.description" class="form-group-description">{{ item.description }}</p>
                <NGrid v-bind="getGridConfig()">
                  <template v-for="fieldSchema in item.fields" :key="getSchemaKey(fieldSchema)">
                    <NGi v-if="ifShowFormItem(fieldSchema)" v-bind="getComponentProps(fieldSchema, 'gi')">
                      <FormField :schema="fieldSchema" :form-model="formModel" :methods="methods" />
                    </NGi>
                  </template>
                </NGrid>
              </div>
            </template>
            <template v-else>
              <FormField :schema="item" :form-model="formModel" :methods="methods" />
            </template>
          </NGi>
        </template>
      </NGrid>
    </template>
    
    <!-- Flex 容器 -->
    <template v-else-if="schema.containerType === 'flex'">
      <div class="flex-container" :style="getFlexStyle(schema.componentProps)">
        <template v-for="(item, index) in schema.children" :key="`flex-${index}`">
          <div class="flex-item" :style="getFlexItemStyle(item)">
            <template v-if="isFormContainerSchema(item)">
              <ContainerRenderer
                :schema="item"
                :form-model="formModel"
                :methods="methods"
                :layout-config="layoutConfig"
                :is-only-show-one-row="isOnlyShowOneRow"
              />
            </template>
            <template v-else-if="isFormGroupSchema(item)">
              <div class="form-group" :style="item.style" :class="item.className">
                <h3 v-if="item.title" class="form-group-title">{{ item.title }}</h3>
                <p v-if="item.description" class="form-group-description">{{ item.description }}</p>
                <NGrid v-bind="getGridConfig()">
                  <template v-for="fieldSchema in item.fields" :key="getSchemaKey(fieldSchema)">
                    <NGi v-if="ifShowFormItem(fieldSchema)" v-bind="getComponentProps(fieldSchema, 'gi')">
                      <FormField :schema="fieldSchema" :form-model="formModel" :methods="methods" />
                    </NGi>
                  </template>
                </NGrid>
              </div>
            </template>
            <template v-else>
              <FormField :schema="item" :form-model="formModel" :methods="methods" />
            </template>
          </div>
        </template>
      </div>
    </template>
    
    <!-- Card 容器 -->
    <template v-else-if="schema.containerType === 'card'">
      <NCard
        v-bind="schema.componentProps"
        :title="schema.title"
        :bordered="schema.componentProps?.bordered !== false"
        :size="schema.componentProps?.size || 'medium'"
      >
        <FormRenderer
          :schemas="schema.children || []"
          :form-model="formModel"
          :methods="methods"
          :layout-config="layoutConfig"
          :is-only-show-one-row="isOnlyShowOneRow"
        />
      </NCard>
    </template>
    
    <!-- Divider 容器 -->
    <template v-else-if="schema.containerType === 'divider'">
      <NDivider v-bind="schema.componentProps">
        {{ schema.title }}
      </NDivider>
      <FormRenderer
        :schemas="schema.children || []"
        :form-model="formModel"
        :methods="methods"
        :layout-config="layoutConfig"
        :is-only-show-one-row="isOnlyShowOneRow"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NCollapse, NCollapseItem, NGrid, NGi, NCard, NDivider } from 'naive-ui'
import type { FormContainerSchema, FormSchema, FormFieldSchema, FormGroupSchema, LayoutConfig } from '../types/form'
import FormField from './FormField.vue'
import FormRenderer from './FormRenderer.vue'

interface Props {
  schema: FormContainerSchema
  formModel: Record<string, any>
  methods: any
  layoutConfig?: LayoutConfig
  isOnlyShowOneRow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layoutConfig: () => ({}),
  isOnlyShowOneRow: false
})

// 判断是否为容器类型
const isFormContainerSchema = (schema: FormSchema): schema is FormContainerSchema => {
  return 'type' in schema && schema.type === 'container' && 'containerType' in schema
}

// 判断是否为分组类型
const isFormGroupSchema = (schema: FormSchema): schema is FormGroupSchema => {
  return 'fields' in schema && Array.isArray(schema.fields)
}

// 获取Grid配置
const getGridConfig = (config?: any) => {
  const defaultConfig = {
    cols: 24,
    xGap: 16,
    yGap: 16,
    responsive: 'screen' as const
  }
  return { ...defaultConfig, ...props.layoutConfig?.grid, ...config }
}

// 获取Flex样式
const getFlexStyle = (config?: any) => {
  const defaultStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-start'
  }
  return { ...defaultStyle, ...props.layoutConfig?.flex, ...config }
}

// 获取Flex项样式
const getFlexItemStyle = (schema: FormSchema) => {
  const style: any = {}
  if ('flex' in schema && schema.flex) {
    style.flex = schema.flex
  }
  if ('style' in schema && schema.style) {
    Object.assign(style, schema.style)
  }
  return style
}

// 获取组件属性
const getComponentProps = (schema: FormSchema, type: 'gi' | 'flex') => {
  if (type === 'gi') {
    return {
      span: schema.span || 1,
      offset: schema.offset || 0,
      ...schema.giProps
    }
  }
  return {}
}

// 生成schema的key
const getSchemaKey = (schema: FormSchema) => {
  if ('field' in schema) {
    return schema.field
  }
  if ('name' in schema) {
    return schema.name
  }
  if ('title' in schema) {
    return schema.title
  }
  return Math.random().toString(36).substr(2, 9)
}

// 判断是否显示表单项
const ifShowFormItem = (schema: FormSchema) => {
  if ('show' in schema && typeof schema.show === 'boolean') {
    return schema.show
  }
  if ('show' in schema && typeof schema.show === 'function') {
    return schema.show(props.formModel)
  }
  return true
}
</script>

<style scoped>
.container-renderer {
  width: 100%;
}

.flex-container {
  width: 100%;
}

.flex-item {
  min-width: 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-group-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.form-group-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
}
</style>