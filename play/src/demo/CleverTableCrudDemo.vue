<template>
  <div class="clever-table-crud-demo">
    <h2>CleverTable CRUD Demo</h2>
    <p>这个示例展示了如何使用新的 API 配置实现完整的增删改查功能</p>
    
    <!-- 表格组件 -->
    <CleverTable
      ref="tableRef"
      :columns="columns"
      :api-config="apiConfig"
      :form-config="formConfig"
      :action-config="actionConfig"
      :search-config="searchConfig"
      :pagination-config="paginationConfig"
      :delete-config="deleteConfig"
      :save-config="saveConfig"
      :auto-show-actions="true"
      show-selection-column
      show-index-column
      @form-open="handleFormOpen"
    />
    
    <!-- 表单弹窗 -->
    <NModal v-model:show="showForm" :title="formTitle" preset="dialog">
      <CleverForm
        ref="formRef"
        :schemas="formSchemas"
        :model="formData"
        :readonly="formMode === FormMode.VIEW"
        @submit="handleFormSubmit"
      />
      
      <template #action>
        <NSpace>
          <NButton @click="showForm = false">取消</NButton>
          <NButton
            v-if="formMode !== FormMode.VIEW"
            type="primary"
            @click="handleFormSubmit"
            :loading="submitting"
          >
            {{ formMode === FormMode.CREATE ? '创建' : '更新' }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { NModal, NButton, NSpace, useMessage } from 'naive-ui'
import { CleverTable, CleverForm } from '@clever-component/components'
import type { 
  TableColumn, 
  ApiConfig, 
  ActionConfig, 
  SearchConfig, 
  PaginationConfig,
  FormConfig,
  DeleteConfig,
  SaveConfig
} from '@clever-component/components'
import { FormMode } from '@clever-component/components'

const message = useMessage()

// 表格引用
const tableRef = ref()

// 表单相关
const showForm = ref(false)
const formRef = ref()
const formMode = ref<FormMode>(FormMode.CREATE)
const submitting = ref(false)
const formData = ref({})

// 表单标题
const formTitle = computed(() => {
  switch (formMode.value) {
    case FormMode.CREATE:
      return '新增用户'
    case FormMode.EDIT:
      return '编辑用户'
    case FormMode.VIEW:
      return '查看用户'
    default:
      return '表单'
  }
})

// 部门选项
const departmentOptions = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '设计部', value: 'design' },
  { label: '运营部', value: 'operation' }
]

// 表单配置
const formSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    },
    rules: [
      { required: true, message: '请输入姓名' },
      { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符' }
    ]
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    required: true,
    componentProps: {
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入邮箱'
    },
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  },
  {
    field: 'department',
    label: '部门',
    component: 'NSelect',
    required: true,
    componentProps: {
      placeholder: '请选择部门',
      options: departmentOptions
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'NRadioGroup',
    required: true,
    componentProps: {
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

// 表格列配置
const columns: TableColumn[] = [
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
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'department',
    title: '部门',
    width: 120,
    render: (row: any) => {
      const dept = departmentOptions.find(d => d.value === row.department)
      return dept?.label || row.department
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row: any) => {
      return row.status === 'active' ? '激活' : '禁用'
    }
  },
  {
    key: 'createdAt',
    title: '创建时间',
    width: 180
  }
]

// 模拟数据存储
let mockData = [
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    department: 'tech',
    status: 'active',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    department: 'product',
    status: 'active',
    createdAt: '2024-01-02 11:00:00'
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    department: 'design',
    status: 'inactive',
    createdAt: '2024-01-03 12:00:00'
  }
]

let nextId = 4

// 模拟API函数
const mockApi = {
  // 获取列表
  async getList(params: any) {
    console.log('获取列表参数:', params)
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟
    
    const { page = 1, pageSize = 10 } = params
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = mockData.slice(start, end)
    
    return {
      code: 0,
      data: {
        list: data,
        total: mockData.length,
        page,
        pageSize
      },
      message: '获取成功'
    }
  },
  
  // 获取单条记录
  async getById(id: number) {
    console.log('获取记录ID:', id)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const record = mockData.find(item => item.id === id)
    if (record) {
      return {
        code: 0,
        data: record,
        message: '获取成功'
      }
    } else {
      return {
        code: 1,
        message: '记录不存在'
      }
    }
  },
  
  // 创建记录
  async create(data: any) {
    console.log('创建记录:', data)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newRecord = {
      ...data,
      id: nextId++,
      createdAt: new Date().toLocaleString()
    }
    mockData.unshift(newRecord)
    
    return {
      code: 0,
      data: newRecord,
      message: '创建成功'
    }
  },
  
  // 更新记录
  async update(id: number, data: any) {
    console.log('更新记录:', id, data)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const index = mockData.findIndex(item => item.id === id)
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...data }
      return {
        code: 0,
        data: mockData[index],
        message: '更新成功'
      }
    } else {
      return {
        code: 1,
        message: '记录不存在'
      }
    }
  },
  
  // 删除记录
  async delete(id: number) {
    console.log('删除记录ID:', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockData.findIndex(item => item.id === id)
    if (index !== -1) {
      mockData.splice(index, 1)
      return {
        code: 0,
        message: '删除成功'
      }
    } else {
      return {
        code: 1,
        message: '记录不存在'
      }
    }
  },
  
  // 批量删除
  async batchDelete(ids: number[]) {
    console.log('批量删除IDs:', ids)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    mockData = mockData.filter(item => !ids.includes(item.id))
    
    return {
      code: 0,
      message: '批量删除成功'
    }
  }
}

