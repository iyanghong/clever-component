<template>
  <div class="comprehensive-layout-demo">
    <n-card title="综合布局演示" class="demo-card">
      <!-- 布局类型选择 -->
      <div class="control-panel">
        <n-space>
          <n-select
            v-model:value="currentLayout"
            :options="layoutOptions"
            placeholder="选择布局类型"
            style="width: 200px"
          />
          <n-select
            v-model:value="currentDemo"
            :options="demoOptions"
            placeholder="选择演示类型"
            style="width: 200px"
          />
          <n-button @click="handleReset" type="primary" ghost>
            重置表单
          </n-button>
        </n-space>
      </div>

      <!-- 表单示例 -->
      <div class="form-example">
        <h3>{{ currentTitle }}</h3>
        <CleverForm
          v-model="formData"
          :config="currentFormConfig"
          @validate="handleValidate"
          @submit="handleSubmit"
        />
      </div>

      <!-- 验证结果 -->
      <div v-if="validationErrors.length > 0" class="validation-result">
        <h4>验证结果</h4>
        <n-alert type="error" :show-icon="false">
          <ul>
            <li v-for="error in validationErrors" :key="error.field">
              <strong>{{ error.field }}:</strong> {{ error.message }}
            </li>
          </ul>
        </n-alert>
      </div>

      <!-- 表单数据展示 -->
      <div class="form-data">
        <h4>表单数据</h4>
        <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { NCard, NSpace, NSelect, NButton, NAlert, NCode } from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig } from '@clever-component/components'
import {
  createForm,
  createGrid,
  createFlex,
  createTabs,
  createCard,
  createGroup,
  createCollapse,
  createSteps,
  createInline,
  createVertical,
  input,
  select,
  radioGroup,
  checkboxGroup,
  textarea,
  inputNumber,
  datePicker,
  switchField,
  checkbox
} from '@clever-component/components/clever-form/src/utils/config-builder'

// 当前选择的布局和演示类型
const currentLayout = ref('grid')
const currentDemo = ref('nested')

// 布局选项
const layoutOptions = [
  { label: '网格布局', value: 'grid' },
  { label: '弹性布局', value: 'flex' },
  { label: '标签页布局', value: 'tabs' },
  { label: '分组布局', value: 'group' },
  { label: '卡片布局', value: 'card' },
  { label: '折叠面板', value: 'collapse' },
  { label: '步骤布局', value: 'steps' },
  { label: '行内布局', value: 'inline' },
  { label: '垂直布局', value: 'vertical' }
]

// 演示类型选项
const demoOptions = [
  { label: '基础示例', value: 'basic' },
  { label: '嵌套布局', value: 'nested' },
  { label: '带验证', value: 'validation' }
]

// 验证状态
const isValid = ref(true)
const validationErrors = ref<Array<{ field: string; message: string }>>([])

// 表单数据
const formData = reactive({
  // 基础字段
  name: '',
  email: '',
  phone: '',
  gender: '',
  age: null,
  hobbies: [],
  description: '',
  agree: false,

  // 嵌套字段
  address: {
    province: '',
    city: '',
    district: '',
    detail: ''
  },
  education: {
    degree: '',
    school: '',
    major: '',
    graduationYear: null
  },

  // 步骤字段
  step1: {
    basicInfo: '',
    contact: ''
  },
  step2: {
    preferences: [],
    settings: ''
  },
  step3: {
    confirmation: false,
    notes: ''
  }
})

// 基础字段配置 - 使用构建器
const baseFields = [
  input('name', '姓名').placeholder('请输入姓名').build(),
  input('email', '邮箱').placeholder('请输入邮箱').build(),
  input('phone', '手机号').placeholder('请输入手机号').build(),
  radioGroup('gender', '性别')
    .options([
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ])
    .build()
]

