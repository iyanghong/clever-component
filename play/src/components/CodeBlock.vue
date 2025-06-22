<template>
  <div class="code-block">
    <div class="code-header">
      <div class="code-info">
        <n-tag :bordered="false" size="small" type="info">
          {{ language.toUpperCase() }}
        </n-tag>
        <span v-if="filename" class="filename">{{ filename }}</span>
      </div>
      <div class="code-actions">
        <n-button
          text
          size="small"
          @click="copyCode"
          :loading="copying"
        >
          <template #icon>
            <n-icon>
              <CheckmarkOutline v-if="copied" />
              <CopyOutline v-else />
            </n-icon>
          </template>
          {{ copied ? '已复制' : '复制' }}
        </n-button>
      </div>
    </div>
    <div class="code-content">
      <pre><code :class="`language-${language}`" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NButton,
  NIcon,
  NTag,
  useMessage
} from 'naive-ui'
import {
  CopyOutline,
  CheckmarkOutline
} from '@vicons/ionicons5'

interface Props {
  /** 代码内容 */
  code: string
  /** 代码语言 */
  language?: string
  /** 文件名 */
  filename?: string
  /** 是否显示行号 */
  showLineNumbers?: boolean
  /** 最大高度 */
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  showLineNumbers: true,
  maxHeight: '400px'
})

const message = useMessage()
const copying = ref(false)
const copied = ref(false)

// 简单的语法高亮（可以后续集成 Prism.js 或其他库）
const highlightedCode = computed(() => {
  let code = props.code
  
  // 基础的语法高亮
  if (props.language === 'vue' || props.language === 'html') {
    code = code
      .replace(/(&lt;\/?[^&gt;]+&gt;)/g, '<span class="tag">$1</span>')
      .replace(/(\s+[a-zA-Z-]+)=/g, '<span class="attr">$1</span>=') 
      .replace(/=(["'][^"']*["'])/g, '=<span class="string">$1</span>')
  } else if (props.language === 'javascript' || props.language === 'typescript') {
    code = code
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="keyword">$1</span>')
      .replace(/(["'][^"']*["'])/g, '<span class="string">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
  }
  
  return code
})

// 复制代码
const copyCode = async () => {
  if (copying.value) return
  
  copying.value = true
  
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    message.success('代码已复制到剪贴板')
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    message.error('复制失败，请手动复制')
  } finally {
    copying.value = false
  }
}

// 转义HTML
const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

onMounted(() => {
  // 这里可以集成更强大的语法高亮库
  // 比如 Prism.js 或 highlight.js
})
</script>

<style scoped>
.code-block {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  background: var(--code-bg-color, #f8f9fa);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--code-header-bg, #f1f3f4);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.code-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filename {
  color: var(--text-color-2);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.code-content {
  overflow-x: auto;
  max-height: v-bind(maxHeight);
}

.code-content pre {
  margin: 0;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  background: transparent;
}

.code-content code {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-family: inherit;
}

/* 语法高亮样式 */
:deep(.keyword) {
  color: #d73a49;
  font-weight: 600;
}

:deep(.string) {
  color: #032f62;
}

:deep(.comment) {
  color: #6a737d;
  font-style: italic;
}

:deep(.tag) {
  color: #22863a;
}

:deep(.attr) {
  color: #6f42c1;
}

/* 暗色主题 */
.dark .code-block {
  background: #1e1e1e;
  border-color: #3e3e3e;
}

.dark .code-header {
  background: #2d2d2d;
  border-color: #3e3e3e;
}

.dark :deep(.keyword) {
  color: #569cd6;
}

.dark :deep(.string) {
  color: #ce9178;
}

.dark :deep(.comment) {
  color: #6a9955;
}

.dark :deep(.tag) {
  color: #4ec9b0;
}

.dark :deep(.attr) {
  color: #9cdcfe;
}

/* 滚动条样式 */
.code-content::-webkit-scrollbar {
  height: 6px;
}

.code-content::-webkit-scrollbar-track {
  background: transparent;
}

.code-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color, #c1c1c1);
  border-radius: 3px;
}

.code-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-hover-color, #a8a8a8);
}
</style>