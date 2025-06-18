import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  title: 'Clever Component',
  description: '基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库',
  base: '/clever-component/',
  
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/your-username/clever-component' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '主题定制', link: '/guide/theming' },
            { text: '国际化', link: '/guide/i18n' }
          ]
        }
      ],
      
      '/components/': [

        {
          text: '表单组件',
          items: [
            { text: 'CleverForm 智能表单', link: '/components/clever-form' }
          ]
        },
        {
          text: '反馈组件',
          items: [
            { text: 'CleverPopup 智能弹窗', link: '/components/clever-popup' }
          ]
        },
        {
          text: '数据展示',
          items: [
            { text: 'CleverTable 智能表格', link: '/components/clever-table' },
            { text: 'CleverDataTable 数据表格', link: '/components/clever-data-table' }
          ]
        }
      ],
      
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '组合式函数', link: '/api/composables' },
            { text: '工具函数', link: '/api/utils' },
            { text: '类型定义', link: '/api/types' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/clever-component' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Clever Component'
    }
  },
  
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../packages'),
        '@clever-component': resolve(__dirname, '../../packages')
      }
    }
  }
})