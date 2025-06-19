import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { h } from 'vue'
import { NCard } from 'naive-ui'

// 导入演示组件
import CleverFormDemo from '../demo/CleverFormDemo.vue'
import CleverPopupDemo from '../demo/CleverPopupDemo.vue'
import CleverTableDemo from '../demo/CleverTableDemo.vue'
import CleverDataTableDemo from '../demo/CleverDataTableDemo.vue'

// 首页组件
const Home = {
  render() {
    return h('div', { class: 'home-page' }, [
      h(NCard, { title: '欢迎使用 Clever Component' }, {
        default: () => [
          h('p', '这是一个基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库。'),
          h('p', '请从左侧菜单选择组件查看演示。')
        ]
      })
    ])
  }
}

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/clever-form',
    name: 'CleverForm',
    component: CleverFormDemo,
    meta: {
      title: 'CleverForm 表单'
    }
  },
  {
    path: '/clever-popup',
    name: 'CleverPopup',
    component: CleverPopupDemo,
    meta: {
      title: 'CleverPopup 弹窗'
    }
  },
  {
    path: '/clever-table',
    name: 'CleverTable',
    component: CleverTableDemo,
    meta: {
      title: 'CleverTable 表格'
    }
  },
  {
    path: '/clever-data-table',
    name: 'CleverDataTable',
    component: CleverDataTableDemo,
    meta: {
      title: 'CleverDataTable 数据表格'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router