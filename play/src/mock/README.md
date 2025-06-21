# Mock API 服务

这个 Mock API 服务为组件演示提供模拟数据，无需真实的后端服务即可测试所有功能。

## 功能特性

- 🚀 自动拦截 API 请求
- 📊 生成真实的模拟数据
- 🔄 支持分页、搜索、筛选等功能
- 🌐 模拟网络延迟
- 🛠️ 开发环境自动启用

## 支持的 API 接口

### 用户相关接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/users` | GET | 基础用户列表 |
| `/api/users/search` | GET | 搜索用户 |
| `/api/users/list` | GET | 带操作的用户列表 |
| `/api/users/editable` | GET | 可编辑用户列表 |
| `/api/users/update` | PUT | 更新用户信息 |
| `/api/users/large-dataset` | GET | 大数据集（虚拟滚动） |
| `/api/users/filterable` | GET | 可筛选用户列表 |
| `/api/users/exportable` | GET | 可导出用户列表 |
| `/api/users/custom-render` | GET | 自定义渲染用户列表 |

### 文件相关接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/files/tree` | GET | 文件树数据 |

## 数据结构

### 用户数据结构

```typescript
interface User {
  id: number
  name: string
  email: string
  phone: string
  department: 'tech' | 'sales' | 'marketing' | 'hr'
  status: 'active' | 'inactive' | 'banned'
  salary: number
  age: number
  address: string
  avatar: string
  performance: number // 0-100
  rating: number // 1-5
  joinDate: string // YYYY-MM-DD
  createdAt: string // ISO string
  tags: Array<{
    text: string
    type: 'default' | 'primary' | 'info' | 'success' | 'warning'
  }>
}
```

### API 响应格式

```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
```

## 使用方法

### 自动启用（推荐）

Mock 服务在开发环境下会自动启用，无需额外配置。

### 手动控制

```typescript
import {
  enableMockInterceptor,
  disableMockInterceptor,
  installMockInterceptor,
  uninstallMockInterceptor
} from '@/mock'

// 启用拦截器
enableMockInterceptor()

// 禁用拦截器
disableMockInterceptor()

// 安装拦截器
installMockInterceptor()

// 卸载拦截器
uninstallMockInterceptor()
```

### 直接调用 Mock API

```typescript
import { callMockApi } from '@/mock'

// 获取用户列表
const result = await callMockApi('/api/users', 'GET', {
  page: 1,
  pageSize: 10
})

// 更新用户
const updateResult = await callMockApi('/api/users/update', 'PUT', {}, {
  id: 1,
  name: '新名称'
})
```

## 支持的查询参数

### 分页参数
- `page`: 页码（默认: 1）
- `pageSize`: 每页数量（默认: 10）

### 搜索参数
- `name`: 姓名搜索
- `email`: 邮箱搜索
- `department`: 部门筛选
- `status`: 状态筛选
- `dateRange`: 日期范围

### 筛选参数
- `filters`: 筛选条件对象
  - `age`: 年龄范围 `[min, max]`
  - `salary`: 薪资范围 `[min, max]`
  - `department`: 部门
  - `status`: 状态

## 开发说明

### 添加新的 API

1. 在 `api.ts` 中的 `mockApi` 对象添加新的处理函数
2. 函数接收参数并返回符合格式的响应数据

```typescript
export const mockApi = {
  // 现有 API...
  
  // 新增 API
  '/api/new-endpoint': (params: any) => {
    return {
      code: 200,
      message: 'success',
      data: {
        // 你的数据
      }
    }
  }
}
```

### 修改模拟数据

修改 `generateUser` 或 `generateFileTree` 函数来自定义生成的数据结构。

### 调整网络延迟

修改 `delay` 函数的默认值来调整模拟的网络延迟时间。

## 注意事项

- Mock 服务仅在开发环境（`import.meta.env.DEV`）下启用
- 生产环境下会自动禁用，不会影响真实的 API 请求
- 所有的模拟数据都是随机生成的，刷新页面会重新生成
- 拦截器会在控制台输出请求和响应日志，便于调试