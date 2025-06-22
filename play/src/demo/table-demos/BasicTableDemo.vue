<template>
  <DemoContainer
    title="基础表格"
    description="展示CleverTable的基础功能，包括数据展示、排序、筛选等。"
    :code="demoCode"
  >
    <CleverTable
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @row-click="handleRowClick"
    />
    
    <template #actions>
      <n-space>
        <n-button @click="refreshData" :loading="loading">刷新数据</n-button>
        <n-button @click="addRandomData" secondary>添加随机数据</n-button>
        <n-button @click="clearData" secondary>清空数据</n-button>
        <n-button @click="exportData" secondary>导出数据</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="selectedRow" type="info">
        <div>选中行数据：</div>
        <pre>{{ JSON.stringify(selectedRow, null, 2) }}</pre>
      </n-alert>
      
      <n-alert v-if="operationLog.length > 0" type="success" style="margin-top: 12px;">
        <div>操作日志：</div>
        <div v-for="(log, index) in operationLog" :key="index" class="log-item">
          <n-tag size="small" type="info">{{ log.time }}</n-tag>
          {{ log.message }}
        </div>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { NSpace, NButton, NAlert, NTag } from 'naive-ui'
import { CleverTable } from '@clever-component'
import type { TableColumn } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateTableCode, generateRandomTableData, delay } from '../../utils/demo-utils'

// 表格引用
const tableRef = ref()

// 状态
const loading = ref(false)
const selectedRow = ref(null)
const operationLog = ref<Array<{ time: string; message: string }>>([])

// 表格数据
const tableData = ref<any[]>([])

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  showQuickJumper: true
})

// 表格列配置
const columns = computed<TableColumn[]>(() => [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    fixed: 'left',
    sorter: true,
    render: (row: any) => `#${row.id}`
  },
  {
    key: 'name',
    title: '姓名',
    width: 120,
    sorter: true,
    filter: {
      type: 'input',
      placeholder: '搜索姓名'
    },
    render: (row: any) => {
      return {
        tag: 'div',
        props: { style: 'font-weight: 500; color: var(--n-text-color);' },
        children: row.name
      }
    }
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
    ellipsis: true,
    filter: {
      type: 'input',
      placeholder: '搜索邮箱'
    }
  },
  {
    key: 'age',
    title: '年龄',
    width: 80,
    sorter: true,
    filter: {
      type: 'select',
      options: [
        { label: '18-25岁', value: '18-25' },
        { label: '26-35岁', value: '26-35' },
        { label: '36-45岁', value: '36-45' },
        { label: '46岁以上', value: '46+' }
      ]
    },
    render: (row: any) => `${row.age}岁`
  },
  {
    key: 'gender',
    title: '性别',
    width: 80,
    filter: {
      type: 'select',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
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
    width: 120,
    filter: {
      type: 'select',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' }
      ]
    }
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
    sorter: true,
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
    filter: {
      type: 'select',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
        { label: '试用期', value: 'trial' }
      ]
    },
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
    sorter: true,
    render: (row: any) => new Date(row.joinDate).toLocaleDateString('zh-CN')
  },
  {
    key: 'actions',
    title: '操作',
    width: 150,
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
              type: 'primary',
              text: true,
              onClick: () => handleView(row)
            },
            children: '查看'
          },
          {
            tag: 'n-button',
            props: {
              size: 'small',
              type: 'info',
              text: true,
              onClick: () => handleEdit(row)
            },
            children: '编辑'
          },
          {
            tag: 'n-button',
            props: {
              size: 'small',
              type: 'error',
              text: true,
              onClick: () => handleDelete(row)
            },
            children: '删除'
          }
        ]
      }
    }
  }
])

// 生成演示代码
const demoCode = computed(() => generateTableCode({
  columns: columns.value,
  data: tableData.value.slice(0, 3), // 只显示前3条数据作为示例
  title: '基础表格示例',
  description: '展示表格的基础功能'
}))

// 添加操作日志
const addLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  operationLog.value.unshift({ time, message })
  if (operationLog.value.length > 10) {
    operationLog.value.pop()
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  addLog('开始加载数据...')
  
  try {
    await delay(800) // 模拟网络延迟
    const data = generateRandomTableData(50) // 生成50条随机数据
    tableData.value = data
    pagination.total = data.length
    addLog(`数据加载完成，共${data.length}条记录`)
  } catch (error) {
    addLog('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.page = page
  addLog(`切换到第${page}页`)
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  addLog(`每页显示${pageSize}条记录`)
}

const handleSortChange = (sortInfo: any) => {
  const { key, order } = sortInfo
  if (order) {
    addLog(`按${key}字段${order === 'ascend' ? '升序' : '降序'}排序`)
    // 这里可以实现实际的排序逻辑
    tableData.value.sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (order === 'ascend') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  } else {
    addLog(`取消${key}字段排序`)
  }
}

const handleFilterChange = (filterInfo: any) => {
  const filters = Object.entries(filterInfo)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ')
  
  if (filters) {
    addLog(`应用筛选条件：${filters}`)
  } else {
    addLog('清除所有筛选条件')
  }
}

const handleRowClick = (row: any) => {
  selectedRow.value = row
  addLog(`选中行：${row.name} (ID: ${row.id})`)
}

const handleView = (row: any) => {
  selectedRow.value = row
  addLog(`查看用户：${row.name}`)
}

const handleEdit = (row: any) => {
  addLog(`编辑用户：${row.name}`)
  // 这里可以打开编辑弹窗
}

const handleDelete = (row: any) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    tableData.value.splice(index, 1)
    pagination.total = tableData.value.length
    addLog(`删除用户：${row.name}`)
  }
}

// 操作方法
const refreshData = () => {
  loadData()
}

const addRandomData = () => {
  const newData = generateRandomTableData(10)
  tableData.value.unshift(...newData)
  pagination.total = tableData.value.length
  addLog(`添加了${newData.length}条随机数据`)
}

const clearData = () => {
  tableData.value = []
  pagination.total = 0
  selectedRow.value = null
  addLog('已清空所有数据')
}

const exportData = () => {
  const dataStr = JSON.stringify(tableData.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'table-data.json'
  a.click()
  URL.revokeObjectURL(url)
  addLog('数据导出完成')
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 200px;
  overflow: auto;
}

.log-item {
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
</style>