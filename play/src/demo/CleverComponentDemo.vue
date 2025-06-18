<template>
  <div class="demo-container">
    <n-space vertical :size="24">
      <!-- 页面标题 -->
      <n-card>
        <template #header>
          <n-space align="center">
            <n-icon size="24" color="#18a058">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </n-icon>
            <h1 style="margin: 0; font-size: 24px;">Clever Component 演示</h1>
          </n-space>
        </template>
        <p style="margin: 0; color: #666;">基于 Vue 3 + TypeScript + Naive UI 的智能组件库演示</p>
      </n-card>

      <!-- 用户管理表格 -->
      <n-card title="用户管理表格">
        <template #header-extra>
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></n-icon>
              </template>
              新增用户
            </n-button>
            <n-button @click="handleRefreshTable">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></n-icon>
              </template>
              刷新
            </n-button>
          </n-space>
        </template>
        
        <CleverTable
          ref="userTableRef"
          :columns="userColumns"
          :api-config="userApiConfig"
          :search-config="userSearchConfig"
          :actions="userActions"
          :header-actions="userHeaderActions"
          :show-selection-column="true"
          :show-index-column="true"
          @selection-change="handleSelectionChange"
        />
      </n-card>

      <!-- 用户表单弹窗 -->
      <CleverForm
        ref="userFormRef"
        :schemas="userFormSchemas"
        :is-popup="true"
        :popup-option="{
          mode: 'modal',
          title: formTitle,
          width: 600
        }"
        v-model:visible-popup="userFormVisible"
        @submit="handleUserSubmit"
        @reset="handleUserReset"
      />

      <!-- 产品管理表格（Drawer模式表单） -->
      <n-card title="产品管理表格">
        <template #header-extra>
          <n-button type="primary" @click="handleAddProduct">
            <template #icon>
              <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></n-icon>
            </template>
            新增产品
          </n-button>
        </template>
        
        <CleverTable
          ref="productTableRef"
          :columns="productColumns"
          :data="productData"
          :auto-load="false"
          :actions="productActions"
          :pagination-config="{ show: true, pageSize: 5 }"
        />
      </n-card>

      <!-- 产品表单抽屉 -->
      <CleverForm
        ref="productFormRef"
        :schemas="productFormSchemas"
        :is-popup="true"
        :popup-option="{
          mode: 'drawer',
          title: '产品信息',
          width: 500,
          placement: 'right'
        }"
        v-model:visible-popup="productFormVisible"
        @submit="handleProductSubmit"
      />

      <!-- 独立弹窗组件演示 -->
      <n-card title="独立弹窗组件演示">
        <n-space>
          <n-button @click="showModalDemo">Modal 弹窗</n-button>
          <n-button @click="showDrawerDemo">Drawer 抽屉</n-button>
        </n-space>
        
        <!-- Modal 演示 -->
        <CleverPopup
          v-model:visible="modalVisible"
          mode="modal"
          title="Modal 演示"
          :width="400"
        >
          <div style="padding: 20px;">
            <p>这是一个 Modal 弹窗的演示内容。</p>
            <p>支持自定义宽度、标题等属性。</p>
          </div>
          <template #footer>
            <n-space justify="end">
              <n-button @click="modalVisible = false">取消</n-button>
              <n-button type="primary" @click="modalVisible = false">确定</n-button>
            </n-space>
          </template>
        </CleverPopup>

        <!-- Drawer 演示 -->
        <CleverPopup
          v-model:visible="drawerVisible"
          mode="drawer"
          title="Drawer 演示"
          :width="300"
          placement="left"
        >
          <div style="padding: 20px;">
            <p>这是一个 Drawer 抽屉的演示内容。</p>
            <p>支持四个方向的定位：top、right、bottom、left。</p>
            <p>当前演示的是左侧抽屉。</p>
          </div>
        </CleverPopup>
      </n-card>

      <!-- 表单组件独立演示 -->
      <n-card title="表单组件独立演示">
        <CleverForm
          :schemas="demoFormSchemas"
          :grid-props="{ cols: 2, xGap: 16, yGap: 16 }"
          :show-action-button-group="true"
          :submit-button-options="{ text: '提交表单' }"
          :reset-button-options="{ text: '重置表单' }"
          @submit="handleDemoSubmit"
          @reset="handleDemoReset"
        />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed,h} from 'vue'
import { useMessage } from 'naive-ui'
import { CleverTable, CleverForm, CleverPopup } from '../../../packages'
import type { TableColumn, TableAction, HeaderAction } from '../../../packages/components/clever-table/src/types'
import type { FormSchema } from '../../../packages/components/clever-form/src/types/form'

