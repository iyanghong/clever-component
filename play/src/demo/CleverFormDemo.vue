<template>
  <div class="clever-form-demo">
    <n-space vertical size="large">
      <!-- 基础用法 -->
      <n-card title="基础用法">
        <CleverForm
          ref="basicFormRef"
          :schema="basicSchema"
          :model="basicModel"
          @submit="handleBasicSubmit"
        />
        <n-divider />
        <n-space>
          <n-button type="primary" @click="submitBasicForm">提交表单</n-button>
          <n-button @click="resetBasicForm">重置表单</n-button>
          <n-button @click="validateBasicForm">验证表单</n-button>
        </n-space>
        <n-alert v-if="basicResult" type="info" style="margin-top: 16px;">
          <pre>{{ basicResult }}</pre>
        </n-alert>
      </n-card>

      <!-- 复杂表单 -->
      <n-card title="复杂表单">
        <CleverForm
          ref="complexFormRef"
          :schema="complexSchema"
          :model="complexModel"
          :api-config="apiConfig"
          @submit="handleComplexSubmit"
          @field-change="handleFieldChange"
        />
        <n-divider />
        <n-space>
          <n-button type="primary" @click="submitComplexForm">提交表单</n-button>
          <n-button @click="resetComplexForm">重置表单</n-button>
          <n-button @click="loadFormData">加载数据</n-button>
        </n-space>
        <n-alert v-if="complexResult" type="info" style="margin-top: 16px;">
          <pre>{{ complexResult }}</pre>
        </n-alert>
      </n-card>

      <!-- 动态表单 -->
      <n-card title="动态表单">
        <n-space vertical>
          <n-space>
            <n-button @click="addField">添加字段</n-button>
            <n-button @click="removeField" :disabled="dynamicSchema.length <= 1">
              删除字段
            </n-button>
            <n-button @click="toggleFieldVisibility">切换字段显示</n-button>
          </n-space>
          
          <CleverForm
            ref="dynamicFormRef"
            :schema="dynamicSchema"
            :model="dynamicModel"
            @submit="handleDynamicSubmit"
          />
          
          <n-space>
            <n-button type="primary" @click="submitDynamicForm">提交表单</n-button>
            <n-button @click="resetDynamicForm">重置表单</n-button>
          </n-space>
          
          <n-alert v-if="dynamicResult" type="info">
            <pre>{{ dynamicResult }}</pre>
          </n-alert>
        </n-space>
      </n-card>

      <!-- 表单验证 -->
      <n-card title="表单验证">
        <CleverForm
          ref="validationFormRef"
          :schema="validationSchema"
          :model="validationModel"
          @submit="handleValidationSubmit"
        />
        <n-divider />
        <n-space>
          <n-button type="primary" @click="submitValidationForm">提交表单</n-button>
          <n-button @click="resetValidationForm">重置表单</n-button>
        </n-space>
        <n-alert v-if="validationResult" type="info" style="margin-top: 16px;">
          <pre>{{ validationResult }}</pre>
        </n-alert>
      </n-card>

      <!-- 分组表单 -->
      <n-card title="分组表单">
        <CleverForm
          ref="groupFormRef"
          :schema="groupSchema"
          :model="groupModel"
          @submit="handleGroupSubmit"
        />
        <n-divider />
        <n-space>
          <n-button type="primary" @click="submitGroupForm">提交表单</n-button>
          <n-button @click="resetGroupForm">重置表单</n-button>
        </n-space>
        <n-alert v-if="groupResult" type="info" style="margin-top: 16px;">
          <pre>{{ groupResult }}</pre>
        </n-alert>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NSpace, NCard, NButton, NDivider, NAlert } from 'naive-ui'
import { CleverForm } from '@clever-component'
import type { FormSchema, FormApiConfig } from '@clever-component'

// 表单引用
const basicFormRef = ref()
const complexFormRef = ref()
const dynamicFormRef = ref()
const validationFormRef = ref()
const groupFormRef = ref()

// 结果显示
const basicResult = ref('')
const complexResult = ref('')
const dynamicResult = ref('')
const validationResult = ref('')
const groupResult = ref('')

// 基础表单
const basicModel = reactive({
  name: '',
  email: '',
  age: null,
  gender: '',
  description: ''
})

const basicSchema: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    required: true,
    props: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    required: true,
    props: {
      placeholder: '请输入邮箱地址'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    props: {
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'select',
    props: {
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
    props: {
      placeholder: '请输入描述信息',
      rows: 3
    }
  }
]

// 复杂表单
const complexModel = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  city: '',
  interests: [],
  newsletter: false,
  birthDate: null
})

const complexSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'input',
    required: true,
    props: {
      placeholder: '请输入用户名'
    },
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符' }
    ]
  },
  {
    field: 'password',
    label: '密码',
    component: 'input',
    required: true,
    props: {
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
    props: {
      type: 'password',
      placeholder: '请再次输入密码'
    },
    rules: [
      { required: true, message: '请确认密码' },
      {
        validator: (rule: any, value: string) => {
          if (value !== complexModel.password) {
            return new Error('两次输入密码不一致')
          }
          return true
        }
      }
    ]
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    props: {
      placeholder: '请输入手机号'
    },
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
    ]
  },
  {
    field: 'address',
    label: '地址',
    component: 'input',
    props: {
      placeholder: '请输入详细地址'
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'select',
    props: {
      placeholder: '请选择城市',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ]
    }
  },
  {
    field: 'interests',
    label: '兴趣爱好',
    component: 'checkbox-group',
    props: {
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' }
      ]
    }
  },
  {
    field: 'newsletter',
    label: '订阅邮件',
    component: 'switch',
    props: {
      checkedText: '是',
      uncheckedText: '否'
    }
  },
  {
    field: 'birthDate',
    label: '出生日期',
    component: 'date-picker',
    props: {
      placeholder: '请选择出生日期',
      type: 'date'
    }
  }
]

