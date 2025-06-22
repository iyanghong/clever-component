<template>
  <DemoContainer
    title="分组表单"
    description="展示CleverForm的表单分组功能，包括Tab分组、Accordion分组和Card分组等。"
    :code="demoCode"
  >
    <n-space vertical size="large">
      <!-- 分组模式切换 -->
      <n-card title="分组模式" size="small">
        <n-radio-group v-model:value="groupMode" @update:value="handleGroupModeChange">
          <n-radio-button value="tabs">Tab分组</n-radio-button>
          <n-radio-button value="accordion">手风琴分组</n-radio-button>
          <n-radio-button value="card">卡片分组</n-radio-button>
          <n-radio-button value="steps">步骤分组</n-radio-button>
        </n-radio-group>
      </n-card>

      <!-- 表单容器 -->
      <CleverForm
        ref="formRef"
        :schemas="schemas"
        :data="model"
        :layout="formLayout"
        @submit="handleSubmit"
        @group-change="handleGroupChange"
      />
    </n-space>
    
    <template #actions>
      <n-space>
        <n-button type="primary" @click="submitForm">提交表单</n-button>
        <n-button @click="resetForm">重置表单</n-button>
        <n-button @click="validateForm" secondary>验证表单</n-button>
        <n-button @click="fillTestData" secondary>填充测试数据</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="result" type="info">
        <pre>{{ result }}</pre>
      </n-alert>
      
      <n-alert v-if="validationResult" :type="validationResult.success ? 'success' : 'error'" style="margin-top: 12px;">
        <div>验证结果：{{ validationResult.success ? '通过' : '失败' }}</div>
        <div v-if="!validationResult.success">
          <div v-for="error in validationResult.errors" :key="error.field" class="error-item">
            <n-tag type="error" size="small">{{ error.field }}</n-tag>
            {{ error.message }}
          </div>
        </div>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { NSpace, NButton, NAlert, NTag, NCard, NRadioGroup, NRadioButton } from 'naive-ui'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateFormCode, generateRandomUserData } from '../../utils/demo-utils'

// 表单引用
const formRef = ref()

// 分组模式
const groupMode = ref('tabs')

// 结果显示
const result = ref('')
const validationResult = ref<{ success: boolean; errors: any[] } | null>(null)

// 表单数据模型
const model = reactive({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthday: null,
  avatar: '',
  
  // 地址信息
  country: '',
  province: '',
  city: '',
  address: '',
  zipCode: '',
  
  // 工作信息
  company: '',
  position: '',
  department: '',
  salary: null,
  workYears: null,
  skills: [],
  
  // 教育信息
  education: '',
  school: '',
  major: '',
  graduationYear: null,
  degree: '',
  
  // 偏好设置
  theme: 'light',
  language: 'zh-CN',
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  privacy: {
    profilePublic: false,
    showEmail: false,
    showPhone: false
  },
  
  // 其他信息
  bio: '',
  hobbies: [],
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: ''
  }
})

// 表单布局配置
const formLayout = computed(() => ({
  mode: groupMode.value,
  labelWidth: 120,
  labelPlacement: 'left'
}))

