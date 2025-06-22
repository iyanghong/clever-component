<template>
  <DemoContainer
    title="表单联动"
    description="展示CleverForm的字段联动功能，包括条件显示、选项联动、值计算等。"
    :code="demoCode"
  >
    <CleverForm
      ref="formRef"
      :schemas="schemas"
      :data="model"
      @submit="handleSubmit"
      @field-change="handleFieldChange"
    />
    
    <template #actions>
      <n-space>
        <n-button type="primary" @click="submitForm">提交表单</n-button>
        <n-button @click="resetForm">重置表单</n-button>
        <n-button @click="triggerLinkage" secondary>触发联动</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="result" type="info">
        <pre>{{ result }}</pre>
      </n-alert>
      
      <n-alert v-if="linkageLog.length > 0" type="success" style="margin-top: 12px;">
        <div>联动日志：</div>
        <div v-for="(log, index) in linkageLog" :key="index" class="linkage-log">
          <n-tag size="small" :type="log.type">{{ log.time }}</n-tag>
          {{ log.message }}
        </div>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { NSpace, NButton, NAlert, NTag } from 'naive-ui'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateFormCode } from '../../utils/demo-utils'

// 表单引用
const formRef = ref()

// 结果显示
const result = ref('')
const linkageLog = ref<Array<{ time: string; message: string; type: string }>>([])

// 表单数据模型
const model = reactive({
  userType: '',
  hasJob: false,
  company: '',
  position: '',
  salary: null,
  province: '',
  city: '',
  district: '',
  productType: '',
  productBrand: '',
  productModel: '',
  quantity: 1,
  unitPrice: 100,
  totalPrice: 100,
  discountType: '',
  discountValue: 0,
  finalPrice: 100
})

// 地区数据
const areaData = {
  '北京': ['朝阳区', '海淀区', '西城区', '东城区'],
  '上海': ['浦东新区', '黄浦区', '静安区', '徐汇区'],
  '广东': ['广州市', '深圳市', '珠海市', '东莞市'],
  '江苏': ['南京市', '苏州市', '无锡市', '常州市']
}

// 产品数据
const productData = {
  '手机': {
    '苹果': ['iPhone 15', 'iPhone 14', 'iPhone 13'],
    '华为': ['Mate 60', 'P60', 'Nova 11'],
    '小米': ['小米14', '小米13', 'Redmi Note 12']
  },
  '电脑': {
    '苹果': ['MacBook Pro', 'MacBook Air', 'iMac'],
    '联想': ['ThinkPad', 'IdeaPad', 'Legion'],
    '戴尔': ['XPS', 'Inspiron', 'Alienware']
  }
}

// 动态计算的选项
const cityOptions = computed(() => {
  if (!model.province) return []
  return (areaData[model.province] || []).map(city => ({ label: city, value: city }))
})

const brandOptions = computed(() => {
  if (!model.productType) return []
  return Object.keys(productData[model.productType] || {}).map(brand => ({ label: brand, value: brand }))
})

const modelOptions = computed(() => {
  if (!model.productType || !model.productBrand) return []
  return (productData[model.productType]?.[model.productBrand] || []).map(model => ({ label: model, value: model }))
})

