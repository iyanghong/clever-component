<template>
  <div class="schema-helpers-demo">
    <n-space vertical size="large">
      <!-- 新增：直接传入辅助函数返回值的示例 -->
      <n-card title="直接传入辅助函数返回值" class="demo-card">
        <p>CleverForm 现在支持直接接受辅助函数的返回值，无需手动解构：</p>
        
        <CleverForm
          v-model:data="directConfigModel"
          :schema-config="directSchemaConfig"
          @submit="handleDirectConfigSubmit"
          @reset="handleDirectConfigReset"
        />
        
        <n-divider />
        
        <h4>代码示例：</h4>
        <n-code language="vue" :code="directConfigCode" />
      </n-card>
      
      <n-card title="Schema辅助工具演示" size="small">
        <n-space>
          <n-button @click="showGridDemo">网格布局示例</n-button>
          <n-button @click="showFlexDemo">Flex布局示例</n-button>
          <n-button @click="showTabsDemo">标签页布局示例</n-button>
          <n-button @click="showAccordionDemo">手风琴布局示例</n-button>
          <n-button @click="showMixedDemo">混合布局示例</n-button>
          <n-button @click="showPresetsDemo">字段预设示例</n-button>
        </n-space>
      </n-card>

      <!-- 网格布局演示 -->
      <n-card v-if="currentDemo === 'grid'" title="网格布局快速创建" size="small">
        <template #header-extra>
          <n-button size="small" @click="resetGridForm">重置</n-button>
        </template>
        <CleverForm
          ref="gridFormRef"
          :schemas="gridSchemas"
          :data="gridModel"
          layout-mode="mixed"
          :layout-config="gridLayoutConfig"
          @submit="handleGridSubmit"
        />
        <template #footer>
          <n-collapse>
            <n-collapse-item title="查看代码" name="grid-code">
              <n-code language="typescript" :code="gridCode" />
            </n-collapse-item>
          </n-collapse>
        </template>
      </n-card>

      <!-- Flex布局演示 -->
      <n-card v-if="currentDemo === 'flex'" title="Flex布局快速创建" size="small">
        <template #header-extra>
          <n-button size="small" @click="resetFlexForm">重置</n-button>
        </template>
        <CleverForm
          ref="flexFormRef"
          :schemas="flexSchemas"
          :data="flexModel"
          layout-mode="mixed"
          :layout-config="flexLayoutConfig"
          @submit="handleFlexSubmit"
        />
        <template #footer>
          <n-collapse>
            <n-collapse-item title="查看代码" name="flex-code">
              <n-code language="typescript" :code="flexCode" />
            </n-collapse-item>
          </n-collapse>
        </template>
      </n-card>

      <!-- 标签页布局演示 -->
      <n-card v-if="currentDemo === 'tabs'" title="标签页布局快速创建" size="small">
        <template #header-extra>
          <n-button size="small" @click="resetTabsForm">重置</n-button>
        </template>
        <CleverForm
          ref="tabsFormRef"
          :schemas="tabsSchemas"
          :data="tabsModel"
          layout-mode="mixed"
          :layout-config="tabsLayoutConfig"
          @submit="handleTabsSubmit"
        />
        <template #footer>
          <n-collapse>
            <n-collapse-item title="查看代码" name="tabs-code">
              <n-code language="typescript" :code="tabsCode" />
            </n-collapse-item>
          </n-collapse>
        </template>
      </n-card>

      <!-- 手风琴布局演示 -->
      <n-card v-if="currentDemo === 'accordion'" title="手风琴布局快速创建" size="small">
        <template #header-extra>
          <n-button size="small" @click="resetAccordionForm">重置</n-button>
        </template>
        <CleverForm
          ref="accordionFormRef"
          :schemas="accordionSchemas"
          :data="accordionModel"
          layout-mode="mixed"
          :layout-config="accordionLayoutConfig"
          @submit="handleAccordionSubmit"
        />
        <template #footer>
          <n-collapse>
            <n-collapse-item title="查看代码" name="accordion-code">
              <n-code language="typescript" :code="accordionCode" />
            </n-collapse-item>
          </n-collapse>
        </template>
      </n-card>

      <!-- 混合布局演示 -->
      <n-card v-if="currentDemo === 'mixed'" title="混合布局快速创建" size="small">
        <template #header-extra>
          <n-button size="small" @click="resetMixedForm">重置</n-button>
        </template>
        <CleverForm
          ref="mixedFormRef"
          :schemas="mixedSchemas"
          :data="mixedModel"
          layout-mode="mixed"
          :layout-config="mixedLayoutConfig"
          @submit="handleMixedSubmit"
        />
        <template #footer>
          <n-collapse>
            <n-collapse-item title="查看代码" name="mixed-code">
              <n-code language="typescript" :code="mixedCode" />
            </n-collapse-item>
          </n-collapse>
        </template>
      </n-card>

      <!-- 字段预设演示 -->
      <n-card v-if="currentDemo === 'presets'" title="字段预设快速创建" size="small">
        <template #header-extra>
          <n-button size="small" @click="resetPresetsForm">重置</n-button>
        </template>
        <CleverForm
          ref="presetsFormRef"
          :schemas="presetsSchemas"
          :data="presetsModel"
          layout-mode="mixed"
          :layout-config="presetsLayoutConfig"
          @submit="handlePresetsSubmit"
        />
        <template #footer>
          <n-collapse>
            <n-collapse-item title="查看代码" name="presets-code">
              <n-code language="typescript" :code="presetsCode" />
            </n-collapse-item>
          </n-collapse>
        </template>
      </n-card>

      <!-- 结果显示 -->
      <n-card v-if="result" title="提交结果" size="small">
        <n-code language="json" :code="JSON.stringify(result, null, 2)" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import {
  CleverForm,
  createGridLayout,
  createFlexLayout,
  createTabsLayout,
  createAccordionLayout,
  GridLayoutBuilder,
  MixedLayoutBuilder,
  FieldPresets,
  type FormSchema,
  type LayoutConfig
} from '@/components'

