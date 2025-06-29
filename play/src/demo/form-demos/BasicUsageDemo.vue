<template>
  <div class="basic-usage-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="基础用法示例">
        演示 CleverForm 的基本功能，包括各种字段类型和基础配置。
      </n-alert>

      <!-- 表单示例 -->
      <n-card title="用户信息表单">
        <CleverForm
          v-model="formData"
          :config="formConfig"
          @submit="handleSubmit"
          @data:change="handleDataChange"
        />
      </n-card>

      <!-- 表单数据展示 -->
      <n-card title="表单数据">
        <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NSpace, NAlert, NCard, NCode, useMessage } from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig, FormData } from '@clever-component/components'

const message = useMessage()

// 表单数据
const formData = ref<FormData>({
  name: '11',
  email: '',
  age: null,
  gender: '',
  interests: [],
  isVip: false,
  birthday: null,
  description: ''
})

// 表单配置
const formConfig: FormConfig = {
  id: 'basic-form',
  title: '用户信息',
  description: '请填写您的基本信息',
  layout: {
    type: 'grid',
    props: {
      cols: 2,
      xGap: 16,
      yGap: 16
    },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        required: true,
        placeholder: '请输入姓名',
        defaultValue:'张三',
        props: {
          clearable: true
        },
        rules: [
          {
            required: true,
            message: '请输入姓名'
          },
          {
            min: 2,
            max: 20,
            message: '姓名长度应在2-20个字符之间'
          }
        ]
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        required: true,
        placeholder: '请输入邮箱地址',
        props: {
          type: 'email',
          clearable: true
        },
        rules: [
          {
            required: true,
            message: '请输入邮箱地址'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱格式'
          }
        ]
      },
      {
        field: 'age',
        label: '年龄',
        component: 'number-input',
        placeholder: '请输入年龄',
        props: {
          min: 1,
          max: 120,
          clearable: true
        },
        rules: [
          {
            type: 'number',
            min: 1,
            max: 120,
            message: '年龄应在1-120之间'
          }
        ]
      },
      {
        field: 'gender',
        label: '性别',
        component: 'radio-group',
        props: {
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
            { label: '其他', value: 'other' }
          ]
        }
      },
      {
        field: 'interests',
        label: '兴趣爱好',
        component: 'checkbox-group',
        span: 2,
        props: {
          options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
            { label: '旅行', value: 'travel' },
            { label: '摄影', value: 'photography' },
            { label: '编程', value: 'programming' }
          ]
        }
      },
      {
        field: 'isVip',
        label: 'VIP会员',
        component: 'switch',
        help: '开启后可享受VIP特权'
      },
      {
        field: 'birthday',
        label: '生日',
        component: 'date-picker',
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择生日'
        }
      },
      {
        field: 'description',
        label: '个人描述',
        component: 'textarea',
        span: 2,
        placeholder: '请简单介绍一下自己...',
        props: {
          rows: 4,
          maxlength: 500,
          showCount: true,
          clearable: true
        }
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 80,
    showRequiredMark: true,
    validateOnSubmit: true
  }
}

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('表单提交:', data)
  message.success('表单提交成功！')
}

// 处理数据变化
const handleDataChange = (data: FormData, field?: string, value?: any) => {
  console.log('数据变化:', { data, field, value })
}
</script>

<style scoped>
.basic-usage-demo {
  padding: 20px;
}
</style>
