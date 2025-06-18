export interface CleverPopupProps {
  /** 弹窗标题 */
  title?: string
  /** 弹窗宽度，支持数字（px）或字符串 */
  width?: number | string
  /** 弹窗模式：modal（模态框）或 drawer（抽屉） */
  mode?: 'modal' | 'drawer'
  /** 抽屉位置，仅在 drawer 模式下生效 */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** 其他任意属性 */
  [key: string]: any
}