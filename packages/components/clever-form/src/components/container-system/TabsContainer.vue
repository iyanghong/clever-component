<template>
  <div class="tabs-container">
    <n-tabs
      :value="activeTab"
      :type="config.type || 'line'"
      :size="config.size || 'medium'"
      :placement="config.placement || 'top'"
      :animated="config.animated ?? true"
      :closable="config.closable"
      :addable="config.addable"
      :tab-style="config.tabStyle"
      :pane-style="config.paneStyle"
      :pane-wrapper-style="config.paneWrapperStyle"
      :pane-class="config.paneClass"
      :justify-content="config.justifyContent"
      @update:value="handleTabChange"
      @close="handleTabClose"
      @add="handleTabAdd"
    >
      <n-tab-pane
        v-for="tab in normalizedTabs"
        :key="tab.key"
        :name="tab.key"
        :tab="tab.label"
        :disabled="tab.disabled"
        :closable="tab.closable"
        :display-directive="config.displayDirective || 'if'"
      >
        <!-- 自定义标签页标题 -->
        <template v-if="tab.renderTab" #tab>
          <component :is="tab.renderTab" :tab="tab" />
        </template>
        
        <!-- 标签页内容 -->
        <div class="tabs-container__pane">
          <!-- 渲染子字段或容器 -->
          <template v-for="child in tab.children" :key="child.field || child.key">
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
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import type {
  TabsContainerConfig,
  ValidationResult,
  FormData
} from '../../types'
import CleverFormItem from '../CleverFormItem.vue'
import ContainerRenderer from './ContainerRenderer.vue'
import { COMPONENT_NAMES } from '../../constants'
import { normalizeChildren } from '../../utils'

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.TABS_CONTAINER
})

// Props定义
interface Props {
  /** 容器配置 */
  config: TabsContainerConfig
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

// 规范化每个标签页的children配置，确保字段项有type: 'field'
const normalizedTabs = computed(() => {
  return props.config.tabs?.map(tab => ({
    ...tab,
    children: normalizeChildren(tab.children || [])
  })) || []
})

// Events定义
interface Emits {
  'field:change': [field: string, value: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [field: string, result: ValidationResult]
  'tab:change': [tab: string]
  'tab:close': [tab: string]
  'tab:add': []
}

const emit = defineEmits<Emits>()

// 响应式数据
const activeTab = ref<string>()

// 初始化激活标签页
const initActiveTab = () => {
  if (props.config.defaultActiveTab) {
    activeTab.value = props.config.defaultActiveTab
  } else if (props.config.tabs && props.config.tabs.length > 0) {
    // 找到第一个未禁用的标签页
    const firstEnabledTab = props.config.tabs.find(tab => !tab.disabled)
    if (firstEnabledTab) {
      activeTab.value = firstEnabledTab.key
    }
  }
}

// 监听配置变化
watch(
  () => props.config,
  () => {
    initActiveTab()
  },
  { immediate: true }
)

// 计算属性
const currentTab = computed(() => {
  return props.config.tabs?.find(tab => tab.key === activeTab.value)
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

const handleTabChange = (tab: string) => {
  activeTab.value = tab
  emit('tab:change', tab)
  
  // 调用配置的回调
  if (props.config.onTabChange) {
    props.config.onTabChange(tab)
  }
}

const handleTabClose = (tab: string) => {
  emit('tab:close', tab)
  
  // 调用配置的回调
  if (props.config.onTabClose) {
    props.config.onTabClose(tab)
  }
  
  // 如果关闭的是当前激活的标签页，切换到下一个
  if (tab === activeTab.value && props.config.tabs) {
    const currentIndex = props.config.tabs.findIndex(t => t.key === tab)
    const nextTab = props.config.tabs[currentIndex + 1] || props.config.tabs[currentIndex - 1]
    if (nextTab && !nextTab.disabled) {
      activeTab.value = nextTab.key
    }
  }
}

const handleTabAdd = () => {
  emit('tab:add')
  
  // 调用配置的回调
  if (props.config.onTabAdd) {
    props.config.onTabAdd()
  }
}

// 暴露方法
defineExpose({
  activeTab: computed(() => activeTab.value),
  currentTab,
  switchTab: (tab: string) => {
    if (props.config.tabs?.some(t => t.key === tab && !t.disabled)) {
      activeTab.value = tab
    }
  },
  getTabData: (tab?: string) => {
    const targetTab = tab ? props.config.tabs?.find(t => t.key === tab) : currentTab.value
    if (!targetTab) return {}
    
    const tabData: FormData = {}
    const collectFieldData = (children: any[]) => {
      children.forEach(child => {
        if (child.type === 'field' && child.field) {
          tabData[child.field] = props.data?.[child.field]
        } else if (child.children) {
          collectFieldData(child.children)
        }
      })
    }
    
    if (targetTab.children) {
      collectFieldData(targetTab.children)
    }
    
    return tabData
  }
})
</script>

<style lang="less">
.tabs-container {
  width: 100%;
  
  &__pane {
    padding: var(--tabs-pane-padding, 16px 0);
    
    > * + * {
      margin-top: var(--form-item-margin, 16px);
    }
  }
}
</style>