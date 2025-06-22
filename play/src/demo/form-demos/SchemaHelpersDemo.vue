<template>
  <div class="schema-helpers-demo">
    <h3>Schema 辅助函数</h3>
    <p>演示 CleverForm 提供的 Schema 构建辅助函数，简化表单配置</p>
    
    <div class="demo-tabs">
      <div class="tab-buttons">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="tab-content">
        <!-- 字段构建器 -->
        <div v-if="activeTab === 'builder'" class="demo-section">
          <h4>字段构建器</h4>
          <p>使用 SchemaBuilder 快速构建表单字段</p>
          
          <div class="code-example">
            <h5>代码示例：</h5>
            <pre><code>{{ builderCode }}</code></pre>
          </div>
          
          <div class="demo-container">
            <CleverForm
              :schemas="builderSchema"
              :data="builderFormData"
              @submit="handleSubmit"
            />
          </div>
        </div>
        
        <!-- 验证规则助手 -->
        <div v-if="activeTab === 'validation'" class="demo-section">
          <h4>验证规则助手</h4>
          <p>使用预定义的验证规则快速配置字段验证</p>
          
          <div class="code-example">
            <h5>代码示例：</h5>
            <pre><code>{{ validationCode }}</code></pre>
          </div>
          
          <div class="demo-container">
            <CleverForm
              :schemas="validationSchema"
              :data="validationFormData"
              @submit="handleSubmit"
            />
          </div>
        </div>
        
        <!-- 布局助手 -->
        <div v-if="activeTab === 'layout'" class="demo-section">
          <h4>布局助手</h4>
          <p>使用布局助手函数快速配置复杂布局</p>
          
          <div class="code-example">
            <h5>代码示例：</h5>
            <pre><code>{{ layoutCode }}</code></pre>
          </div>
          
          <div class="demo-container">
            <CleverForm
              :schemas="layoutSchema"
              :data="layoutFormData"
              @submit="handleSubmit"
            />
          </div>
        </div>
        
        <!-- 条件显示助手 -->
        <div v-if="activeTab === 'conditional'" class="demo-section">
          <h4>条件显示助手</h4>
          <p>使用条件助手函数配置字段的显示和隐藏逻辑</p>
          
          <div class="code-example">
            <h5>代码示例：</h5>
            <pre><code>{{ conditionalCode }}</code></pre>
          </div>
          
          <div class="demo-container">
            <CleverForm
              :schemas="conditionalSchema"
              :data="conditionalFormData"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-data">
      <h4>当前表单数据：</h4>
      <pre>{{ JSON.stringify(getCurrentFormData(), null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'

// 演示说明：这里展示 CleverForm 的基本字段配置方式
// 在实际项目中，可以根据需要创建类似的辅助函数来简化表单配置

// Tab 管理
const activeTab = ref('builder')
const tabs = [
  { key: 'builder', label: '字段构建器' },
  { key: 'validation', label: '验证规则助手' },
  { key: 'layout', label: '布局助手' },
  { key: 'conditional', label: '条件显示助手' }
]

// 表单数据
const builderFormData = ref({})
const validationFormData = ref({})
const layoutFormData = ref({})
const conditionalFormData = ref({ userType: 'individual' })

// 模拟 Schema 辅助函数
const SchemaBuilder = {
  // 输入字段构建器
  input(name: string, label: string, options: any = {}) {
    return {
      name,
      label,
      component: 'input',
      props: {
        placeholder: `请输入${label}`,
        ...options.props
      },
      rules: options.rules || [],
      ...options
    }
  },
  
  // 选择器构建器
  select(name: string, label: string, options: any[] = [], config: any = {}) {
    return {
      name,
      label,
      component: 'select',
      props: {
        placeholder: `请选择${label}`,
        options,
        ...config.props
      },
      rules: config.rules || [],
      ...config
    }
  },
  
  // 数字输入构建器
  number(name: string, label: string, options: any = {}) {
    return {
      name,
      label,
      component: 'input-number',
      props: {
        placeholder: `请输入${label}`,
        ...options.props
      },
      rules: options.rules || [],
      ...options
    }
  },
  
  // 日期选择器构建器
  date(name: string, label: string, options: any = {}) {
    return {
      name,
      label,
      component: 'date-picker',
      props: {
        placeholder: `请选择${label}`,
        ...options.props
      },
      rules: options.rules || [],
      ...options
    }
  }
}

// 验证规则助手
const ValidationRules = {
  required(message?: string) {
    return { required: true, message: message || '此字段为必填项' }
  },
  
  email(message?: string) {
    return { type: 'email', message: message || '请输入有效的邮箱地址' }
  },
  
  phone(message?: string) {
    return { pattern: /^1[3-9]\d{9}$/, message: message || '请输入有效的手机号' }
  },
  
  minLength(min: number, message?: string) {
    return { min, message: message || `最少输入${min}个字符` }
  },
  
  maxLength(max: number, message?: string) {
    return { max, message: message || `最多输入${max}个字符` }
  },
  
  range(min: number, max: number, message?: string) {
    return { min, max, message: message || `长度应在${min}-${max}个字符之间` }
  }
}

// 布局助手
const LayoutHelpers = {
  grid(columns: number = 2, gap: number = 16) {
    return { type: 'grid', columns, gap }
  },
  
  flex(direction: 'row' | 'column' = 'column', gap: number = 16) {
    return { type: 'flex', direction, gap }
  },
  
  tabs() {
    return { type: 'tabs' }
  },
  
  accordion() {
    return { type: 'accordion' }
  }
}

// 条件显示助手
const ConditionalHelpers = {
  when(field: string, value: any) {
    return {
      dependencies: [field],
      visible: (values: any) => values[field] === value
    }
  },
  
  whenNot(field: string, value: any) {
    return {
      dependencies: [field],
      visible: (values: any) => values[field] !== value
    }
  },
  
  whenIn(field: string, values: any[]) {
    return {
      dependencies: [field],
      visible: (formValues: any) => values.includes(formValues[field])
    }
  },
  
  whenTruthy(field: string) {
    return {
      dependencies: [field],
      visible: (values: any) => !!values[field]
    }
  }
}

// Schema 配置
const builderSchema: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    required: true,
    componentProps: {
      type: 'email',
      placeholder: '请输入邮箱'
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'select',
    required: true,
    componentProps: {
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ]
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    required: true,
    componentProps: {
      min: 1,
      max: 120
    }
  }
]

const validationSchema: FormFieldSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入用户名（3-20个字符）'
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'input',
    required: true,
    componentProps: {
      type: 'password',
      placeholder: '请输入密码（6-20个字符）'
    }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入手机号'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入邮箱'
    }
  }
]

