<template>
  <div class="clever-data-table-demo">
    <n-space vertical size="large">
      <!-- 基础用法 -->
      <n-card title="基础用法">
        <CleverDataTable
          :columns="basicColumns"
          :api-config="basicApiConfig"
          @row-click="handleRowClick"
        />
      </n-card>

      <!-- 带搜索的数据表格 -->
      <n-card title="带搜索的数据表格">
        <CleverDataTable
          :columns="searchColumns"
          :api-config="searchApiConfig"
          :search-config="searchConfig"
          @search="handleSearch"
        />
      </n-card>

      <!-- 带操作按钮的数据表格 -->
      <n-card title="带操作按钮的数据表格">
        <CleverDataTable
          ref="actionTableRef"
          :columns="actionColumns"
          :api-config="actionApiConfig"
          :toolbar-config="toolbarConfig"
          :row-selection="actionRowSelection"
          @selection-change="handleActionSelectionChange"
        />
      </n-card>

      <!-- 可编辑的数据表格 -->
      <n-card title="可编辑的数据表格">
        <CleverDataTable
          ref="editableDataTableRef"
          :columns="editableDataColumns"
          :api-config="editableApiConfig"
          :editable="true"
          @cell-edit="handleDataCellEdit"
          @row-save="handleRowSave"
          @row-cancel="handleRowCancel"
        />
      </n-card>

      <!-- 树形数据表格 -->
      <n-card title="树形数据表格">
        <CleverDataTable
          :columns="treeColumns"
          :api-config="treeApiConfig"
          :tree-config="treeConfig"
          @node-expand="handleNodeExpand"
        />
      </n-card>

      <!-- 虚拟滚动数据表格 -->
      <n-card title="虚拟滚动数据表格">
        <CleverDataTable
          :columns="virtualColumns"
          :api-config="virtualApiConfig"
          :virtual-scroll="true"
          :height="400"
        />
      </n-card>

      <!-- 自定义筛选数据表格 -->
      <n-card title="自定义筛选数据表格">
        <CleverDataTable
          :columns="filterColumns"
          :api-config="filterApiConfig"
          :filter-config="filterConfig"
          @filter-change="handleFilterChange"
        />
      </n-card>

      <!-- 导出功能数据表格 -->
      <n-card title="导出功能数据表格">
        <CleverDataTable
          ref="exportTableRef"
          :columns="exportColumns"
          :api-config="exportApiConfig"
          :export-config="exportConfig"
          @export="handleExport"
        />
      </n-card>

      <!-- 自定义渲染数据表格 -->
      <n-card title="自定义渲染数据表格">
        <CleverDataTable
          :columns="customRenderColumns"
          :api-config="customRenderApiConfig"
        />
      </n-card>

      <!-- 操作结果显示 -->
      <n-card title="操作结果" v-if="operationResult">
        <n-alert type="info">
          <pre>{{ operationResult }}</pre>
        </n-alert>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import {
  NSpace,
  NCard,
  NAlert,
  NButton,
  NTag,
  NProgress,
  NAvatar,
  NIcon,
  NSwitch,
  NRate,
  NPopconfirm,
  NTooltip
} from 'naive-ui'
import {
  CreateOutline,
  TrashOutline,
  DownloadOutline,
  RefreshOutline,
  AddOutline,
  EyeOutline,
  SettingsOutline
} from '@vicons/ionicons5'
import { CleverDataTable } from '@clever-component'
import type {
  DataTableColumn,
  ApiConfig,
  SearchConfig,
  ToolbarConfig,
  RowSelection,
  TreeConfig,
  FilterConfig,
  ExportConfig
} from '@clever-component'

// 表格引用
const actionTableRef = ref()
const editableDataTableRef = ref()
const exportTableRef = ref()

// 操作结果
const operationResult = ref('')
const selectedActionRows = ref([])

// 基础数据表格
const basicColumns: DataTableColumn[] = [
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
    width: 120
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row) => {
      const statusMap = {
        active: { type: 'success', text: '活跃' },
        inactive: { type: 'warning', text: '不活跃' },
        banned: { type: 'error', text: '已禁用' }
      }
      const status = statusMap[row.status] || { type: 'default', text: '未知' }
      return h(NTag, { type: status.type }, () => status.text)
    }
  },
  {
    key: 'createdAt',
    title: '创建时间',
    width: 180
  }
]

