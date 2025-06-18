# Clever Component 文档

基于 Vue 3 + TypeScript + Naive UI 的智能组件库，提供完整的数据管理解决方案。

## 目录

- [快速开始](#快速开始)
- [组件介绍](#组件介绍)
  - [CleverForm 智能表单](#cleverform-智能表单)
  - [CleverTable 智能表格](#clevertable-智能表格)
  - [CleverPopup 智能弹窗](#cleverpopup-智能弹窗)
- [完整示例](#完整示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 快速开始

### 安装

```bash
npm install clever-component
# 或
yarn add clever-component
# 或
pnpm add clever-component
```

### 全局注册

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'
import 'clever-component/dist/style.css'

const app = createApp(App)
app.use(CleverComponent)
app.mount('#app')
```

### 按需引入

```typescript
import { CleverForm, CleverTable, CleverPopup } from 'clever-component'
```

## 组件介绍

### CleverForm 智能表单

智能表单组件，支持动态生成、验证、弹窗模式等功能。

#### 基础用法

```vue
<template>
  <CleverForm
    :schemas="formSchemas"
    @submit="handleSubmit"
    @reset="handleReset"
  />
</template>

<script setup>
import { CleverForm } from 'clever-component'

const formSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: {
      min: 1,
      max: 100
    }
  }
]

function handleSubmit(values) {
  console.log('表单数据：', values)
}

function handleReset() {
  console.log('表单重置')
}
</script>
```

#### 弹窗模式

```vue
<template>
  <CleverForm
    :schemas="formSchemas"
    :is-popup="true"
    :popup-option="{
      mode: 'modal',
      title: '用户信息',
      width: 600
    }"
    v-model:visible-popup="visible"
    @submit="handleSubmit"
  />
</template>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schemas | `FormSchema[]` | `[]` | 表单配置项 |
| modelValue | `Record<string, any>` | `{}` | 表单数据 |
| isPopup | `boolean` | `false` | 是否为弹窗模式 |
| popupOption | `PopupOption` | `{}` | 弹窗配置 |
| visiblePopup | `boolean` | `false` | 弹窗显示状态 |
| gridProps | `GridProps` | `{}` | 栅格布局配置 |
| showActionButtonGroup | `boolean` | `true` | 是否显示操作按钮组 |
| submitButtonOptions | `ButtonOption` | `{}` | 提交按钮配置 |
| resetButtonOptions | `ButtonOption` | `{}` | 重置按钮配置 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| submit | `(values: Record<string, any>)` | 表单提交 |
| reset | `()` | 表单重置 |
| update:modelValue | `(values: Record<string, any>)` | 表单数据更新 |
| update:visiblePopup | `(visible: boolean)` | 弹窗显示状态更新 |

#### Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| validate | `()` | `Promise<boolean>` | 验证表单 |
| resetFields | `()` | `void` | 重置表单字段 |
| setFormData | `(data: Record<string, any>)` | `void` | 设置表单数据 |
| getFormData | `()` | `Record<string, any>` | 获取表单数据 |
| setFieldValue | `(field: string, value: any)` | `void` | 设置字段值 |
| getFieldValue | `(field: string)` | `any` | 获取字段值 |

#### FormSchema 配置

```typescript
interface FormSchema {
  field: string                    // 字段名
  label: string                    // 标签
  component: string                // 组件类型
  required?: boolean               // 是否必填
  defaultValue?: any               // 默认值
  componentProps?: Record<string, any>  // 组件属性
  rules?: FormItemRule[]           // 验证规则
  show?: boolean | ((values: Record<string, any>) => boolean)  // 显示条件
  disabled?: boolean | ((values: Record<string, any>) => boolean)  // 禁用条件
  gridItemProps?: GridItemProps    // 栅格项属性
  formItemProps?: FormItemProps    // 表单项属性
  helpText?: string                // 帮助文本
  slot?: string                    // 插槽名称
}
```

### CleverTable 智能表格

基于 NDataTable 的智能表格组件，支持 CRUD 操作、分页、搜索等功能。

#### 基础用法

```vue
<template>
  <CleverTable
    :columns="columns"
    :data="tableData"
    :actions="actions"
  />
</template>

<script setup>
import { CleverTable } from 'clever-component'

const columns = [
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 80 },
  { key: 'email', title: '邮箱', width: 200 }
]

const tableData = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
]

const actions = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: (record) => {
      console.log('编辑：', record)
    }
  },
  {
    key: 'delete',
    label: '删除',
    type: 'error',
    onClick: (record) => {
      console.log('删除：', record)
    },
    confirm: {
      title: '确认删除',
      content: '确定要删除这条记录吗？'
    }
  }
]
</script>
```

#### API 模式

```vue
<template>
  <CleverTable
    :columns="columns"
    :api-config="apiConfig"
    :search-config="searchConfig"
    :actions="actions"
  />
</template>

<script setup>
const apiConfig = {
  listApi: async (params) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return response.json()
  },
  deleteApi: async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

const searchConfig = {
  show: true,
  collapsible: true,
  schemas: [
    {
      field: 'name',
      label: '姓名',
      component: 'NInput',
      componentProps: {
        placeholder: '请输入姓名'
      }
    }
  ]
}
</script>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `TableColumn[]` | `[]` | 表格列配置 |
| data | `any[]` | `[]` | 表格数据 |
| loading | `boolean` | `false` | 加载状态 |
| autoLoad | `boolean` | `true` | 是否自动加载数据 |
| actions | `TableAction[]` | `[]` | 行操作配置 |
| headerActions | `HeaderAction[]` | `[]` | 头部操作配置 |
| searchConfig | `SearchConfig` | `{}` | 搜索配置 |
| apiConfig | `ApiConfig` | `{}` | API 配置 |
| paginationConfig | `PaginationConfig` | `{}` | 分页配置 |
| showActionColumn | `boolean` | `true` | 是否显示操作列 |
| showIndexColumn | `boolean` | `false` | 是否显示序号列 |
| showSelectionColumn | `boolean` | `false` | 是否显示选择列 |
| checkedRowKeys | `(string \| number)[]` | `[]` | 选中的行键 |
| rowKey | `string` | `'id'` | 行键字段 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| selection-change | `(keys: (string \| number)[])` | 选择变化 |
| row-click | `(record: any)` | 行点击 |
| load-data | `(data: any[])` | 数据加载完成 |

#### Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| handleRefresh | `()` | `void` | 刷新数据 |
| handleOpenForm | `(record?: any)` | `void` | 打开表单 |
| handleDelete | `(record: any)` | `void` | 删除数据 |
| setCheckedRowKeys | `(keys: (string \| number)[])` | `void` | 设置选中行 |
| getCheckedRowKeys | `()` | `(string \| number)[]` | 获取选中行 |
| updateSearchParams | `(params: Record<string, any>)` | `void` | 更新搜索参数 |
| getTableData | `()` | `any[]` | 获取表格数据 |
| setTableData | `(data: any[])` | `void` | 设置表格数据 |

### CleverPopup 智能弹窗

智能弹窗组件，支持 Modal 和 Drawer 两种模式。

#### 基础用法

```vue
<template>
  <!-- Modal 模式 -->
  <CleverPopup
    v-model:visible="modalVisible"
    mode="modal"
    title="Modal 标题"
    :width="600"
  >
    <div>Modal 内容</div>
    <template #footer>
      <n-space justify="end">
        <n-button @click="modalVisible = false">取消</n-button>
        <n-button type="primary" @click="handleConfirm">确定</n-button>
      </n-space>
    </template>
  </CleverPopup>

  <!-- Drawer 模式 -->
  <CleverPopup
    v-model:visible="drawerVisible"
    mode="drawer"
    title="Drawer 标题"
    :width="400"
    placement="right"
  >
    <div>Drawer 内容</div>
  </CleverPopup>
</template>

<script setup>
import { ref } from 'vue'
import { CleverPopup } from 'clever-component'

const modalVisible = ref(false)
const drawerVisible = ref(false)

function handleConfirm() {
  console.log('确认操作')
  modalVisible.value = false
}
</script>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | `boolean` | `false` | 显示状态 |
| mode | `'modal' \| 'drawer'` | `'modal'` | 弹窗模式 |
| title | `string` | `''` | 标题 |
| width | `number \| string` | `520` | 宽度 |
| height | `number \| string` | `'auto'` | 高度 |
| placement | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | Drawer 位置 |
| maskClosable | `boolean` | `true` | 点击遮罩是否关闭 |
| closable | `boolean` | `true` | 是否显示关闭按钮 |
| showFooter | `boolean` | `false` | 是否显示底部 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:visible | `(visible: boolean)` | 显示状态更新 |
| close | `()` | 关闭事件 |
| after-enter | `()` | 进入动画完成 |
| after-leave | `()` | 离开动画完成 |

#### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| header | 头部内容 |
| footer | 底部内容 |

## 完整示例

### 用户管理系统

```vue
<template>
  <div class="user-management">
    <!-- 用户列表表格 -->
    <CleverTable
      ref="tableRef"
      :columns="columns"
      :api-config="apiConfig"
      :search-config="searchConfig"
      :actions="actions"
      :header-actions="headerActions"
      :show-selection-column="true"
      :show-index-column="true"
      @selection-change="handleSelectionChange"
    />

    <!-- 用户表单弹窗 -->
    <CleverForm
      ref="formRef"
      :schemas="formSchemas"
      :is-popup="true"
      :popup-option="{
        mode: 'modal',
        title: formTitle,
        width: 600
      }"
      v-model:visible-popup="formVisible"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { CleverTable, CleverForm } from 'clever-component'
import type { TableColumn, TableAction, HeaderAction, FormSchema } from 'clever-component'

const message = useMessage()
const tableRef = ref()
const formRef = ref()
const formVisible = ref(false)
const selectedRowKeys = ref<(string | number)[]>([])
const editingRecord = ref<any>(null)

const formTitle = computed(() => editingRecord.value ? '编辑用户' : '新增用户')

// 表格列配置
const columns: TableColumn[] = [
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'department', title: '部门', width: 120 },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (record) => {
      return h('n-tag', {
        type: record.status === 'active' ? 'success' : 'warning'
      }, () => record.status === 'active' ? '激活' : '禁用')
    }
  }
]

// 行操作配置
const actions: TableAction[] = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: (record) => handleEdit(record)
  },
  {
    key: 'delete',
    label: '删除',
    type: 'error',
    onClick: (record) => handleDelete(record),
    confirm: {
      title: '确认删除',
      content: '确定要删除这个用户吗？'
    }
  }
]

// 头部操作配置
const headerActions: HeaderAction[] = [
  {
    key: 'add',
    label: '新增用户',
    type: 'primary',
    onClick: () => handleAdd()
  },
  {
    key: 'batchDelete',
    label: '批量删除',
    type: 'error',
    disabled: computed(() => selectedRowKeys.value.length === 0),
    onClick: () => handleBatchDelete()
  }
]

// API 配置
const apiConfig = {
  listApi: async (params: any) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  },
  deleteApi: async (id: number) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

// 搜索配置
const searchConfig = {
  show: true,
  collapsible: true,
  schemas: [
    {
      field: 'name',
      label: '姓名',
      component: 'NInput',
      componentProps: {
        placeholder: '请输入姓名'
      }
    },
    {
      field: 'department',
      label: '部门',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择部门',
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' }
        ]
      }
    }
  ] as FormSchema[]
}

// 表单配置
const formSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入邮箱'
    }
  },
  {
    field: 'department',
    label: '部门',
    component: 'NSelect',
    required: true,
    componentProps: {
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'NRadioGroup',
    defaultValue: 'active',
    componentProps: {
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

// 事件处理
function handleAdd() {
  editingRecord.value = null
  formVisible.value = true
  formRef.value?.resetFields()
}

function handleEdit(record: any) {
  editingRecord.value = record
  formVisible.value = true
  nextTick(() => {
    formRef.value?.setFormData(record)
  })
}

function handleDelete(record: any) {
  message.success(`删除用户：${record.name}`)
  tableRef.value?.handleRefresh()
}

function handleBatchDelete() {
  message.success(`批量删除 ${selectedRowKeys.value.length} 个用户`)
  selectedRowKeys.value = []
  tableRef.value?.handleRefresh()
}

function handleSelectionChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

function handleSubmit(values: any) {
  if (editingRecord.value) {
    // 编辑用户
    console.log('编辑用户：', values)
    message.success('用户信息更新成功')
  } else {
    // 新增用户
    console.log('新增用户：', values)
    message.success('用户添加成功')
  }
  formVisible.value = false
  tableRef.value?.handleRefresh()
}
</script>
```

## 最佳实践

### 1. 表单验证

```typescript
// 自定义验证规则
const formSchemas: FormSchema[] = [
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    required: true,
    rules: [
      {
        required: true,
        message: '请输入邮箱'
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '邮箱格式不正确'
      }
    ]
  }
]
```

### 2. 条件显示

```typescript
const formSchemas: FormSchema[] = [
  {
    field: 'type',
    label: '类型',
    component: 'NSelect',
    componentProps: {
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' }
      ]
    }
  },
  {
    field: 'companyName',
    label: '公司名称',
    component: 'NInput',
    show: (values) => values.type === 'company'
  }
]
```

### 3. 表格自定义渲染

```typescript
const columns: TableColumn[] = [
  {
    key: 'avatar',
    title: '头像',
    width: 80,
    render: (record) => {
      return h('n-avatar', {
        src: record.avatar,
        fallbackSrc: '/default-avatar.png'
      })
    }
  },
  {
    key: 'tags',
    title: '标签',
    render: (record) => {
      return h('n-space', {}, () => 
        record.tags?.map((tag: string) => 
          h('n-tag', { size: 'small' }, () => tag)
        )
      )
    }
  }
]
```

### 4. API 错误处理

```typescript
const apiConfig = {
  listApi: async (params: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.code !== 0) {
        throw new Error(result.message || '请求失败')
      }
      
      return result
    } catch (error) {
      console.error('API 请求失败：', error)
      message.error(error.message || '请求失败')
      throw error
    }
  }
}
```

### 5. 响应式设计

```vue
<template>
  <CleverForm
    :schemas="formSchemas"
    :grid-props="gridProps"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
})

const gridProps = computed(() => {
  if (breakpoints.xl.value) return { cols: 3, xGap: 16, yGap: 16 }
  if (breakpoints.lg.value) return { cols: 2, xGap: 16, yGap: 16 }
  return { cols: 1, xGap: 16, yGap: 16 }
})
</script>
```

## 常见问题

### Q: 如何自定义表单组件？

A: 可以通过 `component` 属性指定任何 Naive UI 组件，或者使用 `slot` 属性自定义渲染：

```typescript
const formSchemas: FormSchema[] = [
  {
    field: 'custom',
    label: '自定义组件',
    slot: 'custom-slot'
  }
]
```

```vue
<template>
  <CleverForm :schemas="formSchemas">
    <template #custom-slot="{ field, value, setValue }">
      <div>自定义组件内容</div>
    </template>
  </CleverForm>
</template>
```

### Q: 如何处理大数据量的表格？

A: 建议使用 API 模式，配合后端分页：

```typescript
const apiConfig = {
  listApi: async (params) => {
    // params 包含 page, pageSize, 搜索条件等
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return response.json()
  }
}
```

### Q: 如何实现表单联动？

A: 使用 `show` 和 `disabled` 属性，或者通过 `watch` 监听表单数据变化：

```typescript
const formRef = ref()

watch(() => formRef.value?.getFieldValue('type'), (newType) => {
  if (newType === 'personal') {
    formRef.value?.setFieldValue('companyName', '')
  }
})
```

### Q: 如何自定义表格操作列？

A: 通过 `actions` 属性配置，支持按钮样式、确认对话框等：

```typescript
const actions: TableAction[] = [
  {
    key: 'custom',
    label: '自定义操作',
    type: 'primary',
    onClick: (record) => {
      // 自定义逻辑
    },
    show: (record) => record.status === 'active', // 条件显示
    confirm: {
      title: '确认操作',
      content: '确定要执行此操作吗？'
    }
  }
]
```

### Q: 如何处理文件上传？

A: 使用 NUpload 组件：

```typescript
const formSchemas: FormSchema[] = [
  {
    field: 'avatar',
    label: '头像',
    component: 'NUpload',
    componentProps: {
      action: '/api/upload',
      listType: 'image-card',
      max: 1
    }
  }
]
```

---

更多详细信息请参考 [API 文档](./api.md) 和 [示例代码](../play/src/demo/)。