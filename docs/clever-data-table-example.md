# CleverDataTable 使用示例

`CleverDataTable` 是一个功能强大的数据表格组件，集成了表格展示、搜索、分页、表单编辑等功能，只需要通过 JSON 配置即可快速实现完整的增删改查功能。

## 基础用法

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :api-config="apiConfig"
    :form-config="formConfig"
    :search-config="searchConfig"
    :show-selection-column="true"
    :show-index-column="true"
  />
</template>

<script setup lang="ts">
import { CleverDataTable } from '@/components'
import type { DataTableApiConfig, DataTableFormConfig } from '@/components'

// 表格列配置
const columns = [
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'phone',
    title: '电话',
    width: 150
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row) => {
      return row.status === 1 ? '启用' : '禁用'
    }
  },
  {
    key: 'createTime',
    title: '创建时间',
    width: 180
  }
]

// API 配置
const apiConfig: DataTableApiConfig = {
  listApi: async (params) => {
    // 调用列表查询接口
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  },
  createApi: async (data) => {
    // 调用创建接口
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },
  updateApi: async (data) => {
    // 调用更新接口
    const response = await fetch(`/api/users/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },
  deleteApi: async (id) => {
    // 调用删除接口
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },
  batchDeleteApi: async (ids) => {
    // 调用批量删除接口
    const response = await fetch('/api/users/batch-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
    return response.json()
  }
}

// 表单配置
const formConfig: DataTableFormConfig = {
  title: '用户信息',
  createTitle: '新增用户',
  editTitle: '编辑用户',
  mode: 'modal',
  width: 600,
  schemas: [
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
      field: 'phone',
      label: '电话',
      component: 'NInput',
      componentProps: {
        placeholder: '请输入电话'
      }
    },
    {
      field: 'status',
      label: '状态',
      component: 'NSelect',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    }
  ]
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
      field: 'email',
      label: '邮箱',
      component: 'NInput',
      componentProps: {
        placeholder: '请输入邮箱'
      }
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
</script>
```

## 高级用法

### 自定义操作按钮

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :api-config="apiConfig"
    :form-config="formConfig"
    :header-actions="headerActions"
    :actions="actions"
  />
</template>

<script setup lang="ts">
import { ViewOutline, DownloadOutline } from '@vicons/ionicons5'

// 表头操作按钮
const headerActions = [
  {
    key: 'export',
    label: '导出',
    type: 'default',
    icon: DownloadOutline,
    onClick: () => {
      console.log('导出数据')
    }
  }
]

// 行操作按钮
const actions = [
  {
    key: 'view',
    label: '查看',
    type: 'info',
    icon: ViewOutline,
    onClick: (record) => {
      console.log('查看详情', record)
    }
  }
]
</script>
```

### 表单分组布局

```vue
<script setup lang="ts">
const formConfig: DataTableFormConfig = {
  title: '用户信息',
  mode: 'drawer',
  width: 800,
  schemas: [
    {
      type: 'group',
      title: '基本信息',
      collapsible: true,
      defaultExpanded: true,
      cols: 2,
      schemas: [
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
    },
    {
      type: 'group',
      title: '联系信息',
      collapsible: true,
      defaultExpanded: true,
      cols: 1,
      schemas: [
        {
          field: 'phone',
          label: '电话',
          component: 'NInput'
        },
        {
          field: 'address',
          label: '地址',
          component: 'NInput',
          componentProps: {
            type: 'textarea',
            rows: 3
          }
        }
      ]
    }
  ]
}
</script>
```

### 自定义 ID 字段

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :api-config="apiConfig"
    :form-config="formConfig"
    id-field="userId"
    row-key="userId"
  />
</template>
```

### 数据处理钩子

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :api-config="apiConfig"
    :form-config="formConfig"
    :before-load="beforeLoad"
    :after-load="afterLoad"
    :before-submit="beforeSubmit"
    :after-submit="afterSubmit"
    :before-delete="beforeDelete"
    :after-delete="afterDelete"
  />
</template>

<script setup lang="ts">
// 数据加载前处理
function beforeLoad(params: any) {
  console.log('加载前参数:', params)
  // 可以修改请求参数
  return {
    ...params,
    timestamp: Date.now()
  }
}

// 数据加载后处理
function afterLoad(data: any) {
  console.log('加载后数据:', data)
  // 可以处理返回的数据
  return data
}

// 表单提交前处理
function beforeSubmit(values: Record<string, any>, type: 'create' | 'update') {
  console.log('提交前数据:', values, type)
  // 可以修改提交的数据
  return {
    ...values,
    updateTime: new Date().toISOString()
  }
}

// 表单提交后处理
function afterSubmit(response: any, type: 'create' | 'update') {
  console.log('提交后响应:', response, type)
}

// 删除前确认
function beforeDelete(record: any) {
  console.log('删除前确认:', record)
  // 返回 false 可以阻止删除
  return true
}

// 删除后处理
function afterDelete(response: any) {
  console.log('删除后响应:', response)
}
</script>
```

## API 参考

### CleverDataTableProps

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `TableColumn[]` | - | 表格列配置 |
| data | `any[]` | `[]` | 表格数据 |
| loading | `boolean` | `false` | 加载状态 |
| autoLoad | `boolean` | `true` | 是否自动加载数据 |
| apiConfig | `DataTableApiConfig` | `{}` | API 配置 |
| formConfig | `DataTableFormConfig` | `{}` | 表单配置 |
| searchConfig | `SearchConfig` | `{}` | 搜索配置 |
| paginationConfig | `PaginationConfig` | - | 分页配置 |
| headerActions | `HeaderAction[]` | `[]` | 表头操作 |
| actions | `TableAction[]` | `[]` | 行操作 |
| checkedRowKeys | `(string \| number)[]` | `[]` | 选中的行键 |
| rowKey | `string` | `'id'` | 行键字段名 |
| idField | `string` | `'id'` | ID字段名 |
| showIndexColumn | `boolean` | `false` | 是否显示序号列 |
| showSelectionColumn | `boolean` | `false` | 是否显示选择列 |
| showActionColumn | `boolean` | `true` | 是否显示操作列 |

### DataTableApiConfig

| 参数 | 类型 | 说明 |
|------|------|------|
| listApi | `ApiFn` | 列表查询API |
| createApi | `ApiFn` | 创建API |
| updateApi | `ApiFn` | 更新API |
| deleteApi | `ApiFn` | 删除API |
| batchDeleteApi | `ApiFn` | 批量删除API |
| getApi | `ApiFn` | 详情查询API |

### DataTableFormConfig

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | - | 表单标题 |
| createTitle | `string` | - | 创建时的标题 |
| editTitle | `string` | - | 编辑时的标题 |
| mode | `'modal' \| 'drawer'` | `'modal'` | 表单模式 |
| width | `string \| number` | - | 表单宽度 |
| height | `string \| number` | - | 表单高度 |
| schemas | `FormSchema[]` | - | 表单配置 |
| formProps | `Partial<CleverFormProps>` | - | 表单属性 |

### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| handleRefresh | - | `Promise<void>` | 刷新数据 |
| handleCreate | - | `void` | 创建数据 |
| handleEdit | `record: any` | `void` | 编辑数据 |
| handleDelete | `record: any` | `Promise<void>` | 删除数据 |
| handleBatchDelete | - | `Promise<void>` | 批量删除 |
| setCheckedRowKeys | `keys: (string \| number)[]` | `void` | 设置选中行 |
| getCheckedRowKeys | - | `(string \| number)[]` | 获取选中行 |
| updateSearchParams | `params: any` | `void` | 更新搜索参数 |
| getTableData | - | `any[]` | 获取表格数据 |
| setTableData | `data: any[]` | `void` | 设置表格数据 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:checkedRowKeys | `keys: (string \| number)[]` | 选中行变化 |
| action-click | `action: string, record: any, index: number` | 操作按钮点击 |
| header-action-click | `action: string` | 表头操作按钮点击 |
| row-click | `record: any, index: number` | 行点击 |
| selection-change | `keys: (string \| number)[]` | 选择变化 |
| form-submit | `values: Record<string, any>, type: 'create' \| 'update'` | 表单提交 |
| form-cancel | - | 表单取消 |
| data-change | `data: any[]` | 数据变化 |