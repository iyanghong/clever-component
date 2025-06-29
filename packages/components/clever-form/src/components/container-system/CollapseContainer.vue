<template>
  <div class="collapse-container">
    <n-collapse
      :value="expandedPanels"
      :accordion="config.accordion"
      :arrow-placement="config.arrowPlacement || 'left'"
      :display-directive="config.displayDirective || 'show'"
      @update:value="handleExpandedChange"
    >
      <n-collapse-item
        v-for="panel in normalizedPanels"
        :key="panel.key"
        :name="panel.key"
        :title="panel.title"
        :disabled="panel.disabled"
      >
        <!-- 自定义面板标题 -->
        <template v-if="panel.renderHeader" #header>
          <component :is="panel.renderHeader" :panel="panel" />
        </template>
        
        <!-- 自定义面板图标 -->
        <template v-if="panel.renderIcon" #header-extra>
          <component :is="panel.renderIcon" :panel="panel" />
        </template>
        
        <!-- 面板内容 -->
        <div class="collapse-container__panel">
          <!-- 渲染子字段或容器 -->
          <template v-for="child in panel.children" :key="child.field || child.key">
            <!-- 字段 -->
            <CleverFormItem
              v-if="child.type === 'field'"
              :config="child"
              :disabled="disabled || child.disabled"
              :readonly="readonly || child.readonly"
              :loading="loading"
              @field:change="(field, value) => handleFieldChange(field, value)"
              @field:focus="(field) => handleFieldFocus(field)"
              @field:blur="(field) => handleFieldBlur(field)"
              @validate="(field, result) => handleFieldValidate(field, result)"
            />
            
            <!-- 容器 -->
            <ContainerRenderer
              v-else
              :config="child"
              :disabled="disabled"
              :readonly="readonly"
              :loading="loading"
              @field:change="handleFieldChange"
              @field:focus="handleFieldFocus"
              @field:blur="handleFieldBlur"
              @validate="handleFieldValidate"
            />
          </template>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NCollapse, NCollapseItem } from 'naive-ui'
import type {
  CollapseContainerConfig,
  ValidationResult,
  FormData
} from '../../types'
import CleverFormItem from '../CleverFormItem.vue'
import ContainerRenderer from './ContainerRenderer.vue'
import { COMPONENT_NAMES } from '../../constants'
import { normalizeChildren } from '../../utils'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.COLLAPSE_CONTAINER
})

// Props定义
interface Props {
  /** 容器配置 */
  config: CollapseContainerConfig
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
  'field:change': [field: string, value: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [field: string, result: ValidationResult]
  'panel:expand': [panel: string]
  'panel:collapse': [panel: string]
}

const emit = defineEmits<Emits>()

// 计算属性：规范化面板配置
const normalizedPanels = computed(() => {
  return props.config.panels?.map(panel => ({
    ...panel,
    children: normalizeChildren(panel.children || [])
  })) || []
})

// 响应式数据
const expandedPanels = ref<string | string[]>()

// 初始化展开面板
const initExpandedPanels = () => {
  if (props.config.defaultExpanded !== undefined) {
    expandedPanels.value = props.config.defaultExpanded
  } else if (normalizedPanels.value && normalizedPanels.value.length > 0) {
    if (props.config.accordion) {
      // 手风琴模式，展开第一个未禁用的面板
      const firstEnabledPanel = normalizedPanels.value.find(panel => !panel.disabled)
      expandedPanels.value = firstEnabledPanel ? firstEnabledPanel.key : ''
    } else {
      // 非手风琴模式，展开所有未禁用的面板
      expandedPanels.value = normalizedPanels.value
        .filter(panel => !panel.disabled)
        .map(panel => panel.key)
    }
  }
}

// 监听配置变化
watch(
  () => props.config,
  () => {
    initExpandedPanels()
  },
  { immediate: true }
)

// 计算属性
const currentExpandedPanels = computed(() => {
  if (Array.isArray(expandedPanels.value)) {
    return expandedPanels.value
  }
  return expandedPanels.value ? [expandedPanels.value] : []
})

// 事件处理
const handleFieldChange = (field: string, value: any) => {
  emit('field:change', field, value)
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

const handleExpandedChange = (value: string | string[]) => {
  const oldExpanded = currentExpandedPanels.value
  expandedPanels.value = value
  
  const newExpanded = Array.isArray(value) ? value : (value ? [value] : [])
  
  // 检测新展开的面板
  newExpanded.forEach(panel => {
    if (!oldExpanded.includes(panel)) {
      emit('panel:expand', panel)
      
      // 调用配置的回调
      if (props.config.onPanelExpand) {
        props.config.onPanelExpand(panel)
      }
    }
  })
  
  // 检测新折叠的面板
  oldExpanded.forEach(panel => {
    if (!newExpanded.includes(panel)) {
      emit('panel:collapse', panel)
      
      // 调用配置的回调
      if (props.config.onPanelCollapse) {
        props.config.onPanelCollapse(panel)
      }
    }
  })
}

// 暴露方法
defineExpose({
  expandedPanels: computed(() => expandedPanels.value),
  currentExpandedPanels,
  expandPanel: (panel: string) => {
    if (props.config.accordion) {
      expandedPanels.value = panel
    } else {
      const current = Array.isArray(expandedPanels.value) ? expandedPanels.value : []
      if (!current.includes(panel)) {
        expandedPanels.value = [...current, panel]
      }
    }
  },
  collapsePanel: (panel: string) => {
    if (props.config.accordion) {
      if (expandedPanels.value === panel) {
        expandedPanels.value = ''
      }
    } else {
      const current = Array.isArray(expandedPanels.value) ? expandedPanels.value : []
      expandedPanels.value = current.filter(p => p !== panel)
    }
  },
  togglePanel: (panel: string) => {
    const isExpanded = currentExpandedPanels.value.includes(panel)
    if (isExpanded) {
      // 折叠
      if (props.config.accordion) {
        expandedPanels.value = ''
      } else {
        const current = Array.isArray(expandedPanels.value) ? expandedPanels.value : []
        expandedPanels.value = current.filter(p => p !== panel)
      }
    } else {
      // 展开
      if (props.config.accordion) {
        expandedPanels.value = panel
      } else {
        const current = Array.isArray(expandedPanels.value) ? expandedPanels.value : []
        expandedPanels.value = [...current, panel]
      }
    }
  },
  getPanelData: (panel: string) => {
    const targetPanel = props.config.panels?.find(p => p.key === panel)
    if (!targetPanel) return {}
    
    const panelData: FormData = {}
    const collectFieldData = (children: any[]) => {
      children.forEach(child => {
        if (child.type === 'field' && child.field) {
          panelData[child.field] = props.data?.[child.field]
        } else if (child.children) {
          collectFieldData(child.children)
        }
      })
    }
    
    if (targetPanel.children) {
      collectFieldData(targetPanel.children)
    }
    
    return panelData
  }
})
</script>

<style lang="less">
.collapse-container {
  width: 100%;
  
  &__panel {
    padding: var(--collapse-panel-padding, 16px 0);
    
    > * + * {
      margin-top: var(--form-item-margin, 16px);
    }
  }
}
</style>