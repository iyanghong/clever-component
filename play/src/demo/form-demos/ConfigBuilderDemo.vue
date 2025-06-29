<template>
  <div class="config-builder-demo">
    <n-card title="配置构建器演示" class="demo-card">
      <!-- 构建方式选择 -->
      <div class="control-panel">
        <n-space>
          <n-select
            v-model:value="buildMethod"
            :options="buildMethodOptions"
            placeholder="选择构建方式"
            style="width: 200px"
          />
          <n-select
            v-model:value="templateType"
            :options="templateOptions"
            placeholder="选择模板类型"
            style="width: 200px"
          />
          <n-button @click="generateConfig" type="primary">
            生成配置
          </n-button>
          <n-button @click="copyConfig" type="default" ghost>
            复制配置
          </n-button>
        </n-space>
      </div>

      <!-- 表单演示 -->
      <div class="form-example">
        <h3>{{ currentTitle }}</h3>
        <CleverForm
          v-model="formData"
          :config="currentConfig"
          @validate="handleValidate"
          @submit="handleSubmit"
        />
      </div>

      <!-- 配置代码展示 -->
      <div class="config-display">
        <n-tabs type="card">
          <n-tab-pane name="builder" tab="构建器代码">
            <n-code :code="builderCode" language="typescript" />
          </n-tab-pane>
          <n-tab-pane name="json" tab="JSON配置">
            <n-code :code="jsonConfig" language="json" />
          </n-tab-pane>
          <n-tab-pane name="template" tab="模板使用">
            <n-code :code="templateCode" language="typescript" />
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { NCard, NSpace, NSelect, NButton, NCode, NTabs, NTabPane, useMessage } from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig } from '@clever-component/components'
import {
  createForm,
  createGrid,
  createFlex,
  createTabs,
  input,
  textarea,
  select,
  radioGroup,
  checkboxGroup,
  datePicker,
  switchField,
  numberInput
} from '@clever-component/components/clever-form/src/utils/config-builder'
import {
  formTemplates,
  fieldTemplates,
  layoutTemplates
} from '@clever-component/components/clever-form/src/templates'

const message = useMessage()

// 构建方式选择
const buildMethod = ref('builder')
const templateType = ref('userRegistration')

const buildMethodOptions = [
  { label: '构建器方式', value: 'builder' },
  { label: '模板方式', value: 'template' },
  { label: 'JSON配置', value: 'json' }
]

const templateOptions = [
  { label: '用户注册表单', value: 'userRegistration' },
  { label: '员工信息表单', value: 'employeeInfo' },
  { label: '设置表单', value: 'settings' },
  { label: '搜索表单', value: 'search' }
]

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthday: null,
  address: {
    province: '',
    city: '',
    detail: ''
  },
  work: {
    company: '',
    position: '',
    department: '',
    workYears: null
  },
  education: {
    degree: '',
    school: '',
    major: ''
  },
  preferences: {
    language: 'zh-CN',
    theme: 'light',
    notifications: [],
    autoSave: true
  }
})

// 当前配置
const currentConfig = ref<FormConfig>()
const currentTitle = ref('配置构建器演示')

// 生成的代码
const builderCode = ref('')
const jsonConfig = ref('')
const templateCode = ref('')

