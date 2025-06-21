# CleverTable 组件

一个功能强大的 Vue 3 数据表格组件，提供完整的 CRUD（增删改查）功能。

## 特性

- 🚀 **智能操作列** - 根据 API 配置自动生成操作按钮
- 📝 **灵活表单模式** - 支持新增、编辑、查看三种模式
- 🔍 **高级搜索** - 可折叠的搜索表单
- 📄 **智能分页** - 支持全量和分页两种数据加载方式
- 🎯 **类型安全** - 完整的 TypeScript 类型支持
- 🔧 **高度可配置** - 丰富的配置选项

## 基础用法

```vue
<template>
  <CleverTable
    :columns="columns"
    :api-config="apiConfig"
    :action-config="actionConfig"
    @form-open="handleFormOpen"
  />
</template>

<script setup lang="ts">
import { CleverTable, FormMode } from '@clever-component/components'
import type { TableColumn, ApiConfig, ActionConfig } from '@clever-component/components'

// 表格列配置
const columns: TableColumn[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 }
]

// API 配置
const apiConfig: ApiConfig = {
  getPageApi: async (params) => {
    // 分页查询接口
    return await api.getUsers(params)
  },
  getApi: async (id) => {
    // 获取详情接口
    return await api.getUserById(id)
  },
  createApi: async (data) => {
    // 创建接口
    return await api.createUser(data)
  },
  updateApi: async (data) => {
    // 更新接口
    return await api.updateUser(data)
  },
  deleteApi: async (id) => {
    // 删除接口
    return await api.deleteUser(id)
  }
}

// 操作列配置
const actionConfig: ActionConfig = {
  showView: true,
  showEdit: true,
  showDelete: true
}

// 处理表单打开
function handleFormOpen(mode: FormMode, record?: any) {
  // 处理表单打开逻辑
}
</script>
```

## API 配置

### ApiConfig

| 属性 | 类型 | 说明 |
|------|------|------|
| getAllApi | `(params: any) => Promise<ApiResponse>` | 全量数据查询接口 |
| getPageApi | `(params: any) => Promise<ApiResponse>` | 分页数据查询接口 |
| getApi | `(id: string \| number) => Promise<ApiResponse>` | 获取详情接口 |
| createApi | `(data: any) => Promise<ApiResponse>` | 创建数据接口 |
| updateApi | `(data: any) => Promise<ApiResponse>` | 更新数据接口 |
| deleteApi | `(id: string \| number) => Promise<ApiResponse>` | 删除数据接口 |
| batchDeleteApi | `(ids: (string \| number)[]) => Promise<ApiResponse>` | 批量删除接口 |

### 数据加载策略

组件会根据配置的 API 自动选择数据加载策略：

1. **分页模式**：优先使用 `getPageApi`，支持分页参数
2. **全量模式**：使用 `getAllApi`，一次性加载所有数据

```typescript
// 分页模式
const apiConfig = {
  getPageApi: async (params) => {
    // params 包含: { page, pageSize, ...searchParams }
    return await api.getUsers(params)
  }
}

// 全量模式
const apiConfig = {
  getAllApi: async (params) => {
    // params 包含: { ...searchParams }
    return await api.getAllUsers(params)
  }
}
```

## 操作列配置

### ActionConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| show | `boolean` | `true` | 是否显示操作列 |
| title | `string` | `'操作'` | 操作列标题 |
| width | `number` | `120` | 操作列宽度 |
| align | `'left' \| 'center' \| 'right'` | `'center'` | 对齐方式 |
| fixed | `'left' \| 'right'` | - | 固定位置 |
| showView | `boolean` | `true` | 显示查看按钮 |
| showEdit | `boolean` | `true` | 显示编辑按钮 |
| showDelete | `boolean` | `true` | 显示删除按钮 |
| viewText | `string` | `'查看'` | 查看按钮文本 |
| editText | `string` | `'编辑'` | 编辑按钮文本 |
| deleteText | `string` | `'删除'` | 删除按钮文本 |
| viewProps | `object` | - | 查看按钮属性 |
| editProps | `object` | - | 编辑按钮属性 |
| deleteProps | `object` | - | 删除按钮属性 |
| customButtons | `TableAction[]` | - | 自定义按钮 |

