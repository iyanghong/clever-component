<template>
  <div class="advanced-table-demo">
    <DemoContainer
      title="高级表格功能"
      description="演示表格的高级功能，包括固定列、展开行、自定义渲染、虚拟滚动等"
      :show-code="showCode"
      @toggle-code="showCode = !showCode"
    >
      <template #demo>
        <n-space vertical size="large">
          <!-- 功能切换 -->
          <n-card title="功能演示" size="small">
            <n-space>
              <n-button
                v-for="feature in features"
                :key="feature.key"
                :type="currentFeature === feature.key ? 'primary' : 'default'"
                @click="currentFeature = feature.key"
              >
                {{ feature.title }}
              </n-button>
            </n-space>
          </n-card>

          <!-- 当前功能演示 -->
          <n-card :title="currentFeatureConfig.title">
            <template #header-extra>
              <n-space>
                <n-button @click="refreshData" size="small">
                  <template #icon>
                    <n-icon><refresh-outline /></n-icon>
                  </template>
                  刷新
                </n-button>
                <n-button @click="exportData" size="small">
                  <template #icon>
                    <n-icon><download-outline /></n-icon>
                  </template>
                  导出
                </n-button>
              </n-space>
            </template>

            <component :is="'div'" v-if="currentFeature === 'fixed'">
              <CleverTable
                :columns="fixedColumns"
                :data="fixedData"
                :scroll="{ x: 1500 }"
                height="400px"
              />
            </component>

            <component :is="'div'" v-else-if="currentFeature === 'expandable'">
              <CleverTable
                :columns="expandableColumns"
                :data="expandableData"
                :expandable="expandableConfig"
                @expand="handleExpand"
              />
            </component>

            <component :is="'div'" v-else-if="currentFeature === 'custom'">
              <CleverTable :columns="customColumns" :data="customData" />
            </component>

            <component :is="'div'" v-else-if="currentFeature === 'virtual'">
              <CleverTable
                :columns="virtualColumns"
                :data="virtualData"
                :virtual-scroll="true"
                height="400px"
                :row-height="50"
              />
            </component>

            <component :is="'div'" v-else-if="currentFeature === 'tree'">
              <CleverTable
                :columns="treeColumns"
                :data="treeData"
                :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren'
                }"
                row-key="id"
              />
            </component>
          </n-card>
        </n-space>
      </template>

      <template #code>
        <CodeBlock
          :code="currentFeatureConfig.code"
          language="vue"
          :filename="`${currentFeature}-table-demo.vue`"
        />
      </template>

      <template #config>
        <n-descriptions bordered :column="2">
          <n-descriptions-item label="当前功能">
            {{ currentFeatureConfig.title }}
          </n-descriptions-item>
          <n-descriptions-item label="数据量">
            {{ getCurrentDataLength() }} 条
          </n-descriptions-item>
          <n-descriptions-item label="列数">
            {{ getCurrentColumnsLength() }} 列
          </n-descriptions-item>
          <n-descriptions-item label="特殊配置">
            {{ currentFeatureConfig.config }}
          </n-descriptions-item>
        </n-descriptions>
      </template>

      <template #notes>
        <n-alert type="info">
          <ul>
            <li><strong>固定列：</strong>适用于列数较多需要固定重要列的场景</li>
            <li><strong>展开行：</strong>适用于需要显示详细信息的场景</li>
            <li><strong>自定义渲染：</strong>适用于需要复杂展示效果的场景</li>
            <li><strong>虚拟滚动：</strong>适用于大数据量的性能优化</li>
            <li><strong>树形表格：</strong>适用于层级数据的展示</li>
          </ul>
        </n-alert>
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import {
  NSpace,
  NCard,
  NButton,
  NIcon,
  NDescriptions,
  NDescriptionsItem,
  NAlert,
  NAvatar,
  NTag,
  NProgress,
  NRate,
  NPopover,
  NText
} from 'naive-ui'
import {
  RefreshOutline,
  DownloadOutline,
  PersonOutline,
  BusinessOutline,
  LocationOutline
} from '@vicons/ionicons5'
import DemoContainer from '../../components/DemoContainer.vue'
import CodeBlock from '../../components/CodeBlock.vue'
import { CleverTable } from '@clever-component'
import { generateTableData, generateRandomData } from '../../utils/demo-utils'

// 显示代码
const showCode = ref(false)

// 当前功能
const currentFeature = ref('fixed')

