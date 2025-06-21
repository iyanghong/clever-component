# 组件总览

Clever Component 是一个基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库，提供了丰富的组件来帮助您快速构建高质量的用户界面。

## 表单组件

### CleverForm 智能表单
基于配置的智能表单组件，支持动态表单生成、验证、联动等功能。

- 基于配置快速生成表单
- 支持多种字段类型
- 支持动态表单和验证
- 支持复杂布局和联动

[查看详情](/components/clever-form)

## 反馈组件

### CleverPopup 智能弹窗
智能弹窗组件，支持多种弹窗类型和自定义配置。

- 支持多种弹窗类型
- 支持不同尺寸
- 支持异步操作
- 支持自定义按钮和内容

[查看详情](/components/clever-popup)

## 数据展示

### CleverTable 智能表格
功能丰富的智能表格组件，支持排序、筛选、分页、编辑等功能。

- 支持排序和筛选
- 支持行选择和展开
- 支持可编辑表格
- 支持固定列

[查看详情](/components/clever-table)



## 快速开始

### 安装

```bash
npm install @clever-component/components
```

### 使用

```vue
<template>
  <div>
    <CleverForm :schema="formSchema" />
  </div>
</template>

<script setup>
import { CleverForm } from '@clever-component/components'

const formSchema = {
  fields: [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      required: true
    }
  ]
}
</script>
```

## 设计原则

### 一致性
与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念。

### 反馈
控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作。

### 效率
简化流程：设计简洁直观的操作流程。

### 可控
用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策。

## 贡献指南

我们欢迎社区的贡献！如果您想为 Clever Component 做出贡献，请查看我们的 [贡献指南](https://github.com/your-username/clever-component/blob/main/CONTRIBUTING.md)。

## 许可证

Clever Component 使用 [MIT 许可证](https://github.com/your-username/clever-component/blob/main/LICENSE)。