const basicApiConfig: ApiConfig = {
  url: '/api/users',
  method: 'GET',
  params: {
    page: 1,
    pageSize: 10
  }
}

// 带搜索的数据表格
const searchColumns = basicColumns

const searchApiConfig: ApiConfig = {
  url: '/api/users/search',
  method: 'GET'
}

const searchConfig: SearchConfig = {
  fields: [
    {
      key: 'name',
      label: '姓名',
      type: 'input',
      placeholder: '请输入姓名'
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱'
    },
    {
      key: 'department',
      label: '部门',
      type: 'select',
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '销售部', value: 'sales' },
        { label: '市场部', value: 'marketing' },
        { label: '人事部', value: 'hr' }
      ]
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: [
        { label: '活跃', value: 'active' },
        { label: '不活跃', value: 'inactive' },
        { label: '已禁用', value: 'banned' }
      ]
    },
    {
      key: 'dateRange',
      label: '创建时间',
      type: 'date-range',
      placeholder: ['开始日期', '结束日期']
    }
  ],
  showReset: true,
  showCollapse: true,
  defaultCollapsed: false
}

// 带操作按钮的数据表格
const actionColumns: DataTableColumn[] = [
  ...basicColumns,
  {
    key: 'actions',
    title: '操作',
    width: 200,
    fixed: 'right',
    render: (row) => {
      return h(NSpace, { size: 'small' }, () => [
        h(NTooltip, { trigger: 'hover' }, {
          trigger: () => h(NButton, {
            size: 'small',
            type: 'primary',
            quaternary: true,
            onClick: () => handleView(row)
          }, () => h(NIcon, null, () => h(EyeOutline))),
          default: () => '查看'
        }),
        h(NTooltip, { trigger: 'hover' }, {
          trigger: () => h(NButton, {
            size: 'small',
            type: 'info',
            quaternary: true,
            onClick: () => handleEdit(row)
          }, () => h(NIcon, null, () => h(CreateOutline))),
          default: () => '编辑'
        }),
        h(NPopconfirm, {
          onPositiveClick: () => handleDelete(row)
        }, {
          trigger: () => h(NTooltip, { trigger: 'hover' }, {
            trigger: () => h(NButton, {
              size: 'small',
              type: 'error',
              quaternary: true
            }, () => h(NIcon, null, () => h(TrashOutline))),
            default: () => '删除'
          }),
          default: () => '确定要删除这条记录吗？'
        })
      ])
    }
  }
]

const actionApiConfig: ApiConfig = {
  url: '/api/users/list',
  method: 'GET'
}

const toolbarConfig: ToolbarConfig = {
  title: '用户管理',
  buttons: [
    {
      text: '新增用户',
      type: 'primary',
      icon: h(AddOutline),
      onClick: () => handleAdd()
    },
    {
      text: '批量删除',
      type: 'error',
      icon: h(TrashOutline),
      disabled: () => selectedActionRows.value.length === 0,
      onClick: () => handleBatchDelete()
    },
    {
      text: '导出数据',
      type: 'default',
      icon: h(DownloadOutline),
      onClick: () => handleExportData()
    },
    {
      text: '刷新',
      type: 'default',
      icon: h(RefreshOutline),
      onClick: () => handleRefresh()
    }
  ],
  extra: [
    {
      text: '设置',
      type: 'default',
      icon: h(SettingsOutline),
      onClick: () => handleSettings()
    }
  ]
}

const actionRowSelection: RowSelection = {
  type: 'checkbox',
  showSelectAll: true
}

