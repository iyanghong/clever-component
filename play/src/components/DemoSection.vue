<template>
  <div class="demo-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <div v-if="description" class="section-description">
        {{ description }}
      </div>
    </div>
    
    <div class="section-content">
      <slot />
    </div>
    
    <!-- API 文档 -->
    <div v-if="$slots.api" class="section-api">
      <n-divider>
        <n-icon size="16">
          <DocumentTextOutline />
        </n-icon>
        API 文档
      </n-divider>
      <slot name="api" />
    </div>
    
    <!-- 相关链接 -->
    <div v-if="links && links.length > 0" class="section-links">
      <n-divider>相关链接</n-divider>
      <n-space>
        <n-button
          v-for="link in links"
          :key="link.title"
          text
          type="primary"
          tag="a"
          :href="link.url"
          target="_blank"
        >
          <template #icon>
            <n-icon>
              <LinkOutline />
            </n-icon>
          </template>
          {{ link.title }}
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NDivider,
  NSpace,
  NButton,
  NIcon
} from 'naive-ui'
import {
  DocumentTextOutline,
  LinkOutline
} from '@vicons/ionicons5'

interface Link {
  title: string
  url: string
}

interface Props {
  /** 区块标题 */
  title: string
  /** 区块描述 */
  description?: string
  /** 相关链接 */
  links?: Link[]
}

defineProps<Props>()
</script>

<style scoped>
.demo-section {
  margin-bottom: 48px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-color-1);
}

.section-description {
  font-size: 14px;
  color: var(--text-color-2);
  line-height: 1.6;
}

.section-content {
  /* 内容区域样式 */
}

.section-api {
  margin-top: 32px;
}

.section-links {
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-section {
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .section-header {
    margin-bottom: 16px;
  }
}
</style>