// 构建器方式示例
const builderExamples = {
  userRegistration: {
    title: '用户注册表单 - 构建器方式',
    code: `// 使用构建器创建用户注册表单
const formConfig = createForm()
  .title('用户注册')
  .mode('create')
  .layout(
    createGrid().cols(1).rowGap(20).children([
      // 基本信息卡片
      createGrid().title('基本信息').cols(2).rowGap(16).colGap(16).children([
        input('name', '姓名').required().placeholder('请输入姓名').build(),
        input('email', '邮箱').required().placeholder('请输入邮箱地址')
          .addRule({ type: 'email', message: '请输入有效的邮箱地址' }).build(),
        input('phone', '手机号').required().placeholder('请输入手机号')
          .addRule({ pattern: /^1[3-9]\\d{9}$/, message: '请输入有效的手机号码' }).build(),
        radioGroup('gender', '性别').options([
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]).build(),
        datePicker('birthday', '出生日期').props({ type: 'date' }).build()
      ]),
      
      // 地址信息卡片
      createGrid().title('地址信息').cols(2).rowGap(16).colGap(16).children([
        select('address.province', '省份').required().placeholder('请选择省份').build(),
        select('address.city', '城市').required().placeholder('请选择城市').build(),
        textarea('address.detail', '详细地址').placeholder('请输入详细地址')
          .props({ rows: 3 }).build()
      ])
    ])
  )
  .options({
    size: 'medium',
    labelPlacement: 'top',
    showRequiredMark: true
  })
  .build()`,
    config: () => {
      return createForm()
        .title('用户注册')
        .mode('create')
        .layout(
          createGrid().cols(1).rowGap(20).children([
            // 基本信息卡片
            createGrid().title('基本信息').cols(2).rowGap(16).colGap(16).children([
              input('name', '姓名').required().placeholder('请输入姓名').build(),
              input('email', '邮箱').required().placeholder('请输入邮箱地址')
                .addRule({ type: 'email', message: '请输入有效的邮箱地址' }).build(),
              input('phone', '手机号').required().placeholder('请输入手机号')
                .addRule({ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }).build(),
              radioGroup('gender', '性别').options([
                { label: '男', value: 'male' },
                { label: '女', value: 'female' }
              ]).build(),
              datePicker('birthday', '出生日期').props({ type: 'date' }).build()
            ]),
            
            // 地址信息卡片
            createGrid().title('地址信息').cols(2).rowGap(16).colGap(16).children([
              select('address.province', '省份').required().placeholder('请选择省份').build(),
              select('address.city', '城市').required().placeholder('请选择城市').build(),
              textarea('address.detail', '详细地址').placeholder('请输入详细地址')
                .props({ rows: 3 }).build()
            ])
          ])
        )
        .options({
          size: 'medium',
          labelPlacement: 'top',
          showRequiredMark: true
        })
        .build()
    }
  },
  
  employeeInfo: {
    title: '员工信息表单 - 构建器方式',
    code: `// 使用构建器创建员工信息表单
const formConfig = createForm()
  .title('员工信息')
  .mode('create')
  .layout(
    createTabs().type('card').children([
      // 基本信息标签页
      createGrid().title('基本信息').cols(2).rowGap(16).colGap(16).children([
        input('name', '姓名').required().placeholder('请输入姓名').build(),
        numberInput('age', '年龄').placeholder('请输入年龄').props({ min: 0, max: 150 }).build(),
        input('email', '邮箱').required().placeholder('请输入邮箱地址').build(),
        input('phone', '手机号').required().placeholder('请输入手机号').build()
      ]),
      
      // 工作信息标签页
      createGrid().title('工作信息').cols(2).rowGap(16).colGap(16).children([
        input('work.company', '公司名称').placeholder('请输入公司名称').build(),
        input('work.position', '职位').placeholder('请输入职位').build(),
        input('work.department', '部门').placeholder('请输入部门').build(),
        numberInput('work.workYears', '工作年限').placeholder('请输入工作年限')
          .props({ min: 0, max: 50 }).build()
      ])
    ])
  )
  .build()`,
    config: () => {
      return createForm()
        .title('员工信息')
        .mode('create')
        .layout(
          createTabs().type('card')
            .addTab('basic', '基本信息', [
              createGrid().cols(2).rowGap(16).colGap(16).children([
                input('name', '姓名').required().placeholder('请输入姓名').build(),
                numberInput('age', '年龄').placeholder('请输入年龄').props({ min: 0, max: 150 }).build(),
                input('email', '邮箱').required().placeholder('请输入邮箱地址').build(),
                input('phone', '手机号').required().placeholder('请输入手机号').build()
              ])
            ])
            .addTab('work', '工作信息', [
              createGrid().cols(2).rowGap(16).colGap(16).children([
                input('work.company', '公司名称').placeholder('请输入公司名称').build(),
                input('work.position', '职位').placeholder('请输入职位').build(),
                input('work.department', '部门').placeholder('请输入部门').build(),
                numberInput('work.workYears', '工作年限').placeholder('请输入工作年限')
                  .props({ min: 0, max: 50 }).build()
              ])
            ])
        )
        .build()
    }
  }
}

// 模板方式示例
const templateExamples = {
  userRegistration: {
    title: '用户注册表单 - 模板方式',
    code: `// 使用模板创建用户注册表单
import { formTemplates } from '@clever-component/components/clever-form/src/templates'

const formConfig = formTemplates.userRegistration().build()`,
    config: () => formTemplates.userRegistration().build()
  },
  
  employeeInfo: {
    title: '员工信息表单 - 模板方式',
    code: `// 使用模板创建员工信息表单
import { formTemplates } from '@clever-component/components/clever-form/src/templates'

const formConfig = formTemplates.employeeInfo().build()`,
    config: () => formTemplates.employeeInfo().build()
  },
  
  settings: {
    title: '设置表单 - 模板方式',
    code: `// 使用模板创建设置表单
import { formTemplates } from '@clever-component/components/clever-form/src/templates'

const formConfig = formTemplates.settings().build()`,
    config: () => formTemplates.settings().build()
  },
  
  search: {
    title: '搜索表单 - 模板方式',
    code: `// 使用模板创建搜索表单
import { formTemplates } from '@clever-component/components/clever-form/src/templates'

const formConfig = formTemplates.search().build()`,
    config: () => formTemplates.search().build()
  }
}

// 生成配置
const generateConfig = () => {
  let config: FormConfig
  let code = ''
  let templateCodeStr = ''
  
  if (buildMethod.value === 'builder') {
    const example = builderExamples[templateType.value as keyof typeof builderExamples]
    if (example) {
      config = example.config()
      code = example.code
      currentTitle.value = example.title
    }
  } else if (buildMethod.value === 'template') {
    const example = templateExamples[templateType.value as keyof typeof templateExamples]
    if (example) {
      config = example.config()
      templateCodeStr = example.code
      currentTitle.value = example.title
    }
  }
  
  if (config!) {
    currentConfig.value = config
    builderCode.value = code
    templateCode.value = templateCodeStr
    jsonConfig.value = JSON.stringify(config, null, 2)
  }
}

// 复制配置
const copyConfig = async () => {
  try {
    let textToCopy = ''
    
    if (buildMethod.value === 'builder') {
      textToCopy = builderCode.value
    } else if (buildMethod.value === 'template') {
      textToCopy = templateCode.value
    } else {
      textToCopy = jsonConfig.value
    }
    
    await navigator.clipboard.writeText(textToCopy)
    message.success('配置已复制到剪贴板')
  } catch (error) {
    message.error('复制失败')
  }
}

// 表单事件处理
const handleValidate = (errors: any) => {
  console.log('验证结果:', errors)
}

const handleSubmit = (data: any) => {
  console.log('提交数据:', data)
  message.success('表单提交成功')
}

// 监听变化，自动生成配置
watch([buildMethod, templateType], generateConfig, { immediate: true })
</script>

<style scoped>
.config-builder-demo {
  padding: 20px;
}

.demo-card {
  max-width: 1200px;
  margin: 0 auto;
}

.control-panel {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.form-example {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.config-display {
  margin-top: 24px;
}

.config-display :deep(.n-code) {
  max-height: 400px;
  overflow-y: auto;
}
</style>