// 可编辑的数据表格
const editableDataColumns: DataTableColumn[] = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    editable: false
  },
  {
    key: 'name',
    title: '姓名',
    width: 120,
    editable: true,
    editType: 'input',
    rules: [
      { required: true, message: '请输入姓名' }
    ]
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
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
    width: 120,
    editable: true,
    editType: 'select',
    editOptions: [
      { label: '技术部', value: 'tech' },
      { label: '销售部', value: 'sales' },
      { label: '市场部', value: 'marketing' },
      { label: '人事部', value: 'hr' }
    ]
  },
  {
    key: 'salary',
    title: '薪资',
    width: 120,
    editable: true,
    editType: 'input-number',
    editProps: {
      min: 0,
      max: 100000,
      step: 1000
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    editable: true,
    editType: 'switch',
    render: (row) => {
      return h(NSwitch, {
        value: row.status === 'active',
        checkedValue: true,
        uncheckedValue: false
      })
    }
  }
]

const editableApiConfig: ApiConfig = {
  url: '/api/users/editable',
  method: 'GET',
  updateUrl: '/api/users/update',
  updateMethod: 'PUT'
}

// 树形数据表格
const treeColumns: DataTableColumn[] = [
  {
    key: 'name',
    title: '名称',
    width: 200,
    tree: true
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
  },
  {
    key: 'modifiedAt',
    title: '修改时间',
    width: 180
  }
]

const treeApiConfig: ApiConfig = {
  url: '/api/files/tree',
  method: 'GET'
}

const treeConfig: TreeConfig = {
  childrenKey: 'children',
  hasChildrenKey: 'hasChildren',
  expandedKeys: [],
  defaultExpandAll: false,
  lazy: true,
  loadData: async (node) => {
    // 模拟异步加载子节点
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: `${node.id}-1`,
            name: `子节点 ${node.id}-1`,
            type: 'file',
            size: '1.2MB',
            modifiedAt: '2023-12-01 10:30:00'
          }
        ])
      }, 1000)
    })
  }
}

// 虚拟滚动数据表格
const virtualColumns: DataTableColumn[] = [
  {
    key: 'index',
    title: '序号',
    width: 80,
    render: (row, index) => index + 1
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
    key: 'phone',
    title: '电话',
    width: 150
  },
  {
    key: 'address',
    title: '地址',
    width: 250
  }
]

const virtualApiConfig: ApiConfig = {
  url: '/api/users/large-dataset',
  method: 'GET',
  params: {
    total: 10000
  }
}

// 自定义筛选数据表格
const filterColumns: DataTableColumn[] = [
  {
    key: 'name',
    title: '姓名',
    width: 120,
    filterable: true
  },
  {
    key: 'age',
    title: '年龄',
    width: 100,
    filterable: true,
    filterType: 'number-range'
  },
  {
    key: 'department',
    title: '部门',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: '技术部', value: 'tech' },
      { label: '销售部', value: 'sales' },
      { label: '市场部', value: 'marketing' }
    ]
  },
  {
    key: 'salary',
    title: '薪资',
    width: 120,
    filterable: true,
    filterType: 'number-range'
  },
  {
    key: 'joinDate',
    title: '入职日期',
    width: 150,
    filterable: true,
    filterType: 'date-range'
  }
]

const filterApiConfig: ApiConfig = {
  url: '/api/users/filterable',
  method: 'GET'
}

const filterConfig: FilterConfig = {
  mode: 'advanced',
  showQuickFilter: true,
  quickFilters: [
    { label: '全部', value: 'all' },
    { label: '本月新增', value: 'this-month' },
    { label: '活跃用户', value: 'active' },
    { label: '待激活', value: 'pending' }
  ]
}

// 导出功能数据表格
const exportColumns = basicColumns

const exportApiConfig: ApiConfig = {
  url: '/api/users/exportable',
  method: 'GET'
}

const exportConfig: ExportConfig = {
  formats: ['xlsx', 'csv', 'pdf'],
  filename: '用户数据',
  includeHeaders: true,
  customFields: [
    { key: 'id', label: '用户ID' },
    { key: 'name', label: '用户姓名' },
    { key: 'email', label: '邮箱地址' },
    { key: 'department', label: '所属部门' },
    { key: 'status', label: '用户状态' }
  ]
}