### 智能操作列

组件会根据 API 配置自动显示相应的操作按钮：

```typescript
const actionConfig: ActionConfig = {
  // 自动根据 API 配置显示按钮
  // 有 getApi 时显示查看按钮
  // 有 updateApi 时显示编辑按钮
  // 有 deleteApi 时显示删除按钮
  
  // 自定义按钮
  customButtons: [
    {
      key: 'custom',
      label: '自定义操作',
      type: 'warning',
      handler: (record) => {
        console.log('自定义操作', record)
      }
    }
  ]
}
```

## 表单模式

### FormMode 枚举

```typescript
enum FormMode {
  CREATE = 'create',  // 新增模式
  EDIT = 'edit',      // 编辑模式
  VIEW = 'view'       // 查看模式
}
```

### 表单事件处理

```typescript
function handleFormOpen(mode: FormMode, record?: any) {
  switch (mode) {
    case FormMode.CREATE:
      // 处理新增
      showCreateForm()
      break
    case FormMode.EDIT:
      // 处理编辑
      showEditForm(record)
      break
    case FormMode.VIEW:
      // 处理查看
      showViewForm(record)
      break
  }
}
```

## 搜索配置

```typescript
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
      field: 'status',
      label: '状态',
      component: 'NSelect',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    }
  ]
}
```

## 完整示例

```vue
<template>
  <div class="user-management">
    <CleverTable
      ref="tableRef"
      :columns="columns"
      :api-config="apiConfig"
      :action-config="actionConfig"
      :search-config="searchConfig"
      :pagination-config="paginationConfig"
      show-selection-column
      show-index-column
      @form-open="handleFormOpen"
    />
    
    <!-- 表单弹窗 -->
    <UserFormModal
      v-model:show="showForm"
      :mode="formMode"
      :data="formData"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CleverTable, FormMode } from '@clever-component/components'
import type { 
  TableColumn, 
  ApiConfig, 
  ActionConfig, 
  SearchConfig,
  PaginationConfig 
} from '@clever-component/components'
import UserFormModal from './UserFormModal.vue'
import * as userApi from '@/api/user'

const tableRef = ref()
const showForm = ref(false)
const formMode = ref<FormMode>(FormMode.CREATE)
const formData = ref({})

// 表格列配置
const columns: TableColumn[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'phone', title: '电话', width: 150 },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (record) => record.status === 1 ? '启用' : '禁用'
  },
  { key: 'createTime', title: '创建时间', width: 180 }
]

// API 配置
const apiConfig: ApiConfig = {
  getPageApi: userApi.getUserList,
  getApi: userApi.getUserById,
  createApi: userApi.createUser,
  updateApi: userApi.updateUser,
  deleteApi: userApi.deleteUser,
  batchDeleteApi: userApi.batchDeleteUsers
}

// 操作列配置
const actionConfig: ActionConfig = {
  width: 200,
  customButtons: [
    {
      key: 'reset-password',
      label: '重置密码',
      type: 'warning',
      handler: (record) => handleResetPassword(record)
    }
  ]
}

// 搜索配置
const searchConfig: SearchConfig = {
  show: true,
  collapsible: true,
  schemas: [
    {
      field: 'name',
      label: '姓名',
      component: 'NInput',
      componentProps: { placeholder: '请输入姓名' }
    },
    {
      field: 'email',
      label: '邮箱',
      component: 'NInput',
      componentProps: { placeholder: '请输入邮箱' }
    },
    {
      field: 'status',
      label: '状态',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    }
  ]
}

// 分页配置
const paginationConfig: PaginationConfig = {
  show: true,
  pageSizes: [10, 20, 50, 100],
  showQuickJumper: true,
  showSizePicker: true
}

// 处理表单打开
function handleFormOpen(mode: FormMode, record?: any) {
  formMode.value = mode
  formData.value = record || {}
  showForm.value = true
}

// 处理表单成功
function handleFormSuccess() {
  showForm.value = false
  tableRef.value?.handleRefresh()
}

// 处理重置密码
function handleResetPassword(record: any) {
  // 重置密码逻辑
}
</script>
```

