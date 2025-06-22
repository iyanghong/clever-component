<template>
  <DemoContainer
    title="CRUD表格"
    description="展示CleverTable的增删改查功能，包括行内编辑、批量操作、表单弹窗等。"
    :code="demoCode"
  >
    <n-space vertical size="large">
      <!-- 工具栏 -->
      <n-card size="small">
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              新增用户
            </n-button>
            <n-button 
              type="error" 
              :disabled="selectedRowKeys.length === 0"
              @click="handleBatchDelete"
            >
              <template #icon>
                <n-icon><trash-outline /></n-icon>
              </template>
              批量删除 ({{ selectedRowKeys.length }})
            </n-button>
            <n-button @click="handleExport" secondary>
              <template #icon>
                <n-icon><download-outline /></n-icon>
              </template>
              导出数据
            </n-button>
          </n-space>
          
          <n-space>
            <n-input 
              v-model:value="searchKeyword" 
              placeholder="搜索用户..." 
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <n-icon><search-outline /></n-icon>
              </template>
            </n-input>
            <n-button @click="refreshData" :loading="loading">
              <template #icon>
                <n-icon><refresh-outline /></n-icon>
              </template>
            </n-button>
          </n-space>
        </n-space>
      </n-card>

      <!-- 表格 -->
      <CleverTable
        ref="tableRef"
        :columns="columns"
        :data="filteredData"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @update:selected-row-keys="handleSelectionChange"
      />
    </n-space>
    
    <!-- 编辑弹窗 -->
    <n-modal 
      v-model:show="showEditModal" 
      :title="editMode === 'add' ? '新增用户' : '编辑用户'"
      preset="card"
      style="width: 600px;"
    >
      <CleverForm
        ref="editFormRef"
        :schemas="editFormSchemas"
        :data="editFormData"
        :layout="{ labelWidth: 100, labelPlacement: 'left' }"
      />
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" @click="handleSave" :loading="saving">
            {{ editMode === 'add' ? '新增' : '保存' }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
    
    <template #actions>
      <n-space>
        <n-button @click="refreshData" :loading="loading">刷新数据</n-button>
        <n-button @click="addRandomData" secondary>添加随机数据</n-button>
        <n-button @click="clearData" secondary>清空数据</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="operationLog.length > 0" type="success">
        <div>操作日志：</div>
        <div v-for="(log, index) in operationLog" :key="index" class="log-item">
          <n-tag size="small" :type="log.type">{{ log.time }}</n-tag>
          {{ log.message }}
        </div>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  NSpace, NButton, NAlert, NTag, NCard, NModal, NInput, NIcon,
  useMessage, useDialog
} from 'naive-ui'
import { 
  AddOutline, TrashOutline, DownloadOutline, SearchOutline, 
  RefreshOutline, CreateOutline, EyeOutline 
} from '@vicons/ionicons5'
import { CleverTable, CleverForm } from '@clever-component'
import type { TableColumn, FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateTableCode, generateRandomTableData, delay } from '../../utils/demo-utils'

// 组件引用
const tableRef = ref()
const editFormRef = ref()

// 消息和对话框
const message = useMessage()
const dialog = useDialog()

// 状态
const loading = ref(false)
const saving = ref(false)
const showEditModal = ref(false)
const editMode = ref<'add' | 'edit'>('add')
const searchKeyword = ref('')
const selectedRowKeys = ref<string[]>([])
const operationLog = ref<Array<{ time: string; message: string; type: string }>>([])

// 表格数据
const tableData = ref<any[]>([])
const editFormData = reactive({
  id: '',
  name: '',
  email: '',
  age: null,
  gender: '',
  department: '',
  position: '',
  salary: null,
  status: 'active',
  joinDate: null,
  phone: '',
  address: ''
})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  showQuickJumper: true
})

// 行选择配置
const rowSelection = {
  type: 'checkbox',
  multiple: true
}

// 过滤后的数据
const filteredData = computed(() => {
  if (!searchKeyword.value) return tableData.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(keyword) ||
    item.email.toLowerCase().includes(keyword) ||
    item.department.toLowerCase().includes(keyword) ||
    item.position.toLowerCase().includes(keyword)
  )
})