// 表单字段配置
const schemas = computed<FormFieldSchema[]>(() => [
  {
    field: 'userType',
    label: '用户类型',
    component: 'radio-group',
    required: true,
    componentProps: {
      options: [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'enterprise' }
      ]
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      if (newValue !== oldValue) {
        // 重置工作相关字段
        methods.setFieldValue('hasJob', false)
        methods.setFieldValue('company', '')
        methods.setFieldValue('position', '')
        methods.setFieldValue('salary', '')
        addLinkageLog(`用户类型变更为 "${newValue === 'personal' ? '个人用户' : '企业用户'}"，已重置工作相关字段`, 'warning')
      }
    }
  },
  {
    field: 'hasJob',
    label: '是否有工作',
    component: 'switch',
    ifShow: (formModel: any) => formModel.userType === 'personal', // 条件显示
    componentProps: {
      checkedText: '是',
      uncheckedText: '否'
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      if (!newValue && oldValue) {
        // 清空工作相关字段
        methods.setFieldValue('company', '')
        methods.setFieldValue('position', '')
        methods.setFieldValue('salary', '')
        addLinkageLog('工作状态设为否，已清空工作相关字段', 'info')
      }
    }
  },
  {
    field: 'company',
    label: '公司名称',
    component: 'input',
    ifShow: (formModel: any) => formModel.hasJob && formModel.userType === 'personal', // 多条件显示
    required: true,
    componentProps: {
      placeholder: '请输入公司名称'
    }
  },
  {
    field: 'position',
    label: '职位',
    component: 'input',
    ifShow: (formModel: any) => formModel.hasJob && formModel.userType === 'personal',
    componentProps: {
      placeholder: '请输入职位'
    }
  },
  {
    field: 'salary',
    label: '薪资',
    component: 'input-number',
    ifShow: (formModel: any) => formModel.hasJob && formModel.userType === 'personal',
    componentProps: {
      placeholder: '请输入薪资',
      min: 0,
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
    }
  },
  {
    field: 'province',
    label: '省份',
    component: 'select',
    required: true,
    componentProps: {
      placeholder: '请选择省份',
      options: Object.keys(areaData).map(province => ({ label: province, value: province }))
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      if (newValue !== oldValue) {
        methods.setFieldValue('city', '') // 清空城市选择
        addLinkageLog(`省份变更为 "${newValue}"，已清空城市选择`, 'warning')
      }
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'select',
    required: true,
    ifShow: (formModel: any) => !!formModel.province, // 条件显示
    componentProps: {
      placeholder: '请选择城市',
      options: cityOptions.value
    }
  },
  {
    field: 'productType',
    label: '产品类型',
    component: 'select',
    required: true,
    componentProps: {
      placeholder: '请选择产品类型',
      options: Object.keys(productData).map(type => ({ label: type, value: type }))
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      if (newValue !== oldValue) {
        methods.setFieldValue('productBrand', '')
        methods.setFieldValue('productModel', '')
        addLinkageLog(`产品类型变更为 "${newValue}"，已清空品牌和型号选择`, 'warning')
      }
    }
  },
  {
    field: 'productBrand',
    label: '产品品牌',
    component: 'select',
    required: true,
    ifShow: (formModel: any) => !!formModel.productType,
    componentProps: {
      placeholder: '请选择品牌',
      options: brandOptions.value
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      if (newValue !== oldValue) {
        methods.setFieldValue('productModel', '')
        addLinkageLog(`产品品牌变更为 "${newValue}"，已清空型号选择`, 'warning')
      }
    }
  },
  {
    field: 'productModel',
    label: '产品型号',
    component: 'select',
    required: true,
    ifShow: (formModel: any) => !!formModel.productBrand,
    componentProps: {
      placeholder: '请选择型号',
      options: modelOptions.value
    }
  },
  {
    field: 'quantity',
    label: '数量',
    component: 'input-number',
    required: true,
    componentProps: {
      placeholder: '请输入数量',
      min: 1,
      max: 999
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      const unitPrice = methods.getFieldValue('unitPrice') || 0
      const totalPrice = (newValue || 0) * unitPrice
      methods.setFieldValue('totalPrice', totalPrice)
      addLinkageLog(`总价自动计算：${newValue} × ${unitPrice} = ${totalPrice}`, 'success')
    }
  },
  {
    field: 'unitPrice',
    label: '单价',
    component: 'input-number',
    required: true,
    componentProps: {
      placeholder: '请输入单价',
      min: 0,
      precision: 2,
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      const quantity = methods.getFieldValue('quantity') || 0
      const totalPrice = quantity * (newValue || 0)
      methods.setFieldValue('totalPrice', totalPrice)
      addLinkageLog(`总价自动计算：${quantity} × ${newValue} = ${totalPrice}`, 'success')
    }
  },
  {
    field: 'totalPrice',
    label: '总价',
    component: 'input-number',
    disabled: true, // 计算字段，禁用编辑
    componentProps: {
      placeholder: '自动计算',
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
    }
  },
  {
    field: 'discountType',
    label: '优惠类型',
    component: 'select',
    componentProps: {
      placeholder: '请选择优惠类型',
      options: [
        { label: '无优惠', value: 'none' },
        { label: '固定金额', value: 'fixed' },
        { label: '百分比', value: 'percent' }
      ]
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      if (newValue === 'none') {
        methods.setFieldValue('discountValue', 0)
        addLinkageLog('优惠类型设为无优惠，已清空优惠值', 'info')
      }
    }
  },
  {
    field: 'discountValue',
    label: '优惠值',
    component: 'input-number',
    ifShow: (formModel: any) => formModel.discountType && formModel.discountType !== 'none',
    componentProps: {
      placeholder: '请输入优惠值',
      min: 0,
      precision: 2
    },
    onChange: (newValue: any, oldValue: any, methods: any) => {
      const totalPrice = methods.getFieldValue('totalPrice') || 0
      const discountType = methods.getFieldValue('discountType')
      let finalPrice = totalPrice
      if (discountType === 'fixed') {
        finalPrice = Math.max(0, totalPrice - (newValue || 0))
      } else if (discountType === 'percent') {
        finalPrice = totalPrice * (1 - (newValue || 0) / 100)
      }
      methods.setFieldValue('finalPrice', finalPrice)
      addLinkageLog(`最终价格自动计算：${finalPrice}`, 'success')
    }
  },
  {
    field: 'finalPrice',
    label: '最终价格',
    component: 'input-number',
    disabled: true,
    componentProps: {
      placeholder: '自动计算',
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
    }
  }
])

