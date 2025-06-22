<template>
  <DemoContainer
    title="表单验证"
    description="展示CleverForm的验证功能，包括必填验证、格式验证、自定义验证等。"
    :code="demoCode"
  >
    <CleverForm
      ref="formRef"
      :schemas="schemas"
      :data="model"
      @submit="handleSubmit"
    />
    
    <template #actions>
      <n-space>
        <n-button type="primary" @click="submitForm">提交表单</n-button>
        <n-button @click="resetForm">重置表单</n-button>
        <n-button @click="validateForm">验证表单</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="result" :type="resultType">
        <pre>{{ result }}</pre>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NSpace, NButton, NAlert } from 'naive-ui'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateFormCode } from '../../utils/demo-utils'

// 表单引用
const formRef = ref()

// 结果显示
const result = ref('')
const resultType = ref<'success' | 'info' | 'warning' | 'error'>('info')

// 表单数据模型
const model = reactive({
  email: '',
  url: '',
  number: null,
  required: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

// 表单字段配置
const schemas: FormFieldSchema[] = [
  {
    field: 'email',
    label: '邮箱验证',
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
    field: 'url',
    label: 'URL验证',
    component: 'input',
    componentProps: {
      placeholder: '请输入URL地址'
    },
    rules: [
      { type: 'url', message: '请输入正确的URL格式' }
    ]
  },
  {
    field: 'number',
    label: '数字验证',
    component: 'input-number',
    componentProps: {
      placeholder: '请输入数字',
      min: 0,
      max: 100
    },
    rules: [
      { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数字' }
    ]
  },
  {
    field: 'required',
    label: '必填验证',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '这是必填字段'
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'input',
    required: true,
    componentProps: {
      type: 'password',
      placeholder: '请输入密码'
    },
    rules: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码长度不能少于 6 位' }
    ]
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'input',
    required: true,
    componentProps: {
      type: 'password',
      placeholder: '请再次输入密码'
    },
    rules: [
      { required: true, message: '请确认密码' },
      {
        validator: (rule: any, value: string) => {
          if (value !== model.password) {
            return new Error('两次输入密码不一致')
          }
          return true
        }
      }
    ]
  },
  {
    field: 'phone',
    label: '手机号验证',
    component: 'input',
    componentProps: {
      placeholder: '请输入手机号'
    },
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
    ]
  }
]

// 生成演示代码
const demoCode = generateFormCode({
  schemas,
  model,
  title: '表单验证示例',
  description: '展示各种验证规则的使用方法'
})

// 事件处理
const handleSubmit = (data: any) => {
  result.value = `表单验证通过并提交成功：\n${JSON.stringify(data, null, 2)}`
  resultType.value = 'success'
}

// 表单操作方法
const submitForm = () => {
  formRef.value?.submit()
}

const resetForm = () => {
  formRef.value?.reset()
  result.value = ''
}

const validateForm = async () => {
  try {
    await formRef.value?.validate()
    result.value = '表单验证通过！'
    resultType.value = 'success'
  } catch (error) {
    result.value = `表单验证失败：\n${JSON.stringify(error, null, 2)}`
    resultType.value = 'error'
  }
}
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
</style>