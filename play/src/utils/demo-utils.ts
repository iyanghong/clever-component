import type { FormSchema } from '@/components/clever-form/src/types/form'
import type { TableColumn } from '@/components/clever-table/src/types'

/**
 * Demo 工具函数集合
 */

// ==================== 通用工具 ====================

/**
 * 生成随机ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * 生成随机ID (别名)
 */
export const generateRandomId = (): string => {
  return generateId()
}

/**
 * 延迟函数
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 模拟API请求
 */
export const mockApiRequest = async <T>(data: T, delayMs = 1000): Promise<T> => {
  await delay(delayMs)
  return data
}

/**
 * 生成随机数据
 */
export const generateRandomData = {
  // 生成随机姓名
  name: (): string => {
    const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
    const lastNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋']
    return firstNames[Math.floor(Math.random() * firstNames.length)] + 
           lastNames[Math.floor(Math.random() * lastNames.length)]
  },
  
  // 生成随机邮箱
  email: (): string => {
    const domains = ['gmail.com', '163.com', 'qq.com', 'sina.com']
    const username = Math.random().toString(36).substr(2, 8)
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `${username}@${domain}`
  },
  
  // 生成随机手机号
  phone: (): string => {
    const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return prefix + suffix
  },
  
  // 生成随机地址
  address: (): string => {
    const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市']
    const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区']
    const streets = ['中关村大街', '王府井大街', '长安街', '建国门外大街']
    
    const city = cities[Math.floor(Math.random() * cities.length)]
    const district = districts[Math.floor(Math.random() * districts.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const number = Math.floor(Math.random() * 999) + 1
    
    return `${city}${district}${street}${number}号`
  },
  
  // 生成随机年龄
  age: (): number => {
    return Math.floor(Math.random() * 50) + 18
  },
  
  // 生成随机日期
  date: (): string => {
    const start = new Date(2020, 0, 1)
    const end = new Date()
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
    return new Date(randomTime).toISOString().split('T')[0]
  },
  
  // 生成随机状态
  status: (): string => {
    const statuses = ['active', 'inactive', 'pending', 'disabled']
    return statuses[Math.floor(Math.random() * statuses.length)]
  }
}

// ==================== 表单相关 ====================

/**
 * 常用表单字段配置
 */
export const commonFormFields = {
  // 基础字段
  name: (): FormSchema => ({
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入姓名'
    },
    rules: [
      { required: true, message: '请输入姓名' },
      { min: 2, max: 10, message: '姓名长度在2-10个字符' }
    ]
  }),
  
  email: (): FormSchema => ({
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入邮箱地址'
    },
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  }),
  
  phone: (): FormSchema => ({
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入手机号'
    },
    rules: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
    ]
  }),
  
  age: (): FormSchema => ({
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: {
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    },
    rules: [
      { required: true, message: '请输入年龄' },
      { type: 'number', min: 1, max: 120, message: '年龄必须在1-120之间' }
    ]
  }),
  
  gender: (): FormSchema => ({
    field: 'gender',
    label: '性别',
    component: 'NSelect',
    componentProps: {
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    rules: [
      { required: true, message: '请选择性别' }
    ]
  }),
  
  birthday: (): FormSchema => ({
    field: 'birthday',
    label: '生日',
    component: 'NDatePicker',
    componentProps: {
      placeholder: '请选择生日',
      type: 'date'
    }
  }),
  
  address: (): FormSchema => ({
    field: 'address',
    label: '地址',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入地址',
      type: 'textarea',
      rows: 3
    }
  }),
  
  remark: (): FormSchema => ({
    field: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入备注信息',
      type: 'textarea',
      rows: 4
    }
  })
}

/**
 * 生成表单测试数据
 */
