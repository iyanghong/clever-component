<template>
  <div class="form-renderer">
    <!-- 单行显示模式 -->
    <template v-if="isOnlyShowOneRow">
      <div class="one-row-layout">
        <div class="form-fields">
          <template v-for="schema in schemas" :key="getSchemaKey(schema)">
            <!-- 分组类型 -->
            <template v-if="isFormGroupSchema(schema)">
              <template v-for="fieldSchema in schema.fields" :key="getSchemaKey(fieldSchema)">
                <div v-if="ifShowFormItem(fieldSchema)" class="field-item">
                  <FormField :schema="fieldSchema" :form-model="formModel" :methods="methods" />
                </div>
              </template>
            </template>
            
            <!-- 字段类型 -->
            <template v-else-if="!isFormContainerSchema(schema)">
              <div v-if="ifShowFormItem(schema)" class="field-item">
                <FormField :schema="schema" :form-model="formModel" :methods="methods" />
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
    
    <!-- 正常显示模式 -->
    <template v-else>
      <template v-for="schema in schemas" :key="getSchemaKey(schema)">
        <!-- 分组类型 -->
        <template v-if="isFormGroupSchema(schema)">
          <div class="form-group" :style="schema.style" :class="schema.className">
            <h3 v-if="schema.title" class="form-group-title">{{ schema.title }}</h3>
            <p v-if="schema.description" class="form-group-description">{{ schema.description }}</p>
            <NGrid v-bind="getGridConfig()">
              <template v-for="fieldSchema in schema.fields" :key="getSchemaKey(fieldSchema)">
                <NGi v-if="ifShowFormItem(fieldSchema)" v-bind="getComponentProps(fieldSchema, 'gi')">
                  <FormField :schema="fieldSchema" :form-model="formModel" :methods="methods" />
                </NGi>
              </template>
            </NGrid>
          </div>
        </template>
      
      <!-- 容器类型 -->
      <template v-else-if="schema.type === 'container'">
        <!-- Tabs 容器 -->
        <NTabs v-if="schema.containerType === 'tabs'" v-bind="schema.config || {}">
          <NTabPane 
            v-for="(child, index) in schema.children" 
            :key="index"
            :name="child.name || `tab-${index}`"
            :tab="child.title || child.label || `Tab ${index + 1}`"
          >
            <FormRenderer 
              :schemas="Array.isArray(child.children) ? child.children : [child]"
              :form-model="formModel"
              :methods="methods"
              :layout-config="layoutConfig"
              :is-only-show-one-row="isOnlyShowOneRow"
            />
          </NTabPane>
        </NTabs>
        
        <!-- Accordion 容器 -->
        <NCollapse v-else-if="schema.containerType === 'accordion'" v-bind="schema.config || {}">
          <NCollapseItem 
            v-for="(child, index) in schema.children"
            :key="index"
            :title="child.title || child.label || `Section ${index + 1}`"
            :name="child.name || `section-${index}`"
          >
            <FormRenderer 
              :schemas="Array.isArray(child.children) ? child.children : [child]"
              :form-model="formModel"
              :methods="methods"
              :layout-config="layoutConfig"
              :is-only-show-one-row="isOnlyShowOneRow"
            />
          </NCollapseItem>
        </NCollapse>
        
        <!-- Grid 容器 -->
        <NGrid v-else-if="schema.containerType === 'grid'" v-bind="getGridConfig(schema.config)">
          <template v-for="childSchema in schema.children" :key="getSchemaKey(childSchema)">
            <NGi v-if="childSchema.type !== 'container' && ifShowFormItem(childSchema)" v-bind="getComponentProps(childSchema, 'gi')">
              <FormField :schema="childSchema" :form-model="formModel" :methods="methods" />
            </NGi>
            <FormRenderer 
              v-else-if="childSchema.type === 'container'"
              :schemas="[childSchema]"
              :form-model="formModel"
              :methods="methods"
              :layout-config="layoutConfig"
              :is-only-show-one-row="isOnlyShowOneRow"
            />
          </template>
        </NGrid>
        
        <!-- Flex 容器 -->
        <div v-else-if="schema.containerType === 'flex'" :style="getFlexStyle(schema.config)">
          <template v-for="childSchema in schema.children" :key="getSchemaKey(childSchema)">
            <div v-if="childSchema.type !== 'container' && ifShowFormItem(childSchema)" :style="getFlexItemStyle(childSchema)">
              <FormField :schema="childSchema" :form-model="formModel" :methods="methods" />
            </div>
            <FormRenderer 
              v-else-if="childSchema.type === 'container'"
              :schemas="[childSchema]"
              :form-model="formModel"
              :methods="methods"
              :layout-config="layoutConfig"
              :is-only-show-one-row="isOnlyShowOneRow"
            />
          </template>
        </div>
      </template>
      
      <!-- 字段类型 -->
      <template v-else>
        <div v-if="isFlex && ifShowFormItem(schema)" :style="getFlexItemStyle(schema)">
          <FormField :schema="schema" :form-model="formModel" :methods="methods" />
        </div>
        <FormField v-else-if="ifShowFormItem(schema)" :schema="schema" :form-model="formModel" :methods="methods" />
      </template>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTabs, NTabPane, NCollapse, NCollapseItem, NGrid, NGi } from 'naive-ui'