const message = useMessage()
const currentDemo = ref<string>('')
const result = ref<any>(null)

// 表单引用
const gridFormRef = ref()
const flexFormRef = ref()
const tabsFormRef = ref()
const accordionFormRef = ref()
const mixedFormRef = ref()
const presetsFormRef = ref()

// 直接传入辅助函数返回值的示例
const directConfigModel = ref<DirectConfigForm>({
  name: '',
  email: '',
  age: null,
  gender: '',
  bio: ''
})

// 定义表单数据类型
type DirectConfigForm = {
  name: string
  email: string
  age: number | null
  gender: string
  bio: string
}

// 直接使用辅助函数的返回值
const directSchemaConfig = createGridLayout<DirectConfigForm>([
  FieldPresets.input<DirectConfigForm>('name', '姓名', { required: true }),
  FieldPresets.input<DirectConfigForm>('email', '邮箱', { 
    required: true,
    rules: [{ type: 'email', message: '请输入正确的邮箱格式' }]
  }),
  FieldPresets.number<DirectConfigForm>('age', '年龄', { 
    componentProps: { min: 1, max: 120 }
  }),
  FieldPresets.select<DirectConfigForm>('gender', '性别', [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]),
  FieldPresets.textarea<DirectConfigForm>('bio', '个人简介', { isFull: true })
], {
  cols: '1 s:1 m:2 l:2 xl:2 2xl:2',
  xGap: 16,
  yGap: 16
})

// 处理函数
function handleDirectConfigSubmit(data: any) {
  result.value = { type: 'direct-config', data }
  message.success('直接配置表单提交成功')
}

function handleDirectConfigReset() {
  Object.assign(directConfigModel.value, {
    name: '',
    email: '',
    age: null,
    gender: '',
    bio: ''
  } as DirectConfigForm)
}

