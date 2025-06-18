<template>
  <div class="clever-table-demo">
    <n-space vertical size="large">
      <!-- 基础用法 -->
      <n-card title="基础用法">
        <CleverTable
          :columns="basicColumns"
          :data="basicData"
          :pagination="false"
        />
      </n-card>

      <!-- 带分页的表格 -->
      <n-card title="带分页的表格">
        <CleverTable
          :columns="paginationColumns"
          :data="paginationData"
          :pagination="paginationConfig"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </n-card>

      <!-- 可选择的表格 -->
      <n-card title="可选择的表格">
        <n-space vertical>
          <n-alert v-if="selectedRows.length > 0" type="info">
            已选择 {{ selectedRows.length }} 行数据：
            {{ selectedRows.map(row => row.name).join(', ') }}
          </n-alert>
          
          <CleverTable
            :columns="selectableColumns"
            :data="selectableData"
            :row-selection="rowSelection"
            @selection-change="handleSelectionChange"
          />
          
          <n-space>
            <n-button @click="selectAll">全选</n-button>
            <n-button @click="clearSelection">清空选择</n-button>
            <n-button @click="selectFirst3">选择前3行</n-button>
          </n-space>
        </n-space>
      </n-card>

      <!-- 可排序的表格 -->
      <n-card title="可排序的表格">
        <CleverTable
          :columns="sortableColumns"
          :data="sortableData"
          @sort-change="handleSortChange"
        />
        <n-alert v-if="currentSort" type="info" style="margin-top: 16px;">
          当前排序：{{ currentSort.field }} - {{ currentSort.order }}
        </n-alert>
      </n-card>

      <!-- 可筛选的表格 -->
      <n-card title="可筛选的表格">
        <CleverTable
          :columns="filterableColumns"
          :data="filterableData"
          @filter-change="handleFilterChange"
        />
        <n-alert v-if="currentFilters && Object.keys(currentFilters).length > 0" type="info" style="margin-top: 16px;">
          当前筛选：{{ JSON.stringify(currentFilters) }}
        </n-alert>
      </n-card>

      <!-- 可编辑的表格 -->
      <n-card title="可编辑的表格">
        <n-space vertical>
          <n-space>
            <n-button @click="addRow">添加行</n-button>
            <n-button @click="deleteSelectedRows" :disabled="editableSelectedRows.length === 0">
              删除选中行
            </n-button>
            <n-button @click="saveChanges">保存更改</n-button>
            <n-button @click="cancelChanges">取消更改</n-button>
          </n-space>
          
          <CleverTable
            ref="editableTableRef"
            :columns="editableColumns"
            :data="editableData"
            :row-selection="editableRowSelection"
            :editable="true"
            @cell-edit="handleCellEdit"
            @row-add="handleRowAdd"
            @row-delete="handleRowDelete"
            @selection-change="handleEditableSelectionChange"
          />
        </n-space>
      </n-card>

      <!-- 展开行表格 -->
      <n-card title="展开行表格">
        <CleverTable
          :columns="expandableColumns"
          :data="expandableData"
          :expandable="expandableConfig"
          @expand="handleExpand"
        />
      </n-card>

      <!-- 固定列表格 -->
      <n-card title="固定列表格">
        <CleverTable
          :columns="fixedColumns"
          :data="fixedData"
          :scroll="{ x: 1200 }"
        />
      </n-card>

      <!-- 自定义渲染表格 -->
      <n-card title="自定义渲染表格">
        <CleverTable
          :columns="customColumns"
          :data="customData"
        />
      </n-card>

      <!-- 加载状态表格 -->
      <n-card title="加载状态表格">
        <n-space vertical>
          <n-space>
            <n-button @click="toggleLoading">切换加载状态</n-button>
            <n-button @click="loadData">重新加载数据</n-button>
          </n-space>
          
          <CleverTable
            :columns="loadingColumns"
            :data="loadingData"
            :loading="isLoading"
          />
        </n-space>
      </n-card>

      <!-- 空数据表格 -->
      <n-card title="空数据表格">
        <CleverTable
          :columns="emptyColumns"
          :data="[]"
          empty-text="暂无数据"
        />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  NSpace,
  NCard,
  NButton,
  NAlert,
  NTag,
  NProgress,
  NAvatar,
  NIcon,
  NSwitch,
  NRate,
  NImage
} from 'naive-ui'
import {
  PersonOutline,
  MailOutline,
  CallOutline,
  LocationOutline,
  StarOutline,
  CreateOutline,
  TrashOutline
} from '@vicons/ionicons5'
import { CleverTable } from '@clever-component'
import type { TableColumn, PaginationConfig, RowSelection, ExpandableConfig } from '@clever-component'