// API 配置
const apiConfig: FormApiConfig = {
  submitUrl: '/api/user/create',
  method: 'POST'
}

// 动态表单
const dynamicModel = reactive({
  field1: '',
  field2: ''
})

const dynamicSchema = ref<FormSchema[]>([
  {
    field: 'field1',
    label: '字段1',
    component: 'input',
    props: {
      placeholder: '请输入字段1'
    }
  },
  {
    field: 'field2',
    label: '字段2',
    component: 'input',
    props: {
      placeholder: '请输入字段2'
    }
  }
])

// 验证表单
const validationModel = reactive({
  email: '',
  url: '',
  number: null,
  required: ''
})

const validationSchema: FormSchema[] = [
  {
    field: 'email',
    label: '邮箱验证',
    component: 'input',
    required: true,
    props: {
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
    props: {
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
    props: {
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
    props: {
      placeholder: '这是必填字段'
    }
  }
]

// 分组表单
const groupModel = reactive({
  basicInfo: {
    name: '',
    age: null
  },
  contactInfo: {
    email: '',
    phone: ''
  },
  preferences: {
    theme: '',
    language: ''
  }
})

const groupSchema: FormSchema[] = [
  {
    type: 'group',
    label: '基本信息',
    children: [
      {
        field: 'basicInfo.name',
        label: '姓名',
        component: 'input',
        required: true,
        props: {
          placeholder: '请输入姓名'
        }
      },
      {
        field: 'basicInfo.age',
        label: '年龄',
        component: 'input-number',
        props: {
          placeholder: '请输入年龄'
        }
      }
    ]
  },
  {
    type: 'group',
    label: '联系信息',
    children: [
      {
        field: 'contactInfo.email',
        label: '邮箱',
        component: 'input',
        props: {
          placeholder: '请输入邮箱'
        }
      },
      {
        field: 'contactInfo.phone',
        label: '电话',
        component: 'input',
        props: {
          placeholder: '请输入电话'
        }
      }
    ]
  },
  {
    type: 'group',
    label: '偏好设置',
    children: [
      {
        field: 'preferences.theme',
        label: '主题',
        component: 'select',
        props: {
          placeholder: '请选择主题',
          options: [
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' }
          ]
        }
      },
      {
        field: 'preferences.language',
        label: '语言',
        component: 'select',
        props: {
          placeholder: '请选择语言',
          options: [
            { label: '中文', value: 'zh' },
            { label: 'English', value: 'en' }
          ]
        }
      }
    ]
  }
]

// 方法
const handleBasicSubmit = (data: any) => {
  basicResult.value = `基础表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleComplexSubmit = (data: any) => {
  complexResult.value = `复杂表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleDynamicSubmit = (data: any) => {
  dynamicResult.value = `动态表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleValidationSubmit = (data: any) => {
  validationResult.value = `验证表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleGroupSubmit = (data: any) => {
  groupResult.value = `分组表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleFieldChange = (field: string, value: any) => {
  console.log(`字段 ${field} 值改变为:`, value)
}

// 表单操作方法
const submitBasicForm = () => {
  basicFormRef.value?.submit()
}

const resetBasicForm = () => {
  basicFormRef.value?.reset()
  basicResult.value = ''
}

const validateBasicForm = async () => {
  try {
    await basicFormRef.value?.validate()
    basicResult.value = '表单验证通过！'
  } catch (error) {
    basicResult.value = `表单验证失败：\n${JSON.stringify(error, null, 2)}`
  }
}

const submitComplexForm = () => {
  complexFormRef.value?.submit()
}

const resetComplexForm = () => {
  complexFormRef.value?.reset()
  complexResult.value = ''
}

const loadFormData = () => {
  // 模拟加载数据
  Object.assign(complexModel, {
    username: 'testuser',
    phone: '13800138000',
    address: '测试地址',
    city: 'beijing',
    interests: ['reading', 'music'],
    newsletter: true
  })
  complexResult.value = '数据加载完成'
}

const submitDynamicForm = () => {
  dynamicFormRef.value?.submit()
}

const resetDynamicForm = () => {
  dynamicFormRef.value?.reset()
  dynamicResult.value = ''
}

const submitValidationForm = () => {
  validationFormRef.value?.submit()
}

const resetValidationForm = () => {
  validationFormRef.value?.reset()
  validationResult.value = ''
}

const submitGroupForm = () => {
  groupFormRef.value?.submit()
}

const resetGroupForm = () => {
  groupFormRef.value?.reset()
  groupResult.value = ''
}

// 动态表单操作
let fieldCounter = 3

const addField = () => {
  const newField = {
    field: `field${fieldCounter}`,
    label: `字段${fieldCounter}`,
    component: 'input' as const,
    props: {
      placeholder: `请输入字段${fieldCounter}`
    }
  }
  
  dynamicSchema.value.push(newField)
  dynamicModel[`field${fieldCounter}`] = ''
  fieldCounter++
}

const removeField = () => {
  if (dynamicSchema.value.length > 1) {
    const removedField = dynamicSchema.value.pop()
    if (removedField) {
      delete dynamicModel[removedField.field]
    }
  }
}

const toggleFieldVisibility = () => {
  if (dynamicSchema.value.length > 0) {
    const firstField = dynamicSchema.value[0]
    firstField.hidden = !firstField.hidden
  }
}
</script>

<style scoped>
.clever-form-demo {
  max-width: 100%;
}

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