// 代码示例
const directConfigCode = `// 直接传入辅助函数返回值
import { createGridLayout, FieldPresets } from '@/components'

// 直接使用辅助函数的返回值，无需手动解构
const schemaConfig = createGridLayout([
  FieldPresets.input('name', '姓名', { required: true }),
  FieldPresets.input('email', '邮箱', { 
    required: true,
    rules: [{ type: 'email', message: '请输入正确的邮箱格式' }]
  }),
  FieldPresets.number('age', '年龄'),
  FieldPresets.select('gender', '性别', [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]),
  FieldPresets.textarea('bio', '个人简介', { isFull: true })
], {
  cols: '1 s:1 m:2 l:2 xl:2 2xl:2',
  xGap: 16,
  yGap: 16
})

// 直接传给 CleverForm
<CleverForm
  v-model:data="formData"
  :schema-config="schemaConfig"
  @submit="handleSubmit"
/>`

// 网格布局演示
const gridModel = reactive({
  name: '',
  email: '',
  phone: '',
  age: null,
  gender: '',
  description: ''
})

const { schemas: gridSchemas, layoutConfig: gridLayoutConfig } = createGridLayout([
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入邮箱'
    }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入手机号'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: {
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    }
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
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'NInputTextArea',
    isFull: true,
    componentProps: {
      placeholder: '请输入描述',
      rows: 3
    }
  }
], {
  cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
  xGap: 24,
  yGap: 16
})

// Flex布局演示
const flexModel = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const { schemas: flexSchemas, layoutConfig: flexLayoutConfig } = createFlexLayout([
  {
    field: 'username',
    label: '用户名',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'NInputPassword',
    required: true,
    componentProps: {
      placeholder: '请输入密码'
    }
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'NInputPassword',
    required: true,
    componentProps: {
      placeholder: '请确认密码'
    }
  }
], {
  direction: 'column',
  gap: 16
})

// 标签页布局演示
const tabsModel = reactive({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  // 地址信息
  country: '',
  city: '',
  address: ''
})

const { schemas: tabsSchemas, layoutConfig: tabsLayoutConfig } = createTabsLayout([
  {
    name: 'basic',
    title: '基本信息',
    fields: [
      {
        field: 'name',
        label: '姓名',
        component: 'NInput',
        required: true,
        componentProps: {
          placeholder: '请输入姓名'
        }
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'NInput',
        required: true,
        componentProps: {
          placeholder: '请输入邮箱'
        }
      },
      {
        field: 'phone',
        label: '手机号',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入手机号'
        }
      }
    ]
  },
  {
    name: 'address',
    title: '地址信息',
    fields: [
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
        }
      },
      {
        field: 'city',
        label: '城市',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入城市'
        }
      },
      {
        field: 'address',
        label: '详细地址',
        component: 'NInputTextArea',
        isFull: true,
        componentProps: {
          placeholder: '请输入详细地址',
          rows: 3
        }
      }
    ]
  }
], {
  type: 'card',
  placement: 'top'
})

// 手风琴布局演示
const accordionModel = reactive({
  // 个人信息
  name: '',
  age: null,
  gender: '',
  // 工作信息
  company: '',
  position: '',
  salary: null
})

const { schemas: accordionSchemas, layoutConfig: accordionLayoutConfig } = createAccordionLayout([
  {
    name: 'personal',
    title: '个人信息',
    defaultExpanded: true,
    fields: [
      {
        field: 'name',
        label: '姓名',
        component: 'NInput',
        required: true,
        componentProps: {
          placeholder: '请输入姓名'
        }
      },
      {
        field: 'age',
        label: '年龄',
        component: 'NInputNumber',
        componentProps: {
          placeholder: '请输入年龄',
          min: 1,
          max: 120
        }
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
        }
      }
    ]
  },
  {
    name: 'work',
    title: '工作信息',
    defaultExpanded: false,
    fields: [
      {
        field: 'company',
        label: '公司',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入公司名称'
        }
      },
      {
        field: 'position',
        label: '职位',
        component: 'NInput',
        componentProps: {
          placeholder: '请输入职位'
        }
      },
      {
        field: 'salary',
        label: '薪资',
        component: 'NInputNumber',
        componentProps: {
          placeholder: '请输入薪资',
          min: 0
        }
      }
    ]
  }
], {
  accordion: true,
  arrowPlacement: 'right'
})

// 混合布局演示
const mixedModel = reactive({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  // 偏好设置
  theme: '',
  language: '',
  notifications: false,
  // 安全设置
  password: '',
  confirmPassword: '',
  twoFactor: false
})

