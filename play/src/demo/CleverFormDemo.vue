<template>
  <div class="clever-form-demo">
    <DemoSection
      title="CleverForm 智能表单"
      description="基于配置的智能表单组件，支持动态表单生成、验证、联动等功能。支持多种布局模式：Grid、Flex、Tabs、Accordion 和混合布局。"
    >
      <!-- 基础用法 -->
      <BasicUsageDemo />
      
      <!-- 表单验证 -->
      <ValidationDemo />
      
      <!-- 动态表单 -->
      <DynamicFormDemo />
      
      <!-- 复杂布局 -->
      <ComplexLayoutDemo />
      
      <!-- 表单联动 -->
      <FormLinkageDemo />
      
      <!-- 自定义组件 -->
      <CustomComponentDemo />
      
      <!-- API 配置 -->
      <ApiConfigDemo />
      
      <!-- Schema 辅助函数 -->
      <SchemaHelpersDemo />
      
      <template #api>
        <FormApiDoc />
      </template>
    </DemoSection>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../components/DemoSection.vue'
import BasicUsageDemo from './form-demos/BasicUsageDemo.vue'
import ValidationDemo from './form-demos/ValidationDemo.vue'
import DynamicFormDemo from './form-demos/DynamicFormDemo.vue'
import ComplexLayoutDemo from './form-demos/ComplexLayoutDemo.vue'
import FormLinkageDemo from './form-demos/FormLinkageDemo.vue'
import CustomComponentDemo from './form-demos/CustomComponentDemo.vue'
import ApiConfigDemo from './form-demos/ApiConfigDemo.vue'
import SchemaHelpersDemo from './form-demos/SchemaHelpersDemo.vue'
import FormApiDoc from './form-demos/FormApiDoc.vue'
</script>

<style scoped>
.clever-form-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .clever-form-demo {
    padding: 16px;
  }
}
</style>