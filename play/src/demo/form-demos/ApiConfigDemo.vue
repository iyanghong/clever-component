<template>
  <div class="api-config-demo">
    <h3>API 配置</h3>
    <p>演示如何通过 API 配置动态生成表单</p>
    
    <div class="demo-container">
      <div class="api-controls">
        <button @click="loadUserForm" class="load-btn">加载用户表单</button>
        <button @click="loadProductForm" class="load-btn">加载产品表单</button>
        <button @click="loadCustomForm" class="load-btn">加载自定义表单</button>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <CleverForm
        v-else-if="formSchemas.length"
        :schemas="formSchemas"
        :data="formData"
        @submit="handleSubmit"
      />
      
      <div class="form-data">
        <h4>表单数据：</h4>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
      
      <div class="schema-display">
        <h4>Schema 配置：</h4>
        <pre>{{ JSON.stringify(formSchemas, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'

// 状态管理
const formData = ref<Record<string, any>>({})
const formSchemas = ref<FormFieldSchema[]>([])
const loading = ref(false)

// 模拟 API 数据
const apiSchemas = {
  user: {
    title: '用户信息表单',
    description: '用户基本信息录入',
    layout: { type: 'grid', columns: 2, gap: 16 },
    fields: [
      {
        name: 'username',
        label: '用户名',
        component: 'input',
        props: {
          placeholder: '请输入用户名'
        },
        rules: [
          { required: true, message: '请输入用户名' },
          { min: 3, max: 20, message: '用户名长度为3-20个字符' }
        ]
      },
      {
        name: 'email',
        label: '邮箱',
        component: 'input',
        props: {
          type: 'email',
          placeholder: '请输入邮箱地址'
        },
        rules: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]
      },
      {
        name: 'phone',
        label: '手机号',
        component: 'input',
        props: {
          placeholder: '请输入手机号'
        },
        rules: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
        ]
      },
      {
        name: 'gender',
        label: '性别',
        component: 'radio-group',
        props: {
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
            { label: '其他', value: 'other' }
          ]
        },
        rules: [{ required: true, message: '请选择性别' }]
      },
      {
        name: 'birthday',
        label: '生日',
        component: 'date-picker',
        props: {
          placeholder: '请选择生日'
        }
      },
      {
        name: 'address',
        label: '地址',
        component: 'textarea',
        props: {
          placeholder: '请输入详细地址',
          rows: 3
        },
        span: 2
      }
    ]
  },
  product: {
    title: '产品信息表单',
    description: '产品基本信息录入',
    layout: { type: 'flex', direction: 'column', gap: 16 },
    fields: [
      {
        name: 'name',
        label: '产品名称',
        component: 'input',
        props: {
          placeholder: '请输入产品名称'
        },
        rules: [{ required: true, message: '请输入产品名称' }]
      },
      {
        name: 'category',
        label: '产品分类',
        component: 'select',
        props: {
          placeholder: '请选择产品分类',
          options: [
            { label: '电子产品', value: 'electronics' },
            { label: '服装鞋帽', value: 'clothing' },
            { label: '家居用品', value: 'home' },
            { label: '图书音像', value: 'books' },
            { label: '其他', value: 'other' }
          ]
        },
        rules: [{ required: true, message: '请选择产品分类' }]
      },
      {
        name: 'price',
        label: '价格',
        component: 'input-number',
        props: {
          placeholder: '请输入价格',
          min: 0,
          precision: 2,
          formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
        },
        rules: [{ required: true, message: '请输入价格' }]
      },
      {
        name: 'stock',
        label: '库存数量',
        component: 'input-number',
        props: {
          placeholder: '请输入库存数量',
          min: 0
        },
        rules: [{ required: true, message: '请输入库存数量' }]
      },
      {
        name: 'tags',
        label: '产品标签',
        component: 'checkbox-group',
        props: {
          options: [
            { label: '热销', value: 'hot' },
            { label: '新品', value: 'new' },
            { label: '促销', value: 'sale' },
            { label: '推荐', value: 'recommend' }
          ]
        }
      },
      {
        name: 'description',
        label: '产品描述',
        component: 'textarea',
        props: {
          placeholder: '请输入产品描述',
          rows: 4
        },
        rules: [{ required: true, message: '请输入产品描述' }]
      }
    ]
  },
  custom: {
    title: '自定义表单',
    description: '动态配置的复杂表单',
    layout: { type: 'tabs' },
    fields: [
      {
        name: 'basic',
        label: '基本信息',
        component: 'tab-panel',
        children: [
          {
            name: 'title',
            label: '标题',
            component: 'input',
            props: { placeholder: '请输入标题' },
            rules: [{ required: true, message: '请输入标题' }]
          },
          {
            name: 'type',
            label: '类型',
            component: 'select',
            props: {
              placeholder: '请选择类型',
              options: [
                { label: '文章', value: 'article' },
                { label: '视频', value: 'video' },
                { label: '图片', value: 'image' }
              ]
            },
            rules: [{ required: true, message: '请选择类型' }]
          }
        ]
      },
      {
        name: 'content',
        label: '内容配置',
        component: 'tab-panel',
        children: [
          {
            name: 'content',
            label: '内容',
            component: 'textarea',
            props: {
              placeholder: '请输入内容',
              rows: 6
            },
            rules: [{ required: true, message: '请输入内容' }]
          },
          {
            name: 'keywords',
            label: '关键词',
            component: 'input',
            props: {
              placeholder: '请输入关键词，用逗号分隔'
            }
          }
        ]
      },
      {
        name: 'settings',
        label: '高级设置',
        component: 'tab-panel',
        children: [
          {
            name: 'published',
            label: '是否发布',
            component: 'switch',
            props: {
              checkedChildren: '是',
              unCheckedChildren: '否'
            }
          },
          {
            name: 'publishTime',
            label: '发布时间',
            component: 'date-time-picker',
            props: {
              placeholder: '请选择发布时间'
            },
            dependencies: ['published'],
            visible: (values: any) => values.published
          }
        ]
      }
    ]
  }
}

// 模拟 API 请求
const mockApiRequest = (schemaKey: keyof typeof apiSchemas) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(apiSchemas[schemaKey].fields)
    }, 1000)
  })
}

// 加载表单配置
const loadFormSchema = async (schemaKey: string) => {
  loading.value = true
  formData.value = {}
  
  try {
    const schemas = await mockApiRequest(schemaKey as keyof typeof apiSchemas) as FormFieldSchema[]
    formSchemas.value = schemas
  } catch (error) {
    console.error('加载表单配置失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载不同类型的表单
const loadUserForm = () => loadFormSchema('user')
const loadProductForm = () => loadFormSchema('product')
const loadCustomForm = () => loadFormSchema('custom')

// 提交处理
const handleSubmit = (data: any) => {
  console.log('提交数据:', data)
  alert('表单提交成功！')
}

// 初始化加载用户表单
loadUserForm()
</script>

<style scoped>
.api-config-demo {
  padding: 20px;
}

.api-controls {
  margin: 20px 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.load-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.load-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.demo-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
}

.form-data,
.schema-display {
  margin-top: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.form-data pre,
.schema-display pre {
  margin: 0;
  font-size: 12px;
  color: #666;
  max-height: 300px;
  overflow-y: auto;
}

.schema-display {
  margin-top: 20px;
}

.schema-display h4 {
  margin-bottom: 12px;
  color: #333;
}
</style>