<template>
  <div class="validation-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="表单验证示例">
        演示 CleverForm 的各种验证功能，包括同步验证、异步验证、条件验证等。
      </n-alert>

      <!-- Demo类型选择 -->
      <n-card title="Demo 类型">
        <n-space>
          <n-text>选择验证类型:</n-text>
          <n-select v-model:value="currentDemo" :options="demoOptions" style="width: 200px" />
        </n-space>
      </n-card>

      <!-- 验证配置 -->
      <n-card title="验证配置">
        <n-space>
          <n-checkbox v-model:checked="validationConfig.validateOnInput">
            输入时验证
          </n-checkbox>
          <n-checkbox v-model:checked="validationConfig.validateOnBlur">
            失焦时验证
          </n-checkbox>
          <n-checkbox v-model:checked="validationConfig.validateOnSubmit">
            提交时验证
          </n-checkbox>
          <n-checkbox v-model:checked="validationConfig.showErrorMessage">
            显示错误信息
          </n-checkbox>
        </n-space>
      </n-card>

      <!-- 表单示例 -->
      <n-card :title="demoTitles[currentDemo]">
        <CleverForm
          v-model="formData"
          :config="currentFormConfig"
          @validate="handleValidate"
          @submit="handleSubmit"
        />
      </n-card>

      <!-- 验证结果展示 -->
      <n-card title="验证结果">
        <n-space vertical>
          <div>
            <strong>表单状态：</strong>
            <n-tag :type="isValid ? 'success' : 'error'">
              {{ isValid ? '验证通过' : '验证失败' }}
            </n-tag>
          </div>
          <div v-if="validationErrors.length > 0">
            <strong>验证错误：</strong>
            <n-list>
              <n-list-item v-for="error in validationErrors" :key="error.field">
                <n-thing>
                  <template #header>
                    <n-text type="error">{{ error.field }}</n-text>
                  </template>
                  <n-text>{{ error.message }}</n-text>
                </n-thing>
              </n-list-item>
            </n-list>
          </div>
        </n-space>
      </n-card>

      <!-- 表单数据展示 -->
      <n-card title="表单数据">
        <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  NSpace,
  NAlert,
  NCard,
  NCode,
  NCheckbox,
  NTag,
  NList,
  NListItem,
  NThing,
  NText,
  NSelect,
  useMessage
} from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig, FormData, ValidationResult } from '@clever-component/components'

const message = useMessage()

// 当前Demo类型
const currentDemo = ref<'basic' | 'advanced' | 'async' | 'conditional' | 'custom'>('basic')

// Demo类型选项
const demoOptions = [
  { label: '基础验证', value: 'basic' },
  { label: '高级验证', value: 'advanced' },
  { label: '异步验证', value: 'async' },
  { label: '条件验证', value: 'conditional' },
  { label: '自定义验证', value: 'custom' }
]

// Demo标题
const demoTitles = {
  basic: '基础验证表单',
  advanced: '高级验证表单',
  async: '异步验证表单',
  conditional: '条件验证表单',
  custom: '自定义验证表单'
}

// 验证配置
const validationConfig = reactive({
  validateOnInput: true,
  validateOnBlur: true,
  validateOnSubmit: true,
  showErrorMessage: true
})

// 表单数据
const formData = ref<FormData>({
  // 基础字段
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  age: null,
  website: '',
  agreement: false,
  
  // 高级验证字段
  idCard: '',
  bankCard: '',
  creditScore: null,
  
  // 异步验证字段
  asyncUsername: '',
  asyncEmail: '',
  
  // 条件验证字段
  userType: '',
  companyName: '',
  personalId: '',
  
  // 自定义验证字段
  customField1: '',
  customField2: '',
  complexPassword: ''
})

// 验证结果
const validationErrors = ref<ValidationResult[]>([])
const isValid = computed(() => validationErrors.value.length === 0)

// 自定义验证函数
const validateUsername = async (value: string) => {
  if (!value) {
    return Promise.reject('请输入用户名')
  }
  if (value.length < 3) {
    return Promise.reject('用户名至少3个字符')
  }
  // 模拟异步验证（检查用户名是否已存在）
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === 'admin' || value === 'test') {
        reject('用户名已存在')
      } else {
        resolve(true)
      }
    }, 1000)
  })
}

