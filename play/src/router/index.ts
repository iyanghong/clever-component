import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { h } from 'vue'
import { NCard } from 'naive-ui'

// 导入主要演示组件
import CleverFormDemo from '../demo/CleverFormDemo.vue'
import CleverPopupDemo from '../demo/CleverPopupDemo.vue'
import CleverTableDemo from '../demo/CleverTableDemo.vue'
import CleverTableCrudDemo from '../demo/CleverTableCrudDemo.vue'
import CleverComponentDemo from '../demo/CleverComponentDemo.vue'
import SchemaHelpersDemo from '../demo/SchemaHelpersDemo.vue'

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

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      category: 'home'
    }
  },
  // 组件概览
  {
    path: '/overview',
    name: 'Overview',
    component: CleverComponentDemo,
    meta: {
      title: '组件概览',
      category: 'overview'
    }
  },
  // 表单组件相关路由
  {
    path: '/form',
    name: 'FormOverview',
    component: CleverFormDemo,
    meta: {
      title: 'CleverForm 概览',
      category: 'form'
    }
  },
  {
    path: '/form/basic',
    name: 'FormBasic',
    component: () => import('../demo/form-demos/BasicUsageDemo.vue'),
    meta: {
      title: '基础用法',
      category: 'form'
    }
  },
  {
    path: '/form/validation',
    name: 'FormValidation',
    component: () => import('../demo/form-demos/ValidationDemo.vue'),
    meta: {
      title: '表单验证',
      category: 'form'
    }
  },
  {
    path: '/form/dynamic',
    name: 'FormDynamic',
    component: () => import('../demo/form-demos/DynamicFormDemo.vue'),
    meta: {
      title: '动态表单',
      category: 'form'
    }
  },
  {
    path: '/form/linkage',
    name: 'FormLinkage',
    component: () => import('../demo/form-demos/FormLinkageDemo.vue'),
    meta: {
      title: '表单联动',
      category: 'form'
    }
  },
  {
    path: '/form/grouped',
    name: 'FormGrouped',
    component: () => import('../demo/form-demos/GroupedFormDemo.vue'),
    meta: {
      title: '分组表单',
      category: 'form'
    }
  },
  {
    path: '/form/layout',
    name: 'FormLayout',
    component: () => import('../demo/form-demos/ComplexLayoutDemo.vue'),
    meta: {
      title: '复杂布局',
      category: 'form'
    }
  },
  {
    path: '/form/custom',
    name: 'FormCustom',
    component: () => import('../demo/form-demos/CustomComponentDemo.vue'),
    meta: {
      title: '自定义组件',
      category: 'form'
    }
  },
  {
    path: '/form/nested-mixed',
    name: 'FormCustom',
    component: () => import('../demo/form-demos/NestedMixedLayoutDemo.vue'),
    meta: {
      title: '混合嵌套布局',
      category: 'form'
    }
  },
  {
    path: '/form/api-config',
    name: 'FormApiConfig',
    component: () => import('../demo/form-demos/ApiConfigDemo.vue'),
    meta: {
      title: 'API配置',
      category: 'form'
    }
  },
  {
    path: '/form/one-row',
    name: 'FormOneRow',
    component: () => import('../demo/form-demos/OnlyShowOneRowDemo.vue'),
    meta: {
      title: '单行显示',
      category: 'form'
    }
  },
  {
    path: '/form/api-doc',
    name: 'FormApiDoc',
    component: () => import('../demo/form-demos/FormApiDoc.vue'),
    meta: {
      title: 'API文档',
      category: 'form'
    }
  },
  // 表格组件相关路由
  {
    path: '/table',
    name: 'TableOverview',
    component: CleverTableDemo,
    meta: {
      title: 'CleverTable 概览',
      category: 'table'
    }
  },
  {
    path: '/table/basic',
    name: 'TableBasic',
    component: () => import('../demo/table-demos/BasicTableDemo.vue'),
    meta: {
      title: '基础表格',
      category: 'table'
    }
  },
  {
    path: '/table/advanced',
    name: 'TableAdvanced',
    component: () => import('../demo/table-demos/AdvancedTableDemo.vue'),
    meta: {
      title: '高级功能',
      category: 'table'
    }
  },
  {
    path: '/table/crud',
    name: 'TableCrud',
    component: () => import('../demo/table-demos/CrudTableDemo.vue'),
    meta: {
      title: 'CRUD操作',
      category: 'table'
    }
  },
  {
    path: '/table/crud-overview',
    name: 'TableCrudOverview',
    component: CleverTableCrudDemo,
    meta: {
      title: 'CRUD组件概览',
      category: 'table'
    }
  },
  // 弹窗组件
  {
    path: '/popup',
    name: 'PopupOverview',
    component: CleverPopupDemo,
    meta: {
      title: 'CleverPopup 弹窗',
      category: 'popup'
    }
  },
  // 工具类
  {
    path: '/tools/schema-helpers',
    name: 'SchemaHelpers',
    component: SchemaHelpersDemo,
    meta: {
      title: 'Schema辅助工具',
      category: 'tools'
    }
  },
  {
    path: '/tools/form-schema-helpers',
    name: 'FormSchemaHelpers',
    component: () => import('../demo/form-demos/SchemaHelpersDemo.vue'),
    meta: {
      title: '表单Schema工具',
      category: 'tools'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router