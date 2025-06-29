<template>
  <div class="layout-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="布局容器示例">
        演示 CleverForm 的各种布局容器，包括网格、弹性、标签页、分组、卡片、折叠面板、步骤和行内布局。
      </n-alert>

      <!-- 布局选择 -->
      <n-card title="布局类型选择">
        <n-radio-group v-model:value="currentLayout" name="layout-type">
          <n-space>
            <n-radio value="grid">网格布局</n-radio>
            <n-radio value="flex">弹性布局</n-radio>
            <n-radio value="tabs">标签页布局</n-radio>
            <n-radio value="group">分组布局</n-radio>
            <n-radio value="card">卡片布局</n-radio>
            <n-radio value="collapse">折叠面板</n-radio>
            <n-radio value="steps">步骤布局</n-radio>
            <n-radio value="inline">行内布局</n-radio>
          </n-space>
        </n-radio-group>
      </n-card>

      <!-- Demo类型选择 -->
      <n-card title="Demo类型">
        <n-radio-group v-model:value="currentDemo" name="demo-type">
          <n-space>
            <n-radio value="basic">基础示例</n-radio>
            <n-radio value="nested">嵌套布局</n-radio>
            <n-radio value="validation">带验证</n-radio>
          </n-space>
        </n-radio-group>
      </n-card>

      <!-- 表单示例 -->
      <n-card :title="`${layoutTitles[currentLayout]} - ${demoTitles[currentDemo]}`">
        <CleverForm
          v-model="formData"
          :config="currentFormConfig"
          @submit="handleSubmit"
          @validate="handleValidate"
        />
      </n-card>

      <!-- 验证结果展示 -->
      <n-card v-if="currentDemo === 'validation'" title="验证结果">
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

      <!-- 配置展示 -->
      <n-card title="当前布局配置">
        <n-code :code="JSON.stringify(currentFormConfig.layout, null, 2)" language="json" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NSpace,
  NAlert,
  NCard,
  NCode,
  NRadioGroup,
  NRadio,
  NTag,
  NList,
  NListItem,
  NThing,
  NText,
  useMessage
} from 'naive-ui'
import { CleverForm } from "@clever-component/components";
import type { FormConfig, FormData, ValidationResult } from '@clever-component/components'

const message = useMessage()

// 当前布局类型
const currentLayout = ref<'grid' | 'flex' | 'tabs' | 'group' | 'card' | 'collapse' | 'steps' | 'inline'>('grid')

// 当前Demo类型
const currentDemo = ref<'basic' | 'nested' | 'validation'>('basic')

// 布局标题
const layoutTitles = {
  grid: '网格布局',
  flex: '弹性布局',
  tabs: '标签页布局',
  group: '分组布局',
  card: '卡片布局',
  collapse: '折叠面板布局',
  steps: '步骤布局',
  inline: '行内布局'
}

// Demo标题
const demoTitles = {
  basic: '基础示例',
  nested: '嵌套布局',
  validation: '带验证'
}

// 验证状态
const isValid = ref(true)
const validationErrors = ref<Array<{ field: string; message: string }>>([])

// 表单数据
const formData = ref<FormData>({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  gender: '',
  age: null,
  
  // 地址信息
  country: '',
  province: '',
  city: '',
  address: '',
  
  // 工作信息
  company: '',
  position: '',
  salary: null,
  experience: '',
  
  // 其他信息
  hobbies: [],
  description: '',
  avatar: null,
  agree: false,
  
  // 步骤表单数据
  step1: {
    username: '',
    password: ''
  },
  step2: {
    realName: '',
    idCard: ''
  },
  step3: {
    preferences: []
  }
})

// 基础字段配置
const baseFields = [
  {
    field: 'name',
    label: '姓名',
    component: 'input' as const,
    required: true,
    placeholder: '请输入姓名',
    props: { clearable: true }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input' as const,
    required: true,
    placeholder: '请输入邮箱',
    props: { clearable: true }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input' as const,
    placeholder: '请输入手机号',
    props: { clearable: true }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radio-group' as const,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number' as const,
    placeholder: '请输入年龄',
    props: { min: 1, max: 120 }
  },
  {
    field: 'hobbies',
    label: '爱好',
    component: 'checkbox-group' as const,
    options: [
      { label: '阅读', value: 'reading' },
      { label: '运动', value: 'sports' },
      { label: '音乐', value: 'music' },
      { label: '旅行', value: 'travel' }
    ]
  },
  {
    field: 'description',
    label: '描述',
    component: 'textarea' as const,
    placeholder: '请输入描述',
    props: { rows: 3 }
  }
]

// 验证字段配置
const validationFields = baseFields.map(field => ({
  ...field,
  validation: {
    rules: field.required ? [
      { required: true, message: `请输入${field.label}` },
      ...(field.field === 'email' ? [{ type: 'email', message: '请输入正确的邮箱格式' }] : []),
      ...(field.field === 'name' ? [{ min: 2, max: 20, message: '姓名长度应在2-20个字符之间' }] : [])
    ] : []
  }
}))

