# 快速开始

本指南将帮助您快速上手 Clever Component 组件库。

## 安装

### 使用 npm

```bash
npm install clever-component
```

### 使用 yarn

```bash
yarn add clever-component
```

### 使用 pnpm

```bash
pnpm add clever-component
```

## 引入

### 完整引入

在 `main.ts` 中引入所有组件：

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'
import 'clever-component/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(CleverComponent)
app.mount('#app')
```

### 按需引入

只引入需要的组件：

```typescript
import { CleverForm, CleverTable, CleverPopup } from 'clever-component'
import 'clever-component/dist/style.css'
```

### 自动按需引入（推荐）

使用 `unplugin-vue-components` 实现自动按需引入：

1. 安装插件：

```bash
npm install unplugin-vue-components -D
```

2. 配置 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { CleverComponentResolver } from 'clever-component/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [CleverComponentResolver()]
    })
  ]
})
```

3. 在组件中直接使用，无需手动引入：

```vue
<template>
  <CleverForm :schemas="schemas" />
</template>
```

## 基础使用

### 1. 创建一个简单的表单

```vue
<template>
  <div class="demo">
    <CleverForm
      :schemas="formSchemas"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </div>
</template>

<script setup lang="ts">
import { CleverForm } from 'clever-component'
import type { FormSchema } from 'clever-component'

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
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: {
      min: 1,
      max: 100
    }
  }
]

function handleSubmit(values: any) {
  console.log('表单提交：', values)
}

function handleReset() {
  console.log('表单重置')
}
</script>
```

### 2. 创建一个数据表格

```vue
<template>
  <div class="demo">
    <CleverTable
      :columns="columns"
      :data="tableData"
      :actions="actions"
      :show-index-column="true"
    />
  </div>
</template>

<script setup lang="ts">
import { CleverTable } from 'clever-component'
import type { TableColumn, TableAction } from 'clever-component'

const columns: TableColumn[] = [
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'age', title: '年龄', width: 80 }
]

const tableData = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28 }
]

const actions: TableAction[] = [
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
    }
  }
]
</script>
```

### 3. 创建一个弹窗

```vue
<template>
  <div class="demo">
    <n-button @click="showModal">打开 Modal</n-button>
    <n-button @click="showDrawer">打开 Drawer</n-button>

    <!-- Modal 弹窗 -->
    <CleverPopup
      v-model:visible="modalVisible"
      mode="modal"
      title="Modal 标题"
      :width="600"
    >
      <div style="padding: 20px;">
        <p>这是 Modal 的内容</p>
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="modalVisible = false">取消</n-button>
          <n-button type="primary" @click="handleConfirm">确定</n-button>
        </n-space>
      </template>
    </CleverPopup>

    <!-- Drawer 抽屉 -->
    <CleverPopup
      v-model:visible="drawerVisible"
      mode="drawer"
      title="Drawer 标题"
      :width="400"
      placement="right"
    >
      <div style="padding: 20px;">
        <p>这是 Drawer 的内容</p>
      </div>
    </CleverPopup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CleverPopup } from 'clever-component'

const modalVisible = ref(false)
const drawerVisible = ref(false)

function showModal() {
  modalVisible.value = true
}

function showDrawer() {
  drawerVisible.value = true
}

function handleConfirm() {
  console.log('确认操作')
  modalVisible.value = false
}
</script>
```

## 进阶使用

### 1. 表单弹窗模式

```vue
<template>
  <div class="demo">
    <n-button type="primary" @click="openForm">打开表单</n-button>

    <CleverForm
      ref="formRef"
      :schemas="formSchemas"
      :is-popup="true"
      :popup-option="{
        mode: 'modal',
        title: '用户信息',
        width: 600
      }"
      v-model:visible-popup="formVisible"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CleverForm } from 'clever-component'
import type { FormSchema } from 'clever-component'

const formRef = ref()
const formVisible = ref(false)

const formSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    required: true
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    required: true
  }
]

function openForm() {
  formVisible.value = true
  formRef.value?.resetFields()
}

function handleSubmit(values: any) {
  console.log('表单提交：', values)
  formVisible.value = false
}
</script>
```

### 2. 带搜索的表格

