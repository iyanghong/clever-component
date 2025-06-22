# 动态表格高级搜索功能示例

本文档展示了 CleverDataTable 组件的快捷搜索和高级搜索功能的使用方法。

## 功能特性

- **快捷搜索**：提供常用的搜索字段，简化用户操作
- **高级搜索**：提供完整的搜索条件，满足复杂查询需求
- **混合模式**：同时支持快捷搜索和高级搜索，用户可按需切换
- **向下兼容**：保持对旧版本 `schemas` 配置的兼容性

## 搜索模式

### 1. 快捷搜索模式 (mode: 'quick')

只显示快捷搜索表单，适用于简单的搜索场景。

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :search-config="quickSearchConfig"
    :api-config="apiConfig"
  />
</template>

<script setup>
const quickSearchConfig = {
  show: true,
  mode: 'quick',
  quickSearch: {
    schemas: [
      {
        field: 'keyword',
        label: '关键词',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入姓名或邮箱'
        }
      },
      {
        field: 'status',
        label: '状态',
        component: 'NSelect',
        componentProps: {
          placeholder: '请选择状态',
          options: [
            { label: '全部', value: '' },
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]
        }
      }
    ]
  }
}
</script>
```

### 2. 高级搜索模式 (mode: 'advanced')

只显示高级搜索表单，适用于复杂的搜索场景。

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :search-config="advancedSearchConfig"
    :api-config="apiConfig"
  />
</template>

<script setup>
const advancedSearchConfig = {
  show: true,
  mode: 'advanced',
  advancedSearch: {
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
        field: 'department',
        label: '部门',
        component: 'NSelect',
        componentProps: {
          placeholder: '请选择部门',
          options: [
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '运营部', value: 'operation' }
          ]
        }
      },
      {
        field: 'createTime',
        label: '创建时间',
        component: 'NDatePicker',
        componentProps: {
          type: 'daterange',
          placeholder: ['开始日期', '结束日期']
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
      },
      {
        field: 'role',
        label: '角色',
        component: 'NSelect',
        componentProps: {
          placeholder: '请选择角色',
          multiple: true,
          options: [
            { label: '管理员', value: 'admin' },
            { label: '普通用户', value: 'user' },
            { label: '访客', value: 'guest' }
          ]
        }
      }
    ]
  }
}
</script>
```

### 3. 混合模式 (mode: 'both')

同时支持快捷搜索和高级搜索，用户可以通过按钮切换。默认显示快捷搜索，点击"高级搜索"按钮展开高级搜索表单。

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :search-config="bothSearchConfig"
    :api-config="apiConfig"
  />
</template>

<script setup>
const bothSearchConfig = {
  show: true,
  mode: 'both',
  searchText: '搜索',
  resetText: '重置',
  quickSearch: {
    schemas: [
      {
        field: 'keyword',
        label: '关键词',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入姓名或邮箱进行快速搜索'
        }
      },
      {
        field: 'status',
        label: '状态',
        component: 'NSelect',
        componentProps: {
          placeholder: '请选择状态',
          clearable: true,
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]
        }
      }
    ]
  },
  advancedSearch: {
    defaultVisible: false,
    toggleText: '高级搜索',
    collapseText: '收起高级搜索',
    schemas: [
      {
        field: 'name',
        label: '姓名',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入完整姓名'
        }
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入邮箱地址'
        }
      },
      {
        field: 'phone',
        label: '手机号',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入手机号码'
        }
      },
      {
        field: 'department',
        label: '部门',
        component: 'NSelect',
        componentProps: {
          placeholder: '请选择部门',
          options: [
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '运营部', value: 'operation' },
            { label: '市场部', value: 'marketing' },
            { label: '人事部', value: 'hr' }
          ]
        }
      },
      {
        field: 'position',
        label: '职位',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入职位名称'
        }
      },
      {
        field: 'createTime',
        label: '创建时间',
        component: 'NDatePicker',
        componentProps: {
          type: 'daterange',
          placeholder: ['开始日期', '结束日期'],
          format: 'yyyy-MM-dd'
        }
      },
      {
        field: 'lastLoginTime',
        label: '最后登录',
        component: 'NDatePicker',
        componentProps: {
          type: 'daterange',
          placeholder: ['开始日期', '结束日期'],
          format: 'yyyy-MM-dd'
        }
      },
      {
        field: 'role',
        label: '角色',
        component: 'NSelect',
        componentProps: {
          placeholder: '请选择角色',
          multiple: true,
          options: [
            { label: '超级管理员', value: 'super_admin' },
            { label: '管理员', value: 'admin' },
            { label: '普通用户', value: 'user' },
            { label: '访客', value: 'guest' }
          ]
        }
      }
    ]
  }
}
</script>
```

## 向下兼容

为了保持向下兼容，组件仍然支持直接在 `searchConfig` 中配置 `schemas`：

```vue
<template>
  <CleverDataTable
    :columns="columns"
    :search-config="legacySearchConfig"
    :api-config="apiConfig"
  />
</template>

<script setup>
// 旧版本配置方式，仍然有效
const legacySearchConfig = {
  show: true,
  collapsible: true,
  collapsed: false,
  searchText: '搜索',
  resetText: '重置',
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

## 配置说明

### SearchConfig 类型定义

```typescript
interface SearchConfig {
  // 基础配置
  show?: boolean                    // 是否显示搜索表单
  collapsible?: boolean            // 是否可折叠
  collapsed?: boolean              // 默认是否折叠
  searchText?: string              // 搜索按钮文本
  resetText?: string               // 重置按钮文本
  expandText?: string              // 展开按钮文本
  collapseText?: string            // 收起按钮文本
  
  // 新增配置
  mode?: 'quick' | 'advanced' | 'both'  // 搜索模式
  
  // 快捷搜索配置
  quickSearch?: {
    schemas: FormSchema[]          // 快捷搜索字段配置
    placeholder?: string           // 快捷搜索占位符
    show?: boolean                 // 是否显示快捷搜索
  }
  
  // 高级搜索配置
  advancedSearch?: {
    schemas: FormSchema[]          // 高级搜索字段配置
    defaultVisible?: boolean       // 是否默认显示高级搜索
    toggleText?: string            // 高级搜索按钮文本
    collapseText?: string          // 收起高级搜索按钮文本
  }
  
  // 向下兼容
  schemas?: FormSchema[]           // 直接配置搜索字段（旧版本兼容）
}
```

## 使用建议

1. **简单场景**：使用快捷搜索模式，提供 1-3 个常用搜索字段
2. **复杂场景**：使用高级搜索模式，提供完整的搜索条件
3. **灵活场景**：使用混合模式，让用户根据需要选择搜索方式
4. **渐进升级**：现有项目可以继续使用 `schemas` 配置，后续逐步迁移到新的配置方式

## 最佳实践

- 快捷搜索字段不宜过多，建议 2-4 个
- 高级搜索可以包含更多字段，但要注意布局合理性
- 合理设置默认值和占位符，提升用户体验
- 对于日期范围等复杂组件，建议放在高级搜索中
- 使用 `clearable` 属性让用户可以清空选择