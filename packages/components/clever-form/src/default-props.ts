import type { PropType } from 'vue'
import type { LabelPlacement } from 'naive-ui/es/form/src/interface'
import type { GridProps } from 'naive-ui/es/grid/src/Grid'
import type { GridItemProps } from 'naive-ui/lib/grid'
import type { CleverPopupProps } from '@/components/clever-popup/types'
import type { FormSchema } from '@/components/clever-form/src/types/form'

export default {
  isPopup: {
    type: Boolean,
    required: false,
    default: () => false
  },
  popupMode: {
    type: String as PropType<'modal' | 'drawer'>,
    required: false,
    default: () => 'modal'
  },
  popupVisible: {
    type: Boolean,
    required: false,
    default: () => false
  },
  popupOption: {
    type: Object as PropType<CleverPopupProps>,
    required: false,
    default: () => ({})
  },
  data: {
    type: Object,
    required: false,
    default: () => ({})
  },
  labelWidth: {
    type: [Number, String],
    required: false,
    default: () => '80px'
  },
  schemas: {
    type: Array as PropType<FormSchema[]>,
    required: true,
    default: () => []
  },
  layout: {
    type: String,
    required: false,
    default: () => 'inline'
  },
  inline: {
    type: Boolean,
    required: false,
    default: () => false
  },
  size: {
    type: String,
    required: false,
    default: () => 'medium'
  },
  labelPlacement: {
    type: String as PropType<LabelPlacement | undefined>,
    required: false,
    default: () => 'left'
  },
  isFull: {
    type: Boolean,
    required: false,
    default: () => true
  },
  showActionButtonGroup: {
    type: Boolean,
    required: false,
    default: () => true
  },
  showResetButton: {
    type: Boolean,
    required: false,
    default: () => true
  },
  showSubmitButton: {
    type: Boolean,
    required: false,
    default: () => true
  },
  showAdvancedButton: {
    type: Boolean,
    required: false,
    default: () => false
  },
  submitButtonText: {
    type: String,
    required: false,
    default: () => '确认'
  },
  resetButtonText: {
    type: String,
    required: false,
    default: () => '重置'
  },
  gridProps: {
    type: Object as PropType<GridProps>,
    required: false,
    default: () => ({ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' })
  },
  collapsedRows: {
    type: Number,
    required: false,
    default: () => 1
  },
  giProps: {
    type: Object as PropType<GridItemProps>,
    required: false,
    default: () => ({})
  },
  resetFunc: {
    type: Function,
    required: false
  },
  submitFunc: {
    type: Function,
    required: false
  },
  submitOnReset: {
    type: Boolean,
    required: false,
    default: () => false
  },
  layoutMode: {
    type: String as PropType<'grid' | 'flex' | 'tabs' | 'accordion'>,
    required: false,
    default: () => 'grid'
  },
  layoutConfig: {
    type: Object,
    required: false,
    default: () => ({
      grid: {
        cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
        xGap: 16,
        yGap: 16,
        responsive: true
      }
    })
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
}