import FormField from './FormField.vue'
import type { FormSchema, FormFieldSchema, FormGroupSchema, FormContainerSchema, CleverFormMethods, LayoutConfig } from '../types/form'

interface Props {
  schemas: (FormSchema | FormContainerSchema)[]
  formModel: Record<string, any>
  methods: CleverFormMethods
  layoutConfig?: LayoutConfig
  isFlex?: boolean
  isOnlyShowOneRow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFlex: false,
  isOnlyShowOneRow: false
})

// 判断是否为分组schema
const isFormGroupSchema = (schema: FormSchema | FormContainerSchema): schema is FormGroupSchema => {
  return 'title' in schema && 'fields' in schema && !('type' in schema)
}

// 生成schema的唯一key
const getSchemaKey = (schema: FormSchema | FormContainerSchema) => {
  if ('type' in schema && schema.type === 'container') {
    return `container-${schema.containerType}-${Date.now()}-${Math.random()}`
  }
  if (isFormGroupSchema(schema)) {
    return `group-${schema.title}-${Date.now()}-${Math.random()}`
  }
  return `field-${schema.field}-${Date.now()}`
}

// 获取Grid配置
const getGridConfig = (config?: any) => {
  const defaultConfig = props.layoutConfig?.grid || {
    cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
    xGap: 16,
    yGap: 16
  }
  return { ...defaultConfig, ...config }
}

// 获取Flex样式
const getFlexStyle = (config?: any) => {
  const defaultConfig = props.layoutConfig?.flex || {
    direction: 'row',
    wrap: 'wrap',
    gap: 16,
    justify: 'flex-start',
    align: 'flex-start'
  }
  const mergedConfig = { ...defaultConfig, ...config }
  
  return {
    display: 'flex',
    flexDirection: mergedConfig.direction,
    flexWrap: mergedConfig.wrap,
    gap: `${mergedConfig.gap}px`,
    justifyContent: mergedConfig.justify,
    alignItems: mergedConfig.align
  }
}

// 获取Flex项目样式
const getFlexItemStyle = (schema: FormSchema) => {
  const layout = schema.layout || {}
  return {
    flex: layout.flex || '1 1 auto',
    minWidth: layout.minWidth || '200px',
    maxWidth: layout.maxWidth || 'none'
  }
}

// 获取组件属性
const getComponentProps = (schema: FormSchema, type: string) => {
  if (type === 'gi') {
    return schema.giProps || { span: 1 }
  }
  return {}
}

// 判断是否为字段schema
const isFormFieldSchema = (schema: FormSchema): schema is FormFieldSchema => {
  return 'field' in schema && 'component' in schema
}

// 判断是否为容器schema
const isFormContainerSchema = (schema: FormSchema): schema is FormContainerSchema => {
  return 'type' in schema && schema.type === 'container'
}

// 判断是否显示表单项
const ifShowFormItem = (schema: FormSchema) => {
  if (!schema.ifShow) {
    return true
  }
  
  // FormFieldSchema类型的ifShow有3个参数：formModel, value, methods
  if (isFormFieldSchema(schema)) {
    return schema.ifShow(props.formModel, props.formModel[schema.field as string] || '', props.methods)
  }
  
  // FormGroupSchema和FormContainerSchema类型的ifShow有2个参数：formModel, methods
  if (isFormGroupSchema(schema) || isFormContainerSchema(schema)) {
    return schema.ifShow(props.formModel, props.methods)
  }
  
  return true
}
</script>

<style scoped>
.form-renderer {
  width: 100%;
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

/* 单行显示模式样式 */
.one-row-layout {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  width: 100%;
}

.form-fields {
  display: flex;
  gap: 16px;
  flex: 1;
  min-width: 0;
  align-items: flex-end;
}

.field-item {
  flex: 1;
  min-width: 200px;
}
</style>