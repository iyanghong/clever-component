<template>
  <div class="app">
    <n-config-provider :theme="isDark ? darkTheme : null">
      <n-message-provider>
        <n-dialog-provider>
          <n-layout class="layout" has-sider>
            <!-- 左侧菜单栏 -->
            <n-layout-sider
              bordered
              collapse-mode="width"
              :collapsed-width="64"
              :width="240"
              :collapsed="collapsed"
              show-trigger
              @collapse="collapsed = true"
              @expand="collapsed = false"
            >
              <div class="logo">
                <h3 v-if="!collapsed">Clever Component</h3>
                <span v-else>CC</span>
              </div>
              <n-menu
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
                :value="activeKey"
                @update:value="handleMenuSelect"
              />
            </n-layout-sider>

            <n-layout>
              <!-- 顶部导航 -->
              <n-layout-header class="header" bordered>
                <div class="header-content">
                  <h1>{{ currentTitle }}</h1>
                  <n-space>
                    <n-button @click="toggleTheme">
                      {{ isDark ? '🌞' : '🌙' }}
                    </n-button>
                  </n-space>
                </div>
              </n-layout-header>

              <!-- 主内容区域 -->
              <n-layout-content class="content">
                <div class="demo-container">
                  <!-- 路由视图 - 添加错误边界 -->
                  <router-view v-slot="{ Component }">
                    <Suspense>
                      <template #default>
                        <ErrorBoundary>
                          <component :is="Component" :key="$route.fullPath" />
                        </ErrorBoundary>
                      </template>
                      <template #fallback>
                        <div class="loading-container">
                          <n-spin size="large" />
                        </div>
                      </template>
                    </Suspense>
                  </router-view>
                </div>
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NButton,
  NSpace,
  NSpin,
  darkTheme
} from 'naive-ui'
import { useMenu } from './composables/useMenu'
import ErrorBoundary from './components/ErrorBoundary.vue'

// 使用菜单组合式函数
const {
  menuOptions,
  activeKey,
  currentTitle,
  handleMenuSelect
} = useMenu()

// 响应式数据
const isDark = ref(false)
const collapsed = ref(false)

// 方法
const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
}

.layout {
  height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--n-border-color);
  margin-bottom: 8px;
}

.logo h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.logo span {
  font-size: 20px;
  font-weight: bold;
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.content {
  padding: 24px;
  overflow: auto;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>