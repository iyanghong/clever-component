<template>
  <div class="dynamic-form-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="动态表单示例">
        演示 CleverForm 的动态功能，包括条件显示、动态字段、联动效果等。
      </n-alert>

      <!-- 控制面板 -->
      <n-card title="动态控制">
        <n-space>
          <n-button @click="addEducation" type="primary">
            添加教育经历
          </n-button>
          <n-button @click="addWorkExperience" type="primary">
            添加工作经历
          </n-button>
          <n-button @click="resetForm" type="warning">
            重置表单
          </n-button>
          <n-button @click="toggleAdvanced">
            {{ showAdvanced ? '隐藏' : '显示' }}高级选项
          </n-button>
        </n-space>
      </n-card>

      <!-- 表单示例 -->
      <n-card title="动态简历表单">
        <CleverForm
          v-model="formData"
          :config="dynamicFormConfig"
          @submit="handleSubmit"
          @field:change="handleFieldChange"
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
import { ref, reactive, computed, watch } from 'vue'
import {
  NSpace,
  NAlert,
  NCard,
  NCode,
  NButton,
  useMessage
} from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig, FormData, FieldConfig } from '@clever-component/components'

const message = useMessage()

// 控制状态
const showAdvanced = ref(false)
const educationCount = ref(1)
const workExperienceCount = ref(1)

// 表单数据
const formData = ref<FormData>({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  gender: '',
  maritalStatus: '',
  
  // 求职意向
  jobType: '',
  expectedSalary: null,
  workLocation: '',
  
  // 教育经历
  educations: [{
    school: '',
    major: '',
    degree: '',
    startDate: null,
    endDate: null
  }],
  
  // 工作经历
  workExperiences: [{
    company: '',
    position: '',
    startDate: null,
    endDate: null,
    description: ''
  }],
  
  // 高级选项
  skills: [],
  languages: [],
  certificates: '',
  portfolio: '',
  
  // 其他
  selfIntroduction: ''
})

