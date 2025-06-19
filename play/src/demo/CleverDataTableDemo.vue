<template>
  <div class="clever-data-table-demo">
    <n-space vertical size="large">
      <!-- 基础用法 -->
      <n-card title="基础用法">
        <CleverDataTable
          :columns="basicColumns"
          :data="basicData"
          :pagination="false"
        />
      </n-card>

      <!-- 带搜索和分页的数据表格 -->
      <n-card title="带搜索和分页的数据表格">
        <CleverDataTable
          :columns="searchColumns"
          :api-config="searchApiConfig"
          :search-config="searchConfig"
          :pagination-config="paginationConfig"
          :show-index-column="true"
          :show-selection-column="true"
          :auto-load="true"
          @selection-change="handleSelectionChange"
        />
      </n-card>

      <!-- 完整功能的数据表格 -->
      <n-card title="完整功能的数据表格">
        <CleverDataTable
          ref="fullTableRef"
          :columns="fullColumns"
          :api-config="fullApiConfig"
          :form-config="formConfig"
          :search-config="fullSearchConfig"
          :pagination-config="fullPaginationConfig"
          :header-actions="headerActions"
          :actions="rowActions"
          :show-index-column="true"
          :show-selection-column="true"
          :auto-load="true"
          @action-click="handleActionClick"
          @header-action-click="handleHeaderActionClick"
          @form-submit="handleFormSubmit"
          @selection-change="handleFullSelectionChange"
        />
      </n-card>

      <!-- 自定义渲染的数据表格 -->
      <n-card title="自定义渲染的数据表格">
        <CleverDataTable
          :columns="customColumns"
          :api-config="customApiConfig"
          :pagination-config="customPaginationConfig"
          :show-index-column="true"
          :auto-load="true"
        />
      </n-card>

      <!-- 操作结果显示 -->
      <n-card v-if="operationResult" title="操作结果">
        <n-alert type="info">
          <pre>{{ operationResult }}</pre>
        </n-alert>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import {
  NSpace,
  NCard,
  NAlert,
  NTag,
  NButton,
  NAvatar,
  NProgress,
  NRate,
  NSwitch,
  NIcon,
  useMessage
} from 'naive-ui'
import {
  PersonOutline,
  MailOutline,
  CallOutline,
  LocationOutline,
  CreateOutline,
  TrashOutline,
  AddOutline,
  DownloadOutline,
  RefreshOutline
} from '@vicons/ionicons5'
import { CleverDataTable } from '@clever-component'
import type {
  TableColumn,
  DataTableApiConfig,
  DataTableFormConfig,
  SearchConfig,
  PaginationConfig,
  HeaderAction,
  TableAction,
  FormSchema
} from '@clever-component'

const message = useMessage()
const fullTableRef = ref()
const operationResult = ref('')

// 模拟数据
const generateMockData = (count: number = 50) => {
  const data = []
  const departments = ['技术部', '销售部', '市场部', '人事部', '财务部']
  const positions = ['工程师', '经理', '主管', '专员', '总监']
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['active', 'inactive', 'pending']
  
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `用户${i}`,
      email: `user${i}@example.com`,
      phone: `138${String(i).padStart(8, '0')}`,
      age: 20 + (i % 30),
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      city: cities[i % cities.length],
      salary: 5000 + (i % 20) * 1000,
      status: statuses[i % statuses.length],
      score: Math.floor(Math.random() * 5) + 1,
      progress: Math.floor(Math.random() * 100),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      joinDate: new Date(2020 + (i % 4), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
      isActive: i % 3 !== 0,
      tags: [`标签${i % 3 + 1}`, `类型${i % 2 + 1}`]
    })
  }
  return data
}

const mockData = generateMockData()

