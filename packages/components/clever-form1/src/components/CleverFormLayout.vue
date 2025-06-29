<template>
  <div class="clever-form-layout" :class="layoutClass">
    <!-- 网格布局 -->
    <template v-if="layoutConfig.mode === 'grid'">
      <NGrid v-bind="gridProps">
        <NGi
          v-for="schema in visibleSchemas"
          :key="getFieldKey(schema)"
          v-bind="getGridItemProps(schema)"
        >
          <CleverFormField
            :schema="schema"
            :form-data="formData"
            :methods="methods"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </CleverFormField>
        </NGi>
      </NGrid>
    </template>

    <!-- Flex布局 -->
    <template v-else-if="layoutConfig.mode === 'flex'">
      <div class="clever-form-flex" :style="flexStyle">
        <div
          v-for="schema in visibleSchemas"
          :key="getFieldKey(schema)"
          class="clever-form-flex-item"
          :style="getFlexItemStyle(schema)"
        >
          <CleverFormField
            :schema="schema"
            :form-data="formData"
            :methods="methods"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </CleverFormField>
        </div>
      </div>
    </template>

    <!-- 内联布局 -->
    <template v-else-if="layoutConfig.mode === 'inline'">
      <div class="clever-form-inline">
        <div
          v-for="schema in visibleSchemas"
          :key="getFieldKey(schema)"
          class="clever-form-inline-item"
        >
          <CleverFormField
            :schema="schema"
            :form-data="formData"
            :methods="methods"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </CleverFormField>
        </div>
      </div>
    </template>

    <!-- 垂直布局 -->
    <template v-else>
      <div class="clever-form-vertical">
        <div
          v-for="schema in visibleSchemas"
          :key="getFieldKey(schema)"
          class="clever-form-vertical-item"
        >
          <CleverFormField
            :schema="schema"
            :form-data="formData"
            :methods="methods"
          >
            <!-- 透传所有插槽 -->
            <template
              v-for="(_, slotName) in $slots"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </CleverFormField>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NGrid, NGi } from 'naive-ui'
import type {
  FormFieldSchema,
  FormMethods,
  LayoutConfig
} from '../types/core'
import { getFieldKey } from '../composables/useFormField'
import CleverFormField from './CleverFormField.vue'

// ============= 组件属性 =============

interface Props {
  /** 可见的字段配置 */
  visibleSchemas: FormFieldSchema[]
  /** 表单数据 */
  formData: Record<string, any>
  /** 表单方法 */
  methods: FormMethods
  /** 布局配置 */
  layoutConfig: LayoutConfig
}

const props = defineProps<Props>()

// ============= 计算属性 =============

/** 布局类名 */
const layoutClass = computed(() => {
  return `clever-form-layout--${props.layoutConfig.mode}`
})

/** 网格属性 */
const gridProps = computed(() => {
  const gridConfig = props.layoutConfig.grid || {}
  return {
    cols: gridConfig.cols || '1 s:1 m:2 l:3 xl:4 2xl:4',
    xGap: gridConfig.xGap || 16,
    yGap: gridConfig.yGap || 16,
    responsive: gridConfig.responsive !== false
  }
})

/** Flex样式 */
const flexStyle = computed(() => {
  const flexConfig = props.layoutConfig.flex || {}
  return {
    display: 'flex',
    flexDirection: flexConfig.direction || 'row',
    flexWrap: flexConfig.wrap || 'wrap',
    justifyContent: flexConfig.justify || 'flex-start',
    alignItems: flexConfig.align || 'flex-start',
    gap: typeof flexConfig.gap === 'number' ? `${flexConfig.gap}px` : flexConfig.gap || '16px'
  }
})

// ============= 方法 =============

/** 获取网格项属性 */
const getGridItemProps = (schema: FormFieldSchema) => {
  const props: Record<string, any> = {}
  
  // 基础布局属性
  if (schema.layout?.span) {
    props.span = schema.layout.span
  }
  
  if (schema.layout?.offset) {
    props.offset = schema.layout.offset
  }
  
  // 全宽设置
  if (schema.fullWidth) {
    props.span = 24
  }
  
  // 响应式配置
  if (schema.layout?.responsive) {
    Object.assign(props, schema.layout.responsive)
  }
  
  return props
}

/** 获取Flex项样式 */
const getFlexItemStyle = (schema: FormFieldSchema) => {
  const style: Record<string, any> = {}
  
  // 基础flex属性
  if (schema.layout?.span) {
    style.flex = `0 0 ${(schema.layout.span / 24) * 100}%`
  } else if (schema.fullWidth) {
    style.flex = '1 1 100%'
  } else {
    style.flex = '1 1 auto'
  }
  
  // 自定义样式
  if (schema.layout?.style) {
    Object.assign(style, schema.layout.style)
  }
  
  return style
}
</script>

<style scoped>
.clever-form-layout {
  width: 100%;
}

/* Flex布局样式 */
.clever-form-flex {
  width: 100%;
}

.clever-form-flex-item {
  min-width: 0; /* 防止flex项目溢出 */
}

/* 内联布局样式 */
.clever-form-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.clever-form-inline-item {
  flex: 0 0 auto;
  min-width: 200px;
}

/* 垂直布局样式 */
.clever-form-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.clever-form-vertical-item {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .clever-form-inline {
    flex-direction: column;
  }
  
  .clever-form-inline-item {
    width: 100%;
    min-width: auto;
  }
  
  .clever-form-flex {
    flex-direction: column !important;
  }
  
  .clever-form-flex-item {
    flex: 1 1 100% !important;
  }
}
</style>