// 基础表格
const basicColumns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'age',
    title: '年龄',
    width: 80
  },
  {
    key: 'city',
    title: '城市',
    width: 120
  },
  {
    key: 'email',
    title: '邮箱'
  }
]

const basicData = [
  { id: 1, name: '张三', age: 25, city: '北京', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, city: '上海', email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, city: '广州', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', age: 32, city: '深圳', email: 'zhaoliu@example.com' }
]

// 分页表格
const paginationColumns = basicColumns
const paginationData = ref([])
const paginationConfig = reactive({
  page: 1,
  pageSize: 5,
  total: 50,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50]
})

// 生成分页数据
const generatePaginationData = () => {
  const data = []
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: i,
      name: `用户${i}`,
      age: 20 + (i % 30),
      city: ['北京', '上海', '广州', '深圳'][i % 4],
      email: `user${i}@example.com`
    })
  }
  return data
}

const allPaginationData = generatePaginationData()
paginationData.value = allPaginationData.slice(0, 5)

// 可选择表格
const selectableColumns = basicColumns
const selectableData = basicData
const selectedRows = ref([])

const rowSelection: RowSelection = {
  type: 'checkbox',
  selectedRowKeys: computed(() => selectedRows.value.map(row => row.id)),
  onSelect: (row, selected) => {
    if (selected) {
      selectedRows.value.push(row)
    } else {
      const index = selectedRows.value.findIndex(r => r.id === row.id)
      if (index > -1) {
        selectedRows.value.splice(index, 1)
      }
    }
  },
  onSelectAll: (selected, rows) => {
    if (selected) {
      selectedRows.value = [...rows]
    } else {
      selectedRows.value = []
    }
  }
}

// 可排序表格
const sortableColumns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名',
    sortable: true
  },
  {
    key: 'age',
    title: '年龄',
    sortable: true
  },
  {
    key: 'score',
    title: '分数',
    sortable: true
  },
  {
    key: 'city',
    title: '城市'
  }
]

const sortableData = [
  { id: 1, name: '张三', age: 25, score: 85, city: '北京' },
  { id: 2, name: '李四', age: 30, score: 92, city: '上海' },
  { id: 3, name: '王五', age: 28, score: 78, city: '广州' },
  { id: 4, name: '赵六', age: 32, score: 88, city: '深圳' },
  { id: 5, name: '钱七', age: 26, score: 95, city: '杭州' }
]

const currentSort = ref(null)

// 可筛选表格
const filterableColumns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名'
  },
  {
    key: 'department',
    title: '部门',
    filterable: true,
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '销售部', value: '销售部' },
      { text: '市场部', value: '市场部' }
    ]
  },
  {
    key: 'status',
    title: '状态',
    filterable: true,
    filters: [
      { text: '在职', value: '在职' },
      { text: '离职', value: '离职' },
      { text: '休假', value: '休假' }
    ],
    render: (row) => {
      const statusMap = {
        '在职': 'success',
        '离职': 'error',
        '休假': 'warning'
      }
      return h(NTag, { type: statusMap[row.status] }, () => row.status)
    }
  },
  {
    key: 'salary',
    title: '薪资'
  }
]

const filterableData = [
  { id: 1, name: '张三', department: '技术部', status: '在职', salary: 15000 },
  { id: 2, name: '李四', department: '销售部', status: '在职', salary: 12000 },
  { id: 3, name: '王五', department: '技术部', status: '休假', salary: 18000 },
  { id: 4, name: '赵六', department: '市场部', status: '在职', salary: 14000 },
  { id: 5, name: '钱七', department: '技术部', status: '离职', salary: 16000 }
]

const currentFilters = ref({})

// 可编辑表格
const editableTableRef = ref()
const editableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', editable: false },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', editable: false },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', editable: false }
])