// 模拟API函数
const mockApi = {
  // 列表查询
  async getList(params: any) {
    console.log('API调用 - 获取列表:', params)
    await new Promise(resolve => setTimeout(resolve, 800)) // 模拟网络延迟
    
    let filteredData = [...mockData]
    
    // 搜索过滤
    if (params.name) {
      filteredData = filteredData.filter(item => 
        item.name.includes(params.name)
      )
    }
    if (params.department) {
      filteredData = filteredData.filter(item => 
        item.department === params.department
      )
    }
    if (params.status) {
      filteredData = filteredData.filter(item => 
        item.status === params.status
      )
    }
    
    // 分页
    const { page = 1, pageSize = 10 } = params
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredData.slice(start, end)
    
    return {
      code: 0,
      data: {
        list,
        total: filteredData.length
      },
      message: 'success'
    }
  },
  
  // 创建
  async create(data: any) {
    console.log('API调用 - 创建:', data)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newItem = {
      ...data,
      id: mockData.length + 1,
      joinDate: new Date().toISOString().split('T')[0]
    }
    mockData.push(newItem)
    
    return {
      code: 0,
      data: newItem,
      message: '创建成功'
    }
  },
  
  // 更新
  async update(data: any) {
    console.log('API调用 - 更新:', data)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockData.findIndex(item => item.id === data.id)
    if (index > -1) {
      mockData[index] = { ...mockData[index], ...data }
      return {
        code: 0,
        data: mockData[index],
        message: '更新成功'
      }
    }
    
    return {
      code: 1,
      message: '记录不存在'
    }
  },
  
  // 删除
  async delete(id: number) {
    console.log('API调用 - 删除:', id)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockData.findIndex(item => item.id === id)
    if (index > -1) {
      mockData.splice(index, 1)
      return {
        code: 0,
        data: true,
        message: '删除成功'
      }
    }
    
    return {
      code: 1,
      message: '记录不存在'
    }
  },
  
  // 批量删除
  async batchDelete(ids: number[]) {
    console.log('API调用 - 批量删除:', ids)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ids.forEach(id => {
      const index = mockData.findIndex(item => item.id === id)
      if (index > -1) {
        mockData.splice(index, 1)
      }
    })
    
    return {
      code: 0,
      data: true,
      message: `成功删除 ${ids.length} 条记录`
    }
  },
  
  // 获取详情
  async getDetail(id: number) {
    console.log('API调用 - 获取详情:', id)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const item = mockData.find(item => item.id === id)
    if (item) {
      return {
        code: 0,
        data: item,
        message: 'success'
      }
    }
    
    return {
      code: 1,
      message: '记录不存在'
    }
  }
}

// 基础表格配置
const basicColumns: TableColumn[] = [
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
    key: 'position',
    title: '职位',
    width: 120
  }
]

const basicData = mockData.slice(0, 5)

// 带搜索的表格配置
const searchColumns: TableColumn[] = [
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
        active: { type: 'success', text: '激活' },
        inactive: { type: 'error', text: '禁用' },
        pending: { type: 'warning', text: '待审核' }
      }
      const status = statusMap[row.status as keyof typeof statusMap]
      return h(NTag, { type: status.type }, () => status.text)
    }
  }
]

const searchApiConfig: DataTableApiConfig = {
  listApi: mockApi.getList
}

const searchConfig: SearchConfig = {
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
      field: 'department',
      label: '部门',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择部门',
        options: [
          { label: '技术部', value: '技术部' },
          { label: '销售部', value: '销售部' },
          { label: '市场部', value: '市场部' },
          { label: '人事部', value: '人事部' },
          { label: '财务部', value: '财务部' }
        ]
      }
    },
    {
      field: 'status',
      label: '状态',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '激活', value: 'active' },
          { label: '禁用', value: 'inactive' },
          { label: '待审核', value: 'pending' }
        ]
      }
    }
  ]
}

const paginationConfig: PaginationConfig = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
}

// 完整功能表格配置
const fullColumns: TableColumn[] = [
  {
    key: 'avatar',
    title: '头像',
    width: 80,
    render: (row) => {
      return h(NAvatar, {
        size: 'small',
        src: row.avatar,
        fallbackSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      })
    }
  },
  {
    key: 'name',
    title: '姓名',
    width: 120,
    render: (row) => {
      return h('div', {
        style: 'display: flex; align-items: center; gap: 8px;'
      }, [
        h(NIcon, { size: 16 }, () => h(PersonOutline)),
        row.name
      ])
    }
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
    render: (row) => {
      return h('div', {
        style: 'display: flex; align-items: center; gap: 8px;'
      }, [
        h(NIcon, { size: 16 }, () => h(MailOutline)),
        row.email
      ])
    }
  },
  {
    key: 'phone',
    title: '电话',
    width: 150,
    render: (row) => {
      return h('div', {
        style: 'display: flex; align-items: center; gap: 8px;'
      }, [
        h(NIcon, { size: 16 }, () => h(CallOutline)),
        row.phone
      ])
    }
  },
  {
    key: 'department',
    title: '部门',
    width: 120
  },
  {
    key: 'position',
    title: '职位',
    width: 120
  },
  {
    key: 'salary',
    title: '薪资',
    width: 100,
    render: (row) => {
      return `¥${row.salary.toLocaleString()}`
    }
  },
  {
    key: 'score',
    title: '评分',
    width: 120,
    render: (row) => {
      return h(NRate, {
        value: row.score,
        readonly: true,
        size: 'small'
      })
    }
  },
  {
    key: 'progress',
    title: '进度',
    width: 120,
    render: (row) => {
      return h(NProgress, {
        percentage: row.progress,
        showIndicator: false,
        height: 8
      })
    }
  },
  {
    key: 'isActive',
    title: '是否激活',
    width: 100,
    render: (row) => {
      return h(NSwitch, {
        value: row.isActive,
        disabled: true
      })
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row) => {
      const statusMap = {
        active: { type: 'success', text: '激活' },
        inactive: { type: 'error', text: '禁用' },
        pending: { type: 'warning', text: '待审核' }
      }
      const status = statusMap[row.status as keyof typeof statusMap]
      return h(NTag, { type: status.type }, () => status.text)
    }
  },
  {
    key: 'tags',
    title: '标签',
    width: 150,
    render: (row) => {
      return h('div', {
        style: 'display: flex; gap: 4px; flex-wrap: wrap;'
      }, row.tags.map((tag: string) => 
        h(NTag, { size: 'small', type: 'info' }, () => tag)
      ))
    }
  }
]