// 表单字段配置
const schemas = computed<FormFieldSchema[]>(() => [
  // 基本信息组
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    required: true,
    group: 'basic',
    componentProps: {
      placeholder: '请输入姓名'
    },
    rules: [
      { required: true, message: '请输入姓名' },
      { min: 2, max: 20, message: '姓名长度应在2-20个字符之间' }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    required: true,
    group: 'basic',
    componentProps: {
      placeholder: '请输入邮箱地址'
    },
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    required: true,
    group: 'basic',
    componentProps: {
      placeholder: '请输入手机号'
    },
    rules: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
    ]
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radio-group',
    group: 'basic',
    componentProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' }
      ]
    }
  },
  {
    field: 'birthday',
    label: '生日',
    component: 'date-picker',
    group: 'basic',
    componentProps: {
      placeholder: '请选择生日',
      type: 'date'
    }
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'upload',
    group: 'basic',
    componentProps: {
      accept: 'image/*',
      listType: 'image-card',
      max: 1
    }
  },
  
  // 地址信息组
  {
    field: 'country',
    label: '国家',
    component: 'select',
    group: 'address',
    componentProps: {
      placeholder: '请选择国家',
      options: [
        { label: '中国', value: 'CN' },
        { label: '美国', value: 'US' },
        { label: '日本', value: 'JP' },
        { label: '韩国', value: 'KR' }
      ]
    }
  },
  {
    field: 'province',
    label: '省份',
    component: 'select',
    group: 'address',
    componentProps: {
      placeholder: '请选择省份',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' },
        { label: '江苏', value: 'jiangsu' }
      ]
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'input',
    group: 'address',
    componentProps: {
      placeholder: '请输入城市'
    }
  },
  {
    field: 'address',
    label: '详细地址',
    component: 'textarea',
    group: 'address',
    componentProps: {
      placeholder: '请输入详细地址',
      rows: 3
    }
  },
  {
    field: 'zipCode',
    label: '邮政编码',
    component: 'input',
    group: 'address',
    componentProps: {
      placeholder: '请输入邮政编码'
    },
    rules: [
      { pattern: /^\d{6}$/, message: '请输入正确的邮政编码' }
    ]
  },
  
  // 工作信息组
  {
    field: 'company',
    label: '公司名称',
    component: 'input',
    group: 'work',
    componentProps: {
      placeholder: '请输入公司名称'
    }
  },
  {
    field: 'position',
    label: '职位',
    component: 'input',
    group: 'work',
    componentProps: {
      placeholder: '请输入职位'
    }
  },
  {
    field: 'department',
    label: '部门',
    component: 'input',
    group: 'work',
    componentProps: {
      placeholder: '请输入部门'
    }
  },
  {
    field: 'salary',
    label: '薪资',
    component: 'input-number',
    group: 'work',
    componentProps: {
      placeholder: '请输入薪资',
      min: 0,
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
    }
  },
  {
    field: 'workYears',
    label: '工作年限',
    component: 'input-number',
    group: 'work',
    componentProps: {
      placeholder: '请输入工作年限',
      min: 0,
      max: 50
    }
  },
  {
    field: 'skills',
    label: '技能',
    component: 'select',
    group: 'work',
    componentProps: {
      placeholder: '请选择技能',
      multiple: true,
      options: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Vue.js', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
        { label: 'Go', value: 'go' }
      ]
    }
  },
  
  // 教育信息组
  {
    field: 'education',
    label: '学历',
    component: 'select',
    group: 'education',
    componentProps: {
      placeholder: '请选择学历',
      options: [
        { label: '高中', value: 'high_school' },
        { label: '大专', value: 'college' },
        { label: '本科', value: 'bachelor' },
        { label: '硕士', value: 'master' },
        { label: '博士', value: 'doctor' }
      ]
    }
  },
  {
    field: 'school',
    label: '学校',
    component: 'input',
    group: 'education',
    componentProps: {
      placeholder: '请输入学校名称'
    }
  },
  {
    field: 'major',
    label: '专业',
    component: 'input',
    group: 'education',
    componentProps: {
      placeholder: '请输入专业'
    }
  },
  {
    field: 'graduationYear',
    label: '毕业年份',
    component: 'date-picker',
    group: 'education',
    componentProps: {
      placeholder: '请选择毕业年份',
      type: 'year'
    }
  },
  {
    field: 'degree',
    label: '学位',
    component: 'input',
    group: 'education',
    componentProps: {
      placeholder: '请输入学位'
    }
  },
  
  // 偏好设置组
  {
    field: 'theme',
    label: '主题',
    component: 'radio-group',
    group: 'preferences',
    componentProps: {
      options: [
        { label: '浅色', value: 'light' },
        { label: '深色', value: 'dark' },
        { label: '自动', value: 'auto' }
      ]
    }
  },
  {
    field: 'language',
    label: '语言',
    component: 'select',
    group: 'preferences',
    componentProps: {
      placeholder: '请选择语言',
      options: [
        { label: '中文', value: 'zh-CN' },
        { label: 'English', value: 'en-US' },
        { label: '日本語', value: 'ja-JP' },
        { label: '한국어', value: 'ko-KR' }
      ]
    }
  },
  {
    field: 'notifications.email',
    label: '邮件通知',
    component: 'switch',
    group: 'preferences',
    componentProps: {
      checkedText: '开启',
      uncheckedText: '关闭'
    }
  },
  {
    field: 'notifications.sms',
    label: '短信通知',
    component: 'switch',
    group: 'preferences',
    componentProps: {
      checkedText: '开启',
      uncheckedText: '关闭'
    }
  },
  {
    field: 'notifications.push',
    label: '推送通知',
    component: 'switch',
    group: 'preferences',
    componentProps: {
      checkedText: '开启',
      uncheckedText: '关闭'
    }
  },
  {
    field: 'privacy.profilePublic',
    label: '公开资料',
    component: 'switch',
    group: 'preferences',
    componentProps: {
      checkedText: '公开',
      uncheckedText: '私密'
    }
  },
  {
    field: 'privacy.showEmail',
    label: '显示邮箱',
    component: 'switch',
    group: 'preferences',
    componentProps: {
      checkedText: '显示',
      uncheckedText: '隐藏'
    }
  },
  {
    field: 'privacy.showPhone',
    label: '显示手机',
    component: 'switch',
    group: 'preferences',
    componentProps: {
      checkedText: '显示',
      uncheckedText: '隐藏'
    }
  },
  
  // 其他信息组
  {
    field: 'bio',
    label: '个人简介',
    component: 'textarea',
    group: 'other',
    componentProps: {
      placeholder: '请输入个人简介',
      rows: 4,
      maxlength: 500,
      showCount: true
    }
  },
  {
    field: 'hobbies',
    label: '兴趣爱好',
    component: 'select',
    group: 'other',
    componentProps: {
      placeholder: '请选择兴趣爱好',
      multiple: true,
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '电影', value: 'movies' },
        { label: '旅行', value: 'travel' },
        { label: '摄影', value: 'photography' },
        { label: '游戏', value: 'gaming' },
        { label: '烹饪', value: 'cooking' }
      ]
    }
  },
  {
    field: 'socialLinks.github',
    label: 'GitHub',
    component: 'input',
    group: 'other',
    componentProps: {
      placeholder: '请输入GitHub链接'
    }
  },
  {
    field: 'socialLinks.linkedin',
    label: 'LinkedIn',
    component: 'input',
    group: 'other',
    componentProps: {
      placeholder: '请输入LinkedIn链接'
    }
  },
  {
    field: 'socialLinks.twitter',
    label: 'Twitter',
    component: 'input',
    group: 'other',
    componentProps: {
      placeholder: '请输入Twitter链接'
    }
  }
])

