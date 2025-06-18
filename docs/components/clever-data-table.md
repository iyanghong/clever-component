# CleverDataTable 数据表格

高性能的数据表格组件，支持虚拟滚动、树形数据、导出等高级功能。

## 基础用法

基础的数据表格展示用法。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="columns"
      :data="data"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CleverDataTable } from '@clever-component/components'

const loading = ref(false)

const columns = [
  {
    key: 'id',
    title: 'ID',
    width: 80
  },
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
    key: 'department',
    title: '部门',
    width: 150
  },
  {
    key: 'salary',
    title: '薪资',
    width: 120,
    render: (value) => `¥${value.toLocaleString()}`
  }
]

const data = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    department: '技术部',
    salary: 15000
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    department: '产品部',
    salary: 12000
  }
])
</script>
```

## 带搜索功能

支持全局搜索功能。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="columns"
      :data="data"
      searchable
      :search-config="searchConfig"
      @search="handleSearch"
    />
  </div>
</template>

<script setup>
const searchConfig = {
  placeholder: '搜索姓名、邮箱或部门',
  fields: ['name', 'email', 'department']
}

const handleSearch = (keyword) => {
  console.log('搜索关键词:', keyword)
  // 执行搜索逻辑
}
</script>
```

## 带操作按钮

支持行操作按钮。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="columnsWithActions"
      :data="data"
      :actions="actions"
    />
  </div>
</template>

<script setup>
const columnsWithActions = [
  ...columns,
  {
    key: 'actions',
    title: '操作',
    width: 200,
    fixed: 'right'
  }
]

const actions = [
  {
    label: '编辑',
    type: 'primary',
    icon: 'CreateOutline',
    onClick: (record) => {
      console.log('编辑:', record)
    }
  },
  {
    label: '删除',
    type: 'error',
    icon: 'TrashOutline',
    confirm: {
      title: '确认删除',
      content: '确定要删除这条记录吗？'
    },
    onClick: (record) => {
      console.log('删除:', record)
    }
  }
]
</script>
```

## 可编辑表格

支持行内编辑功能。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="editableColumns"
      :data="editableData"
      editable
      @save="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
const editableColumns = [
  {
    key: 'name',
    title: '姓名',
    editable: true,
    editType: 'input',
    rules: [{ required: true, message: '请输入姓名' }]
  },
  {
    key: 'email',
    title: '邮箱',
    editable: true,
    editType: 'input',
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  },
  {
    key: 'department',
    title: '部门',
    editable: true,
    editType: 'select',
    editOptions: [
      { label: '技术部', value: '技术部' },
      { label: '产品部', value: '产品部' },
      { label: '运营部', value: '运营部' }
    ]
  }
]

const editableData = ref([...])

const handleSave = (record, editedData) => {
  console.log('保存:', record, editedData)
  // 保存逻辑
}

const handleCancel = (record) => {
  console.log('取消编辑:', record)
}
</script>
```

## 树形数据

支持树形数据展示。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="treeColumns"
      :data="treeData"
      tree
      :tree-config="treeConfig"
    />
  </div>
</template>

<script setup>
const treeColumns = [
  {
    key: 'name',
    title: '名称',
    width: 200
  },
  {
    key: 'type',
    title: '类型',
    width: 100
  },
  {
    key: 'size',
    title: '大小',
    width: 120
  }
]

const treeData = [
  {
    id: 1,
    name: '文档',
    type: '文件夹',
    size: '-',
    children: [
      {
        id: 2,
        name: '用户手册.pdf',
        type: '文件',
        size: '2.5MB'
      },
      {
        id: 3,
        name: 'API文档.md',
        type: '文件',
        size: '156KB'
      }
    ]
  }
]

const treeConfig = {
  childrenKey: 'children',
  hasChildren: (record) => record.children && record.children.length > 0
}
</script>
```

## 虚拟滚动

支持大数据量的虚拟滚动。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="columns"
      :data="largeData"
      virtual
      :virtual-config="virtualConfig"
      :height="400"
    />
  </div>
</template>

<script setup>
const virtualConfig = {
  itemHeight: 40,
  buffer: 10
}

// 生成大量数据
const largeData = ref(
  Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    department: ['技术部', '产品部', '运营部'][index % 3],
    salary: Math.floor(Math.random() * 20000) + 8000
  }))
)
</script>
```

