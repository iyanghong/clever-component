# CleverTable 智能表格

功能丰富的智能表格组件，支持排序、筛选、分页、编辑等功能。

## 基础用法

基础的表格展示用法。

```vue
<template>
  <div>
    <CleverTable
      :columns="columns"
      :data="data"
    />
  </div>
</template>

<script setup>
import { CleverTable } from '@clever-component/components'

const columns = [
  {
    key: 'name',
    title: '姓名',
    width: 100
  },
  {
    key: 'age',
    title: '年龄',
    width: 80
  },
  {
    key: 'address',
    title: '地址'
  }
]

const data = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区'
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区'
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '广州市天河区'
  }
]
</script>
```

## 带分页

支持分页功能的表格。

```vue
<template>
  <div>
    <CleverTable
      :columns="columns"
      :data="data"
      :pagination="pagination"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
})

const handlePageChange = (page, pageSize) => {
  pagination.value.page = page
  pagination.value.pageSize = pageSize
  // 重新加载数据
  loadData()
}

const loadData = () => {
  // 加载数据逻辑
}
</script>
```

## 行选择

支持行选择功能。

```vue
<template>
  <div>
    <CleverTable
      :columns="columns"
      :data="data"
      :row-selection="rowSelection"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script setup>
const rowSelection = {
  type: 'checkbox', // 'checkbox' | 'radio'
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    console.log('选中的行:', selectedRowKeys, selectedRows)
  }
}

const handleSelectionChange = (selectedRowKeys, selectedRows) => {
  console.log('选择改变:', selectedRowKeys, selectedRows)
}
</script>
```

## 排序和筛选

支持列排序和筛选功能。

```vue
<template>
  <div>
    <CleverTable
      :columns="sortableColumns"
      :data="data"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    />
  </div>
</template>

<script setup>
const sortableColumns = [
  {
    key: 'name',
    title: '姓名',
    sortable: true,
    filterable: true,
    filterOptions: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' }
    ]
  },
  {
    key: 'age',
    title: '年龄',
    sortable: true,
    sorter: (a, b) => a.age - b.age
  },
  {
    key: 'address',
    title: '地址',
    filterable: true
  }
]

const handleSortChange = (sorter) => {
  console.log('排序改变:', sorter)
}

const handleFilterChange = (filters) => {
  console.log('筛选改变:', filters)
}
</script>
```

## 可编辑表格

支持单元格编辑功能。

```vue
<template>
  <div>
    <CleverTable
      :columns="editableColumns"
      :data="editableData"
      editable
      @cell-edit="handleCellEdit"
    />
  </div>
</template>

<script setup>
const editableColumns = [
  {
    key: 'name',
    title: '姓名',
    editable: true,
    editType: 'input'
  },
  {
    key: 'age',
    title: '年龄',
    editable: true,
    editType: 'number'
  },
  {
    key: 'status',
    title: '状态',
    editable: true,
    editType: 'select',
    editOptions: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
]

const editableData = ref([
  { key: '1', name: '张三', age: 32, status: 'active' },
  { key: '2', name: '李四', age: 28, status: 'inactive' }
])

const handleCellEdit = (record, key, value) => {
  console.log('单元格编辑:', record, key, value)
  // 更新数据
  const index = editableData.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    editableData.value[index][key] = value
  }
}
</script>
```

## 展开行

支持行展开功能。

```vue
<template>
  <div>
    <CleverTable
      :columns="columns"
      :data="data"
      expandable
      @expand="handleExpand"
    >
      <template #expand="{ record }">
        <div style="padding: 16px;">
          <p>详细信息：</p>
          <p>ID: {{ record.key }}</p>
          <p>描述: {{ record.description }}</p>
        </div>
      </template>
    </CleverTable>
  </div>
</template>

<script setup>
const handleExpand = (expanded, record) => {
  console.log('展开状态:', expanded, record)
}
</script>
```

## 固定列

支持固定列功能。

```vue
<template>
  <div>
    <CleverTable
      :columns="fixedColumns"
      :data="data"
      :scroll="{ x: 1200 }"
    />
  </div>
</template>

<script setup>
const fixedColumns = [
  {
    key: 'name',
    title: '姓名',
    width: 100,
    fixed: 'left'
  },
  {
    key: 'age',
    title: '年龄',
    width: 100
  },
  {
    key: 'address',
    title: '地址',
    width: 200
  },
  {
    key: 'phone',
    title: '电话',
    width: 150
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'action',
    title: '操作',
    width: 120,
    fixed: 'right'
  }
]
</script>
```

## API

### CleverTable Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| columns | 表格列的配置 | array | — | [] |
| data | 数据数组 | array | — | [] |
| loading | 页面是否加载中 | boolean | — | false |
| pagination | 分页配置 | object / boolean | — | false |
| row-selection | 行选择配置 | object | — | — |
| scroll | 表格滚动配置 | object | — | — |
| size | 表格大小 | string | small / medium / large | medium |
| bordered | 是否展示外边框和列边框 | boolean | — | false |
| striped | 是否显示斑马纹 | boolean | — | false |
| hoverable | 是否显示悬浮效果 | boolean | — | true |
| editable | 是否可编辑 | boolean | — | false |
| expandable | 是否可展开 | boolean | — | false |
| row-key | 表格行 key 的取值 | string / function | — | 'key' |
| empty-text | 空数据时显示的文本 | string | — | '暂无数据' |

### CleverTable Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| row-click | 点击行时触发 | (record, index) => void |
| row-dblclick | 双击行时触发 | (record, index) => void |
| selection-change | 选择项发生变化时触发 | (selectedRowKeys, selectedRows) => void |
| sort-change | 排序发生变化时触发 | (sorter) => void |
| filter-change | 筛选发生变化时触发 | (filters) => void |
| page-change | 分页发生变化时触发 | (page, pageSize) => void |
| cell-edit | 单元格编辑时触发 | (record, key, value) => void |
| expand | 展开行时触发 | (expanded, record) => void |

### CleverTable Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| expand | 展开行内容 | { record, index } |
| empty | 空数据时的内容 | — |

### Column 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| key | 列数据在数据项中对应的路径 | string | — | — |
| title | 列头显示文字 | string | — | — |
| width | 列宽度 | string / number | — | — |
| minWidth | 最小列宽度 | string / number | — | — |
| maxWidth | 最大列宽度 | string / number | — | — |
| align | 设置列的对齐方式 | string | left / center / right | left |
| fixed | 列是否固定 | string / boolean | left / right / true | false |
| sortable | 是否可排序 | boolean | — | false |
| sorter | 排序函数 | function | — | — |
| filterable | 是否可筛选 | boolean | — | false |
| filterOptions | 筛选选项 | array | — | [] |
| editable | 是否可编辑 | boolean | — | false |
| editType | 编辑类型 | string | input / select / number / date | input |
| editOptions | 编辑选项（select 类型） | array | — | [] |
| render | 自定义渲染函数 | function | — | — |