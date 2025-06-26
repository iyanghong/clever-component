# CleverForm 组件

> 基于 Vue 3 + TypeScript + Naive UI 的智能表单组件

## 📋 概述

CleverForm 是一个功能强大、高度可配置的表单组件，支持多种布局模式、丰富的字段类型和灵活的验证规则。

## ✨ 特性

- 🎯 **类型安全** - 完整的 TypeScript 类型支持
- 🎨 **多种布局** - 支持网格、弹性、内联、垂直布局
- 🧩 **丰富组件** - 支持所有 Naive UI 表单组件
- 🔧 **高度可配置** - 灵活的字段配置和表单配置
- 📱 **响应式设计** - 自适应不同屏幕尺寸
- 🎭 **插槽支持** - 支持自定义渲染和插槽
- ⚡ **性能优化** - 按需渲染和懒加载
- 🔍 **可折叠表单** - 支持字段折叠和展开

## 📦 安装

```bash
npm install @clever-component/form
# 或
pnpm add @clever-component/form
# 或
yarn add @clever-component/form
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <CleverForm
    v-model="formData"
    :schemas="schemas"
    :config="config"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CleverForm } from '@clever-component/form'
import type { FormFieldSchema, FormConfig } from '@clever-component/form'

// 表单数据
const formData = ref({
  name: '',
  email: '',
  age: null,
  gender: null
})

// 表单字段配置
const schemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'n-input',
    componentProps: {
      placeholder: '请输入姓名'
    },
    rules: [
      { required: true, message: '请输入姓名' }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'n-input',
    componentProps: {
      placeholder: '请输入邮箱'
    },
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  },
  {
    field: 'age',
    label: '年龄',
    component: 'n-input-number',
    componentProps: {
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'n-radio-group',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  }
]

// 表单配置
const config: FormConfig = {
  layout: {
    mode: 'grid',
    grid: {
      cols: '1 s:1 m:2 l:3 xl:4',
      xGap: 16,
      yGap: 16
    }
  },
  actions: {
    showReset: true,
    showSubmit: true,
    submitText: '提交',
    resetText: '重置'
  }
}

// 处理提交
const handleSubmit = (data: any, isValid: boolean) => {
  if (isValid) {
    console.log('表单数据:', data)
  }
}
</script>
```

## 📚 API 文档

### CleverForm Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schemas` | `FormFieldSchema[]` | `[]` | 表单字段配置 |
| `config` | `Partial<FormConfig>` | `{}` | 表单配置 |
| `modelValue` | `FormModel` | `{}` | 表单数据 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `class` | `string \| string[] \| Record<string, boolean>` | - | 容器类名 |
| `style` | `string \| Record<string, any>` | - | 容器样式 |

### CleverForm Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `(value: FormModel)` | 表单数据更新 |
| `submit` | `(data: FormModel, isValid: boolean)` | 表单提交 |
| `reset` | `()` | 表单重置 |
| `fieldChange` | `(field: string, value: any, oldValue: any)` | 字段值变化 |
| `validate` | `(errors: any[] \| null)` | 表单验证 |
| `toggle` | `(expanded: boolean)` | 展开/收起切换 |
| `customAction` | `(action: any, index: number)` | 自定义操作 |

### CleverForm Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `setFieldValue` | `(field: string, value: any)` | `void` | 设置字段值 |
| `getFieldValue` | `(field: string)` | `any` | 获取字段值 |
| `setFormData` | `(data: FormModel)` | `void` | 设置表单数据 |
| `getFormData` | `()` | `FormModel` | 获取表单数据 |
| `resetFields` | `()` | `void` | 重置表单 |
| `clearValidate` | `()` | `void` | 清除验证 |
| `validate` | `()` | `Promise<{ valid: boolean, errors: any }>` | 验证表单 |
| `submit` | `()` | `Promise<{ data: FormModel, valid: boolean }>` | 提交表单 |

## 🎨 布局模式

### 网格布局 (Grid)

```typescript
const config: FormConfig = {
  layout: {
    mode: 'grid',
    grid: {
      cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
      xGap: 16,
      yGap: 16,
      responsive: true
    }
  }
}
```

### 弹性布局 (Flex)

```typescript
const config: FormConfig = {
  layout: {
    mode: 'flex',
    flex: {
      direction: 'row',
      wrap: 'wrap',
      justify: 'flex-start',
      align: 'flex-start',
      gap: '16px'
    }
  }
}
```

### 内联布局 (Inline)