const fullApiConfig: DataTableApiConfig = {
  listApi: mockApi.getList,
  createApi: mockApi.create,
  updateApi: mockApi.update,
  deleteApi: mockApi.delete,
  batchDeleteApi: mockApi.batchDelete,
  getApi: mockApi.getDetail
}

const formConfig: DataTableFormConfig = {
  title: '用户信息',
  mode: 'drawer',
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
        placeholder: '请输入电话号码'
      }
    },
    {
      field: 'age',
      label: '年龄',
      component: 'NInputNumber',
      componentProps: {
        placeholder: '请输入年龄',
        min: 18,
        max: 65
      }
    },
    {
      field: 'department',
      label: '部门',
      component: 'NSelect',
      required: true,
      componentProps: {
        placeholder: '请选择部门',
        options: [
          { label: '技术部', value: '技术部' },
          { label: '销售部', value: '销售部' },
          { label: '市场部', value: '市场部' },
          { label: '人事部', value: '人事部' },
          { label: '财务部', value: '财务部' }
        ]
      }
    },
    {
      field: 'position',
      label: '职位',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择职位',
        options: [
          { label: '工程师', value: '工程师' },
          { label: '经理', value: '经理' },
          { label: '主管', value: '主管' },
          { label: '专员', value: '专员' },
          { label: '总监', value: '总监' }
        ]
      }
    },
    {
      field: 'city',
      label: '城市',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择城市',
        options: [
          { label: '北京', value: '北京' },
          { label: '上海', value: '上海' },
          { label: '广州', value: '广州' },
          { label: '深圳', value: '深圳' },
          { label: '杭州', value: '杭州' },
          { label: '成都', value: '成都' }
        ]
      }
    },
    {
      field: 'salary',
      label: '薪资',
      component: 'NInputNumber',
      componentProps: {
        placeholder: '请输入薪资',
        min: 3000,
        max: 50000,
        step: 1000
      }
    },
    {
      field: 'status',
      label: '状态',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '激活', value: 'active' },
          { label: '禁用', value: 'inactive' },
          { label: '待审核', value: 'pending' }
        ]
      }
    },
    {
      field: 'isActive',
      label: '是否激活',
      component: 'NSwitch'
    }
  ]
}

const fullSearchConfig: SearchConfig = {
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
      field: 'department',
      label: '部门',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择部门',
        options: [
          { label: '技术部', value: '技术部' },
          { label: '销售部', value: '销售部' },
          { label: '市场部', value: '市场部' },
          { label: '人事部', value: '人事部' },
          { label: '财务部', value: '财务部' }
        ]
      }
    },
    {
      field: 'status',
      label: '状态',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '激活', value: 'active' },
          { label: '禁用', value: 'inactive' },
          { label: '待审核', value: 'pending' }
        ]
      }
    },
    {
      field: 'city',
      label: '城市',
      component: 'NSelect',
      componentProps: {
        placeholder: '请选择城市',
        options: [
          { label: '北京', value: '北京' },
          { label: '上海', value: '上海' },
          { label: '广州', value: '广州' },
          { label: '深圳', value: '深圳' }
        ]
      }
    }
  ]
}

const fullPaginationConfig: PaginationConfig = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50]
}

const headerActions: HeaderAction[] = [
  {
    key: 'create',
    label: '新增用户',
    type: 'primary',
    icon: AddOutline
  },
  {
    key: 'export',
    label: '导出数据',
    type: 'default',
    icon: DownloadOutline
  },
  {
    key: 'refresh',
    label: '刷新',
    type: 'default',
    icon: RefreshOutline
  }
]

