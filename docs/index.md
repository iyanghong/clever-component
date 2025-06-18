---
layout: home

hero:
  name: "Clever Component"
  text: "现代化 Vue 3 组件库"
  tagline: 基于 Vue 3 + Vite + TypeScript + Naive UI 构建
  image:
    src: /logo.svg
    alt: Clever Component
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看组件
      link: /components/
    - theme: alt
      text: GitHub
      link: https://github.com/your-username/clever-component

features:
  - icon: ⚡️
    title: 极速开发
    details: 基于 Vite 构建，提供极速的开发体验和热更新
  - icon: 🛠️
    title: TypeScript
    details: 完整的 TypeScript 支持，提供优秀的开发体验
  - icon: 🎨
    title: 现代设计
    details: 基于 Naive UI 设计系统，提供美观且一致的用户界面
  - icon: 📦
    title: 开箱即用
    details: 丰富的组件库，满足大部分业务场景需求
  - icon: 🔧
    title: 高度可定制
    details: 灵活的主题系统和组件配置，轻松适配项目需求
  - icon: 📱
    title: 响应式设计
    details: 完美支持各种屏幕尺寸，提供一致的用户体验
---

## 安装

```bash
# 使用 npm
npm install clever-component

# 使用 pnpm
pnpm add clever-component

# 使用 yarn
yarn add clever-component
```

## 快速使用

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'
import 'clever-component/dist/style.css'

const app = createApp(App)
app.use(CleverComponent)
app.mount('#app')
```

```vue
<template>
  <div>
    <CButton type="primary">Hello Clever Component!</CButton>
  </div>
</template>
```