```typescript
const config: FormConfig = {
  layout: {
    mode: 'inline'
  }
}
```

### 垂直布局 (Vertical)

```typescript
const config: FormConfig = {
  layout: {
    mode: 'vertical'
  }
}
```

## 🧩 字段类型

### 输入类组件

```typescript
// 文本输入
{
  field: 'name',
  label: '姓名',
  component: 'n-input',
  componentProps: {
    placeholder: '请输入姓名',
    clearable: true
  }
}

// 数字输入
{
  field: 'age',
  label: '年龄',
  component: 'n-input-number',
  componentProps: {
    min: 0,
    max: 120,
    step: 1
  }
}

// 文本域
{
  field: 'description',
  label: '描述',
  component: 'n-input',
  componentProps: {
    type: 'textarea',
    rows: 4,
    placeholder: '请输入描述'
  }
}
```

### 选择类组件

```typescript
// 下拉选择
{
  field: 'city',
  label: '城市',
  component: 'n-select',
  options: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' }
  ],
  componentProps: {
    placeholder: '请选择城市',
    clearable: true
  }
}

// 单选框组
{
  field: 'gender',
  label: '性别',
  component: 'n-radio-group',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]
}

// 复选框组
{
  field: 'hobbies',
  label: '爱好',
  component: 'n-checkbox-group',
  options: [
    { label: '读书', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' }
  ]
}
```

### 日期时间组件

```typescript
// 日期选择
{
  field: 'birthday',
  label: '生日',
  component: 'n-date-picker',
  componentProps: {
    type: 'date',
    placeholder: '请选择生日'
  }
}

// 时间选择
{
  field: 'time',
  label: '时间',
  component: 'n-time-picker',
  componentProps: {
    placeholder: '请选择时间'
  }
}
```

### 其他组件

```typescript
// 开关
{
  field: 'enabled',
  label: '启用',
  component: 'n-switch'
}

// 滑块
{
  field: 'score',
  label: '评分',
  component: 'n-slider',
  componentProps: {
    min: 0,
    max: 100,
    step: 1
  }
}

// 评分
{
  field: 'rating',
  label: '评级',
  component: 'n-rate',
  componentProps: {
    allowHalf: true
  }
}

// 颜色选择
{
  field: 'color',
  label: '颜色',
  component: 'n-color-picker'
}

// 文件上传
{
  field: 'files',
  label: '文件',
  component: 'n-upload',
  componentProps: {
    action: '/api/upload',
    multiple: true
  }
}
```

## 🔧 高级配置

### 字段显示控制

```typescript
{
  field: 'email',
  label: '邮箱',
  component: 'n-input',
  // 静态显示控制
  visible: true,
  // 动态显示控制
  visible: (formData) => formData.needEmail,
  // 禁用控制
  disabled: false,
  disabled: (formData) => formData.readonly
}
```

### 字段布局配置

```typescript
{
  field: 'description',
  label: '描述',
  component: 'n-input',
  // 占满整行
  fullWidth: true,
  // 自定义布局
  layout: {
    span: 12,
    offset: 2,
    responsive: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6
    }
  }
}
```

### 自定义渲染

```typescript
// 使用插槽
{
  field: 'custom',
  label: '自定义',
  slot: true
}

// 使用渲染函数
{
  field: 'custom',
  label: '自定义',
  render: (props) => {
    return h('div', '自定义内容')
  }
}
```

### 表单验证

```typescript
{
  field: 'email',
  label: '邮箱',
  component: 'n-input',
  rules: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱格式' },
    {
      validator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (value && value.includes('test')) {
            reject(new Error('邮箱不能包含test'))
          } else {
            resolve()
          }
        })
      },
      message: '邮箱验证失败'
    }
  ]
}
```

### 可折叠表单

```typescript
const config: FormConfig = {
  collapsible: true,
  maxVisibleFields: 6,
  collapseTitle: '更多选项',
  actions: {
    showToggle: true,
    expandText: '展开',
    collapseText: '收起'
  }
}
```

## 🎭 插槽支持

### 字段插槽

