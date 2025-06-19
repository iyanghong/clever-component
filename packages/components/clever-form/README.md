# CleverForm 智能表单组件

## 概述

CleverForm 是一个功能强大的 Vue 3 表单组件，支持多种布局模式和混合布局，提供了灵活的表单构建能力。

## 特性

- 🎨 **多种布局模式**：支持 Grid、Flex、Tabs、Accordion 和混合布局
- 🔧 **高度可配置**：丰富的配置选项，满足各种业务需求
- 📱 **响应式设计**：自适应不同屏幕尺寸
- 🎯 **类型安全**：完整的 TypeScript 支持
- 🚀 **高性能**：优化的渲染机制
- 🎪 **组件丰富**：支持 Naive UI 的所有表单组件

## 安装

```bash
npm install @clever-component
```

## 基础用法

```vue
<template>
  <CleverForm
    :schemas="schemas"
    :data="formData"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import { CleverForm } from '@clever-component'

const formData = ref({
  name: '',
  email: ''
})

const schemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: { placeholder: '请输入姓名' },
    rules: [{ required: true, message: '请输入姓名' }]
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    componentProps: { placeholder: '请输入邮箱' },
    rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }]
  }
]

const handleSubmit = (data) => {
  console.log('表单数据:', data)
}
</script>
```

## 布局模式

### 1. Grid 布局（默认）

```vue
<CleverForm
  :schemas="schemas"
  layout-mode="grid"
  :layout-config="{
    grid: {
      cols: '1 s:2 m:3 l:4 xl:4 2xl:4',
      xGap: 16,
      yGap: 16
    }
  }"
/>
```

### 2. Flex 布局

```vue
<CleverForm
  :schemas="schemas"
  layout-mode="flex"
  :layout-config="{
    flex: {
      direction: 'row',
      wrap: 'wrap',
      gap: 16,
      justify: 'flex-start',
      align: 'flex-start'
    }
  }"
/>
```

### 3. Tabs 布局

```vue
<CleverForm
  :schemas="tabsSchemas"
  layout-mode="tabs"
  :layout-config="{
    tabs: {
      type: 'line',
      placement: 'top'
    }
  }"
/>
```

### 4. Accordion 布局

```vue
<CleverForm
  :schemas="accordionSchemas"
  layout-mode="accordion"
  :layout-config="{
    accordion: {
      accordion: true,
      defaultExpandedNames: ['basic-info']
    }
  }"
/>
```

### 5. 混合布局（新特性）

混合布局允许在一个表单中使用多种布局方式，通过容器类型 Schema 实现嵌套布局。

```vue
<CleverForm
  :schemas="mixedSchemas"
  layout-mode="mixed"
  :layout-config="mixedLayoutConfig"
/>
```

#### 混合布局示例

```javascript
const mixedSchemas = [
  {
    type: 'container',
    containerType: 'tabs',
    name: 'main-tabs',
    children: [
      {
        name: 'basic-tab',
        title: '基本信息',
        children: [
          {
            type: 'container',
            containerType: 'grid',
            config: {
              cols: '1 s:2 m:3 l:3 xl:3 2xl:3',
              xGap: 16,
              yGap: 16
            },
            children: [
              {
                field: 'name',
                label: '姓名',
                component: 'NInput',
                componentProps: { placeholder: '请输入姓名' },
                giProps: { span: 1 }
              },
              {
                field: 'email',
                label: '邮箱',
                component: 'NInput',
                componentProps: { placeholder: '请输入邮箱' },
                giProps: { span: 1 }
              }
            ]
          }
        ]
      },
      {
        name: 'address-tab',
        title: '地址信息',
        children: [
          {
            type: 'container',
            containerType: 'flex',
            config: {
              direction: 'row',
              wrap: 'wrap',
              gap: 16
            },
            children: [
              {
                field: 'country',
                label: '国家',
                component: 'NSelect',
                componentProps: {
                  options: [
                    { label: '中国', value: 'china' },
                    { label: '美国', value: 'usa' }
                  ]
                },
                layout: { flex: '1 1 200px', minWidth: '180px' }
              }
            ]
          }
        ]
      }
    ]
  }
]
```

## 容器类型

### 支持的容器类型

- **tabs**: 标签页容器
- **accordion**: 手风琴容器
- **grid**: 网格容器
- **flex**: 弹性布局容器
- **card**: 卡片容器（计划中）
- **divider**: 分割线容器（计划中）

### 容器 Schema 结构

