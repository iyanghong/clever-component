<template>
  <div class="popup-form-demo">
    <n-card title="弹窗表单演示" class="demo-card">
      <!-- 弹窗类型选择 -->
      <div class="control-panel">
        <n-space>
          <n-select
            v-model:value="currentPopupType"
            :options="popupTypeOptions"
            placeholder="选择弹窗类型"
            style="width: 200px"
          />
          <n-select
            v-model:value="currentFormType"
            :options="formTypeOptions"
            placeholder="选择表单类型"
            style="width: 200px"
          />
          <n-button @click="openPopup" type="primary">
            打开弹窗
          </n-button>
          <n-button @click="clearHistory" type="default" ghost>
            清空历史
          </n-button>
        </n-space>
      </div>
    </n-card>

    <n-space vertical size="large">

      <!-- 表单数据展示 -->
      <n-card title="最近提交的数据">
        <div v-if="lastSubmittedData">
          <n-code :code="JSON.stringify(lastSubmittedData, null, 2)" language="json" />
        </div>
        <n-empty v-else description="暂无提交数据" />
      </n-card>
    </n-space>

    <!-- 模态框表单 -->
    <n-modal
      v-model:show="modalVisible"
      preset="card"
      title="用户信息编辑"
      style="width: 600px"
      :mask-closable="false"
    >
      <CleverForm
        v-model="modalFormData"
        :config="modalFormConfig"
        :show-actions="false"
        @submit="handleModalSubmit"
      />
      <template #footer>
        <n-space justify="end">
          <n-button @click="modalVisible = false">
            取消
          </n-button>
          <n-button type="primary" @click="submitModalForm">
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 抽屉表单 -->
    <n-drawer
      v-model:show="drawerVisible"
      :width="500"
      placement="right"
    >
      <n-drawer-content title="创建任务" closable>
        <CleverForm
          v-model="drawerFormData"
          :config="drawerFormConfig"
          :show-actions="false"
          @submit="handleDrawerSubmit"
        />
        <template #footer>
          <n-space justify="end">
            <n-button @click="drawerVisible = false">
              取消
            </n-button>
            <n-button type="primary" @click="submitDrawerForm">
              创建
            </n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>

    <!-- 对话框表单 -->
    <n-modal
      v-model:show="dialogVisible"
      preset="dialog"
      title="快速添加联系人"
      positive-text="添加"
      negative-text="取消"
      @positive-click="handleDialogPositive"
      @negative-click="dialogVisible = false"
    >
      <CleverForm
        v-model="dialogFormData"
        :config="dialogFormConfig"
        :show-actions="false"
        @submit="handleDialogSubmit"
      />
    </n-modal>

    <!-- 确认弹窗表单 -->
    <n-modal
      v-model:show="popconfirmVisible"
      preset="dialog"
      title="删除确认"
      type="warning"
      positive-text="确认删除"
      negative-text="取消"
      @positive-click="handlePopconfirmPositive"
      @negative-click="popconfirmVisible = false"
    >
      <div style="margin-bottom: 16px;">
        <n-text>您确定要删除以下项目吗？此操作不可撤销。</n-text>
      </div>
      <CleverForm
        v-model="popconfirmFormData"
        :config="popconfirmFormConfig"
        :show-actions="false"
        @submit="handlePopconfirmSubmit"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  NSpace,
  NAlert,
  NCard,
  NCode,
  NEmpty,
  NButton,
  NSelect,
  NModal,
  NDrawer,
  NDrawerContent,
  NText,
  useMessage,
  useDialog
} from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig, FormData } from '@clever-component/components'

// 使用 Naive UI 的消息组件


// 当前选择的弹窗类型和表单类型
const currentPopupType = ref('modal')
const currentFormType = ref('basic')

// 弹窗类型选项
const popupTypeOptions = [
  { label: '模态框', value: 'modal' },
  { label: '抽屉', value: 'drawer' },
  { label: '对话框', value: 'dialog' },
  { label: '确认弹窗', value: 'popconfirm' },
  { label: '全屏弹窗', value: 'fullscreen' },
  { label: '侧边弹窗', value: 'sidebar' }
]

