<template>
  <div class="clever-form-demo">
    <n-space vertical size="large">
      <!-- 基础用法 -->
      <n-card title="基础用法">
        <CleverForm
          ref="basicFormRef"
          :schemas="basicSchema"
          :data="basicModel"
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
          :schemas="complexSchema"
          :data="complexModel"
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
            :schemas="dynamicSchema"
            :data="dynamicModel"
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
          :schemas="validationSchema"
          :data="validationModel"
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
          :schemas="groupSchema"
          :data="groupModel"
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

      <!-- 布局模式演示 -->
      <n-card title="布局模式演示">
        <n-space vertical size="large">
          <!-- Grid 布局 -->
          <div>
            <h3>Grid 布局（默认）</h3>
            <CleverForm
              ref="gridFormRef"
              :schemas="layoutSchemas"
              :data="layoutModel"
              layout-mode="grid"
              :layout-config="gridLayoutConfig"
              @submit="handleLayoutSubmit"
            />
          </div>

          <!-- Flex 布局 -->
          <div>
            <h3>Flex 布局</h3>
            <CleverForm
              ref="flexFormRef"
              :schemas="flexLayoutSchemas"
              :data="layoutModel"
              layout-mode="flex"
              :layout-config="flexLayoutConfig"
              @submit="handleLayoutSubmit"
            />
          </div>

          <!-- Tabs 布局 -->
          <div>
            <h3>Tabs 布局</h3>
            <CleverForm
              ref="tabsFormRef"
              :schemas="tabsLayoutSchemas"
              :data="layoutModel"
              layout-mode="tabs"
              @submit="handleLayoutSubmit"
            />
          </div>

          <!-- Accordion 布局 -->
          <div>
            <h3>Accordion 布局</h3>
            <CleverForm
              ref="accordionFormRef"
              :schemas="accordionLayoutSchemas"
              :data="layoutModel"
              layout-mode="accordion"
              @submit="handleLayoutSubmit"
            />
          </div>

          <!-- 混合布局 -->
          <div>
            <h3>混合布局（Tabs + Grid + Accordion）</h3>
            <CleverForm
              ref="mixedFormRef"
              :schemas="mixedLayoutSchemas"
              :data="mixedLayoutModel"
              layout-mode="mixed"
              :layout-config="mixedLayoutConfig"
              @submit="handleMixedLayoutSubmit"
            />
          </div>

          <n-alert v-if="layoutResult" type="info">
            <pre>{{ layoutResult }}</pre>
          </n-alert>
        </n-space>
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
const gridFormRef = ref()
const flexFormRef = ref()
const tabsFormRef = ref()
const accordionFormRef = ref()
const mixedFormRef = ref()

// 结果显示
const basicResult = ref('')
const complexResult = ref('')
const dynamicResult = ref('')
const validationResult = ref('')
const groupResult = ref('')
const layoutResult = ref('')

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

// 布局模式相关数据
const layoutModel = reactive({
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  age: 25,
  gender: 'male',
  city: 'beijing',
  address: '北京市朝阳区',
  company: '某某公司',
  position: '前端工程师',
  salary: 15000,
  description: '这是一个测试描述'
})

// Grid 布局配置
const gridLayoutConfig = {
  grid: {
    cols: '1 s:2 m:3 l:4 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  }
}

// Flex 布局配置
const flexLayoutConfig = {
  flex: {
    wrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    itemFlex: '1 1 300px',
    itemMinWidth: '250px'
  }
}

// 混合布局数据模型
const mixedLayoutModel = reactive({
  // 基本信息
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  gender: 'male',
  birthday: null,
  
  // 地址信息
  country: 'china',
  province: 'beijing',
  city: 'beijing',
  address: '朝阳区某某街道',
  zipCode: '100000',
  
  // 工作信息
  company: '某某科技公司',
  position: '前端工程师',
  department: '技术部',
  salary: 15000,
  workYears: 3,
  
  // 其他信息
  hobbies: ['reading', 'coding'],
  skills: ['Vue', 'React', 'TypeScript'],
  description: '这是一个混合布局的演示表单，展示了如何在一个表单中使用多种布局方式。',
  avatar: '',
  resume: ''
})

// 混合布局配置
const mixedLayoutConfig = {
  grid: {
    cols: '1 s:2 m:3 l:4 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  },
  flex: {
    direction: 'row',
    wrap: 'wrap',
    gap: 16,
    justify: 'flex-start',
    align: 'flex-start'
  },
  tabs: {
    type: 'line',
    placement: 'top'
  },
  accordion: {
    accordion: true,
    defaultExpandedNames: ['basic-info'],
    arrowPlacement: 'left'
  }
}

// 基础布局字段
const layoutSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: { placeholder: '请输入姓名' },
    rules: [{ required: true, message: '请输入姓名' }],
    giProps: { span: 1 }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    componentProps: { placeholder: '请输入邮箱' },
    rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }],
    giProps: { span: 1 }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    componentProps: { placeholder: '请输入手机号' },
    giProps: { span: 1 }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: { placeholder: '请输入年龄', min: 1, max: 120 },
    giProps: { span: 1 }
  }
]