## 自定义筛选

支持自定义筛选功能。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="filterColumns"
      :data="data"
      :filters="filters"
      @filter-change="handleFilterChange"
    />
  </div>
</template>

<script setup>
const filterColumns = [
  {
    key: 'name',
    title: '姓名',
    filterable: true
  },
  {
    key: 'department',
    title: '部门',
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: '技术部', value: '技术部' },
      { label: '产品部', value: '产品部' },
      { label: '运营部', value: '运营部' }
    ]
  },
  {
    key: 'salary',
    title: '薪资',
    filterable: true,
    filterType: 'range'
  }
]

const filters = ref({})

const handleFilterChange = (newFilters) => {
  filters.value = newFilters
  console.log('筛选条件:', newFilters)
  // 执行筛选逻辑
}
</script>
```

## 导出功能

支持数据导出功能。

```vue
<template>
  <div>
    <CleverDataTable
      :columns="columns"
      :data="data"
      exportable
      :export-config="exportConfig"
      @export="handleExport"
    />
  </div>
</template>

<script setup>
const exportConfig = {
  filename: '员工数据',
  formats: ['xlsx', 'csv', 'json'],
  includeHeaders: true
}

const handleExport = (format, data) => {
  console.log('导出格式:', format)
  console.log('导出数据:', data)
  // 执行导出逻辑
}
</script>
```

## API

### CleverDataTable Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| columns | 表格列配置 | array | — | [] |
| data | 表格数据 | array | — | [] |
| loading | 是否加载中 | boolean | — | false |
| height | 表格高度 | string / number | — | — |
| max-height | 表格最大高度 | string / number | — | — |
| searchable | 是否显示搜索框 | boolean | — | false |
| search-config | 搜索配置 | object | — | {} |
| actions | 操作按钮配置 | array | — | [] |
| editable | 是否可编辑 | boolean | — | false |
| tree | 是否为树形表格 | boolean | — | false |
| tree-config | 树形配置 | object | — | {} |
| virtual | 是否启用虚拟滚动 | boolean | — | false |
| virtual-config | 虚拟滚动配置 | object | — | {} |
| filters | 筛选条件 | object | — | {} |
| exportable | 是否可导出 | boolean | — | false |
| export-config | 导出配置 | object | — | {} |
| pagination | 分页配置 | object / boolean | — | false |
| row-key | 行唯一标识 | string / function | — | 'id' |
| size | 表格尺寸 | string | small / medium / large | medium |
| bordered | 是否显示边框 | boolean | — | false |
| striped | 是否显示斑马纹 | boolean | — | false |

### CleverDataTable Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| row-click | 行点击事件 | (record, index) => void |
| row-dblclick | 行双击事件 | (record, index) => void |
| selection-change | 选择改变事件 | (selectedKeys, selectedRows) => void |
| sort-change | 排序改变事件 | (sorter) => void |
| filter-change | 筛选改变事件 | (filters) => void |
| search | 搜索事件 | (keyword) => void |
| save | 保存编辑事件 | (record, editedData) => void |
| cancel | 取消编辑事件 | (record) => void |
| export | 导出事件 | (format, data) => void |
| page-change | 分页改变事件 | (page, pageSize) => void |

### CleverDataTable Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| toolbar | 工具栏插槽 | — |
| empty | 空数据插槽 | — |
| loading | 加载状态插槽 | — |

### CleverDataTable Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| refresh | 刷新表格 | — |
| clearSelection | 清空选择 | — |
| selectAll | 全选 | — |
| selectRow | 选择指定行 | (key: string) => void |
| expandRow | 展开指定行 | (key: string) => void |
| collapseRow | 收起指定行 | (key: string) => void |
| scrollTo | 滚动到指定位置 | (position: number) => void |
| exportData | 导出数据 | (format: string) => void |