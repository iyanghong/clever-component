# CleverForm 智能表单

基于配置的智能表单组件，支持动态表单生成、验证、联动等功能。

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