// 生成演示代码
const demoCode = generateFormCode({
  schemas: schemas.value,
  model,
  title: '表单联动示例',
  description: '展示字段间的各种联动关系'
})

// 添加联动日志
const addLinkageLog = (message: string, type: string = 'info') => {
  const time = new Date().toLocaleTimeString()
  linkageLog.value.unshift({ time, message, type })
  if (linkageLog.value.length > 10) {
    linkageLog.value.pop()
  }
}

// 字段联动现在通过 schema 中的 onChange 和 ifShow 实现
// 不再需要手动 watch 监听

// 事件处理
const handleSubmit = (data: any) => {
  result.value = `表单联动提交成功：\n${JSON.stringify(data, null, 2)}`
}

const handleFieldChange = (field: string, value: any) => {
  addLinkageLog(`字段 "${field}" 值变更为：${JSON.stringify(value)}`, 'info')
}

// 表单操作方法
const submitForm = () => {
  formRef.value?.submit()
}

const resetForm = () => {
  formRef.value?.reset()
  result.value = ''
  linkageLog.value = []
  addLinkageLog('表单已重置', 'info')
}

const triggerLinkage = () => {
  // 模拟触发联动
  model.userType = 'personal'
  setTimeout(() => {
    model.hasJob = true
  }, 500)
  setTimeout(() => {
    model.province = '北京'
  }, 1000)
  setTimeout(() => {
    model.city = '朝阳区'
  }, 1500)
  setTimeout(() => {
    model.productType = '手机'
  }, 2000)
  setTimeout(() => {
    model.productBrand = '苹果'
  }, 2500)
  setTimeout(() => {
    model.quantity = 2
    model.unitPrice = 8999
  }, 3000)
  setTimeout(() => {
    model.discountType = 'percent'
    model.discountValue = 10
  }, 3500)
}
</script>

<style scoped>
pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 200px;
  overflow: auto;
}

.linkage-log {
  margin: 4px 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>