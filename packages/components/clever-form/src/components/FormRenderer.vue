<template>
  <div class="form-renderer">
    <template v-for="schema in schemas" :key="getSchemaKey(schema)">
      <!-- 容器类型 -->
      <template v-if="schema.type === 'container'">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTabs, NTabPane, NCollapse, NCollapseItem, NGrid, NGi } from 'naive-ui'
import FormField from './FormField.vue'
import type { FormSchema, FormContainerSchema, CleverFormMethods, LayoutConfig } from '../types/form'

interface Props {
  schemas: (FormSchema | FormContainerSchema)[]
  formModel: Record<string, any>
  methods: CleverFormMethods
  layoutConfig?: LayoutConfig
  isFlex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFlex: false
})

// 生成schema的唯一key
const getSchemaKey = (schema: FormSchema | FormContainerSchema) => {
  if ('type' in schema && schema.type === 'container') {
    return `container-${schema.containerType}-${Date.now()}-${Math.random()}`
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

// 判断是否显示表单项
const ifShowFormItem = (schema: FormSchema) => {
  if (schema.ifShow) {
    return schema.ifShow(props.formModel, props.formModel[schema.field as string] || '', props.methods)
  }
  return true
}
</script>

<style scoped>
.form-renderer {
  width: 100%;
}
</style>