// 表单类型选项
const formTypeOptions = [
  { label: '基础表单', value: 'basic' },
  { label: '复杂表单', value: 'complex' },
  { label: '验证表单', value: 'validation' },
  { label: '步骤表单', value: 'steps' },
  { label: '动态表单', value: 'dynamic' }
]

const message = useMessage()
const dialog = useDialog()

// 打开弹窗的统一方法
const openPopup = () => {
  // 重置表单数据
  resetFormData()
  
  switch (currentPopupType.value) {
    case 'modal':
      modalVisible.value = true
      break
    case 'drawer':
      drawerVisible.value = true
      break
    case 'dialog':
      dialogVisible.value = true
      break
    case 'popconfirm':
      popconfirmVisible.value = true
      break
    case 'fullscreen':
      showFullscreen.value = true
      break
    case 'sidebar':
      showSidebar.value = true
      break
    default:
      console.warn('未知的弹窗类型:', currentPopupType.value)
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    // 基础字段
    name: '',
    email: '',
    phone: '',
    message: '',
    
    // 复杂表单字段
    company: '',
    position: '',
    experience: '',
    skills: [],
    salary: null,
    
    // 验证表单字段
    username: '',
    password: '',
    confirmPassword: '',
    agreement: false,
    
    // 步骤表单字段
    step1: {
      basicInfo: '',
      contact: ''
    },
    step2: {
      preferences: [],
      settings: ''
    },
    
    // 动态表单字段
    dynamicFields: []
  })
}

// 清空历史数据
const clearHistory = () => {
  lastSubmittedData.value = null
  resetFormData()
  message.success('历史数据已清空')
}

// 表单提交处理
const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
  lastSubmittedData.value = { ...data }
  
  // 关闭所有弹窗
  modalVisible.value = false
  drawerVisible.value = false
  dialogVisible.value = false
  popconfirmVisible.value = false
  showFullscreen.value = false
  showSidebar.value = false
  
  // 显示成功消息
  message.success('表单提交成功！')
}

// 表单验证处理
const handleValidate = (isValid: boolean, errors: any) => {
  console.log('表单验证:', { isValid, errors })
  if (!isValid) {
    message.error('表单验证失败，请检查输入内容')
  }
}

// 弹窗显示状态
const modalVisible = ref(false)
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const popconfirmVisible = ref(false)
const showFullscreen = ref(false)
const showSidebar = ref(false)

// 表单数据
const formData = reactive<FormData>({
  // 基础字段
  name: '',
  email: '',
  phone: '',
  message: '',
  
  // 复杂表单字段
  company: '',
  position: '',
  experience: '',
  skills: [],
  salary: null,
  
  // 验证表单字段
  username: '',
  password: '',
  confirmPassword: '',
  agreement: false,
  
  // 步骤表单字段
  step1: {
    basicInfo: '',
    contact: ''
  },
  step2: {
    preferences: [],
    settings: ''
  },
  
  // 动态表单字段
  dynamicFields: []
})

// 最近提交的数据
const lastSubmittedData = ref<FormData | null>(null)

// 基础表单配置
const basicFormConfig: FormConfig = {
  id: 'basic-popup-form',
  title: '基础信息表单',
  layout: {
    type: 'grid',
    props: { cols: 1, rowGap: 16 },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        required: true,
        placeholder: '请输入姓名'
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        required: true,
        placeholder: '请输入邮箱地址',
        props: { type: 'email' }
      },
      {
        field: 'phone',
        label: '手机号',
        component: 'input',
        placeholder: '请输入手机号'
      },
      {
        field: 'message',
        label: '留言',
        component: 'textarea',
        placeholder: '请输入留言内容',
        props: { rows: 3 }
      }
    ]
  }
}