// 表格列配置
const columns = computed<TableColumn[]>(() => [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    fixed: 'left',
    render: (row: any) => `#${row.id}`
  },
  {
    key: 'name',
    title: '姓名',
    width: 120,
    render: (row: any) => {
      return {
        tag: 'div',
        props: { style: 'font-weight: 500;' },
        children: row.name
      }
    }
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
    ellipsis: true
  },
  {
    key: 'age',
    title: '年龄',
    width: 80,
    render: (row: any) => `${row.age}岁`
  },
  {
    key: 'gender',
    title: '性别',
    width: 80,
    render: (row: any) => {
      const genderMap = {
        male: { text: '男', type: 'info' },
        female: { text: '女', type: 'success' }
      }
      const config = genderMap[row.gender] || { text: '未知', type: 'default' }
      return {
        tag: 'n-tag',
        props: { type: config.type, size: 'small' },
        children: config.text
      }
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
    width: 150,
    ellipsis: true
  },
  {
    key: 'salary',
    title: '薪资',
    width: 120,
    render: (row: any) => {
      const salary = row.salary
      const color = salary >= 20000 ? '#f56c6c' : salary >= 15000 ? '#e6a23c' : '#67c23a'
      return {
        tag: 'span',
        props: { style: `color: ${color}; font-weight: 500;` },
        children: `¥${salary.toLocaleString()}`
      }
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row: any) => {
      const statusMap = {
        active: { text: '在职', type: 'success' },
        inactive: { text: '离职', type: 'error' },
        trial: { text: '试用期', type: 'warning' }
      }
      const config = statusMap[row.status] || { text: '未知', type: 'default' }
      return {
        tag: 'n-tag',
        props: { type: config.type, size: 'small' },
        children: config.text
      }
    }
  },
  {
    key: 'joinDate',
    title: '入职日期',
    width: 120,
    render: (row: any) => new Date(row.joinDate).toLocaleDateString('zh-CN')
  },
  {
    key: 'actions',
    title: '操作',
    width: 180,
    fixed: 'right',
    render: (row: any) => {
      return {
        tag: 'n-space',
        props: { size: 'small' },
        children: [
          {
            tag: 'n-button',
            props: {
              size: 'small',
              type: 'info',
              text: true,
              onClick: () => handleView(row)
            },
            children: [{
              tag: 'n-icon',
              children: { tag: EyeOutline }
            }, '查看']
          },
          {
            tag: 'n-button',
            props: {
              size: 'small',
              type: 'primary',
              text: true,
              onClick: () => handleEdit(row)
            },
            children: [{
              tag: 'n-icon',
              children: { tag: CreateOutline }
            }, '编辑']
          },
          {
            tag: 'n-button',
            props: {
              size: 'small',
              type: 'error',
              text: true,
              onClick: () => handleDelete(row)
            },
            children: [{
              tag: 'n-icon',
              children: { tag: TrashOutline }
            }, '删除']
          }
        ]
      }
    }
  }
])

// 编辑表单字段配置
const editFormSchemas = computed<FormFieldSchema[]>(() => [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    },
    rules: [
      { required: true, message: '请输入姓名' },
      { min: 2, max: 20, message: '姓名长度应在2-20个字符之间' }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入邮箱地址'
    },
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    componentProps: {
      placeholder: '请输入手机号'
    },
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
    ]
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    required: true,
    componentProps: {
      placeholder: '请输入年龄',
      min: 18,
      max: 65
    }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radio-group',
    required: true,
    componentProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    }
  },
  {
    field: 'department',
    label: '部门',
    component: 'select',
    required: true,
    componentProps: {
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' },
        { label: '人事部', value: '人事部' },
        { label: '财务部', value: '财务部' }
      ]
    }
  },
  {
    field: 'position',
    label: '职位',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入职位'
    }
  },
  {
    field: 'salary',
    label: '薪资',
    component: 'input-number',
    required: true,
    componentProps: {
      placeholder: '请输入薪资',
      min: 3000,
      max: 100000,
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'select',
    required: true,
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
        { label: '试用期', value: 'trial' }
      ]
    }
  },
  {
    field: 'joinDate',
    label: '入职日期',
    component: 'date-picker',
    required: true,
    componentProps: {
      placeholder: '请选择入职日期',
      type: 'date'
    }
  },
  {
    field: 'address',
    label: '地址',
    component: 'textarea',
    componentProps: {
      placeholder: '请输入地址',
      rows: 3
    }
  }
])

// 生成演示代码
const demoCode = computed(() => generateTableCode({
  columns: columns.value,
  data: tableData.value.slice(0, 3),
  title: 'CRUD表格示例',
  description: '展示表格的增删改查功能'
}))

// 添加操作日志
const addLog = (message: string, type: string = 'info') => {
  const time = new Date().toLocaleTimeString()
  operationLog.value.unshift({ time, message, type })
  if (operationLog.value.length > 10) {
    operationLog.value.pop()
  }
}

