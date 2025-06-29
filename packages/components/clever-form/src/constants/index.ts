/**
 * 常量定义
 * @description 定义表单组件中使用的各种常量
 */

// 组件名称常量
export const COMPONENT_NAMES = {
  // 核心组件
  CLEVER_FORM: 'CleverForm',
  CLEVER_FORM_ITEM: 'CleverFormItem',
  FORM_ENGINE: 'FormEngine',
  FIELD_RENDERER: 'FieldRenderer',
  CONTAINER_RENDERER: 'ContainerRenderer',
  VALIDATION_ENGINE: 'ValidationEngine',
  API_MANAGER: 'ApiManager',
  POPUP_MANAGER: 'PopupManager',
  EVENT_BUS: 'EventBus',
  
  // 字段组件
  INPUT_FIELD: 'InputField',
  TEXTAREA_FIELD: 'TextareaField',
  NUMBER_FIELD: 'NumberField',
  SELECT_FIELD: 'SelectField',
  RADIO_FIELD: 'RadioField',
  CHECKBOX_FIELD: 'CheckboxField',
  SWITCH_FIELD: 'SwitchField',
  DATE_FIELD: 'DateField',
  TIME_FIELD: 'TimeField',
  UPLOAD_FIELD: 'UploadField',
  
  // 容器组件
  GRID_CONTAINER: 'GridContainer',
  FLEX_CONTAINER: 'FlexContainer',
  TABS_CONTAINER: 'TabsContainer',
  COLLAPSE_CONTAINER: 'CollapseContainer',
  
  // 弹窗组件
  POPUP_RENDERER: 'PopupRenderer',
  MODAL_POPUP: 'ModalPopup',
  DRAWER_POPUP: 'DrawerPopup',
  DIALOG_POPUP: 'DialogPopup',
  POPCONFIRM_POPUP: 'PopconfirmPopup',
  POPOVER_POPUP: 'PopoverPopup'
} as const

// 字段类型常量
export const FIELD_TYPES = {
  // 输入类型
  INPUT: 'input',
  TEXTAREA: 'textarea',
  PASSWORD: 'password',
  NUMBER: 'number',
  
  // 选择类型
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SWITCH: 'switch',
  
  // 日期时间类型
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  DATE_RANGE: 'dateRange',
  TIME_RANGE: 'timeRange',
  DATETIME_RANGE: 'datetimeRange',
  
  // 高级类型
  SLIDER: 'slider',
  RATE: 'rate',
  COLOR: 'color',
  UPLOAD: 'upload',
  CASCADER: 'cascader',
  TREE_SELECT: 'treeSelect',
  TRANSFER: 'transfer',
  
  // 自定义类型
  CUSTOM: 'custom'
} as const

// 容器类型常量
export const CONTAINER_TYPES = {
  GRID: 'grid',
  FLEX: 'flex',
  TABS: 'tabs',
  GROUP: 'group',
  INLINE: 'inline',
  VERTICAL: 'vertical',
  CARD: 'card',
  COLLAPSE: 'collapse',
  STEPS: 'steps',
  CUSTOM: 'custom'
} as const

// 表单模式常量
export const FORM_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
  SEARCH: 'search'
} as const

// 表单状态常量
export const FORM_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUBMITTING: 'submitting',
  VALIDATING: 'validating',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

// 验证触发时机常量
export const VALIDATION_TRIGGERS = {
  BLUR: 'blur',
  CHANGE: 'change',
  INPUT: 'input',
  FOCUS: 'focus',
  SUBMIT: 'submit',
  MANUAL: 'manual'
} as const

// 验证状态常量
export const VALIDATION_STATUS = {
  VALIDATING: 'validating',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
} as const

// 验证级别常量
export const VALIDATION_LEVELS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const

// API操作类型常量
export const API_OPERATION_TYPES = {
  LOAD: 'load',
  SUBMIT: 'submit',
  VALIDATE: 'validate',
  SEARCH: 'search',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  CUSTOM: 'custom'
} as const

// HTTP方法常量
export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
} as const

// API状态常量
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  TIMEOUT: 'timeout',
  CANCELLED: 'cancelled'
} as const

// 弹窗类型常量
export const POPUP_TYPES = {
  MODAL: 'modal',
  DRAWER: 'drawer'
} as const

// 弹窗模式常量
export const POPUP_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
  CONFIRM: 'confirm'
} as const

// 弹窗状态常量
export const POPUP_STATUS = {
  CLOSED: 'closed',
  OPENING: 'opening',
  OPENED: 'opened',
  CLOSING: 'closing',
  LOADING: 'loading',
  SUBMITTING: 'submitting'
} as const

// 弹窗位置常量
export const POPUP_PLACEMENTS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  CENTER: 'center'
} as const

// 事件优先级常量
export const EVENT_PRIORITIES = {
  HIGHEST: 'highest',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
  LOWEST: 'lowest'
} as const

// 事件状态常量
export const EVENT_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ERROR: 'error'
} as const

// 尺寸常量
export const SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const

// 对齐方式常量
export const ALIGNMENTS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  START: 'start',
  END: 'end',
  STRETCH: 'stretch',
  BASELINE: 'baseline'
} as const

// 方向常量
export const DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  ROW: 'row',
  COLUMN: 'column'
} as const

// 响应式断点常量
export const BREAKPOINTS = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl'
} as const