const editableSelectedRows = ref([])

const editableColumns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名',
    editable: true
  },
  {
    key: 'age',
    title: '年龄',
    editable: true
  },
  {
    key: 'email',
    title: '邮箱',
    editable: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    render: (row) => {
      return h(NSpace, null, () => [
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => toggleEdit(row)
        }, () => row.editable ? '保存' : '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => deleteRow(row)
        }, () => '删除')
      ])
    }
  }
]

const editableRowSelection: RowSelection = {
  type: 'checkbox',
  selectedRowKeys: computed(() => editableSelectedRows.value.map(row => row.id)),
  onSelect: (row, selected) => {
    if (selected) {
      editableSelectedRows.value.push(row)
    } else {
      const index = editableSelectedRows.value.findIndex(r => r.id === row.id)
      if (index > -1) {
        editableSelectedRows.value.splice(index, 1)
      }
    }
  }
}

// 展开行表格
const expandableColumns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名'
  },
  {
    key: 'department',
    title: '部门'
  },
  {
    key: 'position',
    title: '职位'
  }
]

const expandableData = [
  {
    id: 1,
    name: '张三',
    department: '技术部',
    position: '前端工程师',
    details: {
      phone: '13800138000',
      address: '北京市朝阳区',
      skills: ['Vue', 'React', 'TypeScript'],
      projects: ['项目A', '项目B', '项目C']
    }
  },
  {
    id: 2,
    name: '李四',
    department: '销售部',
    position: '销售经理',
    details: {
      phone: '13800138001',
      address: '上海市浦东新区',
      skills: ['销售技巧', '客户管理', '市场分析'],
      projects: ['客户A', '客户B', '客户C']
    }
  }
]

const expandableConfig: ExpandableConfig = {
  expandedRowRender: (row) => {
    return h('div', { style: 'padding: 16px;' }, [
      h('h4', '详细信息'),
      h('p', `电话：${row.details.phone}`),
      h('p', `地址：${row.details.address}`),
      h('p', `技能：${row.details.skills.join(', ')}`),
      h('p', `项目：${row.details.projects.join(', ')}`)
    ])
  }
}

// 固定列表格
const fixedColumns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名',
    width: 100,
    fixed: 'left'
  },
  {
    key: 'age',
    title: '年龄',
    width: 80
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
    key: 'company',
    title: '公司',
    width: 150
  },
  {
    key: 'position',
    title: '职位',
    width: 120
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    fixed: 'right'
  }
]

const fixedData = [
  {
    id: 1,
    name: '张三',
    age: 25,
    address: '北京市朝阳区某某街道123号',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    company: 'ABC科技有限公司',
    position: '前端工程师'
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    address: '上海市浦东新区某某路456号',
    phone: '13800138001',
    email: 'lisi@example.com',
    company: 'XYZ互联网公司',
    position: '后端工程师'
  }
]

// 自定义渲染表格
const customColumns: TableColumn[] = [
  {
    key: 'avatar',
    title: '头像',
    width: 80,
    render: (row) => {
      return h(NAvatar, {
        size: 'medium',
        src: row.avatar
      })
    }
  },
  {
    key: 'name',
    title: '姓名',
    render: (row) => {
      return h('div', [
        h('div', { style: 'font-weight: bold;' }, row.name),
        h('div', { style: 'font-size: 12px; color: #999;' }, row.title)
      ])
    }
  },
  {
    key: 'progress',
    title: '进度',
    render: (row) => {
      return h(NProgress, {
        type: 'line',
        percentage: row.progress,
        status: row.progress === 100 ? 'success' : 'info'
      })
    }
  },
  {
    key: 'rating',
    title: '评分',
    render: (row) => {
      return h(NRate, {
        value: row.rating,
        readonly: true,
        size: 'small'
      })
    }
  },
  {
    key: 'status',
    title: '状态',
    render: (row) => {
      const statusMap = {
        active: { type: 'success', text: '活跃' },
        inactive: { type: 'warning', text: '不活跃' },
        banned: { type: 'error', text: '已禁用' }
      }
      const status = statusMap[row.status]
      return h(NTag, { type: status.type }, () => status.text)
    }
  },
  {
    key: 'actions',
    title: '操作',
    render: (row) => {
      return h(NSpace, { size: 'small' }, () => [
        h(NButton, {
          size: 'small',
          type: 'primary',
          quaternary: true
        }, () => [
          h(NIcon, null, () => h(CreateOutline)),
          '编辑'
        ]),
        h(NButton, {
          size: 'small',
          type: 'error',
          quaternary: true
        }, () => [
          h(NIcon, null, () => h(TrashOutline)),
          '删除'
        ])
      ])
    }
  }
]