// 复杂表单配置
const complexFormConfig: FormConfig = {
  id: 'complex-popup-form',
  title: '求职申请表单',
  layout: {
    type: 'tabs',
    props: {
      type: 'line',
      placement: 'top',
      tabs: [
        {
          name: 'basic',
          label: '基本信息',
          children: [
            {
              field: 'name',
              label: '姓名',
              component: 'input',
              required: true,
              placeholder: '请输入姓名'
            },
            {
              field: 'email',
              label: '邮箱',
              component: 'input',
              required: true,
              placeholder: '请输入邮箱地址'
            },
            {
              field: 'phone',
              label: '手机号',
              component: 'input',
              required: true,
              placeholder: '请输入手机号'
            }
          ]
        },
        {
          name: 'work',
          label: '工作信息',
          children: [
            {
              field: 'company',
              label: '公司名称',
              component: 'input',
              placeholder: '请输入公司名称'
            },
            {
              field: 'position',
              label: '职位',
              component: 'input',
              placeholder: '请输入职位'
            },
            {
              field: 'experience',
              label: '工作经验',
              component: 'select',
              options: [
                { label: '1年以下', value: '0-1' },
                { label: '1-3年', value: '1-3' },
                { label: '3-5年', value: '3-5' },
                { label: '5年以上', value: '5+' }
              ]
            },
            {
              field: 'salary',
              label: '期望薪资',
              component: 'number-input',
              placeholder: '请输入期望薪资',
              props: { min: 0, precision: 0 }
            }
          ]
        }
      ]
    }
  }
}

// 验证表单配置
const validationFormConfig: FormConfig = {
  id: 'validation-popup-form',
  title: '用户注册表单',
  layout: {
    type: 'grid',
    props: { cols: 1, rowGap: 16 },
    children: [
      {
        field: 'username',
        label: '用户名',
        component: 'input',
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
        field: 'password',
        label: '密码',
        component: 'input',
        required: true,
        placeholder: '请输入密码',
        props: { type: 'password' },
        validation: {
          required: '密码不能为空',
          rules: [
            { min: 6, max: 20, message: '密码长度必须在6-20个字符之间' }
          ]
        }
      },
      {
        field: 'confirmPassword',
        label: '确认密码',
        component: 'input',
        required: true,
        placeholder: '请再次输入密码',
        props: { type: 'password' },
        validation: {
          required: '确认密码不能为空',
          rules: [
            {
              validator: (rule: any, value: string) => {
                if (value !== formData.password) {
                  return Promise.reject('两次输入的密码不一致')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      },
      {
        field: 'agreement',
        label: '用户协议',
        component: 'checkbox',
        required: true,
        props: { label: '我已阅读并同意用户协议' },
        validation: {
          rules: [
            {
              validator: (rule: any, value: boolean) => {
                if (!value) {
                  return Promise.reject('请同意用户协议')
                }
                return Promise.resolve()
              }
            }
          ]
        }
      }
    ]
  }
}

// 步骤表单配置
const stepsFormConfig: FormConfig = {
  id: 'steps-popup-form',
  title: '分步骤表单',
  layout: {
    type: 'steps',
    props: {
      current: 0,
      direction: 'horizontal',
      steps: [
        {
          title: '基本信息',
          children: [
            {
              field: 'name',
              label: '姓名',
              component: 'input',
              required: true,
              placeholder: '请输入姓名'
            },
            {
              field: 'email',
              label: '邮箱',
              component: 'input',
              required: true,
              placeholder: '请输入邮箱地址'
            }
          ]
        },
        {
          title: '联系方式',
          children: [
            {
              field: 'phone',
              label: '手机号',
              component: 'input',
              required: true,
              placeholder: '请输入手机号'
            },
            {
              field: 'message',
              label: '备注',
              component: 'textarea',
              placeholder: '请输入备注信息'
            }
          ]
        }
      ]
    }
  }
}

// 动态表单配置
const dynamicFormConfig: FormConfig = {
  id: 'dynamic-popup-form',
  title: '动态表单',
  layout: {
    type: 'grid',
    props: { cols: 1, rowGap: 16 },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        required: true,
        placeholder: '请输入姓名'
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        required: true,
        placeholder: '请输入邮箱地址'
      }
      // 动态字段将通过计算属性添加
    ]
  }
}

// 当前表单配置
const currentFormConfig = computed(() => {
  const configs = {
    basic: basicFormConfig,
    complex: complexFormConfig,
    validation: validationFormConfig,
    steps: stepsFormConfig,
    dynamic: dynamicFormConfig
  }
  return configs[currentFormType.value as keyof typeof configs]
})

// 模态框表单数据
const modalFormData = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  startDate: null,
  salary: null,
  description: ''
})

// 抽屉表单数据
const drawerFormData = ref<FormData>({
  title: '',
  priority: '',
  assignee: '',
  dueDate: null,
  tags: [],
  description: ''
})

// 对话框表单数据
const dialogFormData = ref<FormData>({
  name: '',
  phone: '',
  email: '',
  company: ''
})

// 确认弹窗表单数据
const popconfirmFormData = ref<FormData>({
  itemName: '',
  reason: '',
  confirmText: ''
})

// 模态框表单配置
const modalFormConfig: FormConfig = {
  id: 'modal-form',
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
        placeholder: '请输入手机号',
        props: { clearable: true }
      },
      {
        field: 'department',
        label: '部门',
        component: 'select',
        required: true,
        props: {
          options: [
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '设计部', value: 'design' },
            { label: '运营部', value: 'operation' },
            { label: '人事部', value: 'hr' }
          ]
        }
      },
      {
        field: 'position',
        label: '职位',
        component: 'input',
        required: true,
        placeholder: '请输入职位',
        props: { clearable: true }
      },
      {
        field: 'startDate',
        label: '入职日期',
        component: 'date-picker',
        required: true,
        props: {
          type: 'date',
          placeholder: '请选择入职日期'
        }
      },
      {
        field: 'salary',
        label: '薪资',
        component: 'number-input',
        placeholder: '请输入薪资',
        props: {
          min: 0,
          precision: 0,
          suffix: '元/月'
        }
      },
      {
        field: 'description',
        label: '备注',
        component: 'textarea',
        span: 2,
        placeholder: '请输入备注信息...',
        props: {
          rows: 3,
          maxlength: 200,
          showCount: true
        }
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 80,
    showRequiredMark: true
  }
}

