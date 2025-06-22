import { h } from 'vue'

// 信息提示图标
export const InfoIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    },
    [
      h('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z',
        fill: 'currentColor'
      })
    ]
  )

// 展开图标
export const ExpandIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    },
    [
      h('path', {
        d: 'M7 10l5 5 5-5z',
        fill: 'currentColor'
      })
    ]
  )

// 收起图标
export const CollapseIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    },
    [
      h('path', {
        d: 'M7 14l5-5 5 5z',
        fill: 'currentColor'
      })
    ]
  )