// 自定义渲染数据表格
const customRenderColumns: DataTableColumn[] = [
  {
    key: 'avatar',
    title: '头像',
    width: 80,
    render: (row) => {
      return h(NAvatar, {
        size: 'medium',
        src: row.avatar || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
      })
    }
  },
  {
    key: 'userInfo',
    title: '用户信息',
    width: 200,
    render: (row) => {
      return h('div', [
        h('div', { style: 'font-weight: bold; margin-bottom: 4px;' }, row.name),
        h('div', { style: 'font-size: 12px; color: #999;' }, row.email),
        h('div', { style: 'font-size: 12px; color: #666;' }, row.phone)
      ])
    }
  },
  {
    key: 'performance',
    title: '绩效',
    width: 150,
    render: (row) => {
      return h('div', [
        h('div', { style: 'margin-bottom: 8px;' }, [
          h('span', { style: 'margin-right: 8px;' }, '完成度:'),
          h(NProgress, {
            type: 'line',
            percentage: row.performance || 0,
            status: (row.performance || 0) >= 80 ? 'success' : 'info',
            showIndicator: false,
            height: 6
          })
        ]),
        h('div', { style: 'font-size: 12px; color: #666;' }, `${row.performance || 0}%`)
      ])
    }
  },
  {
    key: 'rating',
    title: '评分',
    width: 120,
    render: (row) => {
      return h('div', { style: 'text-align: center;' }, [
        h(NRate, {
          value: row.rating || 0,
          readonly: true,
          size: 'small'
        }),
        h('div', { style: 'font-size: 12px; color: #666; margin-top: 4px;' }, 
          `${row.rating || 0}/5`
        )
      ])
    }
  },
  {
    key: 'tags',
    title: '标签',
    width: 200,
    render: (row) => {
      const tags = row.tags || []
      return h(NSpace, { size: 'small' }, () => 
        tags.map(tag => 
          h(NTag, {
            size: 'small',
            type: tag.type || 'default'
          }, () => tag.text)
        )
      )
    }
  }
]

const customRenderApiConfig: ApiConfig = {
  url: '/api/users/custom-render',
  method: 'GET'
}

// 方法
const handleRowClick = (row: any) => {
  operationResult.value = `点击了行：${JSON.stringify(row, null, 2)}`
}

const handleSearch = (searchParams: any) => {
  operationResult.value = `搜索参数：${JSON.stringify(searchParams, null, 2)}`
}

const handleActionSelectionChange = (selectedRowKeys: any[], selectedRows: any[]) => {
  selectedActionRows.value = selectedRows
  operationResult.value = `选择了 ${selectedRows.length} 行数据`
}

const handleView = (row: any) => {
  operationResult.value = `查看用户：${row.name}`
}

const handleEdit = (row: any) => {
  operationResult.value = `编辑用户：${row.name}`
}

const handleDelete = (row: any) => {
  operationResult.value = `删除用户：${row.name}`
}

const handleAdd = () => {
  operationResult.value = '新增用户'
}

const handleBatchDelete = () => {
  operationResult.value = `批量删除 ${selectedActionRows.value.length} 个用户`
}

const handleExportData = () => {
  operationResult.value = '导出数据'
}

const handleRefresh = () => {
  actionTableRef.value?.refresh()
  operationResult.value = '刷新数据'
}

const handleSettings = () => {
  operationResult.value = '打开设置'
}

const handleDataCellEdit = (row: any, field: string, value: any) => {
  operationResult.value = `编辑单元格：${field} = ${value}`
}

const handleRowSave = (row: any) => {
  operationResult.value = `保存行数据：${JSON.stringify(row, null, 2)}`
}

const handleRowCancel = (row: any) => {
  operationResult.value = `取消编辑：${row.name}`
}

const handleNodeExpand = (expanded: boolean, node: any) => {
  operationResult.value = `节点 ${node.name} ${expanded ? '展开' : '收起'}`
}

const handleFilterChange = (filters: any) => {
  operationResult.value = `筛选条件：${JSON.stringify(filters, null, 2)}`
}

const handleExport = (format: string, data: any[]) => {
  operationResult.value = `导出 ${format} 格式，共 ${data.length} 条数据`
}
</script>

<style scoped>
.clever-data-table-demo {
  max-width: 100%;
}

pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 200px;
  overflow: auto;
}
</style>