// 功能配置
const features = [
  {
    key: 'fixed',
    title: '固定列',
    description: '演示左右固定列功能',
    config: '左固定1列，右固定1列',
    code: `<CleverTable
  :columns="fixedColumns"
  :data="fixedData"
  :scroll="{ x: 1500 }"
  height="400px"
/>`
  },
  {
    key: 'expandable',
    title: '展开行',
    description: '演示行展开功能',
    config: '支持展开显示详细信息',
    code: `<CleverTable
  :columns="expandableColumns"
  :data="expandableData"
  :expandable="expandableConfig"
  @expand="handleExpand"
/>`
  },
  {
    key: 'custom',
    title: '自定义渲染',
    description: '演示自定义单元格渲染',
    config: '头像、进度条、评分、标签等',
    code: `<CleverTable
  :columns="customColumns"
  :data="customData"
/>`
  },
  {
    key: 'virtual',
    title: '虚拟滚动',
    description: '演示大数据量虚拟滚动',
    config: '10000条数据虚拟滚动',
    code: `<CleverTable
  :columns="virtualColumns"
  :data="virtualData"
  :virtual-scroll="true"
  height="400px"
  :row-height="50"
/>`
  },
  {
    key: 'tree',
    title: '树形表格',
    description: '演示树形数据展示',
    config: '支持层级数据展示',
    code: `<CleverTable
  :columns="treeColumns"
  :data="treeData"
  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  row-key="id"
/>`
  }
]

// 当前功能配置
const currentFeatureConfig = computed(() => {
  return (
    features.find(feature => feature.key === currentFeature.value) ||
    features[0]
  )
})

// 固定列表格
const fixedColumns = [
  {
    key: 'name',
    title: '姓名',
    width: 120,
    fixed: 'left'
  },
  {
    key: 'age',
    title: '年龄',
    width: 80
  },
  {
    key: 'address',
    title: '地址',
    width: 200
  },
  {
    key: 'phone',
    title: '电话',
    width: 150
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'company',
    title: '公司',
    width: 150
  },
  {
    key: 'position',
    title: '职位',
    width: 120
  },
  {
    key: 'salary',
    title: '薪资',
    width: 100
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    fixed: 'right'
  }
]

const fixedData = generateTableData(20, {
  name: () => generateRandomData('name'),
  age: () => Math.floor(Math.random() * 40) + 20,
  address: () => generateRandomData('address'),
  phone: () => generateRandomData('phone'),
  email: () => generateRandomData('email'),
  company: () => generateRandomData('company'),
  position: () => generateRandomData('position'),
  salary: () => Math.floor(Math.random() * 20000) + 5000
})

// 展开行表格
const expandableColumns = [
  {
    key: 'name',
    title: '姓名'
  },
  {
    key: 'age',
    title: '年龄'
  },
  {
    key: 'position',
    title: '职位'
  },
  {
    key: 'department',
    title: '部门'
  }
]

const expandableData = generateTableData(10, {
  name: () => generateRandomData('name'),
  age: () => Math.floor(Math.random() * 40) + 20,
  position: () => generateRandomData('position'),
  department: () => generateRandomData('department'),
  details: () => ({
    phone: generateRandomData('phone'),
    email: generateRandomData('email'),
    address: generateRandomData('address'),
    joinDate: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    skills: ['Vue', 'React', 'TypeScript', 'Node.js'].slice(
      0,
      Math.floor(Math.random() * 4) + 1
    )
  })
})

const expandableConfig = {
  render: (row: any) => {
    return h('div', { style: 'padding: 16px; background: #f5f5f5;' }, [
      h('h4', '详细信息'),
      h('p', `电话：${row.details.phone}`),
      h('p', `邮箱：${row.details.email}`),
      h('p', `地址：${row.details.address}`),
      h('p', `入职日期：${row.details.joinDate}`),
      h('p', `技能：${row.details.skills.join(', ')}`)
    ])
  }
}

