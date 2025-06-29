<template>
  <div class="clever-search">
    <!-- 搜索模式切换 -->
    <div v-if="showModeSwitch" class="search-mode-switch mb-4">
      <NButtonGroup>
        <NButton
          :type="searchMode === SearchMode.SIMPLE ? 'primary' : 'default'"
          @click="handleModeChange(SearchMode.SIMPLE)"
        >
          {{ config.text?.simpleSearchText || '简单搜索' }}
        </NButton>
        <NButton
          v-if="config.quickSearch?.enabled"
          :type="searchMode === SearchMode.QUICK ? 'primary' : 'default'"
          @click="handleModeChange(SearchMode.QUICK)"
        >
          {{ config.text?.quickSearchText || '快速搜索' }}
        </NButton>
        <NButton
          v-if="config.advancedSearch?.enabled"
          :type="searchMode === SearchMode.ADVANCED ? 'primary' : 'default'"
          @click="handleModeChange(SearchMode.ADVANCED)"
        >
          {{ config.text?.advancedSearchText || '高级搜索' }}
        </NButton>
      </NButtonGroup>
    </div>

    <!-- 搜索状态指示 -->
    <div v-if="config.ui?.showSearchStatus" class="search-status mb-4">
      <NSpace align="center">
        <!-- 搜索中状态 -->
        <NTag v-if="searchState.searching" type="info" :bordered="false">
          <template #icon>
            <NIcon>
              <RefreshOutline class="animate-spin" />
            </NIcon>
          </template>
          搜索中...
        </NTag>

        <!-- 搜索结果统计 -->
        <NTag
          v-if="config.ui?.showResultStats && !searchState.searching"
          type="success"
          :bordered="false"
        >
          找到 {{ searchState.resultCount }} 条结果
        </NTag>

        <!-- 搜索耗时 -->
        <NTag v-if="searchState.duration > 0" type="default" :bordered="false">
          耗时 {{ searchState.duration }}ms
        </NTag>

        <!-- 活跃条件数量 -->
        <NBadge
          v-if="config.ui?.showActiveConditions && activeConditionsCount > 0"
          :value="activeConditionsCount"
          type="warning"
        >
          <NTag>活跃条件</NTag>
        </NBadge>
      </NSpace>
    </div>

    <!-- 快速搜索 -->
    <div
      v-if="searchMode === SearchMode.QUICK && config.quickSearch?.enabled"
      class="quick-search mb-4"
    >
      <NInput
        v-model:value="quickSearchValue"
        :placeholder="
          config.quickSearch.placeholder ||
          config.text?.quickSearchPlaceholder ||
          '请输入关键词搜索'
        "
        :loading="searchState.searching"
        clearable
        @input="handleQuickSearchInput"
        @clear="handleQuickSearchClear"
      >
        <template #prefix>
          <NIcon>
            <SearchOutline />
          </NIcon>
        </template>
        <template #suffix>
          <NButton
            v-if="!config.quickSearch.realtime"
            text
            type="primary"
            @click="handleQuickSearchSubmit"
          >
            搜索
          </NButton>
        </template>
      </NInput>

      <!-- 搜索建议 -->
      <div
        v-if="config.quickSearch.suggestions && showSuggestions"
        class="search-suggestions mt-2"
      >
        <NSpace>
          <NTag
            v-for="suggestion in config.quickSearch.suggestions"
            :key="suggestion"
            :bordered="false"
            checkable
            @click="handleSuggestionClick(suggestion)"
          >
            {{ suggestion }}
          </NTag>
        </NSpace>
      </div>
    </div>

    <!-- 搜索表单 -->
    <NCard v-if="shouldShowSearchForm" class="search-form">
      <template #header>
        <div class="search-form-header">
          <div class="search-form-title">
            <NSpace align="center">
              <NIcon size="18" class="search-form-icon">
                <SearchOutline />
              </NIcon>
              <span class="search-form-title-text">{{ getSearchFormTitle() }}</span>

              <!-- 活跃条件提示 -->
              <NBadge
                v-if="activeConditionsCount > 0"
                :value="activeConditionsCount"
                type="primary"
                :show-zero="false"
              >
                <NTag size="small" type="info" :bordered="false">
                  已设置条件
                </NTag>
              </NBadge>
            </NSpace>
          </div>

          <div class="search-form-actions">
            <NSpace align="center">
              <!-- 预设管理 -->
              <NDropdown
                v-if="config.presets?.enabled && searchPresets.length > 0"
                :options="presetOptions"
                @select="handlePresetSelect"
              >
                <NButton text type="primary" size="small">
                  <template #icon>
                    <NIcon>
                      <BookmarkOutline />
                    </NIcon>
                  </template>
                  预设
                </NButton>
              </NDropdown>

              <!-- 历史记录 -->
              <NDropdown
                v-if="
                  config.history?.enabled &&
                  config.history.showInDropdown &&
                  searchHistory.length > 0
                "
                :options="historyOptions"
                @select="handleHistorySelect"
              >
                <NButton text type="primary" size="small">
                  <template #icon>
                    <NIcon>
                      <TimeOutline />
                    </NIcon>
                  </template>
                  历史
                </NButton>
              </NDropdown>

              <!-- 导出按钮 -->
              <NDropdown
                v-if="config.export?.enabled"
                :options="exportOptions"
                @select="handleExportSelect"
              >
                <NButton text type="primary" size="small">
                  <template #icon>
                    <NIcon>
                      <DownloadOutline />
                    </NIcon>
                  </template>
                  导出
                </NButton>
              </NDropdown>

              <!-- 折叠按钮 -->
              <NButton
                v-if="config.collapsible"
                text
                type="primary"
                size="small"
                class="collapse-toggle-btn"
                @click="toggleCollapsed"
              >
                <template #icon>
                  <NIcon class="collapse-icon" :class="{ 'collapsed': searchCollapsed }">
                    <ChevronUpOutline />
                  </NIcon>
                </template>
                <span class="collapse-text">
                  {{
                    searchCollapsed
                      ? config.text?.expandText || '展开'
                      : config.text?.collapseText || '收起'
                  }}
                </span>
              </NButton>
            </NSpace>
          </div>
        </div>
      </template>

      <!-- 搜索表单内容 -->
      <div class="search-form-content">
        <Transition
          name="search-form"
          enter-active-class="search-form-enter-active"
          leave-active-class="search-form-leave-active"
          enter-from-class="search-form-enter-from"
          leave-to-class="search-form-leave-to"
        >
          <div v-if="!config.collapsible || !searchCollapsed" class="search-form-body">
            <SearchFormContent />
          </div>
        </Transition>
      </div>
    </NCard>

    <!-- 搜索结果提示 -->
    <div v-if="showResultTip" class="search-result-tip mt-4">
      <NAlert
        v-if="searchState.resultCount === 0 && !searchState.searching"
        type="info"
        :show-icon="false"
      >
        {{
          config.ui?.emptyResultTip || '未找到匹配的结果，请尝试调整搜索条件'
        }}
      </NAlert>
    </div>

    <!-- 保存预设对话框 -->
    <NModal
      v-model:show="showSavePresetModal"
      preset="dialog"
      title="保存搜索预设"
    >
      <NForm ref="presetFormRef" :model="presetForm" :rules="presetFormRules">
        <NFormItem label="预设名称" path="name">
          <NInput
            v-model:value="presetForm.name"
            placeholder="请输入预设名称"
          />
        </NFormItem>
        <NFormItem label="预设描述" path="description">
          <NInput
            v-model:value="presetForm.description"
            type="textarea"
            placeholder="请输入预设描述（可选）"
            :rows="3"
          />
        </NFormItem>
      </NForm>
      <template #action>
        <NSpace>
          <NButton @click="showSavePresetModal = false">取消</NButton>
          <NButton type="primary" @click="handleSavePreset">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, h } from 'vue'