const customData = [
  {
    id: 1,
    avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    name: '张三',
    title: '高级前端工程师',
    progress: 85,
    rating: 4.5,
    status: 'active'
  },
  {
    id: 2,
    avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    name: '李四',
    title: '产品经理',
    progress: 92,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 3,
    avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    name: '王五',
    title: 'UI设计师',
    progress: 100,
    rating: 5.0,
    status: 'inactive'
  }
]

// 加载状态表格
const loadingColumns = basicColumns
const loadingData = ref([])
const isLoading = ref(false)

// 空数据表格
const emptyColumns = basicColumns

// 方法
const handlePageChange = (page: number) => {
  paginationConfig.page = page
  const start = (page - 1) * paginationConfig.pageSize
  const end = start + paginationConfig.pageSize
  paginationData.value = allPaginationData.slice(start, end)
}

const handlePageSizeChange = (pageSize: number) => {
  paginationConfig.pageSize = pageSize
  paginationConfig.page = 1
  paginationData.value = allPaginationData.slice(0, pageSize)
}

const handleSelectionChange = (selectedRowKeys: any[], selectedRows: any[]) => {
  selectedRows.value = selectedRows
}

const selectAll = () => {
  selectedRows.value = [...selectableData]
}

const clearSelection = () => {
  selectedRows.value = []
}

const selectFirst3 = () => {
  selectedRows.value = selectableData.slice(0, 3)
}

const handleSortChange = (sortInfo: any) => {
  currentSort.value = sortInfo
}

const handleFilterChange = (filters: any) => {
  currentFilters.value = filters
}

const handleCellEdit = (row: any, field: string, value: any) => {
  row[field] = value
}

const handleRowAdd = (row: any) => {
  editableData.value.push(row)
}

const handleRowDelete = (row: any) => {
  const index = editableData.value.findIndex(r => r.id === row.id)
  if (index > -1) {
    editableData.value.splice(index, 1)
  }
}

const handleEditableSelectionChange = (selectedRowKeys: any[], selectedRows: any[]) => {
  editableSelectedRows.value = selectedRows
}

const addRow = () => {
  const newId = Math.max(...editableData.value.map(r => r.id)) + 1
  editableData.value.push({
    id: newId,
    name: `新用户${newId}`,
    age: 25,
    email: `newuser${newId}@example.com`,
    editable: true
  })
}

const deleteSelectedRows = () => {
  editableSelectedRows.value.forEach(row => {
    const index = editableData.value.findIndex(r => r.id === row.id)
    if (index > -1) {
      editableData.value.splice(index, 1)
    }
  })
  editableSelectedRows.value = []
}

const saveChanges = () => {
  // 模拟保存操作
  console.log('保存更改:', editableData.value)
}

const cancelChanges = () => {
  // 模拟取消操作
  editableData.value.forEach(row => {
    row.editable = false
  })
}

const toggleEdit = (row: any) => {
  row.editable = !row.editable
}

const deleteRow = (row: any) => {
  const index = editableData.value.findIndex(r => r.id === row.id)
  if (index > -1) {
    editableData.value.splice(index, 1)
  }
}

const handleExpand = (expanded: boolean, row: any) => {
  console.log('展开状态改变:', expanded, row)
}

const toggleLoading = () => {
  isLoading.value = !isLoading.value
}

const loadData = () => {
  isLoading.value = true
  setTimeout(() => {
    loadingData.value = [
      { id: 1, name: '张三', age: 25, city: '北京', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', age: 30, city: '上海', email: 'lisi@example.com' }
    ]
    isLoading.value = false
  }, 2000)
}
</script>

<style scoped>
.clever-table-demo {
  max-width: 100%;
}
</style>