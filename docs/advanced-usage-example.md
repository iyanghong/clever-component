# 高级用法示例

本文档展示了优化后的动态表格和动态表单的高级用法，包括自定义ID字段名和灵活的表单布局。

## 自定义ID字段名

### 表格组件

```typescript
import type { CleverTableProps, ApiConfig } from '@clever-component/components'

// 假设数据使用 'uuid' 作为主键字段
interface UserData {
  uuid: string
  name: string
  email: string
  status: 'active' | 'inactive'
}

const userApi: ApiConfig<UserData> = {
  listApi: async (params) => {
    return await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    }).then(res => res.json())
  },
  
  getApi: async (params) => {
    // params 会包含自定义的ID字段，如 { uuid: 'xxx' }
    return await fetch(`/api/users/${params.uuid}`).then(res => res.json())
  },
  
  deleteApi: async (params) => {
    // params 会包含自定义的ID字段，如 { uuid: 'xxx' }
    return await fetch(`/api/users/${params.uuid}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },
  
  batchDeleteApi: async (params) => {
    // params 会包含自定义的ID字段数组，如 { uuids: ['xxx', 'yyy'] }
    return await fetch('/api/users/batch-delete', {
      method: 'POST',
      body: JSON.stringify(params)
    }).then(res => res.json())
  }
}

const tableProps: CleverTableProps<UserData> = {
  columns: [
    { key: 'uuid', title: 'UUID' },
    { key: 'name', title: '姓名' },
    { key: 'email', title: '邮箱' },
    { key: 'status', title: '状态' }
  ],
  apiConfig: userApi,
  idField: 'uuid', // 指定使用 'uuid' 作为主键字段
  autoLoad: true
}
```

### 表单组件

```typescript
import type { CleverFormProps, FormApiConfig, FormSchema } from '@clever-component/components'

