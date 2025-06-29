/**
 * JSON Schema 定义
 * @description 为配置化JSON提供类型提示和验证支持
 */

import type { JSONSchema7 } from 'json-schema'

// 基础组件类型枚举
const FIELD_COMPONENT_TYPES = [
  'input', 'textarea', 'number-input', 'password', 'search',
  'select', 'radio-group', 'checkbox-group', 'cascader', 'transfer', 'tree-select',
  'date-picker', 'time-picker', 'datetime-picker', 'date-range-picker', 'time-range-picker',
  'switch', 'slider', 'rate', 'color-picker', 'upload', 'mention', 'auto-complete',
  'custom'
] as const

// 容器类型枚举
const CONTAINER_TYPES = [
  'grid', 'flex', 'tabs', 'group', 'inline', 'vertical', 'card', 'collapse', 'steps', 'custom'
] as const

// 基础字段配置 Schema
const baseFieldSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    field: {
      type: 'string',
      description: '字段标识，用于数据绑定'
    },
    label: {
      type: 'string',
      description: '字段标签显示文本'
    },
    component: {
      type: 'string',
      enum: FIELD_COMPONENT_TYPES,
      description: '字段组件类型'
    },
    defaultValue: {
      description: '字段默认值'
    },
    placeholder: {
      type: 'string',
      description: '占位符文本'
    },
    help: {
      type: 'string',
      description: '帮助提示文本'
    },
    required: {
      type: 'boolean',
      description: '是否必填',
      default: false
    },
    disabled: {
      oneOf: [
        { type: 'boolean' },
        { type: 'string', description: '条件函数表达式' }
      ],
      description: '是否禁用'
    },
    readonly: {
      oneOf: [
        { type: 'boolean' },
        { type: 'string', description: '条件函数表达式' }
      ],
      description: '是否只读'
    },
    show: {
      oneOf: [
        { type: 'boolean' },
        { type: 'string', description: '条件函数表达式' }
      ],
      description: '是否显示'
    },
    props: {
      type: 'object',
      description: '传递给组件的属性',
      additionalProperties: true
    },
    rules: {
      type: 'array',
      description: '验证规则',
      items: {
        type: 'object',
        properties: {
          required: { type: 'boolean' },
          message: { type: 'string' },
          pattern: { type: 'string' },
          min: { type: 'number' },
          max: { type: 'number' },
          type: { type: 'string', enum: ['string', 'number', 'boolean', 'email', 'url', 'date'] }
        }
      }
    },
    responsive: {
      type: 'object',
      description: '响应式配置',
      properties: {
        xs: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        sm: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        md: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        lg: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        xl: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        xxl: { oneOf: [{ type: 'number' }, { type: 'string' }] }
      }
    }
  },
  required: ['field', 'label', 'component']
}

// 选择类字段特殊配置
const selectFieldSchema: JSONSchema7 = {
  allOf: [
    baseFieldSchema,
    {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          enum: ['select', 'radio-group', 'checkbox-group', 'cascader', 'tree-select']
        },
        options: {
          type: 'array',
          description: '选项列表',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', description: '选项显示文本' },
              value: { description: '选项值' },
              disabled: { type: 'boolean', description: '是否禁用' },
              children: {
                type: 'array',
                description: '子选项（级联选择器）',
                items: { $ref: '#' }
              }
            },
            required: ['label', 'value']
          }
        }
      }
    }
  ]
}

// 基础容器配置 Schema
const baseContainerSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: CONTAINER_TYPES,
      description: '容器类型'
    },
    title: {
      type: 'string',
      description: '容器标题'
    },
    description: {
      type: 'string',
      description: '容器描述'
    },
    show: {
      oneOf: [
        { type: 'boolean' },
        { type: 'string', description: '条件函数表达式' }
      ],
      description: '是否显示'
    },
    props: {
      type: 'object',
      description: '容器属性',
      additionalProperties: true
    },
    children: {
      type: 'array',
      description: '子项配置',
      items: {
        oneOf: [
          { $ref: '#/definitions/fieldConfig' },
          { $ref: '#/definitions/containerConfig' }
        ]
      }
    }
  },
  required: ['type', 'children']
}