## 组件方法

通过 ref 可以调用组件的方法：

```typescript
const tableRef = ref()

// 刷新表格数据
tableRef.value?.handleRefresh()

// 打开表单
tableRef.value?.handleOpenForm(FormMode.CREATE)

// 获取选中的行键
const checkedKeys = tableRef.value?.getCheckedRowKeys()

// 获取选中的记录
const selectedRecords = tableRef.value?.getSelectedRecords()

// 设置选中行
tableRef.value?.setCheckedRowKeys(['1', '2'])

// 获取表格数据
const tableData = tableRef.value?.getTableData()
```

## 类型定义

```typescript
// 表格列定义
interface TableColumn {
  key: string
  title: string
  width?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  render?: (record: any, index: number) => VNode | string
  // ... 其他属性
}

// API 响应格式
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  total?: number
}

// 表格操作
interface TableAction {
  key: string
  label: string
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  ghost?: boolean
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean | ((record: any) => boolean)
  show?: boolean | ((record: any) => boolean)
  confirm?: {
    title: string
    content: string
  }
  handler: (record: any) => void
}
```

## 迁移指南

### 从旧版本迁移

如果你正在使用旧版本的 CleverTable，以下是主要的变更：

#### API 配置变更

```typescript
// 旧版本
const apiConfig = {
  listApi: api.getUsers,  // 已废弃
  // ... 其他配置
}

// 新版本
const apiConfig = {
  getPageApi: api.getUsers,  // 替换 listApi
  // 或者使用全量 API
  getAllApi: api.getAllUsers,
  // ... 其他配置
}
```

#### 操作列配置变更

```typescript
// 旧版本
<CleverTable
  :actions="actions"
  show-action-column
  action-column-title="操作"
  :action-column-width="150"
/>

// 新版本（推荐）
<CleverTable
  :action-config="{
    title: '操作',
    width: 150,
    showView: true,
    showEdit: true,
    showDelete: true
  }"
  auto-show-actions
/>
```

#### 表单事件变更

```typescript
// 旧版本
function handleFormOpen(record?: any) {
  const isEdit = !!record
  // ...
}

// 新版本
function handleFormOpen(mode: FormMode, record?: any) {
  switch (mode) {
    case FormMode.CREATE:
      // 新增逻辑
      break
    case FormMode.EDIT:
      // 编辑逻辑
      break
    case FormMode.VIEW:
      // 查看逻辑
      break
  }
}
```

## 常见问题

### Q: 如何自定义操作按钮？

A: 使用 `actionConfig.customButtons` 配置：

```typescript
const actionConfig = {
  customButtons: [
    {
      key: 'custom',
      label: '自定义',
      type: 'warning',
      handler: (record) => {
        // 自定义逻辑
      }
    }
  ]
}
```

### Q: 如何禁用某些操作按钮？

A: 使用按钮的 `disabled` 属性：

```typescript
const actionConfig = {
  editProps: {
    disabled: (record) => record.status === 0
  },
  deleteProps: {
    disabled: (record) => record.isSystem
  }
}
```

### Q: 如何处理 API 错误？

A: API 函数应该返回标准的响应格式，组件会自动处理错误：

```typescript
const apiConfig = {
  getPageApi: async (params) => {
    try {
      const response = await api.getUsers(params)
      return {
        code: 0,
        data: response.data,
        message: '查询成功'
      }
    } catch (error) {
      return {
        code: -1,
        data: null,
        message: error.message || '查询失败'
      }
    }
  }
}
```

### Q: 如何实现数据的实时更新？

A: 使用组件的 `handleRefresh` 方法：

```typescript
// 在数据变更后刷新表格
const handleDataChange = () => {
  tableRef.value?.handleRefresh()
}
```