```vue
<template>
  <div class="demo">
    <CleverTable
      :columns="columns"
      :api-config="apiConfig"
      :search-config="searchConfig"
      :actions="actions"
    />
  </div>
</template>

<script setup lang="ts">
import { CleverTable } from 'clever-component'
import type { TableColumn, TableAction, SearchConfig, ApiConfig } from 'clever-component'

const columns: TableColumn[] = [
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'department', title: '部门', width: 120 }
]

const actions: TableAction[] = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: (record) => {
      console.log('编辑：', record)
    }
  }
]

const searchConfig: SearchConfig = {
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
          { label: '产品部', value: '产品部' }
        ]
      }
    }
  ]
}

const apiConfig: ApiConfig = {
  listApi: async (params) => {
    // 模拟 API 调用
    console.log('查询参数：', params)
    
    // 返回模拟数据
    return {
      code: 0,
      message: '成功',
      data: {
        list: [
          { id: 1, name: '张三', email: 'zhangsan@example.com', department: '技术部' },
          { id: 2, name: '李四', email: 'lisi@example.com', department: '产品部' }
        ],
        total: 2
      }
    }
  }
}
</script>
```

### 3. 完整的 CRUD 示例

```vue
<template>
  <div class="demo">
    <!-- 用户管理表格 -->
    <CleverTable
      ref="tableRef"
      :columns="columns"
      :api-config="apiConfig"
      :search-config="searchConfig"
      :actions="actions"
      :header-actions="headerActions"
      :show-selection-column="true"
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
import type { TableColumn, TableAction, HeaderAction, SearchConfig, ApiConfig, FormSchema } from 'clever-component'

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
  { key: 'department', title: '部门', width: 120 }
]

// 行操作
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

// 头部操作
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

// 搜索配置
const searchConfig: SearchConfig = {
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

// API 配置
const apiConfig: ApiConfig = {
  listApi: async (params) => {
    // 实际项目中替换为真实 API
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        { label: '产品部', value: '产品部' }
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
    message.success('用户信息更新成功')
  } else {
    message.success('用户添加成功')
  }
  formVisible.value = false
  tableRef.value?.handleRefresh()
}
</script>
```

## 配置说明

### TypeScript 支持

组件库完全使用 TypeScript 编写，提供完整的类型定义：

```typescript
import type {
  FormSchema,
  TableColumn,
  TableAction,
  HeaderAction,
  SearchConfig,
  ApiConfig,
  PopupOption
} from 'clever-component'
```

### 样式定制

组件库基于 Naive UI，可以通过 Naive UI 的主题系统进行样式定制：

```typescript
import { createApp } from 'vue'
import {
  create,
  NConfigProvider,
  NButton,
  NInput,
  // ... 其他组件
} from 'naive-ui'

const naive = create({
  components: [NConfigProvider, NButton, NInput]
})

const app = createApp(App)
app.use(naive)
```

### 国际化

组件库支持国际化，默认为中文：

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'
import zhCN from 'clever-component/locale/zh-CN'
import enUS from 'clever-component/locale/en-US'

const app = createApp(App)
app.use(CleverComponent, {
  locale: zhCN // 或 enUS
})
```

## 常见问题

### Q: 如何处理表单验证？

A: 在 FormSchema 中配置 `rules` 属性：

```typescript
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

### Q: 如何自定义表格列渲染？

A: 使用 `render` 函数：

```typescript
const columns: TableColumn[] = [
  {
    key: 'status',
    title: '状态',
    render: (record) => {
      return h('n-tag', {
        type: record.status === 'active' ? 'success' : 'warning'
      }, () => record.status === 'active' ? '激活' : '禁用')
    }
  }
]
```

### Q: 如何处理 API 错误？

A: 在 API 函数中进行错误处理：

```typescript
const apiConfig: ApiConfig = {
  listApi: async (params) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('API 请求失败：', error)
      throw error
    }
  }
}
```

## 下一步

- 查看 [完整 API 文档](./api.md)
- 查看 [示例代码](../play/src/demo/)
- 了解 [最佳实践](./README.md#最佳实践)
- 参与 [贡献指南](../CONTRIBUTING.md)

---

如果您在使用过程中遇到问题，请查看 [常见问题](./README.md#常见问题) 或提交 [Issue](https://github.com/your-repo/clever-component/issues)。