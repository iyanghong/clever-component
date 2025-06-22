<template>
  <DemoContainer
    title="基础用法"
    description="展示CleverForm的基本使用方法，包括常用字段类型和基础配置。"
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
      <n-alert v-if="result" type="info">
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

// 表单数据模型
const model = reactive({
  name: '',
  email: '',
  age: null,
  gender: '',
  description: ''
})

// 表单字段配置
const schemas: FormFieldSchema[] = [
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
      placeholder: '请输入邮箱地址'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    componentProps: {
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'select',
    componentProps: {
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'textarea',
    componentProps: {
      placeholder: '请输入描述信息',
      rows: 3
    }
  }
]

// 生成演示代码
const demoCode = generateFormCode({
  schemas,
  model,
  title: '基础表单示例',
  description: '展示常用字段类型的基础用法'
})

// 事件处理
const handleSubmit = (data: any) => {
  result.value = `表单提交成功：\n${JSON.stringify(data, null, 2)}`
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
  } catch (error) {
    result.value = `表单验证失败：\n${JSON.stringify(error, null, 2)}`
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