<template>
  <div class="demo-container">
    <n-card :title="title" class="demo-card">
      <template #header-extra v-if="showCode">
        <n-button
          text
          type="primary"
          @click="toggleCode"
          class="code-toggle-btn"
        >
          <template #icon>
            <n-icon>
              <CodeSlashOutline v-if="!codeVisible" />
              <EyeOffOutline v-else />
            </n-icon>
          </template>
          {{ codeVisible ? '隐藏代码' : '查看代码' }}
        </n-button>
      </template>

      <!-- 描述信息 -->
      <div v-if="description" class="demo-description">
        <n-alert type="info" :show-icon="false">
          {{ description }}
        </n-alert>
      </div>

      <!-- Demo内容 -->
      <div class="demo-content">
        <slot />
      </div>

      <!-- 代码展示 -->
      <div v-if="showCode && codeVisible" class="demo-code">
        <n-divider>代码示例</n-divider>
        <CodeBlock
          :code="code"
          :language="language"
          :filename="filename"
        />
      </div>

      <!-- 配置说明 -->
      <div v-if="$slots.config" class="demo-config">
        <n-divider>配置说明</n-divider>
        <slot name="config" />
      </div>

      <!-- 注意事项 -->
      <div v-if="$slots.notes" class="demo-notes">
        <n-divider>注意事项</n-divider>
        <slot name="notes" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NButton,
  NIcon,
  NAlert,
  NDivider
} from 'naive-ui'
import {
  CodeSlashOutline,
  EyeOffOutline
} from '@vicons/ionicons5'
import CodeBlock from './CodeBlock.vue'

interface Props {
  /** 标题 */
  title: string
  /** 描述信息 */
  description?: string
  /** 是否显示代码 */
  showCode?: boolean
  /** 代码内容 */
  code?: string
  /** 代码语言 */
  language?: string
  /** 文件名 */
  filename?: string
  /** 默认是否展开代码 */
  defaultCodeVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCode: true,
  language: 'vue',
  defaultCodeVisible: false
})

// 代码显示状态
const codeVisible = ref(props.defaultCodeVisible)

// 切换代码显示
const toggleCode = () => {
  codeVisible.value = !codeVisible.value
}
</script>

<style scoped>
.demo-container {
  margin-bottom: 24px;
}

.demo-card {
  border-radius: 8px;
  overflow: hidden;
}

.code-toggle-btn {
  font-size: 14px;
}

.demo-description {
  margin-bottom: 16px;
}

.demo-content {
  padding: 16px 0;
}

.demo-code {
  margin-top: 16px;
}

.demo-config,
.demo-notes {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    margin-bottom: 16px;
  }
  
  .demo-content {
    padding: 12px 0;
  }
}
</style>