// 默认配置常量
export const DEFAULT_CONFIG = {
  // 表单默认配置
  FORM: {
    SIZE: SIZES.MEDIUM,
    LABEL_PLACEMENT: 'left',
    LABEL_WIDTH: 'auto',
    LABEL_ALIGN: ALIGNMENTS.LEFT,
    SHOW_LABEL: true,
    SHOW_REQUIRED_MARK: true,
    SHOW_FEEDBACK: true,
    INLINE: false,
    DISABLED: false,
    READONLY: false,
    AUTO_FOCUS: false,
    VALIDATE_ON_SUBMIT: true,
    CLEAR_VALIDATION_ON_RESET: true
  },
  
  // 验证默认配置
  VALIDATION: {
    DEFAULT_TRIGGER: VALIDATION_TRIGGERS.BLUR,
    VALIDATE_DELAY: 300,
    STOP_ON_FIRST_ERROR: false,
    SHOW_ALL_ERRORS: true,
    MESSAGE_POSITION: 'bottom'
  },
  
  // API默认配置
  API: {
    TIMEOUT: 10000,
    RETRIES: 3,
    RETRY_DELAY: 1000,
    CACHE: false,
    CACHE_TIME: 300000
  },
  
  // 弹窗默认配置
  POPUP: {
    TYPE: POPUP_TYPES.MODAL,
    SIZE: SIZES.MEDIUM,
    CLOSABLE: true,
    MASK: true,
    MASK_CLOSABLE: true,
    ESC_CLOSABLE: true,
    AUTO_FOCUS: true,
    DESTROY_ON_CLOSE: false
  },
  
  // 事件默认配置
  EVENT: {
    MAX_LISTENERS: 100,
    DEBUG: false,
    HISTORY_SIZE: 1000,
    PERFORMANCE: false,
    DEFAULT_PRIORITY: EVENT_PRIORITIES.NORMAL,
    ERROR_HANDLING: 'log',
    ASYNC_TIMEOUT: 5000
  }
} as const

// 错误代码常量
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_CONFIG: 'INVALID_CONFIG',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  
  // 表单错误
  FORM_NOT_FOUND: 'FORM_NOT_FOUND',
  FORM_INVALID: 'FORM_INVALID',
  FORM_SUBMIT_FAILED: 'FORM_SUBMIT_FAILED',
  
  // 字段错误
  FIELD_NOT_FOUND: 'FIELD_NOT_FOUND',
  FIELD_INVALID: 'FIELD_INVALID',
  FIELD_REQUIRED: 'FIELD_REQUIRED',
  
  // 验证错误
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  VALIDATION_RULE_INVALID: 'VALIDATION_RULE_INVALID',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // API错误
  API_REQUEST_FAILED: 'API_REQUEST_FAILED',
  API_TIMEOUT: 'API_TIMEOUT',
  API_CANCELLED: 'API_CANCELLED',
  API_CONFIG_INVALID: 'API_CONFIG_INVALID',
  API_ERROR: 'API_ERROR',
  
  // 弹窗错误
  POPUP_OPEN_FAILED: 'POPUP_OPEN_FAILED',
  POPUP_CLOSE_FAILED: 'POPUP_CLOSE_FAILED',
  POPUP_ERROR: 'POPUP_ERROR',
  
  // 引擎错误
  ENGINE_ERROR: 'ENGINE_ERROR',
  
  // 事件错误
  EVENT_HANDLER_ERROR: 'EVENT_HANDLER_ERROR',
  EVENT_LISTENER_ERROR: 'EVENT_LISTENER_ERROR'
} as const

// 错误消息常量
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNKNOWN_ERROR]: '未知错误',
  [ERROR_CODES.INVALID_CONFIG]: '配置无效',
  [ERROR_CODES.INVALID_PARAMETER]: '参数无效',
  [ERROR_CODES.FORM_NOT_FOUND]: '表单未找到',
  [ERROR_CODES.FORM_INVALID]: '表单无效',
  [ERROR_CODES.FORM_SUBMIT_FAILED]: '表单提交失败',
  [ERROR_CODES.FIELD_NOT_FOUND]: '字段未找到',
  [ERROR_CODES.FIELD_INVALID]: '字段无效',
  [ERROR_CODES.FIELD_REQUIRED]: '字段必填',
  [ERROR_CODES.VALIDATION_FAILED]: '验证失败',
  [ERROR_CODES.VALIDATION_RULE_INVALID]: '验证规则无效',
  [ERROR_CODES.VALIDATION_ERROR]: '验证错误',
  [ERROR_CODES.API_REQUEST_FAILED]: 'API请求失败',
  [ERROR_CODES.API_TIMEOUT]: 'API请求超时',
  [ERROR_CODES.API_CANCELLED]: 'API请求已取消',
  [ERROR_CODES.API_CONFIG_INVALID]: 'API配置无效',
  [ERROR_CODES.API_ERROR]: 'API错误',
  [ERROR_CODES.POPUP_OPEN_FAILED]: '弹窗打开失败',
  [ERROR_CODES.POPUP_CLOSE_FAILED]: '弹窗关闭失败',
  [ERROR_CODES.POPUP_ERROR]: '弹窗错误',
  [ERROR_CODES.ENGINE_ERROR]: '引擎错误',
  [ERROR_CODES.EVENT_HANDLER_ERROR]: '事件处理器错误',
  [ERROR_CODES.EVENT_LISTENER_ERROR]: '事件监听器错误'
} as const

// 正则表达式常量
export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^1[3-9]\d{9}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  CHINESE: /^[\u4e00-\u9fa5]+$/,
  NUMBER: /^-?\d+(\.\d+)?$/,
  INTEGER: /^-?\d+$/,
  POSITIVE_NUMBER: /^\d+(\.\d+)?$/,
  POSITIVE_INTEGER: /^\d+$/
} as const

// 键盘按键常量
export const KEY_CODES = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: 'Space',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete'
} as const

// CSS类名前缀
export const CSS_PREFIX = 'clever-form'

// 组件版本
export const VERSION = '1.0.0'