// Flex 布局字段（带自定义布局属性）
const flexLayoutSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: { placeholder: '请输入姓名' },
    layout: { flex: '1 1 200px', minWidth: '180px' }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    componentProps: { placeholder: '请输入邮箱' },
    layout: { flex: '2 1 300px', minWidth: '250px' }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    componentProps: { placeholder: '请输入手机号' },
    layout: { flex: '1 1 200px', minWidth: '180px' }
  },
  {
    field: 'description',
    label: '描述',
    component: 'NInput',
    componentProps: { type: 'textarea', placeholder: '请输入描述' },
    layout: { flex: '1 1 100%', minWidth: '100%' },
    breakLine: true
  }
]

// Tabs 布局字段（带分组）
const tabsLayoutSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: { placeholder: '请输入姓名' },
    group: '基本信息',
    giProps: { span: 1 }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    componentProps: { placeholder: '请输入邮箱' },
    group: '基本信息',
    giProps: { span: 1 }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    componentProps: { placeholder: '请输入手机号' },
    group: '联系方式',
    giProps: { span: 1 }
  },
  {
    field: 'address',
    label: '地址',
    component: 'NInput',
    componentProps: { placeholder: '请输入地址' },
    group: '联系方式',
    giProps: { span: 1 }
  },
  {
    field: 'company',
    label: '公司',
    component: 'NInput',
    componentProps: { placeholder: '请输入公司' },
    group: '工作信息',
    giProps: { span: 1 }
  },
  {
    field: 'position',
    label: '职位',
    component: 'NInput',
    componentProps: { placeholder: '请输入职位' },
    group: '工作信息',
    giProps: { span: 1 }
  }
]

// Accordion 布局字段（带分组）
const accordionLayoutSchemas = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: { placeholder: '请输入姓名' },
    group: '个人信息',
    order: 1,
    giProps: { span: 1 }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: { placeholder: '请输入年龄' },
    group: '个人信息',
    order: 2,
    giProps: { span: 1 }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    componentProps: { placeholder: '请输入邮箱' },
    group: '联系信息',
    order: 1,
    giProps: { span: 1 }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    componentProps: { placeholder: '请输入手机号' },
    group: '联系信息',
    order: 2,
    giProps: { span: 1 }
  },
  {
    field: 'salary',
    label: '薪资',
    component: 'NInputNumber',
    componentProps: { placeholder: '请输入薪资' },
    group: '薪资信息',
    order: 1,
    giProps: { span: 1 }
  }
]