import {
  NSpace,
  NCard,
  NButton,
  NButtonGroup,
  NInput,
  NIcon,
  NTag,
  NBadge,
  NCollapse,
  NCollapseItem,
  NDropdown,
  NAlert,
  NModal,
  NForm,
  NFormItem,
  useMessage
} from 'naive-ui'
import {
  SearchOutline,
  ChevronUpOutline,
  ChevronDownOutline,
  RefreshOutline,
  BookmarkOutline,
  TimeOutline,
  DownloadOutline
} from '@vicons/ionicons5'
import CleverForm from '../../../clever-form/src/components/CleverForm/index.vue'
import { useEnhancedSearch } from '../hook/use-enhanced-search'
import {
  SearchMode,
  type EnhancedSearchConfig,
  type SearchComponentProps,
  type SearchComponentEmits,
  type SearchPreset,
  type SearchHistory
} from '../types/search'

// Props
interface Props extends SearchComponentProps {
  config: EnhancedSearchConfig
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
})

// Emits
interface Emits extends SearchComponentEmits {}

const emit = defineEmits<Emits>()

const message = useMessage()

// 使用增强搜索功能
const {
  searchParams,
  searchMode,
  searchState,
  searchCollapsed,
  quickSearchValue,
  activeConditionsCount,
  hasActiveConditions,
  canClearAll,
  handleSearch,
  handleReset,
  handleClearAll,
  handleQuickSearch,
  handleModeChange: _handleModeChange,
  updateSearchParams,
  savePreset,
  deletePreset,
  applyPreset,
  getSearchHistory,
  clearSearchHistory,
  applyHistoryItem,
  exportSearchParams,
  importSearchParams
} = useEnhancedSearch(props.config, async params => {
  emit('search', params)
  return params // 这里应该返回实际的搜索结果
})