// 网格布局配置
const gridConfigs = {
  basic: {
    type: 'grid' as const,
    props: { cols: 2, rowGap: 16, colGap: 16 },
    children: baseFields.slice(0, 4)
  },
  nested: {
    type: 'grid' as const,
    props: { cols: 1, rowGap: 24 },
    children: [
      {
        type: 'grid' as const,
        title: '基本信息',
        props: { cols: 2, rowGap: 16, colGap: 16 },
        children: baseFields.slice(0, 2)
      },
      {
        type: 'grid' as const,
        title: '详细信息',
        props: { cols: 3, rowGap: 16, colGap: 16 },
        children: baseFields.slice(2, 5)
      }
    ]
  },
  validation: {
    type: 'grid' as const,
    props: { cols: 2, rowGap: 16, colGap: 16 },
    children: [...validationFields.slice(0, 4), {
      field: 'agree',
      label: '',
      component: 'checkbox' as const,
      text: '我同意相关条款',
      required: true,
      props: { span: 2 },
      validation: {
        rules: [{ required: true, message: '请同意相关条款' }]
      }
    }]
  }
}

// 弹性布局配置
const flexConfigs = {
  basic: {
    type: 'flex' as const,
    props: { direction: 'column', gap: 16 },
    children: baseFields.slice(0, 4)
  },
  nested: {
    type: 'flex' as const,
    props: { direction: 'column', gap: 24 },
    children: [
      {
        type: 'flex' as const,
        title: '水平布局',
        props: { direction: 'row', gap: 16, wrap: true },
        children: baseFields.slice(0, 3)
      },
      {
        type: 'flex' as const,
        title: '垂直布局',
        props: { direction: 'column', gap: 16 },
        children: baseFields.slice(3, 5)
      }
    ]
  },
  validation: {
    type: 'flex' as const,
    props: { direction: 'column', gap: 16 },
    children: validationFields.slice(0, 4)
  }
}

// 标签页布局配置
const tabsConfigs = {
  basic: {
    type: 'tabs' as const,
    props: {
      type: 'card',
      tabs: [
        {
          key: 'basic',
          label: '基本信息',
          children: baseFields.slice(0, 3)
        },
        {
          key: 'detail',
          label: '详细信息',
          children: baseFields.slice(3, 6)
        }
      ]
    },
    children: []
  },
  nested: {
    type: 'tabs' as const,
    props: {
      type: 'line',
      tabs: [
        {
          key: 'info',
          label: '个人信息',
          children: [
            {
              type: 'grid' as const,
              props: { cols: 2, rowGap: 16, colGap: 16 },
              children: baseFields.slice(0, 4)
            }
          ]
        },
        {
          key: 'other',
          label: '其他信息',
          children: [
            {
              type: 'flex' as const,
              props: { direction: 'column', gap: 16 },
              children: baseFields.slice(4, 7)
            }
          ]
        }
      ]
    },
    children: []
  },
  validation: {
    type: 'tabs' as const,
    props: {
      type: 'segment',
      tabs: [
        {
          key: 'required',
          label: '必填信息',
          children: validationFields.slice(0, 2)
        },
        {
          key: 'optional',
          label: '选填信息',
          children: validationFields.slice(2, 4)
        }
      ]
    },
    children: []
  }
 }

// 分组布局配置
const groupConfigs = {
  basic: {
    type: 'group' as const,
    title: '用户信息',
    props: { collapsible: true, defaultExpanded: true },
    children: baseFields.slice(0, 4)
  },
  nested: {
    type: 'vertical' as const,
    props: { gap: 24 },
    children: [
      {
        type: 'group' as const,
        title: '基本信息',
        props: { collapsible: true, defaultExpanded: true },
        children: baseFields.slice(0, 3)
      },
      {
        type: 'group' as const,
        title: '详细信息',
        props: { collapsible: true, defaultExpanded: false },
        children: baseFields.slice(3, 6)
      }
    ]
  },
  validation: {
    type: 'group' as const,
    title: '验证表单',
    props: { collapsible: false },
    children: validationFields.slice(0, 4)
  }
}

// 卡片布局配置
const cardConfigs = {
  basic: {
    type: 'card' as const,
    title: '用户信息卡片',
    props: { bordered: true },
    children: baseFields.slice(0, 4)
  },
  nested: {
    type: 'vertical' as const,
    props: { gap: 16 },
    children: [
      {
        type: 'card' as const,
        title: '基本信息',
        props: { bordered: true, size: 'small' },
        children: baseFields.slice(0, 2)
      },
      {
        type: 'card' as const,
        title: '联系信息',
        props: { bordered: true, size: 'small' },
        children: baseFields.slice(2, 4)
      }
    ]
  },
  validation: {
    type: 'card' as const,
    title: '验证表单',
    props: { bordered: true, hoverable: true },
    children: validationFields.slice(0, 4)
  }
}