// 混合布局字段定义（使用容器类型）
const mixedLayoutSchemas = [
  // 顶级Tabs容器
  {
    type: 'container',
    containerType: 'tabs',
    name: 'main-tabs',
    children: [
      {
        name: 'basic-tab',
        title: '基本信息',
        label: '基本信息',
        children: [
          // 基本信息使用Grid布局
          {
            type: 'container',
            containerType: 'grid',
            config: {
              cols: '1 s:2 m:3 l:3 xl:3 2xl:3',
              xGap: 16,
              yGap: 16
            },
            children: [
              {
                field: 'name',
                label: '姓名',
                component: 'NInput',
                componentProps: { placeholder: '请输入姓名' },
                rules: [{ required: true, message: '请输入姓名' }],
                giProps: { span: 1 }
              },
              {
                field: 'email',
                label: '邮箱',
                component: 'NInput',
                componentProps: { placeholder: '请输入邮箱' },
                rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }],
                giProps: { span: 1 }
              },
              {
                field: 'phone',
                label: '手机号',
                component: 'NInput',
                componentProps: { placeholder: '请输入手机号' },
                giProps: { span: 1 }
              },
              {
                field: 'gender',
                label: '性别',
                component: 'NRadioGroup',
                componentProps: {
                  options: [
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' }
                  ]
                },
                giProps: { span: 1 }
              },
              {
                field: 'birthday',
                label: '生日',
                component: 'NDatePicker',
                componentProps: { placeholder: '请选择生日', type: 'date' },
                giProps: { span: 1 }
              }
            ]
          }
        ]
      },
      {
        name: 'address-tab',
        title: '地址信息',
        label: '地址信息',
        children: [
          // 地址信息使用Flex布局
          {
            type: 'container',
            containerType: 'flex',
            config: {
              direction: 'row',
              wrap: 'wrap',
              gap: 16,
              justify: 'flex-start',
              align: 'flex-start'
            },
            children: [
              {
                field: 'country',
                label: '国家',
                component: 'NSelect',
                componentProps: {
                  placeholder: '请选择国家',
                  options: [
                    { label: '中国', value: 'china' },
                    { label: '美国', value: 'usa' },
                    { label: '日本', value: 'japan' }
                  ]
                },
                layout: { flex: '1 1 200px', minWidth: '180px' }
              },
              {
                field: 'province',
                label: '省份',
                component: 'NInput',
                componentProps: { placeholder: '请输入省份' },
                layout: { flex: '1 1 200px', minWidth: '180px' }
              },
              {
                field: 'city',
                label: '城市',
                component: 'NInput',
                componentProps: { placeholder: '请输入城市' },
                layout: { flex: '1 1 200px', minWidth: '180px' }
              },
              {
                field: 'zipCode',
                label: '邮编',
                component: 'NInput',
                componentProps: { placeholder: '请输入邮编' },
                layout: { flex: '1 1 150px', minWidth: '120px' }
              },
              {
                field: 'address',
                label: '详细地址',
                component: 'NInput',
                componentProps: { placeholder: '请输入详细地址' },
                layout: { flex: '1 1 100%', minWidth: '100%' }
              }
            ]
          }
        ]
      },
      {
        name: 'work-tab',
        title: '工作信息',
        label: '工作信息',
        children: [
          // 工作信息使用Accordion布局
          {
            type: 'container',
            containerType: 'accordion',
            config: {
              accordion: false, // 允许多个同时展开
              defaultExpandedNames: ['company-info', 'position-info'] // 默认展开公司信息和职位信息
            },
            children: [
              {
                name: 'company-info',
                title: '公司信息',
                label: '公司信息',
                children: [
                  {
                    type: 'container',
                    containerType: 'grid',
                    config: {
                      cols: '1 s:2 m:2 l:2 xl:2 2xl:2',
                      xGap: 16,
                      yGap: 16
                    },
                    children: [
                      {
                        field: 'company',
                        label: '公司名称',
                        component: 'NInput',
                        componentProps: { placeholder: '请输入公司名称' },
                        giProps: { span: 1 }
                      },
                      {
                        field: 'department',
                        label: '部门',
                        component: 'NInput',
                        componentProps: { placeholder: '请输入部门' },
                        giProps: { span: 1 }
                      }
                    ]
                  }
                ]
              },
              {
                name: 'position-info',
                title: '职位信息',
                label: '职位信息',
                children: [
                  {
                    type: 'container',
                    containerType: 'grid',
                    config: {
                      cols: '1 s:2 m:3 l:3 xl:3 2xl:3',
                      xGap: 16,
                      yGap: 16
                    },
                    children: [
                      {
                        field: 'position',
                        label: '职位',
                        component: 'NInput',
                        componentProps: { placeholder: '请输入职位' },
                        giProps: { span: 1 }
                      },
                      {
                        field: 'salary',
                        label: '薪资',
                        component: 'NInputNumber',
                        componentProps: { placeholder: '请输入薪资', min: 0 },
                        giProps: { span: 1 }
                      },
                      {
                        field: 'workYears',
                        label: '工作年限',
                        component: 'NInputNumber',
                        componentProps: { placeholder: '请输入工作年限', min: 0 },
                        giProps: { span: 1 }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'other-tab',
        title: '其他信息',
        label: '其他信息',
        children: [
          {
            field: 'hobbies',
            label: '爱好',
            component: 'NDynamicTags',
            componentProps: { placeholder: '请输入爱好' }
          },
          {
            field: 'skills',
            label: '技能',
            component: 'NDynamicTags',
            componentProps: { placeholder: '请输入技能' }
          },
          {
            field: 'description',
            label: '个人描述',
            component: 'NInput',
            componentProps: {
              type: 'textarea',
              placeholder: '请输入个人描述',
              rows: 4
            }
          }
        ]
      }
    ]
  }
]

// 布局提交处理
const handleLayoutSubmit = (data: any) => {
  layoutResult.value = `表单提交成功：\n${JSON.stringify(data, null, 2)}`
}

// 混合布局提交处理
const handleMixedLayoutSubmit = (data: any) => {
  layoutResult.value = `混合布局表单提交成功：\n${JSON.stringify(data, null, 2)}`
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