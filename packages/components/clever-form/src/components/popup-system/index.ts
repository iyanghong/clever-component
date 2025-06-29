/**
 * 弹窗系统组件统一导出
 */

// 组件导出
export { default as PopupRenderer } from './PopupRenderer.vue'
export { default as ModalPopup } from './ModalPopup.vue'
export { default as DrawerPopup } from './DrawerPopup.vue'
export { default as DialogPopup } from './DialogPopup.vue'
export { default as PopconfirmPopup } from './PopconfirmPopup.vue'
export { default as PopoverPopup } from './PopoverPopup.vue'

// 类型导出

// 弹窗组件映射
export const POPUP_COMPONENT_MAP = {
  modal: 'ModalPopup',
  drawer: 'DrawerPopup',
  dialog: 'DialogPopup',
  popconfirm: 'PopconfirmPopup',
  popover: 'PopoverPopup'
} as const

// 弹窗组件类型
export type PopupComponentType = keyof typeof POPUP_COMPONENT_MAP
export type PopupComponentName =
  (typeof POPUP_COMPONENT_MAP)[PopupComponentType]
