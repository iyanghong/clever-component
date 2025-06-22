<template>
  <div class="form-api-doc">
    <h3>CleverForm API 文档</h3>
    
    <div class="api-sections">
      <!-- Props -->
      <section class="api-section">
        <h4>Props</h4>
        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>属性名</th>
                <th>类型</th>
                <th>默认值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td><code>{{ prop.name }}</code></td>
                <td><code>{{ prop.type }}</code></td>
                <td><code>{{ prop.default }}</code></td>
                <td>{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- Events -->
      <section class="api-section">
        <h4>Events</h4>
        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>事件名</th>
                <th>参数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.name">
                <td><code>{{ event.name }}</code></td>
                <td><code>{{ event.params }}</code></td>
                <td>{{ event.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- Methods -->
      <section class="api-section">
        <h4>Methods</h4>
        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>方法名</th>
                <th>参数</th>
                <th>返回值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="method in methods" :key="method.name">
                <td><code>{{ method.name }}</code></td>
                <td><code>{{ method.params }}</code></td>
                <td><code>{{ method.returns }}</code></td>
                <td>{{ method.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- Schema 配置 -->
      <section class="api-section">
        <h4>Schema 配置</h4>
        <div class="schema-docs">
          <h5>FormSchema 接口</h5>
          <div class="code-block">
            <pre><code>{{ schemaInterface }}</code></pre>
          </div>
          
          <h5>FieldSchema 接口</h5>
          <div class="code-block">
            <pre><code>{{ fieldInterface }}</code></pre>
          </div>
          
          <h5>Layout 配置</h5>
          <div class="code-block">
            <pre><code>{{ layoutInterface }}</code></pre>
          </div>
        </div>
      </section>
      
      <!-- 内置组件 -->
      <section class="api-section">
        <h4>内置组件</h4>
        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>组件名</th>
                <th>说明</th>
                <th>Props</th>
                <th>示例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="component in components" :key="component.name">
                <td><code>{{ component.name }}</code></td>
                <td>{{ component.description }}</td>
                <td><code>{{ component.props }}</code></td>
                <td><code>{{ component.example }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- 验证规则 -->
      <section class="api-section">
        <h4>验证规则</h4>
        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>规则类型</th>
                <th>配置</th>
                <th>说明</th>
                <th>示例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in validationRules" :key="rule.type">
                <td><code>{{ rule.type }}</code></td>
                <td><code>{{ rule.config }}</code></td>
                <td>{{ rule.description }}</td>
                <td><code>{{ rule.example }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props 文档
const props = [
  {
    name: 'modelValue',
    type: 'Record<string, any>',
    default: '{}',
    description: '表单数据，支持 v-model 双向绑定'
  },
  {
    name: 'schema',
    type: 'FormSchema',
    default: '-',
    description: '表单配置 Schema，定义表单结构和字段'
  },
  {
    name: 'layout',
    type: 'LayoutConfig',
    default: '{ type: "flex", direction: "column" }',
    description: '表单布局配置，支持 grid、flex、tabs、accordion'
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: '表单加载状态'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: '是否禁用整个表单'
  },
  {
    name: 'readonly',
    type: 'boolean',
    default: 'false',
    description: '是否只读模式'
  },
  {
    name: 'validateOnChange',
    type: 'boolean',
    default: 'true',
    description: '是否在字段值改变时触发验证'
  },
  {
    name: 'showValidateMessage',
    type: 'boolean',
    default: 'true',
    description: '是否显示验证错误信息'
  }
]

// Events 文档
const events = [
  {
    name: 'update:modelValue',
    params: 'value: Record<string, any>',
    description: '表单数据更新时触发'
  },
  {
    name: 'submit',
    params: 'data: Record<string, any>',
    description: '表单提交时触发'
  },
  {
    name: 'validate',
    params: 'valid: boolean, errors: ValidationError[]',
    description: '表单验证时触发'
  },
  {
    name: 'field-change',
    params: 'fieldName: string, value: any, formData: Record<string, any>',
    description: '字段值改变时触发'
  },
  {
    name: 'field-focus',
    params: 'fieldName: string',
    description: '字段获得焦点时触发'
  },
  {
    name: 'field-blur',
    params: 'fieldName: string',
    description: '字段失去焦点时触发'
  }
]

// Methods 文档
const methods = [
  {
    name: 'validate',
    params: '(fieldNames?: string[])',
    returns: 'Promise<boolean>',
    description: '验证表单，可指定验证特定字段'
  },
  {
    name: 'validateField',
    params: '(fieldName: string)',
    returns: 'Promise<boolean>',
    description: '验证指定字段'
  },
  {
    name: 'clearValidation',
    params: '(fieldNames?: string[])',
    returns: 'void',
    description: '清除验证状态，可指定清除特定字段'
  },
  {
    name: 'resetFields',
    params: '(fieldNames?: string[])',
    returns: 'void',
    description: '重置字段值，可指定重置特定字段'
  },
  {
    name: 'setFieldValue',
    params: '(fieldName: string, value: any)',
    returns: 'void',
    description: '设置指定字段的值'
  },
  {
    name: 'getFieldValue',
    params: '(fieldName: string)',
    returns: 'any',
    description: '获取指定字段的值'
  },
  {
    name: 'submit',
    params: '()',
    returns: 'Promise<void>',
    description: '提交表单'
  }
]

// 内置组件文档
const components = [
  {
    name: 'input',
    description: '输入框',
    props: 'placeholder, type, maxlength, disabled, readonly',
    example: '{ component: "input", props: { placeholder: "请输入" } }'
  },
  {
    name: 'textarea',
    description: '多行文本框',
    props: 'placeholder, rows, maxlength, disabled, readonly',
    example: '{ component: "textarea", props: { rows: 4 } }'
  },
  {
    name: 'input-number',
    description: '数字输入框',
    props: 'min, max, step, precision, disabled',
    example: '{ component: "input-number", props: { min: 0, max: 100 } }'
  },
  {
    name: 'select',
    description: '选择器',
    props: 'options, multiple, filterable, placeholder',
    example: '{ component: "select", props: { options: [...] } }'
  },
  {
    name: 'radio-group',
    description: '单选框组',
    props: 'options, disabled',
    example: '{ component: "radio-group", props: { options: [...] } }'
  },
  {
    name: 'checkbox-group',
    description: '复选框组',
    props: 'options, disabled',
    example: '{ component: "checkbox-group", props: { options: [...] } }'
  },
  {
    name: 'switch',
    description: '开关',
    props: 'checkedChildren, unCheckedChildren, disabled',
    example: '{ component: "switch", props: { checkedChildren: "是" } }'
  },
  {
    name: 'date-picker',
    description: '日期选择器',
    props: 'format, placeholder, disabled',
    example: '{ component: "date-picker", props: { format: "YYYY-MM-DD" } }'
  },
  {
    name: 'date-time-picker',
    description: '日期时间选择器',
    props: 'format, placeholder, disabled',
    example: '{ component: "date-time-picker", props: { format: "YYYY-MM-DD HH:mm:ss" } }'
  },
  {
    name: 'upload',
    description: '文件上传',
    props: 'action, accept, multiple, maxCount',
    example: '{ component: "upload", props: { action: "/api/upload" } }'
  }
]

// 验证规则文档
const validationRules = [
  {
    type: 'required',
    config: 'required: boolean, message?: string',
    description: '必填验证',
    example: '{ required: true, message: "此字段为必填项" }'
  },
  {
    type: 'type',
    config: 'type: string, message?: string',
    description: '类型验证',
    example: '{ type: "email", message: "请输入有效邮箱" }'
  },
  {
    type: 'pattern',
    config: 'pattern: RegExp, message?: string',
    description: '正则验证',
    example: '{ pattern: /^1[3-9]\\d{9}$/, message: "手机号格式错误" }'
  },
  {
    type: 'min/max',
    config: 'min?: number, max?: number, message?: string',
    description: '长度验证',
    example: '{ min: 6, max: 20, message: "长度为6-20个字符" }'
  },
  {
    type: 'validator',
    config: 'validator: Function, message?: string',
    description: '自定义验证',
    example: '{ validator: (value) => value > 0, message: "必须大于0" }'
  },
  {
    type: 'asyncValidator',
    config: 'asyncValidator: Function, message?: string',
    description: '异步验证',
    example: '{ asyncValidator: async (value) => { ... }, message: "验证失败" }'
  }
]

// Schema 接口定义
const schemaInterface = `interface FormSchema {
  title?: string
  description?: string
  layout?: LayoutConfig
  fields: FieldSchema[]
  submitText?: string
  resetText?: string
  showSubmit?: boolean
  showReset?: boolean
}`

const fieldInterface = `interface FieldSchema {
  name: string
  label?: string
  component: string | Component
  props?: Record<string, any>
  rules?: ValidationRule[]
  dependencies?: string[]
  visible?: (values: Record<string, any>) => boolean
  disabled?: boolean | ((values: Record<string, any>) => boolean)
  readonly?: boolean | ((values: Record<string, any>) => boolean)
  span?: number
  offset?: number
  children?: FieldSchema[]
  layout?: LayoutConfig
}`

const layoutInterface = `type LayoutConfig = 
  | { type: 'grid'; columns?: number; gap?: number }
  | { type: 'flex'; direction?: 'row' | 'column'; gap?: number; wrap?: boolean }
  | { type: 'tabs'; tabPosition?: 'top' | 'bottom' | 'left' | 'right' }
  | { type: 'accordion'; ghost?: boolean; bordered?: boolean }`
</script>

<style scoped>
.form-api-doc {
  padding: 20px;
  max-width: 1200px;
}

.api-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.api-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.api-section h4 {
  margin: 0;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.api-section h5 {
  margin: 20px 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.api-table {
  overflow-x: auto;
}

.api-table table {
  width: 100%;
  border-collapse: collapse;
}

.api-table th,
.api-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.api-table th {
  background: #f8f8f8;
  font-weight: 600;
  color: #333;
}

.api-table td {
  color: #666;
}

.api-table code {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #d63384;
}

.schema-docs {
  padding: 20px;
}

.code-block {
  margin: 12px 0;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #333;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .form-api-doc {
    padding: 16px;
  }
  
  .api-table {
    font-size: 14px;
  }
  
  .api-table th,
  .api-table td {
    padding: 8px 12px;
  }
}
</style>