const formApi: FormApiConfig<UserData> = {
  getApi: async (params) => {
    // params 会包含自定义的ID字段，如 { uuid: 'xxx' }
    return await fetch(`/api/users/${params.uuid}`).then(res => res.json())
  },
  
  createApi: async (data) => {
    return await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  updateApi: async (data) => {
    // data 会包含自定义的ID字段
    return await fetch(`/api/users/${data.uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }).then(res => res.json())
  }
}

const formProps: CleverFormProps<UserData> = {
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
  ],
  apiConfig: formApi,
  idField: 'uuid', // 指定使用 'uuid' 作为主键字段
  mode: 'edit',
  dataId: 'some-uuid-value'
}
```

## 灵活的表单布局

### 基础字段和分组混合使用

```typescript
import type { FormSchema, FormFieldSchema, FormGroupSchema } from '@clever-component/components'

interface UserProfileData {
  id: number
  // 基本信息
  name: string
  email: string
  phone: string
  // 地址信息
  country: string
  province: string
  city: string
  address: string
  // 个人设置
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
  notifications: boolean
}

const profileSchemas: FormSchema<UserProfileData>[] = [
  // 基础字段（不分组）
  {
    field: 'name',
    label: '用户名',
    component: 'NInput',
    required: true,
    isFull: true // 占满整行
  },
  
  // 联系信息分组
  {
    title: '联系信息',
    collapsible: true,
    defaultExpanded: true,
    columns: 2, // 分组内字段分2列显示
    fields: [
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
        field: 'phone',
        label: '手机号',
        component: 'NInput',
        required: true
      }
    ]
  },
  
  // 地址信息分组
  {
    title: '地址信息',
    collapsible: true,
    defaultExpanded: false, // 默认收起
    columns: 3, // 分组内字段分3列显示
    style: {
      marginTop: '20px'
    },
    fields: [
      {
        field: 'country',
        label: '国家',
        component: 'NSelect',
        componentProps: {
          options: [
            { label: '中国', value: 'CN' },
            { label: '美国', value: 'US' }
          ]
        }
      },
      {
        field: 'province',
        label: '省份',
        component: 'NSelect',
        componentProps: {
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' }
          ]
        }
      },
      {
        field: 'city',
        label: '城市',
        component: 'NSelect',
        componentProps: {
          options: [
            { label: '北京市', value: 'beijing' },
            { label: '上海市', value: 'shanghai' }
          ]
        }
      },
      {
        field: 'address',
        label: '详细地址',
        component: 'NInput',
        isFull: true // 占满整行
      }
    ]
  },
  
  // 个人设置分组
  {
    title: '个人设置',
    collapsible: true,
    defaultExpanded: true,
    columns: 1, // 分组内字段分1列显示
    className: 'settings-group',
    fields: [
      {
        field: 'theme',
        label: '主题',
        component: 'NRadioGroup',
        componentProps: {
          options: [
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' }
          ]
        }
      },
      {
        field: 'language',
        label: '语言',
        component: 'NSelect',
        componentProps: {
          options: [
            { label: '中文', value: 'zh' },
            { label: 'English', value: 'en' }
          ]
        }
      },
      {
        field: 'notifications',
        label: '接收通知',
        component: 'NSwitch'
      }
    ]
  }
]

const formProps: CleverFormProps<UserProfileData> = {
  schemas: profileSchemas,
  labelWidth: 100,
  mode: 'edit'
}
```

### 条件显示分组

```typescript
const conditionalSchemas: FormSchema<UserProfileData>[] = [
  {
    field: 'name',
    label: '用户名',
    component: 'NInput',
    required: true
  },
  
  // 根据条件显示的分组
  {
    title: '高级设置',
    collapsible: true,
    defaultExpanded: false,
    columns: 2,
    // 只有管理员才能看到这个分组
    ifShow: (formModel, methods) => {
      return formModel.role === 'admin'
    },
    fields: [
      {
        field: 'permissions',
        label: '权限',
        component: 'NCheckboxGroup',
        componentProps: {
          options: [
            { label: '读取', value: 'read' },
            { label: '写入', value: 'write' },
            { label: '删除', value: 'delete' }
          ]
        }
      },
      {
        field: 'maxConnections',
        label: '最大连接数',
        component: 'NInputNumber',
        componentProps: {
          min: 1,
          max: 100
        }
      }
    ]
  }
]
```

### 动态分组

```typescript
// 根据数据动态生成分组
function generateDynamicSchemas(categories: string[]): FormSchema<any>[] {
  const schemas: FormSchema<any>[] = []
  
  // 基础信息
  schemas.push({
    field: 'name',
    label: '名称',
    component: 'NInput',
    required: true
  })
  
  // 为每个分类创建一个分组
  categories.forEach((category, index) => {
    schemas.push({
      title: `${category}配置`,
      collapsible: true,
      defaultExpanded: index === 0, // 第一个分组默认展开
      columns: 2,
      fields: [
        {
          field: `${category}_enabled`,
          label: '启用',
          component: 'NSwitch'
        },
        {
          field: `${category}_value`,
          label: '值',
          component: 'NInput',
          ifShow: (formModel) => formModel[`${category}_enabled`]
        }
      ]
    })
  })
  
  return schemas
}

const dynamicSchemas = generateDynamicSchemas(['基础', '高级', '扩展'])
```

## 类型安全的辅助函数

### 字段类型检查

```typescript
// 类型安全的字段检查函数
function isFieldSchema<T>(schema: FormSchema<T>): schema is FormFieldSchema<T> {
  return 'field' in schema
}

function isGroupSchema<T>(schema: FormSchema<T>): schema is FormGroupSchema<T> {
  return 'title' in schema && 'fields' in schema
}

// 使用示例
function processSchemas<T>(schemas: FormSchema<T>[]) {
  schemas.forEach(schema => {
    if (isFieldSchema(schema)) {
      console.log('处理字段:', schema.field)
    } else if (isGroupSchema(schema)) {
      console.log('处理分组:', schema.title)
      schema.fields.forEach(field => {
        console.log('  - 字段:', field.field)
      })
    }
  })
}
```

### 表单验证辅助

```typescript
// 为分组字段添加统一验证
function addGroupValidation<T>(
  groupSchema: FormGroupSchema<T>,
  rules: Record<string, any>
): FormGroupSchema<T> {
  return {
    ...groupSchema,
    fields: groupSchema.fields.map(field => ({
      ...field,
      rules: field.rules || rules[field.field as string]
    }))
  }
}

// 使用示例
const validationRules = {
  email: [{ required: true, type: 'email', message: '请输入有效的邮箱地址' }],
  phone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]
}

const validatedContactGroup = addGroupValidation(contactGroup, validationRules)
```

## 最佳实践

### 1. 合理使用分组
- 相关字段放在同一分组
- 控制分组数量，避免过度嵌套
- 为分组提供清晰的标题

### 2. 响应式布局
- 根据屏幕尺寸调整列数
- 重要字段可以设置 `isFull: true`
- 使用 `giProps` 进行精细控制

### 3. 性能优化
- 使用 `ifShow` 进行条件渲染
- 避免在 `onChange` 中执行重操作
- 合理使用 `defaultExpanded` 控制初始状态

### 4. 用户体验
- 提供清晰的分组标题
- 合理设置默认展开状态
- 使用收缩功能减少页面长度