// API配置
const apiConfig: ApiConfig = {
  getPageApi: mockApi.getList,
  getApi: mockApi.getById,
  createApi: mockApi.create,
  updateApi: (data: any) => mockApi.update(data.id, data),
  deleteApi: mockApi.delete,
  batchDeleteApi: (records: any[]) => mockApi.batchDelete(records.map(r => r.id))
}

// 表单配置
const formConfig: FormConfig = {
  schemas: formSchemas,
  labelWidth: 80,
  showRequiredMark: true
}

// 删除配置
const deleteConfig: DeleteConfig = {
  title: '确认删除',
  content: '确定要删除这条记录吗？删除后无法恢复。',
  okText: '确认删除',
  cancelText: '取消'
}

// 保存配置
const saveConfig: SaveConfig = {
  beforeSave: (data: any, isEdit: boolean) => {
    console.log('保存前处理:', data, isEdit)
    // 可以在这里进行数据验证或转换
    return data
  },
  afterSave: (result: any, isEdit: boolean) => {
    console.log('保存后处理:', result, isEdit)
    message.success(isEdit ? '更新成功' : '创建成功')
  }
}

// 操作列配置
const actionConfig: ActionConfig = {
  title: '操作',
  width: 200,
  align: 'center',
  showView: true,
  showEdit: true,
  showDelete: true,
  customButtons: [
    {
      key: 'reset-password',
      label: '重置密码',
      type: 'warning',
      handler: (record) => {
        message.info(`重置密码: ${record.name}`)
      }
    }
  ]
}

// 搜索配置
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
      field: 'email',
      label: '邮箱',
      component: 'NInput',
      componentProps: {
        placeholder: '请输入邮箱'
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
          { label: '禁用', value: 'inactive' }
        ]
      }
    }
  ]
}

// 分页配置
const paginationConfig: PaginationConfig = {
  show: true,
  pageSizes: [10, 20, 50, 100],
  showQuickJumper: true,
  showSizePicker: true
}

// 处理表单打开
function handleFormOpen(mode: FormMode, record?: any) {
  console.log('表单打开:', mode, record)
  formMode.value = mode
  formData.value = record || {}
  showForm.value = true
}

// 处理表单提交
async function handleFormSubmit() {
  try {
    const valid = await formRef.value?.validate()
    if (valid) {
      submitting.value = true
      const isEdit = formMode.value === FormMode.EDIT
      await tableRef.value?.handleSave(formData.value, isEdit)
      showForm.value = false
      // 成功消息由 saveConfig.afterSave 处理
    }
  } catch (error) {
    console.error('表单提交失败:', error)
    message.error('操作失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.clever-table-crud-demo {
  padding: 20px;
}

.clever-table-crud-demo h2 {
  margin-bottom: 10px;
  color: #333;
}

.clever-table-crud-demo p {
  margin-bottom: 20px;
  color: #666;
}
</style>