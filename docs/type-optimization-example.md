# 类型优化使用示例

本文档展示了如何使用优化后的动态表格和动态表单类型定义。

## 表格类型优化

### 基础用法

```typescript
import type { CleverTableProps, ApiConfig } from '@clever-component/components'
import type { GetPageApiFn, CreateApiFn, UpdateApiFn, DeleteApiFn } from '@clever-component/types'

// 定义数据类型
interface UserData {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive'
}

// 定义API函数
const userApi: ApiConfig<UserData> = {
  listApi: async (params) => {
    // 返回类型自动推断为 ResponseBaseModel<PageResponseModel<UserData>>
    return await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    }).then(res => res.json())
  },
  
  getApi: async ({ id }) => {
    // 返回类型自动推断为 ResponseBaseModel<UserData>
    return await fetch(`/api/users/${id}`).then(res => res.json())
  },
  
  createApi: async (data) => {
    // 参数类型自动推断为 UserData
    return await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  updateApi: async (data) => {
    // 参数类型自动推断为 UserData & { id: string | number }
    return await fetch(`/api/users/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  deleteApi: async ({ id }) => {
    // 参数类型自动推断为 { id: string | number }
    return await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  }
}

// 表格配置
const tableProps: CleverTableProps<UserData> = {
  columns: [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '姓名' },
    { key: 'email', title: '邮箱' },
    { key: 'age', title: '年龄' },
    { key: 'status', title: '状态' }
  ],
  apiConfig: userApi,
  autoLoad: true,
  paginationConfig: {
    show: true,
    pageSize: 10
  }
}
```

## 表单类型优化

### 基础用法

```typescript
import type { CleverFormProps, FormApiConfig, FormSchema } from '@clever-component/components'

// 使用相同的 UserData 类型
interface UserData {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive'
}

// 定义表单API
const formApi: FormApiConfig<UserData> = {
  getApi: async ({ id }) => {
    // 获取单条数据用于编辑
    return await fetch(`/api/users/${id}`).then(res => res.json())
  },
  
  createApi: async (data) => {
    // 创建新数据
    return await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  updateApi: async (data) => {
    // 更新数据
    return await fetch(`/api/users/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }).then(res => res.json())
  }
}

// 表单配置
const formSchemas: FormSchema<UserData>[] = [
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
    required: true,
    componentProps: {
      type: 'email'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    required: true
  },
  {
    field: 'status',
    label: '状态',
    component: 'NSelect',
    componentProps: {
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

const formProps: CleverFormProps<UserData> = {
  schemas: formSchemas,
  apiConfig: formApi,
  mode: 'create', // 'create' | 'edit' | 'view'
  labelWidth: 80
}
```

## 类型安全优势

### 1. 自动类型推断
- API函数的参数和返回值类型自动推断
- 表单字段名称类型检查
- 数据结构一致性保证

### 2. 编译时错误检查
```typescript
// ❌ 错误：字段名不存在
const wrongSchema: FormSchema<UserData> = {
  field: 'nonExistentField', // TypeScript 会报错
  label: '不存在的字段',
  component: 'NInput'
}

// ❌ 错误：API返回类型不匹配
const wrongApi: ApiConfig<UserData> = {
  listApi: async () => {
    return { data: 'wrong type' } // TypeScript 会报错
  }
}
```

### 3. 智能代码提示
- IDE 会提供准确的字段名自动完成
- API 函数参数提示
- 返回值类型提示

## 迁移指南

### 从旧版本迁移

1. **更新类型导入**
```typescript
// 旧版本
import type { CleverTableProps } from '@clever-component/components'

// 新版本
import type { CleverTableProps } from '@clever-component/components'
// 添加泛型参数
const props: CleverTableProps<YourDataType> = { ... }
```

2. **更新API配置**
```typescript
// 旧版本
const apiConfig = {
  listApi: (params: any) => Promise<any>
}

// 新版本
const apiConfig: ApiConfig<YourDataType> = {
  listApi: (params) => Promise<ResponseBaseModel<PageResponseModel<YourDataType>>>
}
```

3. **更新表单配置**
```typescript
// 旧版本
const schemas: FormSchema[] = [...]

// 新版本
const schemas: FormSchema<YourDataType>[] = [...]
```

## 最佳实践

1. **定义清晰的数据接口**
```typescript
interface UserData {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}
```

2. **使用统一的API响应格式**
```typescript
// 确保API返回格式符合 ResponseBaseModel
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}
```

3. **利用类型守卫**
```typescript
function isValidUserData(data: any): data is UserData {
  return data && typeof data.id === 'number' && typeof data.name === 'string'
}
```

4. **组合使用表格和表单**
```typescript
// 共享相同的数据类型和API配置
const sharedApiConfig = {
  // ... API 配置
}

const tableProps: CleverTableProps<UserData> = {
  apiConfig: sharedApiConfig,
  // ... 其他配置
}

const formProps: CleverFormProps<UserData> = {
  apiConfig: {
    getApi: sharedApiConfig.getApi,
    createApi: sharedApiConfig.createApi,
    updateApi: sharedApiConfig.updateApi
  },
  // ... 其他配置
}
```