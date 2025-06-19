# CleverForm 智能表单

基于配置的智能表单组件，支持动态表单生成、验证、联动等功能。支持多种布局模式：Grid、Flex、Tabs、Accordion 和混合布局。

## 基础用法

通过配置字段信息快速生成表单。

```vue
<template>
  <div>
    <CleverForm
      v-model:value="formData"
      :fields="fields"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CleverForm } from '@clever-component/components'

const formData = ref({})

const fields = [
  {
    key: 'name',
    label: '姓名',
    type: 'input',
    required: true,
    placeholder: '请输入姓名'
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    required: true,
    placeholder: '请输入邮箱',
    rules: [
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入正确的邮箱格式'
      }
    ]
  },
  {
    key: 'age',
    label: '年龄',
    type: 'number',
    placeholder: '请输入年龄'
  }
]

const handleSubmit = (data) => {
  console.log('提交数据:', data)
}
</script>
```

## 复杂表单

支持多种字段类型和复杂布局。

```vue
<template>
  <div>
    <CleverForm
      v-model:value="formData"
      :fields="complexFields"
      :columns="2"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
const complexFields = [
  {
    key: 'name',
    label: '姓名',
    type: 'input',
    required: true,
    span: 1
  },
  {
    key: 'gender',
    label: '性别',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ],
    span: 1
  },
  {
    key: 'birthday',
    label: '生日',
    type: 'date',
    span: 1
  },
  {
    key: 'city',
    label: '城市',
    type: 'select',
    multiple: true,
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' }
    ],
    span: 1
  },
  {
    key: 'description',
    label: '描述',
    type: 'textarea',
    span: 2,
    rows: 4
  }
]
</script>
```

## 动态表单

支持动态添加和删除字段。

```vue
<template>
  <div>
    <CleverForm
      v-model:value="formData"
      :fields="dynamicFields"
      dynamic
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
const dynamicFields = [
  {
    key: 'contacts',
    label: '联系人',
    type: 'array',
    itemFields: [
      {
        key: 'name',
        label: '姓名',
        type: 'input',
        required: true
      },
      {
        key: 'phone',
        label: '电话',
        type: 'input',
        required: true
      }
    ]
  }
]
</script>
```

## 表单验证

支持多种验证规则。

```vue
<template>
  <div>
    <CleverForm
      v-model:value="formData"
      :fields="validationFields"
      @submit="handleSubmit"
      @validate="handleValidate"
    />
  </div>
</template>

<script setup>
const validationFields = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    rules: [
      {
        min: 3,
        max: 20,
        message: '用户名长度在 3 到 20 个字符'
      },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: '用户名只能包含字母、数字和下划线'
      }
    ]
  },
  {
    key: 'password',
    label: '密码',
    type: 'password',
    required: true,
    rules: [
      {
        min: 6,
        message: '密码长度不能少于 6 位'
      }
    ]
  },
  {
    key: 'confirmPassword',
    label: '确认密码',
    type: 'password',
    required: true,
    rules: [
      {
        validator: (rule, value, callback, source) => {
          if (value !== source.password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        }
      }
    ]
  }
]

const handleValidate = (errors) => {
  if (errors) {
    console.log('验证失败:', errors)
  } else {
    console.log('验证通过')
  }
}
</script>
```

## 布局模式

### Grid 布局（默认）

网格布局，适合规整的表单结构。

```vue
<template>
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
</template>
```

### Flex 布局

弹性布局，适合需要灵活排列的表单。

```vue
<template>
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
</template>
```

### Tabs 布局

标签页布局，适合分组展示表单内容。

```vue
<template>
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
</template>

<script setup>
const tabsSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    group: 'basic-info',
    groupTitle: '基本信息'
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    group: 'basic-info'
  },
  {
    field: 'address',
    label: '地址',
    component: 'NInput',
    group: 'contact-info',
    groupTitle: '联系信息'
  }
]
</script>
```

### Accordion 布局

手风琴布局，适合可折叠的分组表单。

```vue
<template>
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
</template>

<script setup>
const accordionSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    group: 'basic-info',
    groupTitle: '基本信息',
    order: 1
  },
  {
    field: 'description',
    label: '描述',
    component: 'NInput',
    group: 'detail-info',
    groupTitle: '详细信息',
    order: 2
  }
]
</script>
```

### 混合布局（新特性）

混合布局允许在一个表单中使用多种布局方式，通过容器类型实现嵌套布局。

```vue
<template>
  <CleverForm
    :schemas="mixedSchemas"
    layout-mode="mixed"
    :layout-config="mixedLayoutConfig"
  />
</template>

<script setup>
const mixedLayoutConfig = {
  tabs: {
    type: 'line',
    placement: 'top'
  },
  grid: {
    cols: '1 s:2 m:3 l:3 xl:3 2xl:3',
    xGap: 16,
    yGap: 16
  },
  flex: {
    direction: 'row',
    wrap: 'wrap',
    gap: 16
  },
  accordion: {
    accordion: true
  }
}

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
            containerType: 'accordion',
            children: [
              {
                name: 'home-address',
                title: '家庭地址',
                children: [
                  {
                    field: 'homeAddress',
                    label: '详细地址',
                    component: 'NInput',
                    componentProps: { type: 'textarea', rows: 3 }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
</script>
```

## 容器类型

### 支持的容器类型

- **tabs**: 标签页容器
- **accordion**: 手风琴容器
- **grid**: 网格容器
- **flex**: 弹性布局容器
- **card**: 卡片容器
- **divider**: 分割线容器

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

### CleverForm Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| value / v-model | 表单数据 | object | — | {} |
| fields | 字段配置 | array | — | [] |
| columns | 列数 | number | — | 1 |
| label-width | 标签宽度 | string / number | — | 'auto' |
| label-placement | 标签位置 | string | left / top | left |
| size | 表单尺寸 | string | small / medium / large | medium |
| disabled | 是否禁用 | boolean | — | false |
| readonly | 是否只读 | boolean | — | false |
| show-feedback | 是否显示验证反馈 | boolean | — | true |
| show-label | 是否显示标签 | boolean | — | true |
| show-require-mark | 是否显示必填标记 | boolean | — | true |
| require-mark-placement | 必填标记位置 | string | left / right | right |

### CleverForm Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 表单提交时触发 | (data: object) => void |
| validate | 表单验证时触发 | (errors: array \| null) => void |
| change | 表单数据改变时触发 | (data: object, field: string) => void |

### CleverForm Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| validate | 验证表单 | (callback?: Function) => Promise |
| validateField | 验证指定字段 | (field: string, callback?: Function) => Promise |
| resetFields | 重置表单 | — |
| clearValidate | 清除验证 | (fields?: string[]) => void |
| setFieldValue | 设置字段值 | (field: string, value: any) => void |
| getFieldValue | 获取字段值 | (field: string) => any |

### Field 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| key | 字段键名 | string | — | — |
| label | 字段标签 | string | — | — |
| type | 字段类型 | string | input / textarea / select / date / number / switch / checkbox / radio / array | input |
| required | 是否必填 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| readonly | 是否只读 | boolean | — | false |
| placeholder | 占位文本 | string | — | — |
| options | 选项列表（select、radio、checkbox 类型） | array | — | [] |
| rules | 验证规则 | array | — | [] |
| span | 占用列数 | number | — | 1 |
| show | 是否显示 | boolean / function | — | true |
| itemFields | 子字段配置（array 类型） | array | — | [] |