// 分组配置
const groupConfig = {
  basic: { title: '基本信息', icon: 'person-outline' },
  address: { title: '地址信息', icon: 'location-outline' },
  work: { title: '工作信息', icon: 'briefcase-outline' },
  education: { title: '教育信息', icon: 'school-outline' },
  preferences: { title: '偏好设置', icon: 'settings-outline' },
  other: { title: '其他信息', icon: 'information-circle-outline' }
}

// 生成演示代码
const demoCode = computed(() => generateFormCode({
  schemas: schemas.value,
  model,
  title: '分组表单示例',
  description: `展示${groupMode.value}分组模式的表单`,
  layout: formLayout.value
}))

// 事件处理
const handleSubmit = (data: any) => {
  result.value = `分组表单提交成功：\n${JSON.stringify(data, null, 2)}`
  validationResult.value = null
}

const handleGroupChange = (groupKey: string) => {
  console.log('分组切换:', groupKey)
}

const handleGroupModeChange = (mode: string) => {
  console.log('分组模式切换:', mode)
}

// 表单操作方法
const submitForm = () => {
  formRef.value?.submit()
}

const resetForm = () => {
  formRef.value?.reset()
  result.value = ''
  validationResult.value = null
}

const validateForm = async () => {
  try {
    const valid = await formRef.value?.validate()
    validationResult.value = {
      success: valid,
      errors: []
    }
  } catch (errors) {
    validationResult.value = {
      success: false,
      errors: Array.isArray(errors) ? errors : [errors]
    }
  }
}

const fillTestData = () => {
  const testData = generateRandomUserData()
  Object.assign(model, testData)
  result.value = '测试数据已填充'
}
</script>

<style scoped>
pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 300px;
  overflow: auto;
}

.error-item {
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
</style>