```typescript
interface FormContainerSchema {
  type: 'container'
  containerType: 'tabs' | 'accordion' | 'grid' | 'flex' | 'card' | 'divider'
  name?: string
  title?: string
  description?: string
  children: (FormSchema | FormContainerSchema)[]
  config?: Record<string, any>
  style?: Record<string, any>
  className?: string
  ifShow?: (formModel: any, methods: any) => boolean
  order?: number
}
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schemas | `FormSchema[]` | `[]` | 表单字段配置 |
| data | `Record<string, any>` | `{}` | 表单数据 |
| layoutMode | `'grid' \| 'flex' \| 'tabs' \| 'accordion' \| 'mixed'` | `'grid'` | 布局模式 |
| layoutConfig | `LayoutConfig` | - | 布局配置 |
| labelWidth | `number \| string` | `80` | 标签宽度 |
| labelPlacement | `'left' \| 'top'` | `'left'` | 标签位置 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 表单尺寸 |
| showActionButtonGroup | `boolean` | `true` | 是否显示操作按钮组 |
| showSubmitButton | `boolean` | `true` | 是否显示提交按钮 |
| showResetButton | `boolean` | `true` | 是否显示重置按钮 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| submit | `(data: Record<string, any>)` | 表单提交事件 |
| reset | `()` | 表单重置事件 |
| field-change | `(field: string, value: any, oldValue: any)` | 字段值变化事件 |

### Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| submit | - | `Promise<any>` | 提交表单 |
| resetFields | - | `Promise<void>` | 重置表单 |
| setFieldValue | `(field: string, value: any)` | `void` | 设置字段值 |
| getFieldValue | `(field: string)` | `any` | 获取字段值 |
| setFormData | `(data: Record<string, any>)` | `void` | 设置表单数据 |
| getFormData | - | `Record<string, any>` | 获取表单数据 |
| validate | `(nameList?: string[])` | `Promise<any>` | 验证表单 |
| clearValidate | `(name?: string \| string[])` | `Promise<void>` | 清除验证 |

## 字段 Schema

### 基础字段 Schema

```typescript
interface FormFieldSchema {
  field: string
  label: string
  component: ComponentType
  componentProps?: Record<string, any>
  rules?: any[]
  defaultValue?: any
  required?: boolean
  labelWidth?: string | number
  labelMessage?: string
  suffix?: string
  slot?: string
  layout?: {
    span?: number
    offset?: number
    flex?: string
    minWidth?: string
    maxWidth?: string
    style?: Record<string, any>
    className?: string
  }
  ifShow?: (formModel: any, value: any, methods: any) => boolean
  onChange?: (newValue: any, oldValue: any, methods: any) => void
}
```

### 支持的组件类型

- `NInput` - 输入框
- `NInputNumber` - 数字输入框
- `NInputTextArea` - 文本域
- `NSelect` - 选择器
- `NRadioGroup` - 单选框组
- `NCheckbox` - 复选框组
- `NDatePicker` - 日期选择器
- `NTimePicker` - 时间选择器
- `NSwitch` - 开关
- `NSlider` - 滑块
- `NRate` - 评分
- `NDynamicTags` - 动态标签

## 高级功能

### 条件显示

```javascript
{
  field: 'email',
  label: '邮箱',
  component: 'NInput',
  ifShow: (formModel, value, methods) => {
    return formModel.needEmail === true
  }
}
```

### 字段联动

```javascript
{
  field: 'city',
  label: '城市',
  component: 'NSelect',
  onChange: (newValue, oldValue, methods) => {
    // 根据城市选择更新区域选项
    methods.setFieldValue('district', '')
  }
}
```

### 自定义验证

```javascript
{
  field: 'password',
  label: '密码',
  component: 'NInput',
  componentProps: { type: 'password' },
  rules: [
    { required: true, message: '请输入密码' },
    {
      validator: (rule, value) => {
        if (value && value.length < 6) {
          return new Error('密码长度不能少于6位')
        }
        return true
      }
    }
  ]
}
```

## 最佳实践

### 1. 性能优化

- 对于大型表单，考虑使用分组或标签页布局
- 合理使用 `ifShow` 条件显示，避免不必要的组件渲染
- 对于复杂的联动逻辑，使用防抖处理

### 2. 用户体验

- 合理设置表单验证规则和错误提示
- 使用 `labelMessage` 提供字段说明
- 为必填字段设置明确的标识

### 3. 布局设计

- 根据表单复杂度选择合适的布局模式
- 使用混合布局时，保持层级结构清晰
- 注意响应式设计，确保在不同设备上的良好体验

## 更新日志

### v2.0.0

- ✨ 新增混合布局支持
- ✨ 新增容器类型 Schema
- ✨ 新增 FormRenderer 递归渲染组件
- 🐛 修复 submit 方法未正确暴露的问题
- 💄 优化布局配置类型定义

### v1.x.x

- 基础表单功能
- Grid、Flex、Tabs、Accordion 布局支持
- 丰富的表单组件支持

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个组件。

## 许可证

MIT