// 本地状态
const showSuggestions = ref(false)
const showSavePresetModal = ref(false)
const presetForm = ref({ name: '', description: '' })
const presetFormRef = ref()
const searchPresets = ref<SearchPreset[]>(props.config.presets?.list || [])
const searchHistory = computed(() => getSearchHistory())

// 表单验证规则
const presetFormRules = {
  name: {
    required: true,
    message: '请输入预设名称',
    trigger: 'blur'
  }
}

// 计算属性
const showModeSwitch = computed(() => {
  const modes = [SearchMode.SIMPLE]
  if (props.config.quickSearch?.enabled) modes.push(SearchMode.QUICK)
  if (props.config.advancedSearch?.enabled) modes.push(SearchMode.ADVANCED)
  return modes.length > 1
})

const shouldShowSearchForm = computed(() => {
  return (
    searchMode.value === SearchMode.SIMPLE ||
    searchMode.value === SearchMode.ADVANCED
  )
})

const showResultTip = computed(() => {
  return props.config.ui?.emptyResultTip && !props.loading
})

// 预设选项
const presetOptions = computed(() => {
  const options = searchPresets.value.map(preset => ({
    label: preset.label,
    key: preset.key,
    props: {
      onClick: () => applyPreset(preset)
    }
  }))

  if (props.config.presets?.allowSave) {
    options.push({
      type: 'divider',
      key: 'divider'
    })
    options.push({
      label: props.config.text?.savePresetText || '保存当前搜索',
      key: 'save',
      props: {
        onClick: () => {
          showSavePresetModal.value = true
        }
      }
    })
  }

  return options
})

// 历史记录选项
const historyOptions = computed(() => {
  const options = searchHistory.value.slice(0, 10).map(item => ({
    label: item.description || '搜索记录',
    key: item.id,
    props: {
      onClick: () => applyHistoryItem(item)
    }
  }))

  if (searchHistory.value.length > 0) {
    options.push({
      type: 'divider',
      key: 'divider'
    })
    options.push({
      label: '清空历史记录',
      key: 'clear',
      props: {
        onClick: () => clearSearchHistory()
      }
    })
  }

  return options
})

// 导出选项
const exportOptions = computed(() => {
  const formats = props.config.export?.formats || ['json', 'csv', 'url']
  return formats.map(format => ({
    label: format.toUpperCase(),
    key: format,
    props: {
      onClick: () => exportSearchParams(format)
    }
  }))
})

// 方法
const getSearchFormTitle = () => {
  switch (searchMode.value) {
    case SearchMode.ADVANCED:
      return '高级搜索'
    case SearchMode.SIMPLE:
    default:
      return '搜索条件'
  }
}

const toggleCollapsed = () => {
  searchCollapsed.value = !searchCollapsed.value
}

const handleModeChange = (mode: SearchMode) => {
  _handleModeChange(mode)
  emit('mode-change', mode)
}

const handleQuickSearchInput = (value: string) => {
  showSuggestions.value = value.length > 0
  if (props.config.quickSearch?.realtime) {
    handleQuickSearch(value)
  }
}

