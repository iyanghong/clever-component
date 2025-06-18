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
                  <!-- 首页 -->
                  <div v-if="activeKey === 'home'" class="home-page">
                    <n-card title="欢迎使用 Clever Component">
                      <p>这是一个基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库。</p>
                      <p>请从左侧菜单选择组件查看演示。</p>
                    </n-card>
                  </div>

                  <!-- CleverForm组件演示 -->
                  <CleverFormDemo v-else-if="activeKey === 'clever-form'" />

                  <!-- CleverPopup组件演示 -->
                  <CleverPopupDemo v-else-if="activeKey === 'clever-popup'" />

                  <!-- CleverTable组件演示 -->
                  <CleverTableDemo v-else-if="activeKey === 'clever-table'" />

                  <!-- CleverDataTable组件演示 -->
                  <CleverDataTableDemo v-else-if="activeKey === 'clever-data-table'" />
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
  NCard,
  darkTheme,
  type MenuOption
} from 'naive-ui'
import {
  HomeOutline,
  RadioButtonOnOutline,
  CardOutline,
  CreateOutline,
  DocumentTextOutline,
  GridOutline,
  LayersOutline
} from '@vicons/ionicons5'

// 导入演示组件
import CleverFormDemo from './demo/CleverFormDemo.vue'
import CleverPopupDemo from './demo/CleverPopupDemo.vue'
import CleverTableDemo from './demo/CleverTableDemo.vue'
import CleverDataTableDemo from './demo/CleverDataTableDemo.vue'

// 响应式数据
const isDark = ref(false)
const collapsed = ref(false)
const activeKey = ref('home')

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
        label: 'CleverDataTable 数据表格',
        key: 'clever-data-table',
        icon: () => h(DocumentTextOutline)
      }
    ]
  }
]

// 计算当前页面标题
const currentTitle = computed(() => {
  const findTitle = (options: MenuOption[]): string => {
    for (const option of options) {
      if (option.key === activeKey.value) {
        return option.label as string
      }
      if (option.children) {
        const childTitle = findTitle(option.children as MenuOption[])
        if (childTitle) return childTitle
      }
    }
    return 'Clever Component 开发预览'
  }
  return findTitle(menuOptions)
})

// 方法
const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleMenuSelect = (key: string) => {
  activeKey.value = key
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