```vue
<template>
  <CleverForm v-model="formData" :schemas="schemas">
    <!-- 自定义字段渲染 -->
    <template #custom="{ schema, formData, methods }">
      <div>自定义字段内容</div>
    </template>
    
    <!-- 字段标签插槽 -->
    <template #label-name="{ schema, formData }">
      <span style="color: red;">{{ schema.label }} *</span>
    </template>
    
    <!-- 字段前缀插槽 -->
    <template #prefix-name="{ schema, formData }">
      <NIcon><UserOutline /></NIcon>
    </template>
    
    <!-- 字段后缀插槽 -->
    <template #suffix-name="{ schema, formData }">
      <NButton size="small">验证</NButton>
    </template>
    
    <!-- 选项插槽 -->
    <template #options-gender="{ schema, formData }">
      <NRadio value="male">👨 男</NRadio>
      <NRadio value="female">👩 女</NRadio>
    </template>
    
    <!-- 上传插槽 -->
    <template #upload-avatar="{ schema, formData }">
      <NButton>选择头像</NButton>
    </template>
  </CleverForm>
</template>
```

### 操作按钮插槽

```vue
<template>
  <CleverForm v-model="formData" :schemas="schemas">
    <!-- 自定义操作按钮 -->
    <template #actions="{ methods }">
      <NButton @click="methods.reset">重置</NButton>
      <NButton type="primary" @click="methods.submit">提交</NButton>
      <NButton @click="handlePreview">预览</NButton>
    </template>
  </CleverForm>
</template>
```

## 🎯 最佳实践

### 1. 类型安全

```typescript
// 定义表单数据类型
interface UserForm {
  name: string
  email: string
  age: number | null
  gender: 'male' | 'female' | null
}

// 使用类型约束
const formData = ref<UserForm>({
  name: '',
  email: '',
  age: null,
  gender: null
})

// 类型安全的字段配置
const schemas: FormFieldSchema[] = [
  {
    field: 'name' as keyof UserForm,
    label: '姓名',
    component: 'n-input'
  }
]
```

### 2. 性能优化

```typescript
// 使用 shallowRef 优化大表单性能
const formData = shallowRef({
  // 大量字段...
})

// 按需加载字段配置
const schemas = computed(() => {
  return condition.value ? basicSchemas : extendedSchemas
})

// 使用 v-show 而不是 v-if 控制字段显示
{
  field: 'email',
  label: '邮箱',
  component: 'n-input',
  visible: (formData) => formData.showEmail
}
```

### 3. 表单验证

```typescript
// 统一的验证规则
const commonRules = {
  required: { required: true, message: '此字段为必填项' },
  email: { type: 'email', message: '请输入正确的邮箱格式' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
}

// 复用验证规则
const schemas: FormFieldSchema[] = [
  {
    field: 'email',
    label: '邮箱',
    component: 'n-input',
    rules: [commonRules.required, commonRules.email]
  }
]
```

### 4. 国际化支持

```typescript
// 使用 i18n
const { t } = useI18n()

const schemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: t('form.name'),
    component: 'n-input',
    componentProps: {
      placeholder: t('form.namePlaceholder')
    },
    rules: [
      { required: true, message: t('form.nameRequired') }
    ]
  }
]
```

## 🔍 故障排除

### 常见问题

1. **字段不显示**
   - 检查 `visible` 属性
   - 确认字段配置正确
   - 检查组件名称是否正确

2. **验证不生效**
   - 确认 `rules` 配置正确
   - 检查字段 `field` 属性是否匹配
   - 确认表单数据结构正确

3. **样式问题**
   - 检查 CSS 变量是否正确
   - 确认 Naive UI 主题配置
   - 检查响应式断点设置

4. **性能问题**
   - 使用 `shallowRef` 优化大表单
   - 避免在 `visible` 函数中进行复杂计算
   - 合理使用字段懒加载

### 调试技巧

```typescript
// 开启调试模式
const config: FormConfig = {
  debug: true // 在控制台输出调试信息
}

// 监听表单变化
watch(formData, (newData) => {
  console.log('表单数据变化:', newData)
}, { deep: true })

// 监听字段变化
const handleFieldChange = (field: string, value: any, oldValue: any) => {
  console.log(`字段 ${field} 从 ${oldValue} 变为 ${value}`)
}
```

## 📄 更新日志

### v2.0.0

- 🎉 全新的组件架构
- ✨ 完整的 TypeScript 重写
- 🎨 新增多种布局模式
- 🧩 更丰富的字段类型支持
- 📱 更好的响应式设计
- 🔧 更灵活的配置选项
- 🎭 更强大的插槽支持
- ⚡ 更好的性能优化

## 📜 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果你在使用过程中遇到问题，可以通过以下方式获取帮助：

- 查看文档：[组件文档](./docs)
- 提交 Issue：[GitHub Issues](https://github.com/your-repo/issues)
- 讨论交流：[GitHub Discussions](https://github.com/your-repo/discussions)
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