// 抽屉表单配置
const drawerFormConfig: FormConfig = {
  id: 'drawer-form',
  layout: {
    type: 'grid',
    props: {
      cols: 1,
      yGap: 16
    },
    children: [
      {
        field: 'title',
        label: '任务标题',
        component: 'input',
        required: true,
        placeholder: '请输入任务标题',
        props: { clearable: true }
      },
      {
        field: 'priority',
        label: '优先级',
        component: 'radio-group',
        required: true,
        props: {
          options: [
            { label: '低', value: 'low' },
            { label: '中', value: 'medium' },
            { label: '高', value: 'high' },
            { label: '紧急', value: 'urgent' }
          ]
        }
      },
      {
        field: 'assignee',
        label: '负责人',
        component: 'select',
        required: true,
        props: {
          options: [
            { label: '张三', value: 'zhangsan' },
            { label: '李四', value: 'lisi' },
            { label: '王五', value: 'wangwu' },
            { label: '赵六', value: 'zhaoliu' }
          ]
        }
      },
      {
        field: 'dueDate',
        label: '截止日期',
        component: 'date-picker',
        props: {
          type: 'datetime',
          placeholder: '请选择截止日期'
        }
      },
      {
        field: 'tags',
        label: '标签',
        component: 'checkbox-group',
        props: {
          options: [
            { label: '前端', value: 'frontend' },
            { label: '后端', value: 'backend' },
            { label: '测试', value: 'test' },
            { label: '设计', value: 'design' },
            { label: '文档', value: 'doc' }
          ]
        }
      },
      {
        field: 'description',
        label: '任务描述',
        component: 'textarea',
        placeholder: '请详细描述任务内容...',
        props: {
          rows: 4,
          maxlength: 500,
          showCount: true
        }
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'top',
    showRequiredMark: true
  }
}

// 对话框表单配置
const dialogFormConfig: FormConfig = {
  id: 'dialog-form',
  layout: {
    type: 'grid',
    props: {
      cols: 1,
      yGap: 16
    },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        required: true,
        placeholder: '请输入联系人姓名',
        props: { clearable: true }
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
        field: 'email',
        label: '邮箱',
        component: 'input',
        placeholder: '请输入邮箱（可选）',
        props: { type: 'email', clearable: true }
      },
      {
        field: 'company',
        label: '公司',
        component: 'input',
        placeholder: '请输入公司名称（可选）',
        props: { clearable: true }
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 60,
    showRequiredMark: true
  }
}

// 确认弹窗表单配置
const popconfirmFormConfig: FormConfig = {
  id: 'popconfirm-form',
  layout: {
    type: 'grid',
    props: {
      cols: 1,
      yGap: 16
    },
    children: [
      {
        field: 'itemName',
        label: '项目名称',
        component: 'input',
        required: true,
        placeholder: '请输入要删除的项目名称',
        props: { clearable: true }
      },
      {
        field: 'reason',
        label: '删除原因',
        component: 'select',
        required: true,
        props: {
          options: [
            { label: '项目已完成', value: 'completed' },
            { label: '项目取消', value: 'cancelled' },
            { label: '重复项目', value: 'duplicate' },
            { label: '其他原因', value: 'other' }
          ]
        }
      },
      {
        field: 'confirmText',
        label: '确认文本',
        component: 'input',
        required: true,
        placeholder: '请输入 "确认删除" 以继续',
        props: { clearable: true },
        rules: [
          {
            required: true,
            message: '请输入确认文本'
          },
          {
            validator: (value: string) => {
              if (value !== '确认删除') {
                return Promise.reject('请输入正确的确认文本')
              }
              return Promise.resolve()
            }
          }
        ]
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 80,
    showRequiredMark: true
  }
}

// 打开模态框
const openModal = () => {
  modalVisible.value = true
  // 重置表单数据
  modalFormData.value = {
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    startDate: null,
    salary: null,
    description: ''
  }
}

// 打开抽屉
const openDrawer = () => {
  drawerVisible.value = true
  // 重置表单数据
  drawerFormData.value = {
    title: '',
    priority: '',
    assignee: '',
    dueDate: null,
    tags: [],
    description: ''
  }
}

// 打开对话框
const openDialog = () => {
  dialogVisible.value = true
  // 重置表单数据
  dialogFormData.value = {
    name: '',
    phone: '',
    email: '',
    company: ''
  }
}

// 打开确认弹窗
const openPopconfirm = () => {
  popconfirmVisible.value = true
  // 重置表单数据
  popconfirmFormData.value = {
    itemName: '',
    reason: '',
    confirmText: ''
  }
}

// 提交模态框表单
const submitModalForm = () => {
  // 这里应该触发表单验证和提交
  handleModalSubmit(modalFormData.value)
}

// 提交抽屉表单
const submitDrawerForm = () => {
  // 这里应该触发表单验证和提交
  handleDrawerSubmit(drawerFormData.value)
}

// 处理对话框确定按钮
const handleDialogPositive = () => {
  // 这里应该触发表单验证和提交
  handleDialogSubmit(dialogFormData.value)
  return false // 阻止默认关闭行为，由提交处理函数控制
}

// 处理确认弹窗确定按钮
const handlePopconfirmPositive = () => {
  // 这里应该触发表单验证和提交
  handlePopconfirmSubmit(popconfirmFormData.value)
  return false // 阻止默认关闭行为，由提交处理函数控制
}

// 处理模态框表单提交
const handleModalSubmit = (data: FormData) => {
  console.log('模态框表单提交:', data)
  lastSubmittedData.value = { ...data, type: 'modal' }
  modalVisible.value = false
  message.success('用户信息保存成功！')
}

// 处理抽屉表单提交
const handleDrawerSubmit = (data: FormData) => {
  console.log('抽屉表单提交:', data)
  lastSubmittedData.value = { ...data, type: 'drawer' }
  drawerVisible.value = false
  message.success('任务创建成功！')
}

// 处理对话框表单提交
const handleDialogSubmit = (data: FormData) => {
  console.log('对话框表单提交:', data)
  lastSubmittedData.value = { ...data, type: 'dialog' }
  dialogVisible.value = false
  message.success('联系人添加成功！')
}

// 处理确认弹窗表单提交
const handlePopconfirmSubmit = (data: FormData) => {
  console.log('确认弹窗表单提交:', data)
  lastSubmittedData.value = { ...data, type: 'popconfirm' }
  popconfirmVisible.value = false
  message.success('项目删除成功！')
}
</script>

<style scoped>
.popup-form-demo {
  padding: 20px;
}
</style>