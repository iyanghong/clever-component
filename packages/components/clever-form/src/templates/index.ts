/**
 * 配置模板库
 * @description 提供常用的表单配置模板，快速生成标准化配置
 */

import type { FormConfig, FieldConfig, ContainerConfig } from '../types'
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
} from '../utils/config-builder'

// 基础字段模板
export const fieldTemplates = {
  // 用户信息字段
  userInfo: {
    name: input('name', '姓名').required().placeholder('请输入姓名'),
    email: input('email', '邮箱').required().placeholder('请输入邮箱地址')
      .addRule({ type: 'email', message: '请输入有效的邮箱地址' }),
    phone: input('phone', '手机号').required().placeholder('请输入手机号')
      .addRule({ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }),
    age: numberInput('age', '年龄').placeholder('请输入年龄')
      .props({ min: 0, max: 150 }),
    gender: radioGroup('gender', '性别').options([
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]),
    birthday: datePicker('birthday', '出生日期').props({ type: 'date' })
  },

  // 地址信息字段
  address: {
    province: select('address.province', '省份').required().placeholder('请选择省份'),
    city: select('address.city', '城市').required().placeholder('请选择城市'),
    district: select('address.district', '区县').placeholder('请选择区县'),
    detail: textarea('address.detail', '详细地址').placeholder('请输入详细地址')
      .props({ rows: 3 })
  },

  // 联系方式字段
  contact: {
    email: input('contact.email', '邮箱').placeholder('请输入邮箱')
      .addRule({ type: 'email', message: '请输入有效的邮箱地址' }),
    phone: input('contact.phone', '电话').placeholder('请输入电话号码'),
    wechat: input('contact.wechat', '微信号').placeholder('请输入微信号'),
    qq: input('contact.qq', 'QQ号').placeholder('请输入QQ号')
  },

  // 工作信息字段
  work: {
    company: input('work.company', '公司名称').placeholder('请输入公司名称'),
    position: input('work.position', '职位').placeholder('请输入职位'),
    department: input('work.department', '部门').placeholder('请输入部门'),
    workYears: numberInput('work.workYears', '工作年限').placeholder('请输入工作年限')
      .props({ min: 0, max: 50 }),
    salary: numberInput('work.salary', '薪资').placeholder('请输入薪资')
      .props({ min: 0, formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
  },

  // 教育背景字段
  education: {
    degree: select('education.degree', '学历').required().options([
      { label: '高中', value: 'high_school' },
      { label: '大专', value: 'college' },
      { label: '本科', value: 'bachelor' },
      { label: '硕士', value: 'master' },
      { label: '博士', value: 'doctor' }
    ]),
    school: input('education.school', '学校名称').placeholder('请输入学校名称'),
    major: input('education.major', '专业').placeholder('请输入专业'),
    graduationYear: datePicker('education.graduationYear', '毕业年份')
      .props({ type: 'year' })
  },

  // 偏好设置字段
  preferences: {
    language: select('preferences.language', '语言偏好').options([
      { label: '中文', value: 'zh-CN' },
      { label: 'English', value: 'en-US' },
      { label: '日本語', value: 'ja-JP' }
    ]),
    theme: radioGroup('preferences.theme', '主题').options([
      { label: '浅色', value: 'light' },
      { label: '深色', value: 'dark' },
      { label: '自动', value: 'auto' }
    ]),
    notifications: checkboxGroup('preferences.notifications', '通知设置').options([
      { label: '邮件通知', value: 'email' },
      { label: '短信通知', value: 'sms' },
      { label: '推送通知', value: 'push' }
    ]),
    autoSave: switchField('preferences.autoSave', '自动保存')
  }
}

// 布局模板
export const layoutTemplates = {
  // 单列布局
  singleColumn: () => createGrid().cols(1).rowGap(16),

  // 双列布局
  doubleColumn: () => createGrid().cols(2).rowGap(16).colGap(16),

  // 三列布局
  tripleColumn: () => createGrid().cols(3).rowGap(16).colGap(16),

  // 响应式网格布局
  responsiveGrid: () => createGrid().cols({
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    xxl: 6
  }).rowGap(16).colGap(16),

  // 弹性垂直布局
  flexVertical: () => createFlex().direction('column').gap(16),

  // 弹性水平布局
  flexHorizontal: () => createFlex().direction('row').gap(16).wrap('wrap'),

  // 居中布局
  centered: () => createFlex().direction('column').justify('center').align('center').gap(16),

  // 卡片标签页布局
  cardTabs: () => createTabs().type('card').placement('top')
}

// 完整表单模板
export const formTemplates = {
  // 用户注册表单
  userRegistration: () => {
    const { name, email, phone, gender, birthday } = fieldTemplates.userInfo
    const { province, city, detail } = fieldTemplates.address
    
    return createForm()
      .title('用户注册')
      .mode('create')
      .layout(
        createGrid().cols(1).rowGap(20).children([
          // 基本信息卡片
          createGrid().title('基本信息').cols(2).rowGap(16).colGap(16).children([
            name.build(),
            email.build(),
            phone.build(),
            gender.build(),
            birthday.build()
          ]),
          
          // 地址信息卡片
          createGrid().title('地址信息').cols(2).rowGap(16).colGap(16).children([
            province.build(),
            city.build(),
            detail.build()
          ])
        ])
      )
      .options({
        size: 'medium',
        labelPlacement: 'top',
        showRequiredMark: true
      })
  },

  // 员工信息表单
  employeeInfo: () => {
    const { name, email, phone, age } = fieldTemplates.userInfo
    const { company, position, department, workYears } = fieldTemplates.work
    const { degree, school, major } = fieldTemplates.education
    
    return createForm()
      .title('员工信息')
      .mode('create')
      .layout(
        createTabs().type('card').children([
          // 基本信息标签页
          createGrid().title('基本信息').cols(2).rowGap(16).colGap(16).children([
            name.build(),
            age.build(),
            email.build(),
            phone.build()
          ]),
          
          // 工作信息标签页
          createGrid().title('工作信息').cols(2).rowGap(16).colGap(16).children([
            company.build(),
            position.build(),
            department.build(),
            workYears.build()
          ]),
          
          // 教育背景标签页
          createGrid().title('教育背景').cols(2).rowGap(16).colGap(16).children([
            degree.build(),
            school.build(),
            major.build()
          ])
        ])
      )
      .options({
        size: 'medium',
        labelPlacement: 'left',
        labelWidth: 120
      })
  },

  // 设置表单
  settings: () => {
    const { language, theme, notifications, autoSave } = fieldTemplates.preferences
    
    return createForm()
      .title('系统设置')
      .mode('edit')
      .layout(
        createFlex().direction('column').gap(24).children([
          // 界面设置组
          createGrid().title('界面设置').cols(2).rowGap(16).colGap(16).children([
            language.build(),
            theme.build()
          ]),
          
          // 通知设置组
          createFlex().direction('column').gap(16).children([
            notifications.build(),
            autoSave.build()
          ])
        ])
      )
      .options({
        size: 'medium',
        labelPlacement: 'left',
        labelWidth: 100
      })
  },

  // 搜索表单
  search: () => {
    const name = input('name', '姓名').placeholder('请输入姓名')
    const email = input('email', '邮箱').placeholder('请输入邮箱')
    const status = select('status', '状态').options([
      { label: '全部', value: '' },
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ])
    const dateRange = datePicker('dateRange', '创建时间').props({ type: 'daterange' })
    
    return createForm()
      .title('搜索条件')
      .mode('search')
      .layout(
        createFlex().direction('row').gap(16).wrap('wrap').children([
          name.build(),
          email.build(),
          status.build(),
          dateRange.build()
        ])
      )
      .options({
        size: 'medium',
        labelPlacement: 'top',
        inline: true
      })
  },

  // 快速表单（单列简单布局）
  quickForm: (fields: FieldConfig[]) => {
    return createForm()
      .layout(
        createGrid().cols(1).rowGap(16).children(fields)
      )
      .options({
        size: 'medium',
        labelPlacement: 'top'
      })
  }
}

// 导出所有模板
export default {
  fields: fieldTemplates,
  layouts: layoutTemplates,
  forms: formTemplates
}

// 快捷创建函数
export const createQuickForm = formTemplates.quickForm
export const createUserRegistrationForm = formTemplates.userRegistration
export const createEmployeeInfoForm = formTemplates.employeeInfo
export const createSettingsForm = formTemplates.settings
export const createSearchForm = formTemplates.search