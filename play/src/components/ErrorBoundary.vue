<template>
  <div v-if="hasError" class="error-boundary">
    <n-result status="error" title="页面加载失败" description="抱歉，页面遇到了一些问题">
      <template #footer>
        <n-space>
          <n-button @click="retry">重试</n-button>
          <n-button @click="goHome" type="primary">返回首页</n-button>
        </n-space>
      </template>
    </n-result>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NResult, NButton, NSpace } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const hasError = ref(false)
let retryCount = 0
const maxRetries = 3

// 捕获子组件错误
onErrorCaptured((error: Error) => {
  console.error('ErrorBoundary caught error:', error)
  hasError.value = true
  return false // 阻止错误继续传播
})

// 重试功能
const retry = async () => {
  if (retryCount < maxRetries) {
    retryCount++
    hasError.value = false
    await nextTick()
    // 不使用reload，而是重新渲染组件
  } else {
    goHome()
  }
}

// 返回首页
const goHome = () => {
  hasError.value = false
  retryCount = 0
  router.push('/')
}

// 监听路由变化，重置错误状态
watch(
  () => route.path,
  () => {
    hasError.value = false
    retryCount = 0
  },
  { immediate: false }
)
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
}
</style>