const rowActions: TableAction[] = [
  {
    key: 'view',
    label: '查看',
    type: 'info'
  },
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    icon: CreateOutline
  },
  {
    key: 'delete',
    label: '删除',
    type: 'error',
    icon: TrashOutline
  }
]

// 自定义渲染表格配置
const customColumns: TableColumn[] = [
  {
    key: 'name',
    title: '用户信息',
    width: 250,
    render: (row) => {
      return h('div', {
        style: 'display: flex; align-items: center; gap: 12px;'
      }, [
        h(NAvatar, {
          size: 'medium',
          src: row.avatar,
          fallbackSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
        }),
        h('div', {}, [
          h('div', { style: 'font-weight: 500; margin-bottom: 4px;' }, row.name),
          h('div', { style: 'font-size: 12px; color: #999;' }, row.email)
        ])
      ])
    }
  },
  {
    key: 'work',
    title: '工作信息',
    width: 200,
    render: (row) => {
      return h('div', {}, [
        h('div', { style: 'margin-bottom: 4px;' }, `${row.department} - ${row.position}`),
        h('div', { style: 'font-size: 12px; color: #999;' }, `薪资: ¥${row.salary.toLocaleString()}`)
      ])
    }
  },
  {
    key: 'location',
    title: '位置',
    width: 120,
    render: (row) => {
      return h('div', {
        style: 'display: flex; align-items: center; gap: 8px;'
      }, [
        h(NIcon, { size: 16 }, () => h(LocationOutline)),
        row.city
      ])
    }
  },
  {
    key: 'performance',
    title: '绩效',
    width: 200,
    render: (row) => {
      return h('div', {}, [
        h('div', {
          style: 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;'
        }, [
          h('span', { style: 'font-size: 12px;' }, '评分:'),
          h(NRate, {
            value: row.score,
            readonly: true,
            size: 'small'
          })
        ]),
        h('div', {
          style: 'display: flex; align-items: center; gap: 8px;'
        }, [
          h('span', { style: 'font-size: 12px;' }, '进度:'),
          h(NProgress, {
            percentage: row.progress,
            showIndicator: true,
            height: 6,
            style: 'flex: 1;'
          })
        ])
      ])
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 120,
    render: (row) => {
      const statusMap = {
        active: { type: 'success', text: '激活' },
        inactive: { type: 'error', text: '禁用' },
        pending: { type: 'warning', text: '待审核' }
      }
      const status = statusMap[row.status as keyof typeof statusMap]
      return h('div', {
        style: 'display: flex; flex-direction: column; gap: 4px;'
      }, [
        h(NTag, { type: status.type, size: 'small' }, () => status.text),
        h(NSwitch, {
          value: row.isActive,
          size: 'small',
          disabled: true
        })
      ])
    }
  }
]

const customApiConfig: DataTableApiConfig = {
  listApi: mockApi.getList
}

const customPaginationConfig: PaginationConfig = {
  page: 1,
  pageSize: 8,
  showSizePicker: true,
  pageSizes: [8, 16, 24]
}

// 事件处理
const handleSelectionChange = (keys: (string | number)[]) => {
  operationResult.value = `选择了 ${keys.length} 条记录: ${keys.join(', ')}`
}

const handleFullSelectionChange = (keys: (string | number)[]) => {
  operationResult.value = `完整表格选择了 ${keys.length} 条记录: ${keys.join(', ')}`
}

const handleActionClick = (action: string, record: any, index: number) => {
  operationResult.value = `点击了行操作: ${action}, 记录ID: ${record.id}, 索引: ${index}`
  
  if (action === 'view') {
    message.info(`查看用户: ${record.name}`)
  } else if (action === 'delete') {
    message.warning(`删除用户: ${record.name}`)
  }
}

const handleHeaderActionClick = (action: string) => {
  operationResult.value = `点击了表头操作: ${action}`
  
  if (action === 'create') {
    message.info('打开新增用户表单')
  } else if (action === 'export') {
    message.info('开始导出数据')
  } else if (action === 'refresh') {
    message.info('刷新表格数据')
    fullTableRef.value?.refresh()
  }
}

const handleFormSubmit = (values: Record<string, any>, type: 'create' | 'update') => {
  operationResult.value = `表单提交: ${type}, 数据: ${JSON.stringify(values, null, 2)}`
  message.success(`${type === 'create' ? '创建' : '更新'}成功`)
}
</script>

<style scoped>
.clever-data-table-demo {
  padding: 20px;
}

.clever-data-table-demo :deep(.n-card) {
  margin-bottom: 20px;
}

.clever-data-table-demo :deep(.n-card:last-child) {
  margin-bottom: 0;
}
</style>