import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { h } from 'vue'
import { NCard } from 'naive-ui'

// 首页组件
const Home = {
  render() {
    return h('div', { class: 'home-page' }, [
      h(NCard, { title: '欢迎使用 Clever Component' }, {
        default: () => [
          h('p', '这是一个基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库。'),
          h('p', '请从左侧菜单选择组件查看演示。'),
          h('h3', '组件特性：'),
          h('ul', [
            h('li', 'CleverForm - 智能表单组件，支持动态配置和复杂验证'),
            h('li', 'CleverTable - 高性能数据表格，支持CRUD操作'),
            h('li', 'CleverPopup - 灵活的弹窗容器组件'),
            h('li', 'Schema工具 - 表单配置辅助工具')
          ])
        ]
      })
    ])
  }
}

// 动态导入函数
const importDemo = (path: string) => () => import(`../demo/${path}.vue`)
const importFormDemo = (name: string) => () => import(`../demo/form-demos/${name}.vue`)
const importTableDemo = (name: string) => () => import(`../demo/table-demos/${name}.vue`)

// 路由配置数据
const routeConfig = {
  // 基础路由
  base: [
    { path: '/', name: 'Home', component: Home, title: '首页', category: 'home' },
    { path: '/overview', name: 'Overview', component: 'CleverComponentDemo', title: '组件概览', category: 'overview' }
  ],
  // 表单相关路由
  form: [
    { path: '/form', name: 'FormOverview', component: 'CleverFormDemo', title: 'CleverForm 概览' },
    { path: '/form/basic', name: 'FormBasic', component: 'BasicUsageDemo', title: '基础用法' },
    { path: '/form/validation', name: 'FormValidation', component: 'ValidationDemo', title: '表单验证' },
    { path: '/form/layout', name: 'FormLayout', component: 'LayoutDemo', title: '布局容器' },
    { path: '/form/dynamic', name: 'FormDynamic', component: 'DynamicFormDemo', title: '动态表单' },
    { path: '/form/popup', name: 'FormPopup', component: 'PopupFormDemo', title: '弹窗表单' },
    { path: '/form/comprehensive', name: 'FormComprehensive', component: 'ComprehensiveLayoutDemo', title: '综合布局' }
  ],
  // 表格相关路由
  table: [
    { path: '/table', name: 'TableOverview', component: 'CleverTableDemo', title: 'CleverTable 概览' },
    { path: '/table/basic', name: 'TableBasic', component: 'BasicTableDemo', title: '基础表格' },
    { path: '/table/advanced', name: 'TableAdvanced', component: 'AdvancedTableDemo', title: '高级功能' },
    { path: '/table/crud', name: 'TableCrud', component: 'CrudTableDemo', title: 'CRUD操作' },
    { path: '/table/crud-overview', name: 'TableCrudOverview', component: 'CleverTableCrudDemo', title: 'CRUD组件概览' }
  ],
  // 弹窗相关路由
  popup: [
    { path: '/popup', name: 'PopupOverview', component: 'CleverPopupDemo', title: 'CleverPopup 弹窗' }
  ]
}

// 生成路由函数
const createRoute = (config: any, category: string, isFormDemo = false, isTableDemo = false): RouteRecordRaw => {
  let component
  if (typeof config.component === 'string') {
    if (isFormDemo) {
      component = importFormDemo(config.component)
    } else if (isTableDemo) {
      component = importTableDemo(config.component)
    } else {
      component = importDemo(config.component)
    }
  } else {
    component = config.component
  }

  return {
    path: config.path,
    name: config.name,
    component,
    meta: {
      title: config.title,
      category: category
    }
  }
}

// 构建路由数组
const routes: RouteRecordRaw[] = [
  // 基础路由
  ...routeConfig.base.map(config => createRoute(config, config.category || 'base')),
  // 表单路由
  ...routeConfig.form.map(config => createRoute(config, 'form', true)),
  // 表格路由
  ...routeConfig.table.map(config => createRoute(config, 'table', false, true)),
  // 弹窗路由
  ...routeConfig.popup.map(config => createRoute(config, 'popup'))
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router