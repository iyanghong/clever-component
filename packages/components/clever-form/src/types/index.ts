export type ComponentType =
  | 'NInput'
  | 'NInputGroup'
  | 'NInputPassword'
  | 'NInputSearch'
  | 'NInputTextArea'
  | 'NInputNumber'
  | 'NInputCountDown'
  | 'NSelect'
  | 'NTreeSelect'
  | 'NRadioButtonGroup'
  | 'NRadioGroup'
  | 'NCheckbox'
  | 'NCheckboxGroup'
  | 'NAutoComplete'
  | 'NCascader'
  | 'NDatePicker'
  | 'NMonthPicker'
  | 'NRangePicker'
  | 'NWeekPicker'
  | 'NTimePicker'
  | 'NSwitch'
  | 'NStrengthMeter'
  | 'NUpload'
  | 'NIconPicker'
  | 'NRender'
  | 'NSlider'
  | 'NRate'
  | 'NDynamicTags'
  | 'SelectIcon'
  | 'UploadAvatar'
  | 'UploadImage'

export * from './form'
export type {
  CleverFormMethods,
  FormSchema,
  FormFieldSchema,
  FormGroupSchema,
  CleverFormProps,
  FormActionType,
  RegisterFn,
  UseFormReturnType,
  FormApiConfig
} from './form'