const message = useMessage()

// 表格引用
const userTableRef = ref()
const productTableRef = ref()

// 表单引用
const userFormRef = ref()
const productFormRef = ref()

// 弹窗状态
const userFormVisible = ref(false)
const productFormVisible = ref(false)
const modalVisible = ref(false)
const drawerVisible = ref(false)

// 表单标题
const formTitle = ref('新增用户')

// 选中的行
const selectedRowKeys = ref<(string | number)[]>([])

// 用户表格配置
const userColumns: TableColumn[] = [
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
    key: 'phone',
    title: '电话',
    width: 150
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
    render: (record) => {
      return h('n-tag', {
        type: record.status === 'active' ? 'success' : 'warning'
      }, () => record.status === 'active' ? '激活' : '禁用')
    }
  }
]

// 用户表格操作
const userActions: TableAction[] = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: (record) => {
      handleEdit(record)
    }
  },
  {
    key: 'delete',
    label: '删除',
    type: 'error',
    onClick: (record) => {
      handleDelete(record)
    },
    confirm: {
      title: '确认删除',
      content: '确定要删除这个用户吗？'
    }
  }
]

// 用户表格头部操作
const userHeaderActions: HeaderAction[] = [
  {
    key: 'batchDelete',
    label: '批量删除',
    type: 'error',
    disabled: computed(() => selectedRowKeys.value.length === 0),
    onClick: () => {
      handleBatchDelete()
    }
  }
]

// 用户API配置
const userApiConfig = {
  listApi: async (params: any) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockData = [
      { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', phone: '13800138001', department: '技术部', status: 'active' },
      { id: 2, name: '李四', age: 30, email: 'lisi@example.com', phone: '13800138002', department: '产品部', status: 'active' },
      { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', phone: '13800138003', department: '设计部', status: 'inactive' },
      { id: 4, name: '赵六', age: 32, email: 'zhaoliu@example.com', phone: '13800138004', department: '运营部', status: 'active' },
      { id: 5, name: '钱七', age: 26, email: 'qianqi@example.com', phone: '13800138005', department: '技术部', status: 'active' }
    ]
    
    // 模拟搜索过滤
    let filteredData = mockData
    if (params.name) {
      filteredData = filteredData.filter(item => item.name.includes(params.name))
    }
    if (params.department) {
      filteredData = filteredData.filter(item => item.department === params.department)
    }
    
    // 模拟分页
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredData.slice(start, end)
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list,
        total: filteredData.length
      }
    }
  },
  deleteApi: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      code: 0,
      message: '删除成功',
      data: true
    }
  }
}

// 用户搜索配置
const userSearchConfig = {
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
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '运营部', value: '运营部' }
        ]
      }
    }
  ] as FormSchema[]
}

// 用户表单配置
const userFormSchemas: FormSchema[] = [
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
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    required: true,
    componentProps: {
      placeholder: '请输入年龄',
      min: 1,
      max: 100
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
    field: 'department',
    label: '部门',
    component: 'NSelect',
    required: true,
    componentProps: {
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' },
        { label: '运营部', value: '运营部' }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'NRadioGroup',
    defaultValue: 'active',
    componentProps: {
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

// 产品数据
const productData = ref([
  { id: 1, name: 'iPhone 15', price: 5999, category: '手机', stock: 100, description: '最新款iPhone' },
  { id: 2, name: 'MacBook Pro', price: 12999, category: '电脑', stock: 50, description: '专业级笔记本电脑' },
  { id: 3, name: 'iPad Air', price: 4399, category: '平板', stock: 80, description: '轻薄平板电脑' },
  { id: 4, name: 'AirPods Pro', price: 1999, category: '耳机', stock: 200, description: '无线降噪耳机' },
  { id: 5, name: 'Apple Watch', price: 2999, category: '手表', stock: 120, description: '智能手表' }
])

// 产品表格配置
const productColumns: TableColumn[] = [
  { key: 'name', title: '产品名称', width: 150 },
  { 
    key: 'price', 
    title: '价格', 
    width: 120,
    render: (record) => `¥${record.price}`
  },
  { key: 'category', title: '分类', width: 100 },
  { key: 'stock', title: '库存', width: 80 },
  { key: 'description', title: '描述', width: 200 }
]

// 产品表格操作
const productActions: TableAction[] = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: (record) => {
      handleEditProduct(record)
    }
  },
  {
    key: 'delete',
    label: '删除',
    type: 'error',
    onClick: (record) => {
      handleDeleteProduct(record)
    }
  }
]

// 产品表单配置
const productFormSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '产品名称',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入产品名称'
    }
  },
  {
    field: 'price',
    label: '价格',
    component: 'NInputNumber',
    required: true,
    componentProps: {
      placeholder: '请输入价格',
      min: 0,
      precision: 2
    }
  },
  {
    field: 'category',
    label: '分类',
    component: 'NSelect',
    required: true,
    componentProps: {
      placeholder: '请选择分类',
      options: [
        { label: '手机', value: '手机' },
        { label: '电脑', value: '电脑' },
        { label: '平板', value: '平板' },
        { label: '耳机', value: '耳机' },
        { label: '手表', value: '手表' }
      ]
    }
  },
  {
    field: 'stock',
    label: '库存',
    component: 'NInputNumber',
    required: true,
    componentProps: {
      placeholder: '请输入库存数量',
      min: 0
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'NInput',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入产品描述',
      rows: 3
    }
  }
]