// 生成教育经历字段
const generateEducationFields = (): FieldConfig[] => {
  const fields: FieldConfig[] = []
  
  for (let i = 0; i < educationCount.value; i++) {
    fields.push(
      {
        field: `educations.${i}.school`,
        label: `学校 ${i + 1}`,
        component: 'input',
        placeholder: '请输入学校名称',
        props: { clearable: true }
      },
      {
        field: `educations.${i}.major`,
        label: `专业 ${i + 1}`,
        component: 'input',
        placeholder: '请输入专业名称',
        props: { clearable: true }
      },
      {
        field: `educations.${i}.degree`,
        label: `学历 ${i + 1}`,
        component: 'select',
        props: {
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
        field: `educations.${i}.startDate`,
        label: `入学时间 ${i + 1}`,
        component: 'date-picker',
        props: {
          type: 'month',
          placeholder: '请选择入学时间'
        }
      },
      {
        field: `educations.${i}.endDate`,
        label: `毕业时间 ${i + 1}`,
        component: 'date-picker',
        props: {
          type: 'month',
          placeholder: '请选择毕业时间'
        }
      }
    )
    
    // 添加删除按钮（除了第一个）
    if (i > 0) {
      fields.push({
        field: `educations.${i}.delete`,
        label: '',
        component: 'custom',
        render: () => {
          return h(NButton, {
            type: 'error',
            size: 'small',
            onClick: () => removeEducation(i)
          }, () => '删除')
        }
      })
    }
  }
  
  return fields
}

// 生成工作经历字段
const generateWorkExperienceFields = (): FieldConfig[] => {
  const fields: FieldConfig[] = []
  
  for (let i = 0; i < workExperienceCount.value; i++) {
    fields.push(
      {
        field: `workExperiences.${i}.company`,
        label: `公司 ${i + 1}`,
        component: 'input',
        placeholder: '请输入公司名称',
        props: { clearable: true }
      },
      {
        field: `workExperiences.${i}.position`,
        label: `职位 ${i + 1}`,
        component: 'input',
        placeholder: '请输入职位名称',
        props: { clearable: true }
      },
      {
        field: `workExperiences.${i}.startDate`,
        label: `入职时间 ${i + 1}`,
        component: 'date-picker',
        props: {
          type: 'month',
          placeholder: '请选择入职时间'
        }
      },
      {
        field: `workExperiences.${i}.endDate`,
        label: `离职时间 ${i + 1}`,
        component: 'date-picker',
        props: {
          type: 'month',
          placeholder: '请选择离职时间（在职可不填）'
        }
      },
      {
        field: `workExperiences.${i}.description`,
        label: `工作描述 ${i + 1}`,
        component: 'textarea',
        span: 2,
        placeholder: '请描述工作内容和成就...',
        props: {
          rows: 3,
          maxlength: 500,
          showCount: true
        }
      }
    )
    
    // 添加删除按钮（除了第一个）
    if (i > 0) {
      fields.push({
        field: `workExperiences.${i}.delete`,
        label: '',
        component: 'custom',
        render: () => {
          return h(NButton, {
            type: 'error',
            size: 'small',
            onClick: () => removeWorkExperience(i)
          }, () => '删除')
        }
      })
    }
  }
  
  return fields
}

// 动态表单配置
const dynamicFormConfig = computed<FormConfig>(() => {
  const baseFields: FieldConfig[] = [
    // 基本信息
    {
      field: 'name',
      label: '姓名',
      component: 'input',
      required: true,
      placeholder: '请输入姓名',
      props: { clearable: true }
    },
    {
      field: 'email',
      label: '邮箱',
      component: 'input',
      required: true,
      placeholder: '请输入邮箱',
      props: { type: 'email', clearable: true }
    },
    {
      field: 'phone',
      label: '手机号',
      component: 'input',
      required: true,
      placeholder: '请输入手机号',
      props: { clearable: true }
    },
    {
      field: 'gender',
      label: '性别',
      component: 'radio-group',
      props: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      }
    },
    {
      field: 'maritalStatus',
      label: '婚姻状况',
      component: 'select',
      // 条件显示：只有选择了性别才显示
      show: (data: FormData) => !!data.gender,
      props: {
        options: [
          { label: '未婚', value: 'single' },
          { label: '已婚', value: 'married' },
          { label: '离异', value: 'divorced' }
        ]
      }
    },
    
    // 求职意向
    {
      field: 'jobType',
      label: '求职类型',
      component: 'select',
      required: true,
      props: {
        options: [
          { label: '全职', value: 'fulltime' },
          { label: '兼职', value: 'parttime' },
          { label: '实习', value: 'internship' },
          { label: '远程', value: 'remote' }
        ]
      }
    },
    {
      field: 'expectedSalary',
      label: '期望薪资',
      component: 'number-input',
      // 条件显示：只有选择了求职类型才显示
      show: (data: FormData) => !!data.jobType,
      placeholder: '请输入期望薪资',
      props: {
        min: 0,
        precision: 0,
        suffix: '元/月'
      }
    },
    {
      field: 'workLocation',
      label: '工作地点',
      component: 'select',
      // 条件显示：非远程工作才显示
      show: (data: FormData) => data.jobType && data.jobType !== 'remote',
      props: {
        options: [
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
          { label: '广州', value: 'guangzhou' },
          { label: '深圳', value: 'shenzhen' },
          { label: '杭州', value: 'hangzhou' }
        ]
      }
    }
  ]
  
  // 高级选项字段
  const advancedFields: FieldConfig[] = showAdvanced.value ? [
    {
      field: 'skills',
      label: '技能标签',
      component: 'checkbox-group',
      span: 2,
      props: {
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
    {
      field: 'languages',
      label: '语言能力',
      component: 'checkbox-group',
      span: 2,
      props: {
        options: [
          { label: '中文（母语）', value: 'chinese' },
          { label: '英语', value: 'english' },
          { label: '日语', value: 'japanese' },
          { label: '韩语', value: 'korean' },
          { label: '法语', value: 'french' }
        ]
      }
    },
    {
      field: 'certificates',
      label: '证书/资质',
      component: 'textarea',
      span: 2,
      placeholder: '请输入您的证书或资质信息...',
      props: {
        rows: 3,
        maxlength: 300,
        showCount: true
      }
    },
    {
      field: 'portfolio',
      label: '作品集链接',
      component: 'input',
      span: 2,
      placeholder: '请输入作品集或个人网站链接',
      props: {
        clearable: true
      }
    }
  ] : []
  
  return {
    id: 'dynamic-resume-form',
    title: '动态简历表单',
    layout: {
      type: 'tabs',
      props: {
        type: 'line',
        animated: true
      },
      children: [
        {
          key: 'basic',
          label: '基本信息',
          type: 'grid',
          props: { cols: 2, xGap: 16, yGap: 16 },
          children: baseFields
        },
        {
          key: 'education',
          label: '教育经历',
          type: 'grid',
          props: { cols: 3, xGap: 16, yGap: 16 },
          children: generateEducationFields()
        },
        {
          key: 'work',
          label: '工作经历',
          type: 'grid',
          props: { cols: 2, xGap: 16, yGap: 16 },
          children: generateWorkExperienceFields()
        },
        ...(showAdvanced.value ? [{
          key: 'advanced',
          label: '高级选项',
          type: 'grid',
          props: { cols: 2, xGap: 16, yGap: 16 },
          children: advancedFields
        }] : []),
        {
          key: 'other',
          label: '其他信息',
          type: 'grid',
          props: { cols: 1, yGap: 16 },
          children: [
            {
              field: 'selfIntroduction',
              label: '自我介绍',
              component: 'textarea',
              placeholder: '请简单介绍一下自己...',
              props: {
                rows: 6,
                maxlength: 1000,
                showCount: true
              }
            }
          ]
        }
      ]
    },
    options: {
      size: 'medium',
      labelPlacement: 'left',
      labelWidth: 100,
      showRequiredMark: true
    }
  }
})

// 添加教育经历
const addEducation = () => {
  educationCount.value++
  formData.value.educations.push({
    school: '',
    major: '',
    degree: '',
    startDate: null,
    endDate: null
  })
  message.success('已添加教育经历')
}

// 删除教育经历
const removeEducation = (index: number) => {
  if (educationCount.value > 1) {
    educationCount.value--
    formData.value.educations.splice(index, 1)
    message.success('已删除教育经历')
  }
}

// 添加工作经历
const addWorkExperience = () => {
  workExperienceCount.value++
  formData.value.workExperiences.push({
    company: '',
    position: '',
    startDate: null,
    endDate: null,
    description: ''
  })
  message.success('已添加工作经历')
}

// 删除工作经历
const removeWorkExperience = (index: number) => {
  if (workExperienceCount.value > 1) {
    workExperienceCount.value--
    formData.value.workExperiences.splice(index, 1)
    message.success('已删除工作经历')
  }
}

// 切换高级选项
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
  message.info(showAdvanced.value ? '已显示高级选项' : '已隐藏高级选项')
}

// 重置表单
const resetForm = () => {
  educationCount.value = 1
  workExperienceCount.value = 1
  showAdvanced.value = false
  
  formData.value = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    maritalStatus: '',
    jobType: '',
    expectedSalary: null,
    workLocation: '',
    educations: [{
      school: '',
      major: '',
      degree: '',
      startDate: null,
      endDate: null
    }],
    workExperiences: [{
      company: '',
      position: '',
      startDate: null,
      endDate: null,
      description: ''
    }],
    skills: [],
    languages: [],
    certificates: '',
    portfolio: '',
    selfIntroduction: ''
  }
  
  message.success('表单已重置')
}

// 处理字段变化
const handleFieldChange = (field: string, value: any) => {
  console.log('字段变化:', { field, value })
  
  // 联动逻辑示例
  if (field === 'jobType' && value === 'remote') {
    formData.value.workLocation = ''
    message.info('远程工作无需选择工作地点')
  }
}

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('简历提交:', data)
  message.success('简历提交成功！')
}
</script>

<style scoped>
.dynamic-form-demo {
  padding: 20px;
}
</style>