const validateConfirmPassword = (value: string) => {
  if (!value) {
    return Promise.reject('请确认密码')
  }
  if (value !== formData.value.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

// 基础验证配置
const basicValidationConfig = {
  id: 'basic-validation-form',
  title: '基础验证表单',
  layout: {
    type: 'grid' as const,
    props: { cols: 2, rowGap: 16, colGap: 16 },
    children: [
      {
        field: 'username',
        label: '用户名',
        component: 'input' as const,
        required: true,
        placeholder: '请输入用户名',
        validation: {
          required: '用户名不能为空',
          rules: [
            { min: 3, max: 20, message: '用户名长度必须在3-20个字符之间' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
          ]
        }
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input' as const,
        required: true,
        placeholder: '请输入邮箱地址',
        validation: {
          required: '邮箱不能为空',
          rules: [{ type: 'email', message: '请输入有效的邮箱地址' }]
        }
      },
      {
        field: 'password',
        label: '密码',
        component: 'input' as const,
        required: true,
        placeholder: '请输入密码',
        props: { type: 'password' },
        validation: {
          required: '密码不能为空',
          rules: [
            { min: 6, max: 20, message: '密码长度必须在6-20个字符之间' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, message: '密码必须包含大小写字母和数字' }
          ]
        }
      },
      {
        field: 'confirmPassword',
        label: '确认密码',
        component: 'input' as const,
        required: true,
        placeholder: '请再次输入密码',
        props: { type: 'password' },
        validation: {
          required: '确认密码不能为空',
          rules: [
            {
              validator: (rule: any, value: string) => {
                if (value !== formData.value.password) {
                  return Promise.reject('两次输入的密码不一致')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      }
    ]
  },
  validation: validationConfig
}

// 高级验证配置
const advancedValidationConfig = {
  id: 'advanced-validation-form',
  title: '高级验证表单',
  layout: {
    type: 'grid' as const,
    props: { cols: 2, rowGap: 16, colGap: 16 },
    children: [
      {
        field: 'idCard',
        label: '身份证号',
        component: 'input' as const,
        required: true,
        placeholder: '请输入身份证号',
        validation: {
          required: '身份证号不能为空',
          rules: [
            { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入有效的身份证号' }
          ]
        }
      },
      {
        field: 'bankCard',
        label: '银行卡号',
        component: 'input' as const,
        required: true,
        placeholder: '请输入银行卡号',
        validation: {
          required: '银行卡号不能为空',
          rules: [
            { pattern: /^[1-9]\d{15,18}$/, message: '请输入有效的银行卡号' }
          ]
        }
      },
      {
        field: 'creditScore',
        label: '信用评分',
        component: 'input' as const,
        required: true,
        placeholder: '请输入信用评分',
        props: { type: 'number' },
        validation: {
          required: '信用评分不能为空',
          rules: [
            { type: 'number', min: 300, max: 850, message: '信用评分必须在300-850之间' }
          ]
        }
      },
      {
        field: 'phone',
        label: '手机号',
        component: 'input' as const,
        required: true,
        placeholder: '请输入手机号',
        validation: {
          required: '手机号不能为空',
          rules: [
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
          ]
        }
      }
    ]
  },
  validation: validationConfig
}

// 异步验证配置
const asyncValidationConfig = {
  id: 'async-validation-form',
  title: '异步验证表单',
  layout: {
    type: 'grid' as const,
    props: { cols: 1, rowGap: 16 },
    children: [
      {
        field: 'asyncUsername',
        label: '用户名（异步验证）',
        component: 'input' as const,
        required: true,
        placeholder: '请输入用户名',
        validation: {
          required: '用户名不能为空',
          rules: [
            {
              asyncValidator: async (rule: any, value: string) => {
                if (!value) return Promise.resolve()
                // 模拟异步验证
                await new Promise(resolve => setTimeout(resolve, 1000))
                if (value === 'admin' || value === 'test') {
                  return Promise.reject('该用户名已被占用')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      },
      {
        field: 'asyncEmail',
        label: '邮箱（异步验证）',
        component: 'input' as const,
        required: true,
        placeholder: '请输入邮箱地址',
        validation: {
          required: '邮箱不能为空',
          rules: [
            { type: 'email', message: '请输入有效的邮箱地址' },
            {
              asyncValidator: async (rule: any, value: string) => {
                if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return Promise.resolve()
                // 模拟异步验证
                await new Promise(resolve => setTimeout(resolve, 800))
                if (value === 'test@example.com') {
                  return Promise.reject('该邮箱已被注册')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      }
    ]
  },
  validation: validationConfig
}

// 条件验证配置
const conditionalValidationConfig = {
  id: 'conditional-validation-form',
  title: '条件验证表单',
  layout: {
    type: 'grid' as const,
    props: { cols: 1, rowGap: 16 },
    children: [
      {
        field: 'userType',
        label: '用户类型',
        component: 'select' as const,
        required: true,
        placeholder: '请选择用户类型',
        options: [
          { label: '个人用户', value: 'personal' },
          { label: '企业用户', value: 'company' }
        ],
        validation: {
          required: '请选择用户类型'
        }
      },
      {
        field: 'companyName',
        label: '公司名称',
        component: 'input' as const,
        placeholder: '请输入公司名称',
        show: () => formData.value.userType === 'company',
        validation: {
          required: formData.value.userType === 'company' ? '公司名称不能为空' : undefined
        }
      },
      {
        field: 'personalId',
        label: '个人身份证',
        component: 'input' as const,
        placeholder: '请输入身份证号',
        show: () => formData.value.userType === 'personal',
        validation: {
          required: formData.value.userType === 'personal' ? '身份证号不能为空' : undefined,
          rules: formData.value.userType === 'personal' ? [
            { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入有效的身份证号' }
          ] : []
        }
      }
    ]
  },
  validation: validationConfig
}

// 自定义验证配置
const customValidationConfig = {
  id: 'custom-validation-form',
  title: '自定义验证表单',
  layout: {
    type: 'grid' as const,
    props: { cols: 1, rowGap: 16 },
    children: [
      {
        field: 'customField1',
        label: '自定义字段1',
        component: 'input' as const,
        required: true,
        placeholder: '请输入内容（不能包含特殊字符）',
        validation: {
          required: '此字段不能为空',
          rules: [
            {
              validator: (rule: any, value: string) => {
                if (!value) return Promise.resolve()
                if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                  return Promise.reject('不能包含特殊字符')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      },
      {
        field: 'customField2',
        label: '自定义字段2',
        component: 'input' as const,
        required: true,
        placeholder: '请输入内容（必须以字母开头）',
        validation: {
          required: '此字段不能为空',
          rules: [
            {
              validator: (rule: any, value: string) => {
                if (!value) return Promise.resolve()
                if (!/^[a-zA-Z]/.test(value)) {
                  return Promise.reject('必须以字母开头')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      },
      {
        field: 'complexPassword',
        label: '复杂密码',
        component: 'input' as const,
        required: true,
        placeholder: '请输入复杂密码',
        props: { type: 'password' },
        validation: {
          required: '密码不能为空',
          rules: [
            {
              validator: (rule: any, value: string) => {
                if (!value) return Promise.resolve()
                
                const errors = []
                if (value.length < 8) errors.push('至少8个字符')
                if (!/[a-z]/.test(value)) errors.push('至少包含一个小写字母')
                if (!/[A-Z]/.test(value)) errors.push('至少包含一个大写字母')
                if (!/\d/.test(value)) errors.push('至少包含一个数字')
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('至少包含一个特殊字符')
                
                if (errors.length > 0) {
                  return Promise.reject(`密码强度不够：${errors.join('、')}`)
                }
                return Promise.resolve()
              }
            }
          ]
        }
      }
    ]
  },
  validation: validationConfig
}

// 当前表单配置
const currentFormConfig = computed(() => {
  const configs = {
    basic: basicValidationConfig,
    advanced: advancedValidationConfig,
    async: asyncValidationConfig,
    conditional: conditionalValidationConfig,
    custom: customValidationConfig
  }
  return configs[currentDemo.value]
})

// 监听验证配置变化，重新生成表单配置
watch(validationConfig, () => {
  // 触发表单配置更新
}, { deep: true })

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('表单提交:', data)
  message.success('注册成功！')
}

// 处理验证结果
const handleValidate = (results: ValidationResult[]) => {
  validationErrors.value = results.filter(result => !result.valid)
  console.log('验证结果:', results)
}
</script>

<style scoped>
.validation-demo {
  padding: 20px;
}
</style>