const handleQuickSearchClear = () => {
  showSuggestions.value = false
  handleQuickSearch('')
}

const handleQuickSearchSubmit = () => {
  handleQuickSearch(quickSearchValue.value)
  showSuggestions.value = false
}

const handleSuggestionClick = (suggestion: string) => {
  quickSearchValue.value = suggestion
  handleQuickSearch(suggestion)
  showSuggestions.value = false
}

const handlePresetSelect = (key: string) => {
  if (key === 'save') {
    showSavePresetModal.value = true
  }
}

const handleHistorySelect = (key: string) => {
  if (key === 'clear') {
    clearSearchHistory()
  }
}

const handleExportSelect = (format: string) => {
  exportSearchParams(format)
}

const handleSavePreset = async () => {
  try {
    await presetFormRef.value?.validate()
    const preset = {
      key: Date.now().toString(),
      label: presetForm.value.name,
      params: { ...searchParams.value },
      description: presetForm.value.description
    }
    savePreset(presetForm.value.name, presetForm.value.description)
    showSavePresetModal.value = false
    emit('preset-save', preset)
    presetForm.value = { name: '', description: '' }
  } catch (error) {
    // 验证失败
  }
}

const handleSearchSubmit = (values: Record<string, any>) => {
  handleSearch(values)
}

const handleSearchReset = () => {
  handleReset()
  emit('reset')
}

const handleClearAllClick = () => {
  handleClearAll()
  emit('clear-all')
}

// 搜索表单内容组件
const SearchFormContent = () => {
  const schemas =
    searchMode.value === SearchMode.ADVANCED
      ? props.config.advancedSearch?.schemas || []
      : props.config.schemas

  return h(
    CleverForm,
    {
      schemas,
      model: searchParams.value,
      showActionButtonGroup: true,
      submitButtonOptions: {
        text: props.config.text?.searchText || '搜索',
        loading: props.loading
      },
      resetButtonOptions: {
        text: props.config.text?.resetText || '重置'
      },
      gridProps: { cols: 4, xGap: 16, yGap: 16 },
      disabled: props.disabled,
      'onUpdate:model': (values: Record<string, any>) => {
        Object.assign(searchParams.value, values)
      },
      onSubmit: handleSearchSubmit,
      onReset: handleSearchReset
    },
    {
      'action-button-group-suffix': () => {
        if (!props.config.ui?.showClearAll || !canClearAll.value) return null

        return h(
          NButton,
          {
            type: 'warning',
            ghost: true,
            onClick: handleClearAllClick
          },
          () => props.config.text?.clearAllText || '清空所有'
        )
      }
    }
  )
}

// 监听搜索参数变化
watch(
  () => searchParams.value,
  newParams => {
    emit('params-change', newParams)
  },
  { deep: true }
)

// 暴露方法
defineExpose({
  handleSearch,
  handleReset,
  handleClearAll,
  updateSearchParams,
  savePreset,
  deletePreset,
  applyPreset,
  exportSearchParams,
  importSearchParams
})
</script>

<style scoped>
.clever-search {
  width: 100%;
}

.search-mode-switch {
  display: flex;
  justify-content: flex-start;
}

.search-status {
  padding: 8px 0;
}

.quick-search {
  width: 100%;
}

.search-suggestions {
  max-height: 200px;
  overflow-y: auto;
}

.search-form {
  width: 100%;
  padding: 0;
}

/* 搜索表单头部样式 */
.search-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  background: var(--n-color-target);
}

.search-form-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--n-text-color-1);
}

.search-form-title .n-icon {
  color: var(--n-color-primary);
}

.active-conditions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.active-conditions .n-tag {
  font-size: 12px;
}

/* 折叠按钮样式 */
.collapse-toggle-btn {
  transition: all 0.3s ease;
}

.collapse-icon {
  transition: transform 0.3s ease;
}

.collapse-icon.collapsed {
  transform: rotate(180deg);
}

.collapse-text {
  margin-left: 4px;
  font-size: 12px;
}

/* 搜索表单内容样式 */
.search-form-content {
  overflow: hidden;
}

.search-form-body {
  padding: 16px;
}

/* 搜索表单动画 */
.search-form-enter-active,
.search-form-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.search-form-enter-from,
.search-form-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}

.search-form-enter-to,
.search-form-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}

.search-result-tip {
  width: 100%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