const mixedBuilder = new MixedLayoutBuilder()
  .addGridContainer('basic', '基本信息', [
    {
      field: 'name',
      label: '姓名',
      component: 'NInput',
      required: true,
      componentProps: {
        placeholder: '请输入姓名'
      }
    },
    {
      field: 'email',
      label: '邮箱',
      component: 'NInput',
      required: true,
      componentProps: {
        placeholder: '请输入邮箱'
      }
    },
    {
      field: 'phone',
      label: '手机号',
      component: 'NInput',
      componentProps: {
        placeholder: '请输入手机号'
      }
    }
  ])
  .addTabsContainer('settings', '设置', [
    {
      name: 'preferences',
      title: '偏好设置',
      fields: [
        {
          field: 'theme',
          label: '主题',
          component: 'NSelect',
          componentProps: {
            placeholder: '请选择主题',
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
          component: 'NSelect',
          componentProps: {
            placeholder: '请选择语言',
            options: [
              { label: '中文', value: 'zh' },
              { label: 'English', value: 'en' }
            ]
          }
        },
        {
          field: 'notifications',
          label: '通知',
          component: 'NSwitch'
        }
      ]
    },
    {
      name: 'security',
      title: '安全设置',
      fields: [
        {
          field: 'password',
          label: '新密码',
          component: 'NInputPassword',
          componentProps: {
            placeholder: '请输入新密码'
          }
        },
        {
          field: 'confirmPassword',
          label: '确认密码',
          component: 'NInputPassword',
          componentProps: {
            placeholder: '请确认密码'
          }
        },
        {
          field: 'twoFactor',
          label: '双因子认证',
          component: 'NSwitch'
        }
      ]
    }
  ])

const { schemas: mixedSchemas, layoutConfig: mixedLayoutConfig } = mixedBuilder.build()

// 字段预设演示
const presetsModel = reactive({
  username: '',
  password: '',
  email: '',
  age: null,
  gender: '',
  interests: [],
  birthday: null,
  rating: 0,
  enabled: false,
  description: ''
})

const presetsBuilder = new GridLayoutBuilder()
  .addField(FieldPresets.input('username', '用户名', { required: true }))
  .addField(FieldPresets.password('password', '密码', { required: true }))
  .addField(FieldPresets.input('email', '邮箱', { 
    required: true,
    componentProps: {
      type: 'email'
    }
  }))
  .addField(FieldPresets.number('age', '年龄', {
    componentProps: {
      min: 1,
      max: 120
    }
  }))
  .addField(FieldPresets.radio('gender', '性别', [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]))
  .addField(FieldPresets.checkbox('interests', '兴趣爱好', [
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' },
    { label: '旅行', value: 'travel' }
  ]))
  .addField(FieldPresets.date('birthday', '生日'))
  .addField(FieldPresets.rate('rating', '评分'))
  .addField(FieldPresets.switch('enabled', '启用状态'))
  .addField(FieldPresets.textarea('description', '描述'))

const { schemas: presetsSchemas, layoutConfig: presetsLayoutConfig } = presetsBuilder.build()

// 代码示例
const gridCode = `// 网格布局快速创建
const { schemas, layoutConfig } = createGridLayout([
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    required: true,
    componentProps: {
      placeholder: '请输入邮箱'
    }
  }
  // ... 更多字段
], {
  cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
  xGap: 24,
  yGap: 16
})`

const flexCode = `// Flex布局快速创建
const { schemas, layoutConfig } = createFlexLayout([
  {
    field: 'username',
    label: '用户名',
    component: 'NInput',
    required: true
  },
  {
    field: 'password',
    label: '密码',
    component: 'NInputPassword',
    required: true
  }
  // ... 更多字段
], {
  direction: 'column',
  gap: 16
})`

const tabsCode = `// 标签页布局快速创建
const { schemas, layoutConfig } = createTabsLayout([
  {
    name: 'basic',
    title: '基本信息',
    fields: [
      {
        field: 'name',
        label: '姓名',
        component: 'NInput',
        required: true
      }
      // ... 更多字段
    ]
  },
  {
    name: 'address',
    title: '地址信息',
    fields: [
      // ... 字段定义
    ]
  }
], {
  type: 'card',
  placement: 'top'
})`

const accordionCode = `// 手风琴布局快速创建
const { schemas, layoutConfig } = createAccordionLayout([
  {
    name: 'personal',
    title: '个人信息',
    defaultExpanded: true,
    fields: [
      {
        field: 'name',
        label: '姓名',
        component: 'NInput',
        required: true
      }
      // ... 更多字段
    ]
  }
  // ... 更多面板
], {
  accordion: true,
  arrowPlacement: 'right'
})`

const mixedCode = `// 混合布局快速创建
const mixedBuilder = new MixedLayoutBuilder()
  .addGridContainer('basic', '基本信息', [
    // ... 字段定义
  ])
  .addTabsContainer('settings', '设置', [
    {
      name: 'preferences',
      title: '偏好设置',
      fields: [
        // ... 字段定义
      ]
    }
    // ... 更多标签页
  ])

const { schemas, layoutConfig } = mixedBuilder.build()`

const presetsCode = `// 字段预设快速创建
const presetsBuilder = new GridLayoutBuilder()
  .addField(FieldPresets.input('username', '用户名', { required: true }))
  .addField(FieldPresets.password('password', '密码', { required: true }))
  .addField(FieldPresets.number('age', '年龄'))
  .addField(FieldPresets.radio('gender', '性别', [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]))
  .addField(FieldPresets.date('birthday', '生日'))
  .addField(FieldPresets.switch('enabled', '启用状态'))
  .addField(FieldPresets.textarea('description', '描述'))

const { schemas, layoutConfig } = presetsBuilder.build()`

// 演示方法
function showGridDemo() {
  currentDemo.value = 'grid'
  result.value = null
}

function showFlexDemo() {
  currentDemo.value = 'flex'
  result.value = null
}

function showTabsDemo() {
  currentDemo.value = 'tabs'
  result.value = null
}

function showAccordionDemo() {
  currentDemo.value = 'accordion'
  result.value = null
}

function showMixedDemo() {
  currentDemo.value = 'mixed'
  result.value = null
}

function showPresetsDemo() {
  currentDemo.value = 'presets'
  result.value = null
}

// 重置方法
function resetGridForm() {
  Object.assign(gridModel, {
    name: '',
    email: '',
    phone: '',
    age: null,
    gender: '',
    description: ''
  })
}

function resetFlexForm() {
  Object.assign(flexModel, {
    username: '',
    password: '',
    confirmPassword: ''
  })
}

function resetTabsForm() {
  Object.assign(tabsModel, {
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: ''
  })
}

function resetAccordionForm() {
  Object.assign(accordionModel, {
    name: '',
    age: null,
    gender: '',
    company: '',
    position: '',
    salary: null
  })
}

function resetMixedForm() {
  Object.assign(mixedModel, {
    name: '',
    email: '',
    phone: '',
    theme: '',
    language: '',
    notifications: false,
    password: '',
    confirmPassword: '',
    twoFactor: false
  })
}

function resetPresetsForm() {
  Object.assign(presetsModel, {
    username: '',
    password: '',
    email: '',
    age: null,
    gender: '',
    interests: [],
    birthday: null,
    rating: 0,
    enabled: false,
    description: ''
  })
}

// 提交处理
function handleGridSubmit(data: any) {
  result.value = { type: 'grid', data }
  message.success('网格布局表单提交成功')
}

function handleFlexSubmit(data: any) {
  result.value = { type: 'flex', data }
  message.success('Flex布局表单提交成功')
}

function handleTabsSubmit(data: any) {
  result.value = { type: 'tabs', data }
  message.success('标签页布局表单提交成功')
}

function handleAccordionSubmit(data: any) {
  result.value = { type: 'accordion', data }
  message.success('手风琴布局表单提交成功')
}

function handleMixedSubmit(data: any) {
  result.value = { type: 'mixed', data }
  message.success('混合布局表单提交成功')
}

function handlePresetsSubmit(data: any) {
  result.value = { type: 'presets', data }
  message.success('字段预设表单提交成功')
}
</script>

<style scoped>
.schema-helpers-demo {
  padding: 20px;
}
</style>