const layoutSchema: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    required: true,
    componentProps: {
      min: 1,
      max: 120
    }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入手机号'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    required: true,
    componentProps: {
      type: 'email',
      placeholder: '请输入邮箱'
    }
  }
]

const conditionalSchema: FormFieldSchema[] = [
  {
    field: 'userType',
    label: '用户类型',
    component: 'radio',
    required: true,
    componentProps: {
      options: [
        { label: '个人用户', value: 'individual' },
        { label: '企业用户', value: 'company' }
      ]
    }
  },
  {
    field: 'personalName',
    label: '个人姓名',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入个人姓名'
    }
  },
  {
    field: 'idCard',
    label: '身份证号',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入身份证号'
    }
  },
  {
    field: 'companyName',
    label: '公司名称',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入公司名称'
    }
  },
  {
    field: 'businessLicense',
    label: '营业执照号',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入营业执照号'
    }
  },
  {
    field: 'legalPerson',
    label: '法人代表',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入法人代表'
    }
  }
]

// 代码示例
const builderCode = `// 使用字段构建器
const schema = {
  layout: LayoutHelpers.grid(2),
  fields: [
    SchemaBuilder.input('name', '姓名', {
      rules: [ValidationRules.required(), ValidationRules.range(2, 20)]
    }),
    SchemaBuilder.select('city', '城市', [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' }
    ], {
      rules: [ValidationRules.required()]
    })
  ]
}`

const validationCode = `// 使用验证规则助手
const rules = [
  ValidationRules.required('用户名不能为空'),
  ValidationRules.range(3, 20, '用户名长度应在3-20个字符之间'),
  ValidationRules.email(),
  ValidationRules.phone()
]`

const layoutCode = `// 使用布局助手
const layouts = {
  grid: LayoutHelpers.grid(2, 16),
  flex: LayoutHelpers.flex('column', 16),
  tabs: LayoutHelpers.tabs(),
  accordion: LayoutHelpers.accordion()
}`

const conditionalCode = `// 使用条件显示助手
const conditionalField = {
  ...SchemaBuilder.input('companyName', '公司名称'),
  ...ConditionalHelpers.when('userType', 'company')
}

// 其他条件助手
ConditionalHelpers.whenNot('field', 'value')
ConditionalHelpers.whenIn('field', ['value1', 'value2'])
ConditionalHelpers.whenTruthy('field')`

// 获取当前表单数据
const getCurrentFormData = () => {
  switch (activeTab.value) {
    case 'builder': return builderFormData.value
    case 'validation': return validationFormData.value
    case 'layout': return layoutFormData.value
    case 'conditional': return conditionalFormData.value
    default: return {}
  }
}

// 提交处理
const handleSubmit = (data: any) => {
  console.log('提交数据:', data)
  alert('表单提交成功！')
}
</script>

<style scoped>
.schema-helpers-demo {
  padding: 20px;
}

.demo-tabs {
  margin: 20px 0;
}

.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #1890ff;
}

.tab-btn.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.demo-section {
  padding: 20px 0;
}

.demo-section h4 {
  margin-bottom: 8px;
  color: #333;
}

.demo-section p {
  margin-bottom: 20px;
  color: #666;
}

.code-example {
  margin: 20px 0;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.code-example h5 {
  margin-bottom: 12px;
  color: #333;
}

.code-example pre {
  margin: 0;
  font-size: 13px;
  color: #666;
  overflow-x: auto;
}

.demo-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
}

.form-data {
  margin-top: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.form-data h4 {
  margin-bottom: 12px;
  color: #333;
}

.form-data pre {
  margin: 0;
  font-size: 12px;
  color: #666;
  max-height: 200px;
  overflow-y: auto;
}
</style>