// 折叠面板布局配置
const collapseConfigs = {
  basic: {
    type: 'collapse' as const,
    props: {
      panels: [
        {
          key: 'basic',
          title: '基本信息',
          children: baseFields.slice(0, 3)
        }
      ]
    },
    children: []
  },
  nested: {
    type: 'collapse' as const,
    props: {
      accordion: false,
      panels: [
        {
          key: 'personal',
          title: '个人信息',
          children: [
            {
              type: 'grid' as const,
              props: { cols: 2, rowGap: 16, colGap: 16 },
              children: baseFields.slice(0, 3)
            }
          ]
        },
        {
          key: 'contact',
          title: '联系信息',
          children: [
            {
              type: 'flex' as const,
              props: { direction: 'column', gap: 16 },
              children: baseFields.slice(3, 5)
            }
          ]
        }
      ]
    },
    children: []
  },
  validation: {
    type: 'collapse' as const,
    props: {
      accordion: true,
      panels: [
        {
          key: 'validation',
          title: '验证信息',
          children: validationFields.slice(0, 4)
        }
      ]
    },
    children: []
  }
}

// 步骤布局配置
const stepsConfigs = {
  basic: {
    type: 'steps' as const,
    props: {
      current: 0,
      steps: [
        {
          title: '基本信息',
          children: baseFields.slice(0, 2)
        },
        {
          title: '详细信息',
          children: baseFields.slice(2, 4)
        }
      ]
    },
    children: []
  },
  nested: {
    type: 'steps' as const,
    props: {
      current: 0,
      direction: 'vertical',
      steps: [
        {
          title: '账户信息',
          description: '设置登录信息',
          children: [
            {
              type: 'grid' as const,
              props: { cols: 1, rowGap: 16 },
              children: [
                {
                  field: 'step1.username',
                  label: '用户名',
                  component: 'input' as const,
                  required: true,
                  placeholder: '请输入用户名'
                },
                {
                  field: 'step1.password',
                  label: '密码',
                  component: 'input' as const,
                  required: true,
                  placeholder: '请输入密码',
                  props: { type: 'password' }
                }
              ]
            }
          ]
        },
        {
          title: '身份验证',
          description: '验证身份信息',
          children: [
            {
              type: 'grid' as const,
              props: { cols: 1, rowGap: 16 },
              children: [
                {
                  field: 'step2.realName',
                  label: '真实姓名',
                  component: 'input' as const,
                  required: true,
                  placeholder: '请输入真实姓名'
                },
                {
                  field: 'step2.idCard',
                  label: '身份证号',
                  component: 'input' as const,
                  required: true,
                  placeholder: '请输入身份证号'
                }
              ]
            }
          ]
        }
      ]
    },
    children: []
  },
  validation: {
    type: 'steps' as const,
    props: {
      current: 0,
      steps: [
        {
          title: '验证步骤',
          children: validationFields.slice(0, 2)
        }
      ]
    },
    children: []
  }
}

// 行内布局配置
const inlineConfigs = {
  basic: {
    type: 'inline' as const,
    props: { gap: 16 },
    children: baseFields.slice(0, 3)
  },
  nested: {
    type: 'vertical' as const,
    props: { gap: 16 },
    children: [
      {
        type: 'inline' as const,
        title: '基本信息',
        props: { gap: 16, wrap: true },
        children: baseFields.slice(0, 3)
      },
      {
        type: 'inline' as const,
        title: '其他信息',
        props: { gap: 16, align: 'center' },
        children: baseFields.slice(3, 5)
      }
    ]
  },
  validation: {
    type: 'inline' as const,
    props: { gap: 16, wrap: true },
    children: validationFields.slice(0, 3)
  }
 }

// 计算属性：根据当前布局和demo类型返回对应的表单配置
const currentFormConfig = computed(() => {
  const configs = {
    grid: gridConfigs,
    flex: flexConfigs,
    tabs: tabsConfigs,
    group: groupConfigs,
    card: cardConfigs,
    collapse: collapseConfigs,
    steps: stepsConfigs,
    inline: inlineConfigs
  }
  
  const layoutConfigs = configs[currentLayout.value]
  if (!layoutConfigs) return null
  
  const config = layoutConfigs[currentDemo.value]
  if (!config) return null
  
  return {
    layout: config,
    validation: currentDemo.value === 'validation' ? {
      validateOnInput: true,
      validateOnBlur: true,
      showErrorMessage: true
    } : undefined
  }
})

// 表单验证处理
const handleValidate = (result: any) => {
  isValid.value = result.isValid
  validationErrors.value = result.errors || []
}

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('表单提交:', data)
}

// 处理表单重置
const handleReset = () => {
  Object.keys(formData.value).forEach(key => {
    if (typeof formData.value[key] === 'object' && formData.value[key] !== null) {
      Object.keys(formData.value[key]).forEach(subKey => {
        formData.value[key][subKey] = ''
      })
    } else {
      formData.value[key] = ''
    }
  })
  isValid.value = true
  validationErrors.value = []
}
</script>
<style scoped>
.layout-demo {
  padding: 20px;
}
</style>