// 网格布局容器 Schema
const gridContainerSchema: JSONSchema7 = {
  allOf: [
    baseContainerSchema,
    {
      type: 'object',
      properties: {
        type: { const: 'grid' },
        props: {
          type: 'object',
          properties: {
            cols: {
              oneOf: [
                { type: 'number', minimum: 1, maximum: 24 },
                { $ref: '#/definitions/responsiveConfig' }
              ],
              description: '列数配置',
              default: 1
            },
            rowGap: {
              oneOf: [{ type: 'number' }, { type: 'string' }],
              description: '行间距'
            },
            colGap: {
              oneOf: [{ type: 'number' }, { type: 'string' }],
              description: '列间距'
            },
            itemProps: {
              type: 'object',
              description: '网格项属性',
              properties: {
                span: {
                  oneOf: [
                    { type: 'number', minimum: 1, maximum: 24 },
                    { $ref: '#/definitions/responsiveConfig' }
                  ],
                  description: '跨列数'
                },
                offset: {
                  oneOf: [
                    { type: 'number', minimum: 0, maximum: 23 },
                    { $ref: '#/definitions/responsiveConfig' }
                  ],
                  description: '列偏移'
                },
                align: {
                  type: 'string',
                  enum: ['start', 'center', 'end', 'stretch'],
                  description: '对齐方式'
                }
              }
            }
          }
        }
      }
    }
  ]
}

// 弹性布局容器 Schema
const flexContainerSchema: JSONSchema7 = {
  allOf: [
    baseContainerSchema,
    {
      type: 'object',
      properties: {
        type: { const: 'flex' },
        props: {
          type: 'object',
          properties: {
            direction: {
              type: 'string',
              enum: ['row', 'column', 'row-reverse', 'column-reverse'],
              description: '主轴方向',
              default: 'row'
            },
            justify: {
              type: 'string',
              enum: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
              description: '主轴对齐',
              default: 'flex-start'
            },
            align: {
              type: 'string',
              enum: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
              description: '交叉轴对齐',
              default: 'stretch'
            },
            wrap: {
              type: 'string',
              enum: ['nowrap', 'wrap', 'wrap-reverse'],
              description: '换行方式',
              default: 'nowrap'
            },
            gap: {
              oneOf: [{ type: 'number' }, { type: 'string' }],
              description: '间距'
            }
          }
        }
      }
    }
  ]
}

// 标签页容器 Schema
const tabsContainerSchema: JSONSchema7 = {
  allOf: [
    baseContainerSchema,
    {
      type: 'object',
      properties: {
        type: { const: 'tabs' },
        props: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['line', 'card', 'bar', 'segment'],
              description: '标签页类型',
              default: 'line'
            },
            placement: {
              type: 'string',
              enum: ['top', 'right', 'bottom', 'left'],
              description: '标签页位置',
              default: 'top'
            },
            tabs: {
              type: 'array',
              description: '标签页配置',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string', description: '标签页键值' },
                  label: { type: 'string', description: '标签页标题' },
                  disabled: { type: 'boolean', description: '是否禁用' },
                  children: {
                    type: 'array',
                    description: '标签页内容',
                    items: {
                      oneOf: [
                        { $ref: '#/definitions/fieldConfig' },
                        { $ref: '#/definitions/containerConfig' }
                      ]
                    }
                  }
                },
                required: ['key', 'label', 'children']
              }
            }
          },
          required: ['tabs']
        }
      }
    }
  ]
}

// 完整的表单配置 Schema
export const formConfigSchema: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'CleverForm Configuration Schema',
  description: 'CleverForm 组件的配置化 JSON Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: '表单唯一标识'
    },
    title: {
      type: 'string',
      description: '表单标题'
    },
    description: {
      type: 'string',
      description: '表单描述'
    },
    mode: {
      type: 'string',
      enum: ['create', 'edit', 'view', 'search'],
      description: '表单模式',
      default: 'create'
    },
    layout: {
      $ref: '#/definitions/containerConfig',
      description: '表单布局配置'
    },
    options: {
      type: 'object',
      description: '表单选项',
      properties: {
        size: {
          type: 'string',
          enum: ['small', 'medium', 'large'],
          description: '表单大小',
          default: 'medium'
        },
        labelPlacement: {
          type: 'string',
          enum: ['left', 'top'],
          description: '标签位置',
          default: 'top'
        },
        labelWidth: {
          oneOf: [{ type: 'number' }, { type: 'string' }],
          description: '标签宽度'
        },
        showRequiredMark: {
          type: 'boolean',
          description: '是否显示必填星号',
          default: true
        },
        disabled: {
          type: 'boolean',
          description: '是否禁用整个表单',
          default: false
        },
        readonly: {
          type: 'boolean',
          description: '是否只读',
          default: false
        }
      }
    }
  },
  required: ['layout'],
  definitions: {
    responsiveConfig: {
      type: 'object',
      properties: {
        xs: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        sm: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        md: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        lg: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        xl: { oneOf: [{ type: 'number' }, { type: 'string' }] },
        xxl: { oneOf: [{ type: 'number' }, { type: 'string' }] }
      }
    },
    fieldConfig: {
      oneOf: [
        baseFieldSchema,
        selectFieldSchema
      ]
    },
    containerConfig: {
      oneOf: [
        gridContainerSchema,
        flexContainerSchema,
        tabsContainerSchema,
        baseContainerSchema
      ]
    }
  }
}

// 导出类型定义
export type FormConfigSchema = typeof formConfigSchema