export const generateFormData = (fields: string[]): Record<string, any> => {
  const data: Record<string, any> = {}
  
  fields.forEach(field => {
    switch (field) {
      case 'name':
        data[field] = generateRandomData.name()
        break
      case 'email':
        data[field] = generateRandomData.email()
        break
      case 'phone':
        data[field] = generateRandomData.phone()
        break
      case 'age':
        data[field] = generateRandomData.age()
        break
      case 'gender':
        data[field] = Math.random() > 0.5 ? 'male' : 'female'
        break
      case 'birthday':
        data[field] = generateRandomData.date()
        break
      case 'address':
        data[field] = generateRandomData.address()
        break
      case 'status':
        data[field] = generateRandomData.status()
        break
      default:
        data[field] = ''
    }
  })
  
  return data
}

/**
 * 生成随机用户数据
 */
export const generateRandomUserData = (): Record<string, any> => {
  return {
    id: generateRandomId(),
    name: generateRandomData.name(),
    email: generateRandomData.email(),
    phone: generateRandomData.phone(),
    age: generateRandomData.age(),
    gender: Math.random() > 0.5 ? 'male' : 'female',
    birthday: generateRandomData.date(),
    address: generateRandomData.address(),
    status: generateRandomData.status(),
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
}

// ==================== 表格相关 ====================

/**
 * 常用表格列配置
 */
export const commonTableColumns = {
  id: (): TableColumn => ({
    key: 'id',
    title: 'ID',
    width: 80,
    align: 'center'
  }),
  
  name: (): TableColumn => ({
    key: 'name',
    title: '姓名',
    width: 100
  }),
  
  email: (): TableColumn => ({
    key: 'email',
    title: '邮箱',
    width: 200
  }),
  
  phone: (): TableColumn => ({
    key: 'phone',
    title: '手机号',
    width: 120
  }),
  
  age: (): TableColumn => ({
    key: 'age',
    title: '年龄',
    width: 80,
    align: 'center'
  }),
  
  gender: (): TableColumn => ({
    key: 'gender',
    title: '性别',
    width: 80,
    align: 'center',
    render: (row: any) => {
      return row.gender === 'male' ? '男' : '女'
    }
  }),
  
  address: (): TableColumn => ({
    key: 'address',
    title: '地址',
    minWidth: 200,
    ellipsis: {
      tooltip: true
    }
  }),
  
  status: (): TableColumn => ({
    key: 'status',
    title: '状态',
    width: 100,
    align: 'center'
  }),
  
  createTime: (): TableColumn => ({
    key: 'createTime',
    title: '创建时间',
    width: 180,
    render: (row: any) => {
      return new Date(row.createTime).toLocaleString()
    }
  }),
  
  updateTime: (): TableColumn => ({
    key: 'updateTime',
    title: '更新时间',
    width: 180,
    render: (row: any) => {
      return new Date(row.updateTime).toLocaleString()
    }
  })
}

/**
 * 生成表格测试数据
 */
export const generateTableData = (count: number, columns: string[]): any[] => {
  const data: any[] = []
  
  for (let i = 0; i < count; i++) {
    const row: any = {
      id: i + 1,
      key: i + 1
    }
    
    columns.forEach(column => {
      if (column === 'id' || column === 'key') return
      
      switch (column) {
        case 'name':
          row[column] = generateRandomData.name()
          break
        case 'email':
          row[column] = generateRandomData.email()
          break
        case 'phone':
          row[column] = generateRandomData.phone()
          break
        case 'age':
          row[column] = generateRandomData.age()
          break
        case 'gender':
          row[column] = Math.random() > 0.5 ? 'male' : 'female'
          break
        case 'address':
          row[column] = generateRandomData.address()
          break
        case 'status':
          row[column] = generateRandomData.status()
          break
        case 'createTime':
        case 'updateTime':
          row[column] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
          break
        default:
          row[column] = `${column}_${i + 1}`
      }
    })
    
    data.push(row)
  }
  
  return data
}

// ==================== 代码生成 ====================

/**
 * 生成Vue组件代码
 */
export const generateVueCode = (options: {
  template: string
  script: string
  style?: string
}): string => {
  const { template, script, style } = options
  
  let code = `<template>
${template}
</template>

<script setup lang="ts">
${script}
</script>`
  
  if (style) {
    code += `

<style scoped>
${style}
</style>`
  }
  
  return code
}

/**
 * 格式化JSON
 */
export const formatJson = (obj: any, indent = 2): string => {
  return JSON.stringify(obj, null, indent)
}

/**
 * 生成表单配置代码
 */
export const generateFormConfigCode = (schemas: FormSchema[]): string => {
  return `const schemas = ${formatJson(schemas)}`
}

/**
 * 生成表单代码
 */
export const generateFormCode = (options: {
  schemas: any[]
  model: Record<string, any>
  title?: string
  description?: string
}): string => {
  const { schemas, model, title, description } = options
  
  const template = `  <div class="demo-container">
    ${title ? `<h3>${title}</h3>` : ''}
    ${description ? `<p class="description">${description}</p>` : ''}
    <CleverForm
      :schemas="schemas"
      v-model="formData"
      @submit="handleSubmit"
    />
  </div>`
  
  const script = `import { ref } from 'vue'
import { CleverForm } from '@clever-component/components'

const schemas = ${formatJson(schemas)}

const formData = ref(${formatJson(model)})

const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
}`
  
  const style = `.demo-container {
  padding: 20px;
}

.description {
  color: #666;
  margin-bottom: 20px;
}`
  
  return generateVueCode({ template, script, style })
}

/**
 * 生成表格配置代码
 */
export const generateTableConfigCode = (columns: TableColumn[]): string => {
  return `const columns = ${formatJson(columns)}`
}

// ==================== 主题相关 ====================

/**
 * 获取当前主题
 */
export const getCurrentTheme = (): 'light' | 'dark' => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * 切换主题
 */
export const toggleTheme = (): void => {
  document.documentElement.classList.toggle('dark')
}

// ==================== 本地存储 ====================

// 生成表格代码
export function generateTableCode(options: {
  columns: any[]
  data: any[]
  title: string
  description: string
}): string {
  const { columns, data, title, description } = options
  
  // 生成列定义代码
  const columnsCode = JSON.stringify(columns, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"(function[^"]+)"/g, '$1')
  
  // 生成数据代码
  const dataCode = JSON.stringify(data, null, 2)
  
  return `<template>
  <div class="table-demo">
    <h3>${title}</h3>
    <p>${description}</p>
    <CleverTable
      :columns="columns"
      :data="data"
      :pagination="pagination"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CleverTable } from '@clever-component'

// 表格列定义
const columns = ref(${columnsCode})

// 表格数据
const data = ref(${dataCode})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: data.value.length
})

// 分页变化处理
const handlePageChange = (page: number) => {
  pagination.page = page
}
</script>

<style scoped>
.table-demo {
  padding: 16px;
}

.table-demo h3 {
  margin-bottom: 8px;
  color: #333;
}

.table-demo p {
  margin-bottom: 16px;
  color: #666;
}
</style>`
}

// 生成随机表格数据
export function generateRandomTableData(count: number): any[] {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: generateId(),
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      age: Math.floor(Math.random() * 50) + 18,
      gender: Math.random() > 0.5 ? '男' : '女',
      department: ['技术部', '产品部', '运营部', '市场部', '人事部'][Math.floor(Math.random() * 5)],
      position: ['工程师', '产品经理', '运营专员', '市场专员', '人事专员'][Math.floor(Math.random() * 5)],
      salary: Math.floor(Math.random() * 20000) + 8000,
      status: Math.random() > 0.2 ? '在职' : '离职',
      createTime: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0]
    })
  }
  return data
}

/**
 * 本地存储工具
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 忽略存储错误
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // 忽略删除错误
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch {
      // 忽略清空错误
    }
  }
}