// 重置编辑表单
const resetEditForm = () => {
  Object.assign(editFormData, {
    id: '',
    name: '',
    email: '',
    age: null,
    gender: '',
    department: '',
    position: '',
    salary: null,
    status: 'active',
    joinDate: null,
    phone: '',
    address: ''
  })
}

// 加载数据
const loadData = async () => {
  loading.value = true
  addLog('开始加载数据...')
  
  try {
    await delay(800)
    const data = generateRandomTableData(30)
    tableData.value = data
    pagination.total = data.length
    addLog(`数据加载完成，共${data.length}条记录`, 'success')
  } catch (error) {
    addLog('数据加载失败', 'error')
  } finally {
    loading.value = false
  }
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.page = page
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
}

const handleSelectionChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const handleSearch = () => {
  pagination.page = 1
  if (searchKeyword.value) {
    addLog(`搜索关键词：${searchKeyword.value}`)
  }
}

// CRUD操作
const handleAdd = () => {
  editMode.value = 'add'
  resetEditForm()
  showEditModal.value = true
  addLog('打开新增用户弹窗')
}

const handleEdit = (row: any) => {
  editMode.value = 'edit'
  Object.assign(editFormData, row)
  showEditModal.value = true
  addLog(`编辑用户：${row.name}`)
}

const handleView = (row: any) => {
  dialog.info({
    title: '用户详情',
    content: () => {
      return {
        tag: 'div',
        children: [
          { tag: 'p', children: `姓名：${row.name}` },
          { tag: 'p', children: `邮箱：${row.email}` },
          { tag: 'p', children: `年龄：${row.age}岁` },
          { tag: 'p', children: `性别：${row.gender === 'male' ? '男' : '女'}` },
          { tag: 'p', children: `部门：${row.department}` },
          { tag: 'p', children: `职位：${row.position}` },
          { tag: 'p', children: `薪资：¥${row.salary.toLocaleString()}` },
          { tag: 'p', children: `状态：${row.status}` },
          { tag: 'p', children: `入职日期：${new Date(row.joinDate).toLocaleDateString('zh-CN')}` }
        ]
      }
    },
    positiveText: '确定'
  })
  addLog(`查看用户：${row.name}`)
}

const handleDelete = (row: any) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除用户 "${row.name}" 吗？此操作不可恢复。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      const index = tableData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        tableData.value.splice(index, 1)
        pagination.total = tableData.value.length
        message.success(`用户 "${row.name}" 删除成功`)
        addLog(`删除用户：${row.name}`, 'warning')
      }
    }
  })
}

const handleBatchDelete = () => {
  dialog.warning({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个用户吗？此操作不可恢复。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      const deletedCount = selectedRowKeys.value.length
      tableData.value = tableData.value.filter(item => !selectedRowKeys.value.includes(item.id))
      pagination.total = tableData.value.length
      selectedRowKeys.value = []
      message.success(`批量删除 ${deletedCount} 个用户成功`)
      addLog(`批量删除 ${deletedCount} 个用户`, 'warning')
    }
  })
}

const handleSave = async () => {
  try {
    await editFormRef.value?.validate()
    saving.value = true
    
    await delay(500) // 模拟保存延迟
    
    if (editMode.value === 'add') {
      const newUser = {
        ...editFormData,
        id: Date.now().toString()
      }
      tableData.value.unshift(newUser)
      pagination.total = tableData.value.length
      message.success('新增用户成功')
      addLog(`新增用户：${editFormData.name}`, 'success')
    } else {
      const index = tableData.value.findIndex(item => item.id === editFormData.id)
      if (index > -1) {
        tableData.value[index] = { ...editFormData }
        message.success('编辑用户成功')
        addLog(`编辑用户：${editFormData.name}`, 'success')
      }
    }
    
    showEditModal.value = false
  } catch (error) {
    message.error('表单验证失败，请检查输入')
  } finally {
    saving.value = false
  }
}

// 其他操作
const refreshData = () => {
  loadData()
}

const addRandomData = () => {
  const newData = generateRandomTableData(5)
  tableData.value.unshift(...newData)
  pagination.total = tableData.value.length
  addLog(`添加了${newData.length}条随机数据`, 'success')
}

const clearData = () => {
  tableData.value = []
  pagination.total = 0
  selectedRowKeys.value = []
  addLog('已清空所有数据', 'warning')
}

const handleExport = () => {
  const dataStr = JSON.stringify(tableData.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'users-data.json'
  a.click()
  URL.revokeObjectURL(url)
  addLog('数据导出完成', 'success')
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.log-item {
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
</style>