// 演示表单配置
const demoFormSchemas: FormSchema[] = [
  {
    field: 'input',
    label: '输入框',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入内容'
    }
  },
  {
    field: 'number',
    label: '数字输入',
    component: 'NInputNumber',
    componentProps: {
      placeholder: '请输入数字'
    }
  },
  {
    field: 'select',
    label: '选择器',
    component: 'NSelect',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ]
    }
  },
  {
    field: 'date',
    label: '日期选择',
    component: 'NDatePicker',
    componentProps: {
      placeholder: '请选择日期',
      type: 'date'
    }
  },
  {
    field: 'switch',
    label: '开关',
    component: 'NSwitch',
    defaultValue: false
  },
  {
    field: 'radio',
    label: '单选框',
    component: 'NRadioGroup',
    componentProps: {
      options: [
        { label: '选项A', value: 'A' },
        { label: '选项B', value: 'B' }
      ]
    }
  },
  {
    field: 'checkbox',
    label: '多选框',
    component: 'NCheckboxGroup',
    componentProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ]
    }
  },
  {
    field: 'textarea',
    label: '文本域',
    component: 'NInput',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入多行文本',
      rows: 3
    }
  }
]

// 事件处理函数
function handleAdd() {
  formTitle.value = '新增用户'
  userFormVisible.value = true
  userFormRef.value?.resetFields()
}

function handleEdit(record: any) {
  formTitle.value = '编辑用户'
  userFormVisible.value = true
  nextTick(() => {
    userFormRef.value?.setFormData(record)
  })
}

function handleDelete(record: any) {
  message.success(`删除用户：${record.name}`)
  userTableRef.value?.handleRefresh()
}

function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的用户')
    return
  }
  message.success(`批量删除 ${selectedRowKeys.value.length} 个用户`)
  selectedRowKeys.value = []
  userTableRef.value?.handleRefresh()
}

function handleRefreshTable() {
  userTableRef.value?.handleRefresh()
  message.success('刷新成功')
}

function handleSelectionChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

function handleUserSubmit(values: any) {
  console.log('用户表单提交：', values)
  message.success('用户信息保存成功')
  userFormVisible.value = false
  userTableRef.value?.handleRefresh()
}

function handleUserReset() {
  message.info('表单已重置')
}

function handleAddProduct() {
  productFormVisible.value = true
  productFormRef.value?.resetFields()
}

function handleEditProduct(record: any) {
  productFormVisible.value = true
  nextTick(() => {
    productFormRef.value?.setFormData(record)
  })
}

function handleDeleteProduct(record: any) {
  const index = productData.value.findIndex(item => item.id === record.id)
  if (index > -1) {
    productData.value.splice(index, 1)
    message.success(`删除产品：${record.name}`)
  }
}

function handleProductSubmit(values: any) {
  console.log('产品表单提交：', values)
  if (values.id) {
    // 编辑
    const index = productData.value.findIndex(item => item.id === values.id)
    if (index > -1) {
      productData.value[index] = { ...values }
    }
    message.success('产品信息更新成功')
  } else {
    // 新增
    const newProduct = {
      ...values,
      id: Date.now()
    }
    productData.value.unshift(newProduct)
    message.success('产品添加成功')
  }
  productFormVisible.value = false
}

function showModalDemo() {
  modalVisible.value = true
}

function showDrawerDemo() {
  drawerVisible.value = true
}

function handleDemoSubmit(values: any) {
  console.log('演示表单提交：', values)
  message.success('表单提交成功')
}

function handleDemoReset() {
  message.info('表单已重置')
}
</script>

<style scoped>
.demo-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.n-card) {
  border-radius: 8px;
}

:deep(.n-card .n-card-header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.n-card .n-card__content) {
  padding: 20px;
}
</style>