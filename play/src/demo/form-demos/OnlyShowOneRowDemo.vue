<template>
  <DemoContainer
    title="单行显示模式"
    description="展示CleverForm的onlyShowOneRow功能，支持在单行内显示表单字段和操作按钮，适用于搜索表单和紧凑布局场景。"
    :code="demoCode"
  >
    <!-- 基础单行显示 -->
    <n-card title="基础单行显示" class="demo-card">
      <CleverForm
        ref="basicFormRef"
        :schemas="basicSchemas"
        :data="basicModel"
        :only-show-one-row="true"
        :show-advanced-button="true"
        layout="flex"
        @submit="handleBasicSubmit"
      />
    </n-card>

    <!-- Grid布局单行显示 -->
    <n-card title="Grid布局单行显示" class="demo-card">
      <CleverForm
        ref="gridFormRef"
        :schemas="gridSchemas"
        :data="gridModel"
        :only-show-one-row="true"
        :show-advanced-button="true"
        layout="grid"
        @submit="handleGridSubmit"
      />
    </n-card>

    <!-- Tabs布局单行显示 -->
    <n-card title="Tabs布局单行显示" class="demo-card">
      <CleverForm
        ref="tabsFormRef"
        :schemas="tabsSchemas"
        :data="tabsModel"
        :only-show-one-row="true"
        :show-advanced-button="true"
        layout="tabs"
        @submit="handleTabsSubmit"
      />
    </n-card>

    <!-- 搜索表单示例 -->
    <n-card title="搜索表单示例" class="demo-card">
      <CleverForm
        ref="searchFormRef"
        :schemas="searchSchemas"
        :data="searchModel"
        :only-show-one-row="true"
        :show-advanced-button="true"
        :show-reset-button="true"
        :show-submit-button="true"
        submit-button-text="搜索"
        reset-button-text="重置"
        layout="flex"
        @submit="handleSearch"
        @reset="handleReset"
      />
    </n-card>
    
    <template #actions>
      <n-space>
        <n-button type="primary" @click="toggleAllForms">切换所有表单展开状态</n-button>
        <n-button @click="resetAllForms">重置所有表单</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="result" type="info">
        <pre>{{ result }}</pre>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NSpace, NButton, NAlert, NCard } from 'naive-ui'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateFormCode } from '../../utils/demo-utils'

// 表单引用
const basicFormRef = ref()
const gridFormRef = ref()
const tabsFormRef = ref()
const searchFormRef = ref()

// 结果显示
const result = ref('')

// 基础表单数据模型
const basicModel = reactive({
  name: '',
  email: '',
  phone: '',
  city: ''
})

// Grid表单数据模型
const gridModel = reactive({
  title: '',
  category: '',
  status: '',
  priority: ''
})

// Tabs表单数据模型
const tabsModel = reactive({
  username: '',
  department: '',
  role: '',
  level: ''
})

// 搜索表单数据模型
const searchModel = reactive({
  keyword: '',
  type: '',
  dateRange: null,
  status: ''
})

// 基础表单字段配置
const basicSchemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: {
      placeholder: '请输入邮箱'
    }
  },
  {
    field: 'phone',
    label: '电话',
    component: 'input',
    componentProps: {
      placeholder: '请输入电话'
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'select',
    componentProps: {
      placeholder: '请选择城市',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ]
    }
  }
]

// Grid表单字段配置
const gridSchemas: FormFieldSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'input',
    componentProps: {
      placeholder: '请输入标题'
    }
  },
  {
    field: 'category',
    label: '分类',
    component: 'select',
    componentProps: {
      placeholder: '请选择分类',
      options: [
        { label: '技术', value: 'tech' },
        { label: '产品', value: 'product' },
        { label: '设计', value: 'design' }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '进行中', value: 'progress' },
        { label: '已完成', value: 'completed' },
        { label: '已暂停', value: 'paused' }
      ]
    }
  },
  {
    field: 'priority',
    label: '优先级',
    component: 'select',
    componentProps: {
      placeholder: '请选择优先级',
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ]
    }
  }
]

// Tabs表单字段配置
const tabsSchemas: FormFieldSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'input',
    componentProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    field: 'department',
    label: '部门',
    component: 'select',
    componentProps: {
      placeholder: '请选择部门',
      options: [
        { label: '研发部', value: 'dev' },
        { label: '产品部', value: 'product' },
        { label: '设计部', value: 'design' },
        { label: '运营部', value: 'operation' }
      ]
    }
  },
  {
    field: 'role',
    label: '角色',
    component: 'select',
    componentProps: {
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' }
      ]
    }
  },
  {
    field: 'level',
    label: '级别',
    component: 'select',
    componentProps: {
      placeholder: '请选择级别',
      options: [
        { label: 'P1', value: 'p1' },
        { label: 'P2', value: 'p2' },
        { label: 'P3', value: 'p3' },
        { label: 'P4', value: 'p4' }
      ]
    }
  }
]

// 搜索表单字段配置
const searchSchemas: FormFieldSchema[] = [
  {
    field: 'keyword',
    label: '关键词',
    component: 'input',
    componentProps: {
      placeholder: '请输入搜索关键词'
    }
  },
  {
    field: 'type',
    label: '类型',
    component: 'select',
    componentProps: {
      placeholder: '请选择类型',
      options: [
        { label: '全部', value: '' },
        { label: '文章', value: 'article' },
        { label: '视频', value: 'video' },
        { label: '图片', value: 'image' }
      ]
    }
  },
  {
    field: 'dateRange',
    label: '日期范围',
    component: 'date-picker',
    componentProps: {
      type: 'daterange',
      placeholder: '请选择日期范围'
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '已发布', value: 'published' },
        { label: '草稿', value: 'draft' },
        { label: '已删除', value: 'deleted' }
      ]
    }
  }
]

// 生成演示代码
const demoCode = generateFormCode({
  schemas: basicSchemas,
  model: basicModel,
  title: '单行显示模式示例',
  description: '展示onlyShowOneRow功能的使用方法',
  extraProps: {
    onlyShowOneRow: true,
    showAdvancedButton: true,
    layout: 'flex'
  }
})

// 事件处理
const handleBasicSubmit = (data: any) => {
  result.value = `基础表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleGridSubmit = (data: any) => {
  result.value = `Grid表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleTabsSubmit = (data: any) => {
  result.value = `Tabs表单提交：\n${JSON.stringify(data, null, 2)}`
}

const handleSearch = (data: any) => {
  result.value = `搜索条件：\n${JSON.stringify(data, null, 2)}`
}

const handleReset = () => {
  result.value = '搜索表单已重置'
}

// 表单操作方法
const toggleAllForms = () => {
  const forms = [basicFormRef.value, gridFormRef.value, tabsFormRef.value, searchFormRef.value]
  forms.forEach(form => {
    if (form?.unfoldToggle) {
      form.unfoldToggle()
    }
  })
}

const resetAllForms = () => {
  const forms = [basicFormRef.value, gridFormRef.value, tabsFormRef.value, searchFormRef.value]
  forms.forEach(form => {
    if (form?.reset) {
      form.reset()
    }
  })
  result.value = '所有表单已重置'
}
</script>

<style scoped>
.demo-card {
  margin-bottom: 24px;
}

.demo-card:last-child {
  margin-bottom: 0;
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