<template>
  <div class="test-container">
    <h2>CleverForm 重构测试</h2>
    
    <div class="form-section">
      <h3>表单数据：</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>

    <CleverForm
      v-model="formData"
      :config="formConfig"
      @data:change="handleDataChange"
      @submit="handleSubmit"
    />

    <div class="actions">
      <button @click="updateExternalData">外部更新数据</button>
      <button @click="resetData">重置数据</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CleverForm } from './packages/components/clever-form'
import type { FormConfig, FormData } from './packages/components/clever-form/src/types'

// 表单数据
const formData = ref<FormData>({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com'
})

// 表单配置
const formConfig: FormConfig = {
  title: '用户信息表单',
  description: '测试 modelValue 和 formData 统一数据源',
  layout: {
    type: 'grid',
    props: {
      cols: 1,
      xGap: 16,
      yGap: 16
    },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        props: {
          placeholder: '请输入姓名'
        },
        rules: [
          { required: true, message: '请输入姓名' }
        ]
      },
      {
        field: 'age',
        label: '年龄',
        component: 'number',
        props: {
          placeholder: '请输入年龄',
          min: 0,
          max: 120
        }
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        props: {
          placeholder: '请输入邮箱'
        },
        rules: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱格式' }
        ]
      }
    ]
  }
}

// 事件处理
const handleDataChange = (data: FormData) => {
  console.log('数据变化:', data)
  console.log('formData === data:', formData.value === data)
}

const handleSubmit = (data: FormData) => {
  console.log('提交数据:', data)
  alert('提交成功！数据：' + JSON.stringify(data, null, 2))
}

// 外部更新数据测试
const updateExternalData = () => {
  formData.value.name = '李四'
  formData.value.age = 30
  console.log('外部更新数据完成')
}

// 重置数据
const resetData = () => {
  formData.value = {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-section h3 {
  margin-top: 0;
}

.form-section pre {
  background: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  overflow-x: auto;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.actions button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.actions button:hover {
  background: #f0f0f0;
}
</style>