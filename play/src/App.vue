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
                  <!-- 路由视图 -->
                  <router-view />
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
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
  darkTheme,
  type MenuOption
} from 'naive-ui'
import {
  HomeOutline,
  DocumentTextOutline,
  GridOutline,
  LayersOutline
} from '@vicons/ionicons5'

// 路由相关
const router = useRouter()
const route = useRoute()

// 响应式数据
const isDark = ref(false)
const collapsed = ref(false)

// 当前激活的菜单项（基于路由）
const activeKey = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  return path.substring(1) // 移除开头的 '/'
})

// 菜单选项
const menuOptions: MenuOption[] = [
  {
    label: '首页',
    key: 'home',
    icon: () => h(HomeOutline)
  },
  {
    label: '高级组件',
    key: 'advanced',
    icon: () => h(GridOutline),
    children: [
      {
        label: 'CleverForm 表单',
        key: 'clever-form',
        icon: () => h(DocumentTextOutline)
      },
      {
        label: 'CleverPopup 弹窗',
        key: 'clever-popup',
        icon: () => h(LayersOutline)
      },
      {
        label: 'CleverTable 表格',
        key: 'clever-table',
        icon: () => h(GridOutline)
      },
      {
        label: 'CleverTable CRUD',
        key: 'clever-table-crud',
        icon: () => h(GridOutline)
      },

    ]
  }
]

// 计算当前页面标题
const currentTitle = computed(() => {
  return route.meta?.title as string || 'Clever Component 开发预览'
})

// 方法
const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleMenuSelect = (key: string) => {
  // 根据菜单key导航到对应路由
  if (key === 'home') {
    router.push('/')
  } else {
    router.push(`/${key}`)
  }
}
</script>

<style scoped>
.app {
  height: 100vh;
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
  font-weight: bold;
  color: var(--n-text-color);
}

.header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 18px;
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

.home-page {
  text-align: center;
  padding: 60px 0;
}
</style>