# useForm 表单初始化功能

## 概述

`useForm` 组合式函数现在支持基于字段配置的自动初始化功能，能够根据表单字段的 `defaultValue` 属性自动初始化表单数据。

## 核心功能

### 1. 自动字段初始化

当设置表单配置时，`useForm` 会自动遍历所有字段配置，并根据每个字段的 `defaultValue` 初始化表单数据：

```typescript
import { useForm } from '@clever-component/form'
import type { FormConfig } from '@clever-component/form'

const formConfig: FormConfig = {
  layout: {
    schemas: [
      {
        field: 'username',
        label: '用户名',
        component: 'input',
        defaultValue: '', // 字符串默认值
        required: true
      },
      {
        field: 'age',
        label: '年龄',
        component: 'number-input',
        defaultValue: 18, // 数字默认值
      },
      {
        field: 'isActive',
        label: '是否激活',
        component: 'switch',
        defaultValue: true, // 布尔默认值
      },
      {
        field: 'createTime',
        label: '创建时间',
        component: 'date-picker',
        defaultValue: () => new Date(), // 函数形式的默认值
      }
    ]
  }
}

const {
  formData,
  formState,
  setConfig,
  initFormModel
} = useForm()

// 设置配置时会自动初始化表单数据
setConfig(formConfig)

// 此时 formData.value 将包含：
// {
//   username: '',
//   age: 18,
//   isActive: true,
//   createTime: new Date()
// }
```

### 2. 支持嵌套容器

`useForm` 能够递归处理嵌套的容器配置，提取所有字段：

```typescript
const nestedConfig: FormConfig = {
  layout: {
    schemas: [
      {
        type: 'grid',
        children: [
          {
            field: 'basicInfo.name',
            label: '姓名',
            component: 'input',
            defaultValue: ''
          },
          {
            field: 'basicInfo.email',
            label: '邮箱',
            component: 'input',
            defaultValue: ''
          }
        ]
      },
      {
        type: 'tabs',
        children: [
          {
            field: 'settings.theme',
            label: '主题',
            component: 'select',
            defaultValue: 'light'
          }
        ]
      }
    ]
  }
}
```

### 3. 函数式默认值

支持使用函数来动态生成默认值：

```typescript
const dynamicConfig: FormConfig = {
  layout: {
    schemas: [
      {
        field: 'id',
        label: 'ID',
        component: 'input',
        defaultValue: () => `user_${Date.now()}` // 动态生成唯一ID
      },
      {
        field: 'timestamp',
        label: '时间戳',
        component: 'number-input',
        defaultValue: () => Date.now() // 当前时间戳
      },
      {
        field: 'randomValue',
        label: '随机值',
        component: 'number-input',
        defaultValue: () => Math.random() // 随机数
      }
    ]
  }
}
```

## API 参考

### 新增方法

#### `initFormModel<T>()`

手动初始化表单模型，根据当前配置重新生成表单数据。

```typescript
const { initFormModel } = useForm()

// 手动重新初始化表单
initFormModel()
```

#### `extractFieldsFromSchemas(schemas)`

递归提取配置中的所有字段。

**参数：**
- `schemas`: `Array<FieldConfig | ContainerConfig>` - 字段或容器配置数组

**返回：**
- `FieldConfig[]` - 提取出的所有字段配置

```typescript
const { extractFieldsFromSchemas } = useForm()

const schemas = [
  { field: 'name', component: 'input', defaultValue: '' },
  {
    type: 'grid',
    children: [
      { field: 'age', component: 'number-input', defaultValue: 0 }
    ]
  }
]

const fields = extractFieldsFromSchemas(schemas)
// 返回: [{ field: 'name', ... }, { field: 'age', ... }]
```

#### `getActualSchemas()`

获取当前表单配置中的实际字段配置数组。

**返回：**
- `Array<FieldConfig | ContainerConfig>` - 当前配置的字段数组

```typescript
const { getActualSchemas } = useForm()

const schemas = getActualSchemas()
console.log('当前表单字段配置:', schemas)
```

### 新增响应式状态

#### `formItemFieldKeys`

表单字段的唯一键值映射，用于 Vue 的 key 属性优化渲染性能。

```typescript
const { formItemFieldKeys } = useForm()

// formItemFieldKeys.value 结构示例：
// {
//   'username': 'username-1703123456789',
//   'age': 'age-1703123456790',
//   'email': 'email-1703123456791'
// }
```

## 使用场景

### 1. 表单创建模式

```typescript
// 创建新用户表单
const createUserForm = useForm({
  config: {
    layout: {
      schemas: [
        {
          field: 'username',
          label: '用户名',
          component: 'input',
          defaultValue: '',
          required: true
        },
        {
          field: 'role',
          label: '角色',
          component: 'select',
          defaultValue: 'user' // 默认为普通用户
        },
        {
          field: 'isActive',
          label: '是否激活',
          component: 'switch',
          defaultValue: true // 默认激活
        }
      ]
    }
  }
})
```

### 2. 表单编辑模式

```typescript
// 编辑用户表单
const editUserForm = useForm({
  config: userFormConfig,
  initialData: {
    username: 'john_doe',
    role: 'admin',
    isActive: false
  }
})

// 初始数据会覆盖默认值
```

### 3. 动态表单配置

```typescript
const dynamicForm = useForm()

// 根据用户权限动态设置表单配置
if (userRole === 'admin') {
  dynamicForm.setConfig(adminFormConfig)
} else {
  dynamicForm.setConfig(userFormConfig)
}
```

## 最佳实践

### 1. 合理设置默认值

```typescript
// ✅ 推荐：根据字段类型设置合适的默认值
{
  field: 'name',
  component: 'input',
  defaultValue: '' // 字符串字段使用空字符串
}

{
  field: 'count',
  component: 'number-input',
  defaultValue: 0 // 数字字段使用 0
}

{
  field: 'tags',
  component: 'select',
  defaultValue: [] // 多选字段使用空数组
}
```

### 2. 使用函数式默认值处理复杂逻辑

```typescript
// ✅ 推荐：使用函数处理需要计算的默认值
{
  field: 'expireDate',
  component: 'date-picker',
  defaultValue: () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1) // 默认一个月后过期
    return date
  }
}
```

### 3. 避免在默认值中使用引用类型

```typescript
// ❌ 不推荐：直接使用对象引用
{
  field: 'config',
  component: 'custom',
  defaultValue: { theme: 'light' } // 所有实例共享同一个对象
}

// ✅ 推荐：使用函数返回新对象
{
  field: 'config',
  component: 'custom',
  defaultValue: () => ({ theme: 'light' }) // 每次返回新对象
}
```

## 注意事项

1. **默认值优先级**：`initialData` > `defaultValue` > `null`
2. **函数式默认值**：每次初始化时都会重新执行函数
3. **嵌套字段**：支持使用点号路径（如 `user.profile.name`）
4. **性能考虑**：大量字段时，建议使用 `immediate: false` 延迟初始化

## 类型安全

```typescript
interface UserForm {
  username: string
  age: number
  isActive: boolean
  profile: {
    email: string
    phone: string
  }
}

const { formData, initFormModel } = useForm<UserForm>()

// TypeScript 会提供完整的类型提示和检查
initFormModel<UserForm>()
```