// 带验证的字段配置 - 使用构建器
const validationFields = [
  input('name', '姓名')
    .placeholder('请输入姓名')
    .required()
    .addRule({ required: true, message: '姓名不能为空' })
    .build(),

  input('email', '邮箱')
    .placeholder('请输入邮箱')
    .required()
    .addRule({ required: true, message: '邮箱不能为空' })
    .addRule({ type: 'email', message: '请输入有效的邮箱地址' })
    .build(),

  input('phone', '手机号')
    .placeholder('请输入手机号')
    .required()
    .addRule({ required: true, message: '手机号不能为空' })
    .addRule({ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' })
    .build(),

  radioGroup('gender', '性别')
    .options([
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ])
    .required()
    .addRule({ required: true, message: '性别不能为空' })
    .build()
]

// 网格布局配置 - 使用构建器
const gridConfigs = {
  basic: createForm()
    .id('grid-basic')
    .title('网格布局 - 基础示例')
    .layout(createGrid().cols(2).rowGap(16).colGap(16).children(baseFields))
    .build(),
  nested: createForm()
    .id('grid-nested')
    .title('网格布局 - 复杂嵌套示例')
    .layout(
      createGrid()
        .cols(1)
        .rowGap(20)
        .children([
          createCard()
            .title('个人基础信息')
            .bordered(true)
            .children([
              createGrid()
                .cols(3)
                .rowGap(16)
                .colGap(16)
                .children([
                  ...baseFields.slice(0, 2),
                  inputNumber('age', '年龄').placeholder('请输入年龄').build()
                ])
                .build()
            ])
            .build(),
          createTabs()
            .type('card')
            .placement('top')
            .addTab('contact', '联系方式', [
              createFlex()
                .direction('column')
                .gap(16)
                .children([
                  baseFields[2], // phone
                  createGroup()
                    .title('详细地址')
                    .collapsible(true)
                    .defaultExpanded(true)
                    .children([
                      createGrid()
                        .cols(2)
                        .rowGap(12)
                        .colGap(12)
                        .children([
                          input('address.province', '省份')
                            .placeholder('请输入省份')
                            .build(),
                          input('address.city', '城市')
                            .placeholder('请输入城市')
                            .build(),
                          input('address.district', '区县')
                            .placeholder('请输入区县')
                            .build(),
                          textarea('address.detail', '详细地址')
                            .placeholder('请输入详细地址')
                            .build()
                        ])
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .addTab('education', '教育背景', [
              createCollapse()
                .accordion(false)
                .defaultExpandedNames(['education-info'])
                .addPanel('education-info', '学历信息', [
                  createFlex()
                    .direction('column')
                    .gap(16)
                    .children([
                      createFlex()
                        .direction('row')
                        .gap(16)
                        .children([
                          select('education.degree', '学历')
                            .options([
                              { label: '高中', value: 'high_school' },
                              { label: '大专', value: 'college' },
                              { label: '本科', value: 'bachelor' },
                              { label: '硕士', value: 'master' },
                              { label: '博士', value: 'doctor' }
                            ])
                            .build(),
                          datePicker('education.graduationYear', '毕业年份')
                            .props({ type: 'year' })
                            .build()
                        ])
                        .build(),
                      input('education.school', '学校名称')
                        .placeholder('请输入学校名称')
                        .build(),
                      input('education.major', '专业')
                        .placeholder('请输入专业')
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .addTab('settings', '设置', [
              createFlex()
                .direction('column')
                .gap(24)
                .children([
                  createGroup()
                    .title('通知设置')
                    .collapsible(true)
                    .defaultExpanded(true)
                    .children([
                      createGrid()
                        .cols(2)
                        .rowGap(16)
                        .colGap(16)
                        .children([
                          switchField('settings.emailNotification', '邮件通知')
                            .defaultValue(true)
                            .build(),
                          switchField('settings.smsNotification', '短信通知')
                            .defaultValue(false)
                            .build()
                        ])
                        .build()
                    ])
                    .build(),
                  createGroup()
                    .title('隐私设置')
                    .collapsible(true)
                    .defaultExpanded(false)
                    .children([
                      createFlex()
                        .direction('column')
                        .gap(16)
                        .children([
                          radioGroup(
                            'settings.profileVisibility',
                            '个人资料可见性'
                          )
                            .options([
                              { label: '公开', value: 'public' },
                              { label: '仅好友', value: 'friends' },
                              { label: '私密', value: 'private' }
                            ])
                            .defaultValue('friends')
                            .build(),
                          switchField('settings.allowSearch', '允许搜索')
                            .defaultValue(true)
                            .build()
                        ])
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .build(),
          createGroup()
            .title('其他信息')
            .collapsible(true)
            .defaultExpanded(false)
            .children([
              createFlex()
                .direction('column')
                .gap(12)
                .children([
                  baseFields[3], // gender
                  checkboxGroup('hobbies', '兴趣爱好')
                    .options([
                      { label: '阅读', value: 'reading' },
                      { label: '运动', value: 'sports' },
                      { label: '音乐', value: 'music' },
                      { label: '旅行', value: 'travel' },
                      { label: '摄影', value: 'photography' }
                    ])
                    .build(),
                  textarea('description', '个人描述')
                    .placeholder('请简单介绍一下自己')
                    .props({ rows: 3 })
                    .build()
                ])
                .build()
            ])
            .build()
        ])
    )
    .build(),
  validation: {
    id: 'grid-validation',
    title: '网格布局 - 带验证',
    layout: {
      type: 'grid' as const,
      props: { cols: 2, rowGap: 16, colGap: 16 },
      children: validationFields
    }
  }
}

// 弹性布局配置
const flexConfigs = {
  basic: createForm()
    .id('flex-basic')
    .title('弹性布局 - 基础示例')
    .layout(createFlex().direction('column').gap(16).children(baseFields))
    .build(),
  nested: createForm()
    .id('flex-nested')
    .title('弹性布局 - 响应式嵌套示例')
    .layout(
      createFlex()
        .direction('column')
        .gap(20)
        .children([
          createCard()
            .title('用户基本信息')
            .bordered(true)
            .children([
              createFlex()
                .direction('row')
                .gap(16)
                .wrap('wrap')
                .children([
                  createFlex()
                    .direction('column')
                    .gap(12)
                    .flex(1)
                    .children(baseFields.slice(0, 2))
                    .build(),
                  createFlex()
                    .direction('column')
                    .gap(12)
                    .flex(1)
                    .children([
                      baseFields[3], // gender
                      inputNumber('age', '年龄')
                        .placeholder('请输入年龄')
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .build(),
          createSteps()
            .current(0)
            .direction('horizontal')
            .addStep('联系信息', [
              createFlex()
                .direction('column')
                .gap(16)
                .children([
                  baseFields[2], // phone
                  createGroup()
                    .title('地址信息')
                    .collapsible(true)
                    .defaultExpanded(true)
                    .children([
                      createFlex()
                        .direction('row')
                        .gap(12)
                        .wrap('wrap')
                        .children([
                          input('address.province', '省份')
                            .placeholder('请输入省份')
                            .build(),
                          input('address.city', '城市')
                            .placeholder('请输入城市')
                            .build()
                        ])
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .addStep('个人偏好', [
              createFlex()
                .direction('column')
                .gap(16)
                .children([
                  createFlex()
                    .direction('row')
                    .gap(20)
                    .wrap('wrap')
                    .children([
                      checkboxGroup('hobbies', '兴趣爱好')
                        .options([
                          { label: '阅读', value: 'reading' },
                          { label: '运动', value: 'sports' },
                          { label: '音乐', value: 'music' }
                        ])
                        .build()
                    ])
                    .build(),
                  textarea('description', '个人描述')
                    .placeholder('请简单介绍一下自己')
                    .props({ rows: 4 })
                    .build()
                ])
                .build()
            ])
            .build(),
          createCollapse()
            .accordion(true)
            .defaultExpandedNames(['advanced'])
            .addPanel('advanced', '高级设置', [
              createFlex()
                .direction('row')
                .gap(16)
                .justify('space-between')
                .children([
                  createFlex()
                    .direction('column')
                    .gap(12)
                    .flex(1)
                    .children([
                      select('education.degree', '学历')
                        .options([
                          { label: '本科', value: 'bachelor' },
                          { label: '硕士', value: 'master' },
                          { label: '博士', value: 'doctor' }
                        ])
                        .build(),
                      input('education.school', '学校')
                        .placeholder('请输入学校名称')
                        .build()
                    ])
                    .build(),
                  createFlex()
                    .direction('column')
                    .gap(12)
                    .flex(1)
                    .children([
                      input('education.major', '专业')
                        .placeholder('请输入专业')
                        .build(),
                      checkbox('agree', '同意条款')
                        .props({ label: '我已阅读并同意相关条款' })
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .build()
        ])
        .build()
    ),
  validation: {
    id: 'flex-validation',
    title: '弹性布局 - 带验证',
    layout: {
      type: 'flex' as const,
      props: { direction: 'column', gap: 16 },
      children: validationFields
    }
  }
}

// 标签页布局配置
const tabsConfigs = {
  basic: {
    id: 'tabs-basic',
    title: '标签页布局 - 基础示例',
    layout: {
      type: 'tabs' as const,
      props: {
        type: 'line',
        placement: 'top',
        tabs: [
          {
            name: 'basic',
            label: '基本信息',
            children: baseFields.slice(0, 2)
          },
          {
            name: 'contact',
            label: '联系方式',
            children: baseFields.slice(2)
          }
        ]
      }
    }
  },
  nested: createForm()
    .id('tabs-nested')
    .title('标签页布局 - 多层嵌套示例')
    .layout(
      createTabs()
        .type('card')
        .placement('top')
        .addTab('personal', '个人信息', [
          createFlex()
            .direction('column')
            .gap(20)
            .children([
              createCard()
                .title('基础信息')
                .bordered(true)
                .children([
                  createGrid()
                    .cols(2)
                    .rowGap(16)
                    .colGap(16)
                    .children(baseFields)
                    .build()
                ])
                .build(),
              createTabs()
                .type('line')
                .placement('top')
                .addTab('contact-detail', '联系详情', [
                  createFlex()
                    .direction('column')
                    .gap(16)
                    .children([
                      input('address.province', '省份')
                        .placeholder('请输入省份')
                        .build(),
                      input('address.city', '城市')
                        .placeholder('请输入城市')
                        .build()
                    ])
                    .build()
                ])
                .addTab('emergency', '紧急联系人', [
                  createGroup()
                    .title('紧急联系人信息')
                    .collapsible(true)
                    .defaultExpanded(true)
                    .children([
                      createFlex()
                        .direction('row')
                        .gap(16)
                        .children([
                          input('emergency.name', '姓名')
                            .placeholder('请输入紧急联系人姓名')
                            .build(),
                          input('emergency.phone', '电话')
                            .placeholder('请输入紧急联系人电话')
                            .build()
                        ])
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .build()
        ])
        .addTab('education', '教育经历', [
          createSteps()
            .current(0)
            .direction('vertical')
            .addStep('学历信息', [
              createCollapse()
                .accordion(false)
                .defaultExpandedNames(['degree', 'school'])
                .addPanel('degree', '学位信息', [
                  createFlex()
                    .direction('row')
                    .gap(16)
                    .wrap('wrap')
                    .children([
                      select('education.degree', '学历')
                        .options([
                          { label: '高中', value: 'high_school' },
                          { label: '大专', value: 'college' },
                          { label: '本科', value: 'bachelor' },
                          { label: '硕士', value: 'master' },
                          { label: '博士', value: 'doctor' }
                        ])
                        .build(),
                      datePicker('education.graduationYear', '毕业年份')
                        .props({ type: 'year' })
                        .build()
                    ])
                    .build()
                ])
                .addPanel('school', '学校信息', [
                  createFlex()
                    .direction('column')
                    .gap(16)
                    .children([
                      input('education.school', '学校名称')
                        .placeholder('请输入学校名称')
                        .build(),
                      input('education.major', '专业')
                        .placeholder('请输入专业')
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .addStep('技能证书', [
              createCard()
                .title('专业技能')
                .bordered(true)
                .children([
                  createGrid()
                    .cols(1)
                    .rowGap(12)
                    .children([
                      checkboxGroup('skills', '技能列表')
                        .options([
                          { label: 'JavaScript', value: 'javascript' },
                          { label: 'Vue.js', value: 'vue' },
                          { label: 'React', value: 'react' },
                          { label: 'Node.js', value: 'nodejs' },
                          { label: 'Python', value: 'python' }
                        ])
                        .build(),
                      textarea('certificates', '证书描述')
                        .placeholder('请描述您的专业证书')
                        .props({ rows: 3 })
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .build()
        ])
        .addTab('preferences', '个人偏好', [
          createFlex()
            .direction('column')
            .gap(20)
            .children([
              createGroup()
                .title('兴趣爱好')
                .collapsible(true)
                .defaultExpanded(true)
                .children([
                  createTabs()
                    .type('segment')
                    .placement('top')
                    .addTab('hobbies', '爱好', [
                      createInline()
                        .gap(16)
                        .wrap(true)
                        .children([
                          checkboxGroup('hobbies', '兴趣爱好')
                            .options([
                              { label: '阅读', value: 'reading' },
                              { label: '运动', value: 'sports' },
                              { label: '音乐', value: 'music' },
                              { label: '旅行', value: 'travel' },
                              { label: '摄影', value: 'photography' }
                            ])
                            .build()
                        ])
                        .build()
                    ])
                    .addTab('lifestyle', '生活方式', [
                      createVertical()
                        .gap(16)
                        .children([
                          radioGroup('lifestyle.workStyle', '工作方式')
                            .options([
                              { label: '远程工作', value: 'remote' },
                              { label: '办公室工作', value: 'office' },
                              { label: '混合工作', value: 'hybrid' }
                            ])
                            .build(),
                          select('lifestyle.schedule', '作息偏好')
                            .options([
                              { label: '早起型', value: 'early' },
                              { label: '夜猫子', value: 'night' },
                              { label: '正常作息', value: 'normal' }
                            ])
                            .build()
                        ])
                        .build()
                    ])
                    .build()
                ])
                .build(),
              createCard()
                .title('其他信息')
                .bordered(true)
                .children([
                  createFlex()
                    .direction('column')
                    .gap(16)
                    .children([
                      textarea('description', '个人描述')
                        .placeholder('请简单介绍一下自己')
                        .props({ rows: 4 })
                        .build(),
                      checkbox('agree', '协议确认')
                        .props({ label: '我已阅读并同意相关条款和隐私政策' })
                        .build()
                    ])
                    .build()
                ])
                .build()
            ])
            .build()
        ])
        .build()
    ),
  validation: {
    id: 'tabs-validation',
    title: '标签页布局 - 带验证',
    layout: createTabs()
      .type('line')
      .placement('top')
      .addTab('basic', '基本信息', validationFields.slice(0, 2))
      .addTab('contact', '联系方式', validationFields.slice(2))
      .build()
  }
}

// 分组布局配置
const groupConfigs = {
  basic: {
    id: 'group-basic',
    title: '分组布局 - 基础示例',
    layout: createGroup()
      .title('用户信息')
      .collapsible(true)
      .defaultExpanded(true)
      .children(baseFields)
      .build()
  },
  nested: {
    id: 'group-nested',
    title: '分组布局 - 深度嵌套示例',
    layout: createVertical()
      .gap(24)
      .children([
        createGroup()
          .title('基础信息组')
          .collapsible(true)
          .defaultExpanded(true)
          .bordered(true)
          .children([
            createTabs()
              .type('card')
              .placement('top')
              .addTab('basic', '基本资料', [
                createCard()
                  .title('个人基本信息')
                  .bordered(false)
                  .children([
                    createGrid()
                      .cols(2)
                      .rowGap(16)
                      .colGap(16)
                      .children(baseFields)
                      .build()
                  ])
                  .build()
              ])
              .addTab('contact', '联系方式', [
                createFlex()
                  .direction('column')
                  .gap(16)
                  .children([
                    createGroup()
                      .title('主要联系方式')
                      .collapsible(true)
                      .defaultExpanded(true)
                      .children([
                        createInline()
                          .gap(16)
                          .children([
                            input('contact.phone', '手机号码')
                              .placeholder('请输入手机号码')
                              .build(),
                            input('contact.email', '邮箱地址')
                              .placeholder('请输入邮箱地址')
                              .build()
                          ])
                          .build()
                      ])
                      .build(),
                    createGroup()
                      .title('备用联系方式')
                      .collapsible(true)
                      .defaultExpanded(false)
                      .children([
                        createVertical()
                          .gap(12)
                          .children([
                            input('contact.alternatePhone', '备用电话')
                              .placeholder('请输入备用电话')
                              .build(),
                            input('contact.wechat', '微信号')
                              .placeholder('请输入微信号')
                              .build()
                          ])
                          .build()
                      ])
                      .build()
                  ])
                  .build()
              ])
              .build()
          ])
          .build(),
        createGroup()
          .title('详细信息组')
          .collapsible(true)
          .defaultExpanded(true)
          .bordered(true)
          .children([
            createCollapse()
              .accordion(false)
              .defaultExpandedNames(['address', 'work'])
              .addPanel('address', '地址信息', [
                createSteps()
                  .current(0)
                  .direction('horizontal')
                  .addStep('基本地址', [
                    createFlex()
                      .direction('row')
                      .gap(16)
                      .wrap('wrap')
                      .children([
                        select('address.province', '省份')
                          .options([
                            { label: '北京市', value: 'beijing' },
                            { label: '上海市', value: 'shanghai' },
                            { label: '广东省', value: 'guangdong' },
                            { label: '浙江省', value: 'zhejiang' }
                          ])
                          .build(),
                        input('address.city', '城市')
                          .placeholder('请输入城市')
                          .build()
                      ])
                      .build()
                  ])
                  .addStep('详细地址', [
                    createVertical()
                      .gap(16)
                      .children([
                        input('address.district', '区/县')
                          .placeholder('请输入区/县')
                          .build(),
                        textarea('address.street', '街道地址')
                          .placeholder('请输入详细街道地址')
                          .props({ rows: 2 })
                          .build()
                      ])
                      .build()
                  ])
                  .build()
              ])
              .addPanel('work', '工作信息', [
                createTabs()
                  .type('line')
                  .placement('left')
                  .addTab('current-job', '当前工作', [
                    createCard()
                      .title('当前职位信息')
                      .bordered(true)
                      .children([
                        createGroup()
                          .title('职位详情')
                          .collapsible(false)
                          .children([
                            createGrid()
                              .cols(2)
                              .rowGap(16)
                              .colGap(16)
                              .children([
                                input('work.company', '公司名称')
                                  .placeholder('请输入公司名称')
                                  .build(),
                                input('work.position', '职位')
                                  .placeholder('请输入职位')
                                  .build(),
                                input('work.department', '部门')
                                  .placeholder('请输入部门')
                                  .build(),
                                datePicker('work.startDate', '入职时间')
                                  .props({ type: 'date' })
                                  .build()
                              ])
                              .build()
                          ])
                          .build()
                      ])
                      .build()
                  ])
                  .addTab('experience', '工作经历', [
                    createFlex()
                      .direction('column')
                      .gap(20)
                      .children([
                        createGroup()
                          .title('工作技能')
                          .collapsible(true)
                          .defaultExpanded(true)
                          .children([
                            createInline()
                              .gap(16)
                              .wrap(true)
                              .children([
                                checkboxGroup('work.skills', '专业技能')
                                  .options([
                                    { label: '前端开发', value: 'frontend' },
                                    { label: '后端开发', value: 'backend' },
                                    { label: '全栈开发', value: 'fullstack' },
                                    { label: '移动开发', value: 'mobile' },
                                    { label: '数据分析', value: 'data' }
                                  ])
                                  .build()
                              ])
                              .build()
                          ])
                          .build(),
                        createGroup()
                          .title('工作描述')
                          .collapsible(true)
                          .defaultExpanded(false)
                          .children([
                            createVertical()
                              .gap(16)
                              .children([
                                textarea('work.description', '工作内容')
                                  .placeholder('请描述您的主要工作内容')
                                  .props({ rows: 4 })
                                  .build(),
                                textarea('work.achievements', '主要成就')
                                  .placeholder('请描述您的主要工作成就')
                                  .props({ rows: 3 })
                                  .build()
                              ])
                              .build()
                          ])
                          .build()
                      ])
                      .build()
                  ])
                  .build()
              ])
              .addPanel('other', '其他信息', [
                createCard()
                  .title('补充信息')
                  .bordered(true)
                  .children([
                    createFlex()
                      .direction('column')
                      .gap(16)
                      .children([
                        textarea('other.notes', '备注信息')
                          .placeholder('请输入其他需要说明的信息')
                          .props({ rows: 3 })
                          .build(),
                        radioGroup('other.privacy', '隐私设置')
                          .options([
                            { label: '公开', value: 'public' },
                            { label: '仅好友可见', value: 'friends' },
                            { label: '私密', value: 'private' }
                          ])
                          .build()
                      ])
                      .build()
                  ])
                  .build()
              ])
              .build()
          ])
          .build()
      ])
      .build()
  },
  validation: {
    id: 'group-validation',
    title: '分组布局 - 带验证',
    layout: {
      type: 'group' as const,
      props: {
        title: '用户信息（必填）',
        collapsible: true,
        defaultExpanded: true
      },
      children: validationFields
    }
  }
}

// 卡片布局配置
const cardConfigs = {
  basic: {
    id: 'card-basic',
    title: '卡片布局 - 基础示例',
    layout: createCard()
      .title('用户信息卡片')
      .bordered(true)
      .children(baseFields)
      .build()
  },
  nested: {
    id: 'card-nested',
    title: '卡片布局 - 嵌套示例',
    layout: createVertical()
      .gap(16)
      .children([
        createCard()
          .title('基本信息')
          .bordered(true)
          .children(baseFields.slice(0, 2))
          .build(),
        createCard()
          .title('联系方式')
          .bordered(true)
          .children(baseFields.slice(2))
          .build()
      ])
      .build()
  },
  validation: {
    id: 'card-validation',
    title: '卡片布局 - 带验证',
    layout: createCard()
      .title('用户信息（必填）')
      .bordered(true)
      .children(validationFields)
      .build()
  }
}

// 折叠面板配置
const collapseConfigs = {
  basic: {
    id: 'collapse-basic',
    title: '折叠面板 - 基础示例',
    layout: createCollapse()
      .accordion(false)
      .defaultExpandedNames(['panel1'])
      .addPanel('panel1', '用户信息', baseFields)
      .build()
  },
  nested: {
    id: 'collapse-nested',
    title: '折叠面板 - 嵌套示例',
    layout: createCollapse()
      .accordion(false)
      .defaultExpandedNames(['basic', 'contact'])
      .addPanel('basic', '基本信息', baseFields.slice(0, 2))
      .addPanel('contact', '联系方式', baseFields.slice(2))
      .build()
  },
  validation: {
    id: 'collapse-validation',
    title: '折叠面板 - 带验证',
    layout: createCollapse()
      .accordion(false)
      .defaultExpandedNames(['validation'])
      .addPanel('validation', '用户信息（必填）', validationFields)
      .build()
  }
}

// 步骤布局配置
const stepsConfigs = {
  basic: {
    id: 'steps-basic',
    title: '步骤布局 - 基础示例',
    layout: createSteps()
      .current(0)
      .direction('horizontal')
      .addStep('基本信息', baseFields.slice(0, 2))
      .addStep('联系方式', baseFields.slice(2))
      .build()
  },
  nested: {
    id: 'steps-nested',
    title: '步骤布局 - 嵌套示例',
    layout: createSteps()
      .current(0)
      .direction('horizontal')
      .addStep('第一步', [
        createGrid()
          .cols(2)
          .rowGap(12)
          .colGap(12)
          .children(baseFields.slice(0, 2))
          .build()
      ])
      .addStep('第二步', [
        createVertical().gap(12).children(baseFields.slice(2)).build()
      ])
      .build()
  },
  validation: {
    id: 'steps-validation',
    title: '步骤布局 - 带验证',
    layout: createSteps()
      .current(0)
      .direction('horizontal')
      .addStep('基本信息', validationFields.slice(0, 2))
      .addStep('联系方式', validationFields.slice(2))
      .build()
  }
}

// 行内布局配置
const inlineConfigs = {
  basic: {
    id: 'inline-basic',
    title: '行内布局 - 基础示例',
    layout: createInline()
      .gap(16)
      .align('center')
      .children(baseFields.slice(0, 2))
      .build()
  },
  nested: {
    id: 'inline-nested',
    title: '行内布局 - 嵌套示例',
    layout: createVertical()
      .gap(16)
      .children([
        createInline()
          .gap(16)
          .align('center')
          .children(baseFields.slice(0, 2))
          .build(),
        createInline()
          .gap(16)
          .align('center')
          .children(baseFields.slice(2))
          .build()
      ])
      .build()
  },
  validation: {
    id: 'inline-validation',
    title: '行内布局 - 带验证',
    layout: createInline()
      .gap(16)
      .align('center')
      .children(validationFields.slice(0, 2))
      .build()
  }
}

// 垂直布局配置
const verticalConfigs = {
  basic: {
    id: 'vertical-basic',
    title: '垂直布局 - 基础示例',
    layout: createVertical()
      .gap(16)
      .align('stretch')
      .children(baseFields)
      .build()
  },
  nested: {
    id: 'vertical-nested',
    title: '垂直布局 - 嵌套示例',
    layout: createVertical()
      .gap(16)
      .children([
        createGroup()
          .title('基本信息')
          .children([
            createVertical().gap(12).children(baseFields.slice(0, 2)).build()
          ])
          .build(),
        createGroup()
          .title('联系方式')
          .children([
            createVertical().gap(12).children(baseFields.slice(2)).build()
          ])
          .build()
      ])
      .build()
  },
  validation: {
    id: 'vertical-validation',
    title: '垂直布局 - 带验证',
    layout: createVertical()
      .gap(16)
      .align('stretch')
      .children(validationFields)
      .build()
  }
}

// 所有配置
const allConfigs = {
  grid: gridConfigs,
  flex: flexConfigs,
  tabs: tabsConfigs,
  group: groupConfigs,
  card: cardConfigs,
  collapse: collapseConfigs,
  steps: stepsConfigs,
  inline: inlineConfigs,
  vertical: verticalConfigs
}

// 当前表单配置
const currentFormConfig = computed(() => {
  const layoutConfigs =
    allConfigs[currentLayout.value as keyof typeof allConfigs]
  return layoutConfigs[
    currentDemo.value as keyof typeof layoutConfigs
  ] as FormConfig
})

// 当前标题
const currentTitle = computed(() => {
  return currentFormConfig.value?.title || '表单示例'
})

// 处理验证
const handleValidate = (valid: boolean, errors: any[]) => {
  isValid.value = valid
  validationErrors.value = errors || []
}

// 处理提交
const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
}

// 重置表单
const handleReset = () => {
  Object.assign(formData, {
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: null,
    hobbies: [],
    description: '',
    agree: false,
    address: {
      province: '',
      city: '',
      district: '',
      detail: ''
    },
    education: {
      degree: '',
      school: '',
      major: '',
      graduationYear: null
    },
    step1: {
      basicInfo: '',
      contact: ''
    },
    step2: {
      preferences: [],
      settings: ''
    },
    step3: {
      confirmation: false,
      notes: ''
    }
  })
  isValid.value = true
  validationErrors.value = []
}
</script>

<style scoped>
.comprehensive-layout-demo {
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.control-panel {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 6px;
}

.form-example {
  margin-bottom: 20px;
}

.form-example h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.validation-result {
  margin-bottom: 20px;
}

.validation-result h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.validation-result ul {
  margin: 0;
  padding-left: 20px;
}

.validation-result li {
  margin-bottom: 4px;
}

.form-data {
  margin-top: 20px;
}

.form-data h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}
</style>
