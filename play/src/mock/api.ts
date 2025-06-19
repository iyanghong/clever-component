// Mock API 服务
import { faker } from '@faker-js/faker'

// 设置中文语言
faker.locale = 'zh_CN'

// 生成用户数据
const generateUser = (id: number) => ({
  id,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  department: faker.helpers.arrayElement(['tech', 'sales', 'marketing', 'hr']),
  status: faker.helpers.arrayElement(['active', 'inactive', 'banned']),
  salary: faker.number.int({ min: 5000, max: 50000 }),
  age: faker.number.int({ min: 22, max: 60 }),
  address: faker.location.streetAddress(),
  avatar: faker.image.avatar(),
  performance: faker.number.int({ min: 0, max: 100 }),
  rating: faker.number.int({ min: 1, max: 5 }),
  joinDate: faker.date.past().toISOString().split('T')[0],
  createdAt: faker.date.past().toISOString(),
  tags: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    text: faker.helpers.arrayElement(['新员工', '优秀', '核心', '管理', '技术专家']),
    type: faker.helpers.arrayElement(['default', 'primary', 'info', 'success', 'warning'])
  }))
})

// 生成文件树数据
const generateFileTree = (depth = 0, parentId = ''): any[] => {
  if (depth > 2) return []
  
  return Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, index) => {
    const id = parentId ? `${parentId}-${index}` : `${index}`
    const isFolder = depth < 2 && faker.datatype.boolean()
    
    return {
      id,
      name: isFolder ? faker.system.directoryPath().split('/').pop() : faker.system.fileName(),
      type: isFolder ? 'folder' : 'file',
      size: isFolder ? '-' : faker.number.int({ min: 1, max: 1000 }) + 'KB',
      modifiedAt: faker.date.recent().toISOString(),
      hasChildren: isFolder,
      children: isFolder ? generateFileTree(depth + 1, id) : undefined
    }
  })
}

// 生成大量用户数据
const generateLargeDataset = (total: number) => {
  return Array.from({ length: total }, (_, index) => generateUser(index + 1))
}

// 模拟 API 响应
export const mockApi = {
  // 基础用户列表
  '/api/users': (params: any) => {
    const { page = 1, pageSize = 10 } = params
    const total = 100
    const start = (page - 1) * pageSize
    const data = Array.from({ length: pageSize }, (_, index) => generateUser(start + index + 1))
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 搜索用户
  '/api/users/search': (params: any) => {
    const { page = 1, pageSize = 10, name, email, department, status } = params
    let data = Array.from({ length: 50 }, (_, index) => generateUser(index + 1))
    
    // 模拟搜索过滤
    if (name) {
      data = data.filter(user => user.name.includes(name))
    }
    if (email) {
      data = data.filter(user => user.email.includes(email))
    }
    if (department) {
      data = data.filter(user => user.department === department)
    }
    if (status) {
      data = data.filter(user => user.status === status)
    }
    
    const total = data.length
    const start = (page - 1) * pageSize
    const list = data.slice(start, start + pageSize)
    
    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 用户列表（带操作）
  '/api/users/list': (params: any) => {
    const { page = 1, pageSize = 10 } = params
    const total = 80
    const start = (page - 1) * pageSize
    const data = Array.from({ length: pageSize }, (_, index) => generateUser(start + index + 1))
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 可编辑用户列表
  '/api/users/editable': (params: any) => {
    const { page = 1, pageSize = 10 } = params
    const total = 60
    const start = (page - 1) * pageSize
    const data = Array.from({ length: pageSize }, (_, index) => generateUser(start + index + 1))
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 更新用户
  '/api/users/update': (data: any) => {
    return {
      code: 200,
      message: '更新成功',
      data: { ...data, updatedAt: new Date().toISOString() }
    }
  },

  // 文件树
  '/api/files/tree': () => {
    return {
      code: 200,
      message: 'success',
      data: {
        list: generateFileTree(),
        total: 20
      }
    }
  },

  // 大数据集
  '/api/users/large-dataset': (params: any) => {
    const { page = 1, pageSize = 50, total = 10000 } = params
    const start = (page - 1) * pageSize
    const data = Array.from({ length: Math.min(pageSize, total - start) }, (_, index) => 
      generateUser(start + index + 1)
    )
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: data,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 可筛选用户列表
  '/api/users/filterable': (params: any) => {
    const { page = 1, pageSize = 10, filters = {} } = params
    let data = Array.from({ length: 100 }, (_, index) => generateUser(index + 1))
    
    // 模拟筛选
    Object.keys(filters).forEach(key => {
      const value = filters[key]
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'age' && Array.isArray(value)) {
          data = data.filter(user => user.age >= value[0] && user.age <= value[1])
        } else if (key === 'salary' && Array.isArray(value)) {
          data = data.filter(user => user.salary >= value[0] && user.salary <= value[1])
        } else {
          data = data.filter(user => user[key] === value)
        }
      }
    })
    
    const total = data.length
    const start = (page - 1) * pageSize
    const list = data.slice(start, start + pageSize)
    
    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 可导出用户列表
  '/api/users/exportable': (params: any) => {
    const { page = 1, pageSize = 10 } = params
    const total = 200
    const start = (page - 1) * pageSize
    const data = Array.from({ length: pageSize }, (_, index) => generateUser(start + index + 1))
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 自定义渲染用户列表
  '/api/users/custom-render': (params: any) => {
    const { page = 1, pageSize = 10 } = params
    const total = 50
    const start = (page - 1) * pageSize
    const data = Array.from({ length: pageSize }, (_, index) => generateUser(start + index + 1))
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }
}

// 模拟网络延迟
export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// API 调用函数
export const callMockApi = async (url: string, method: string = 'GET', params: any = {}, data: any = null) => {
  await delay()
  
  const apiHandler = mockApi[url]
  if (!apiHandler) {
    throw new Error(`API ${url} not found`)
  }
  
  if (method === 'GET') {
    return apiHandler(params)
  } else if (method === 'PUT' || method === 'POST') {
    return apiHandler(data || params)
  }
  
  throw new Error(`Method ${method} not supported`)
}