// 自定义渲染表格
const customColumns = [
  {
    key: 'avatar',
    title: '头像',
    width: 80,
    render: (row: any) => {
      return h(NAvatar, {
        size: 'medium',
        src: row.avatar,
        fallbackSrc: 'https://via.placeholder.com/40x40?text=Avatar'
      })
    }
  },
  {
    key: 'name',
    title: '用户信息',
    render: (row: any) => {
      return h('div', [
        h('div', { style: 'font-weight: bold; margin-bottom: 4px;' }, row.name),
        h('div', { style: 'font-size: 12px; color: #999;' }, row.title)
      ])
    }
  },
  {
    key: 'progress',
    title: '完成度',
    render: (row: any) => {
      return h(NProgress, {
        type: 'line',
        percentage: row.progress,
        status:
          row.progress === 100
            ? 'success'
            : row.progress >= 80
              ? 'info'
              : 'warning',
        showIndicator: false
      })
    }
  },
  {
    key: 'rating',
    title: '评分',
    render: (row: any) => {
      return h(NRate, {
        value: row.rating,
        readonly: true,
        size: 'small'
      })
    }
  },
  {
    key: 'status',
    title: '状态',
    render: (row: any) => {
      const statusMap: Record<string, { type: any; text: string }> = {
        active: { type: 'success', text: '活跃' },
        inactive: { type: 'warning', text: '不活跃' },
        banned: { type: 'error', text: '已禁用' }
      }
      const status = statusMap[row.status]
      return h(NTag, { type: status.type }, () => status.text)
    }
  },
  {
    key: 'tags',
    title: '标签',
    render: (row: any) => {
      return h(NSpace, { size: 'small' }, () =>
        row.tags.map((tag: string) =>
          h(
            NTag,
            {
              size: 'small',
              type: 'info',
              bordered: false
            },
            () => tag
          )
        )
      )
    }
  }
]

const customData = generateTableData(15, {
  avatar: () =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
  name: () => generateRandomData('name'),
  title: () => generateRandomData('position'),
  progress: () => Math.floor(Math.random() * 100),
  rating: () => Math.floor(Math.random() * 5) + 1,
  status: () => ['active', 'inactive', 'banned'][Math.floor(Math.random() * 3)],
  tags: () =>
    ['前端', '后端', '全栈', '移动端', 'DevOps'].slice(
      0,
      Math.floor(Math.random() * 3) + 1
    )
})

// 虚拟滚动表格
const virtualColumns = [
  {
    key: 'id',
    title: 'ID',
    width: 80
  },
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'age',
    title: '年龄',
    width: 80
  },
  {
    key: 'city',
    title: '城市',
    width: 100
  },
  {
    key: 'score',
    title: '分数',
    width: 80
  }
]

const virtualData = generateTableData(10000, {
  name: () => generateRandomData('name'),
  age: () => Math.floor(Math.random() * 60) + 18,
  city: () => generateRandomData('city'),
  score: () => Math.floor(Math.random() * 100)
})

// 树形表格
const treeColumns = [
  {
    key: 'name',
    title: '名称',
    width: 200
  },
  {
    key: 'type',
    title: '类型',
    width: 100
  },
  {
    key: 'size',
    title: '大小',
    width: 100
  },
  {
    key: 'modified',
    title: '修改时间',
    width: 150
  }
]

const treeData = [
  {
    id: 1,
    name: 'src',
    type: '文件夹',
    size: '-',
    modified: '2024-01-15',
    children: [
      {
        id: 11,
        name: 'components',
        type: '文件夹',
        size: '-',
        modified: '2024-01-15',
        children: [
          {
            id: 111,
            name: 'Button.vue',
            type: 'Vue文件',
            size: '2.5KB',
            modified: '2024-01-15'
          },
          {
            id: 112,
            name: 'Input.vue',
            type: 'Vue文件',
            size: '3.2KB',
            modified: '2024-01-14'
          }
        ]
      },
      {
        id: 12,
        name: 'utils',
        type: '文件夹',
        size: '-',
        modified: '2024-01-13',
        children: [
          {
            id: 121,
            name: 'helpers.ts',
            type: 'TypeScript文件',
            size: '1.8KB',
            modified: '2024-01-13'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'package.json',
    type: 'JSON文件',
    size: '1.2KB',
    modified: '2024-01-10'
  }
]

// 事件处理
const handleExpand = (row: any, expanded: boolean) => {
  console.log('展开行:', row, '展开状态:', expanded)
}

const refreshData = () => {
  console.log('刷新数据')
}

const exportData = () => {
  console.log('导出数据')
}

// 获取当前数据长度
const getCurrentDataLength = () => {
  switch (currentFeature.value) {
    case 'fixed':
      return fixedData.length
    case 'expandable':
      return expandableData.length
    case 'custom':
      return customData.length
    case 'virtual':
      return virtualData.length
    case 'tree':
      return treeData.length
    default:
      return 0
  }
}

// 获取当前列数
const getCurrentColumnsLength = () => {
  switch (currentFeature.value) {
    case 'fixed':
      return fixedColumns.length
    case 'expandable':
      return expandableColumns.length
    case 'custom':
      return customColumns.length
    case 'virtual':
      return virtualColumns.length
    case 'tree':
      return treeColumns.length
    default:
      return 0
  }
}
</script>

<style scoped>
.advanced-table-demo {
  width: 100%;
}
</style>
