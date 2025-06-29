/**
 * API相关类型定义
 * @description 定义表单API集成的所有相关类型
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { FormData } from './form'

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
export type ApiMethods = HttpMethod
// API操作类型
export type ApiOperationType = 'load' | 'submit' | 'validate' | 'search' | 'upload' | 'download' | 'custom'

// 请求数据类型
export type RequestDataType = 'json' | 'form' | 'formData' | 'text' | 'blob' | 'arrayBuffer'

// 响应数据类型
export type ResponseDataType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream'

// API状态
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'timeout' | 'cancelled'

// 基础API配置
export interface BaseApiConfig {
  // API标识
  id?: string
  // API名称
  name?: string
  // 请求URL
  url: string
  // HTTP方法
  method?: HttpMethod
  // 请求头
  headers?: Record<string, string>
  // 请求参数
  params?: Record<string, any>
  // 请求数据
  data?: any
  // 请求数据类型
  dataType?: RequestDataType
  // 响应数据类型
  responseType?: ResponseDataType
  // 超时时间（毫秒）
  timeout?: number
  // 重试次数
  retries?: number
  // 重试延迟（毫秒）
  retryDelay?: number
  // 是否缓存
  cache?: boolean
  // 缓存时间（毫秒）
  cacheTime?: number
  // 请求拦截器
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  // 响应拦截器
  responseInterceptor?: (response: AxiosResponse) => any | Promise<any>
  // 错误处理器
  errorHandler?: (error: any) => any | Promise<any>
  // 条件执行
  condition?: (formData: FormData) => boolean
  // 依赖字段
  dependencies?: string[]
}

// 加载API配置
export interface LoadApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'load'
  // 数据映射函数
  dataMapper?: (response: any) => FormData
  // 默认数据
  defaultData?: FormData
  // 是否自动加载
  autoLoad?: boolean
  // 加载触发条件
  loadTrigger?: 'init' | 'manual' | 'dependency'
}

// 提交API配置
export interface SubmitApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'submit'
  // 数据预处理函数
  dataPreprocessor?: (formData: FormData) => any
  // 响应处理函数
  responseHandler?: (response: any) => any
  // 提交前验证
  validateBeforeSubmit?: boolean
  // 提交成功后的操作
  onSuccess?: 'reload' | 'redirect' | 'close' | 'custom'
  // 成功回调
  successCallback?: (response: any) => void
  // 重定向URL
  redirectUrl?: string
}

// 验证API配置
export interface ValidateApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'validate'
  // 验证字段
  field: string
  // 验证触发时机
  trigger?: 'blur' | 'change' | 'input'
  // 防抖延迟（毫秒）
  debounce?: number
  // 验证结果映射
  resultMapper?: (response: any) => boolean | string
}

// 搜索API配置
export interface SearchApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'search'
  // 搜索字段
  searchField: string
  // 搜索关键字参数名
  queryParam?: string
  // 最小搜索长度
  minLength?: number
  // 防抖延迟（毫秒）
  debounce?: number
  // 结果映射函数
  resultMapper?: (response: any) => any[]
  // 选项标签字段
  labelField?: string
  // 选项值字段
  valueField?: string
}

// 上传API配置
export interface UploadApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'upload'
  // 文件字段名
  fileField?: string
  // 支持的文件类型
  accept?: string
  // 最大文件大小（字节）
  maxSize?: number
  // 是否支持多文件
  multiple?: boolean
  // 上传前处理
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  // 上传进度回调
  onProgress?: (progress: number, file: File) => void
  // 上传成功回调
  onSuccess?: (response: any, file: File) => void
  // 上传失败回调
  onError?: (error: any, file: File) => void
}

// 下载API配置
export interface DownloadApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'download'
  // 文件名
  filename?: string
  // 是否在新窗口打开
  openInNewWindow?: boolean
  // 下载前处理
  beforeDownload?: (formData: FormData) => boolean | Promise<boolean>
  // 下载进度回调
  onProgress?: (progress: number) => void
  // 下载成功回调
  onSuccess?: (blob: Blob, filename: string) => void
  // 下载失败回调
  onError?: (error: any) => void
}

// 自定义API配置
export interface CustomApiConfig extends BaseApiConfig {
  // 操作类型
  type: 'custom'
  // 自定义处理函数
  handler: (formData: FormData, config: CustomApiConfig) => Promise<any>
  // 结果处理函数
  resultHandler?: (result: any) => any
}

// API配置联合类型
export type ApiConfig = {
  // 加载API
  load?: LoadApiConfig
  // 提交API
  submit?: SubmitApiConfig
  // 验证API
  validate?: Record<string, ValidateApiConfig>
  // 搜索API
  search?: Record<string, SearchApiConfig>
  // 上传API
  upload?: Record<string, UploadApiConfig>
  // 下载API
  download?: Record<string, DownloadApiConfig>
  // 自定义API
  custom?: Record<string, CustomApiConfig>
  // 全局配置
  global?: {
    // 基础URL
    baseURL?: string
    // 全局请求头
    headers?: Record<string, string>
    // 全局超时时间
    timeout?: number
    // 全局重试配置
    retries?: number
    // 全局缓存配置
    cache?: boolean
    // 全局错误处理
    errorHandler?: (error: any) => void
    // 请求拦截器
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    // 响应拦截器
    responseInterceptor?: (response: AxiosResponse) => any
  }
}

// API请求选项
export interface ApiRequestOptions {
  // 是否显示加载状态
  showLoading?: boolean
  // 加载文本
  loadingText?: string
  // 是否显示错误消息
  showError?: boolean
  // 错误消息
  errorMessage?: string
  // 是否静默请求
  silent?: boolean
  // 请求ID（用于取消）
  requestId?: string
  // 额外参数
  extra?: Record<string, any>
}

// API响应结果
export interface ApiResponse<T = any> {
  // 响应数据
  data: T
  // 状态码
  status: number
  // 状态文本
  statusText: string
  // 响应头
  headers: Record<string, string>
  // 请求配置
  config: AxiosRequestConfig
  // 原始响应
  raw: AxiosResponse
}

// API错误信息
export interface ApiError {
  // 错误代码
  code: string | number
  // 错误消息
  message: string
  // 错误详情
  details?: any
  // 请求配置
  config?: AxiosRequestConfig
  // 响应数据
  response?: AxiosResponse
  // 原始错误
  originalError: Error
  // 错误时间戳
  timestamp: number
}

// API状态信息
export interface ApiState {
  // 当前状态
  status: ApiStatus
  // 是否正在加载
  loading: boolean
  // 错误信息
  error?: ApiError
  // 响应数据
  data?: any
  // 请求开始时间
  startTime?: number
  // 请求结束时间
  endTime?: number
  // 请求耗时
  duration?: number
}

// API事件类型
export interface ApiEvents {
  // 请求开始
  'request:start': (config: BaseApiConfig, options?: ApiRequestOptions) => void
  // 请求成功
  'request:success': (response: ApiResponse, config: BaseApiConfig) => void
  // 请求失败
  'request:error': (error: ApiError, config: BaseApiConfig) => void
  // 请求完成
  'request:complete': (config: BaseApiConfig) => void
  // 请求取消
  'request:cancel': (config: BaseApiConfig) => void
  // 上传进度
  'upload:progress': (progress: number, file: File) => void
  // 下载进度
  'download:progress': (progress: number) => void
}

// API管理器接口
export interface ApiManager {
  // 配置API
  configure(config: ApiConfig): void
  // 执行加载
  load(options?: ApiRequestOptions): Promise<FormData>
  // 执行提交
  submit(data: FormData, options?: ApiRequestOptions): Promise<any>
  // 执行验证
  validate(field: string, value: any, options?: ApiRequestOptions): Promise<boolean | string>
  // 执行搜索
  search(field: string, query: string, options?: ApiRequestOptions): Promise<any[]>
  // 执行上传
  upload(field: string, files: File[], options?: ApiRequestOptions): Promise<any>
  // 执行下载
  download(name: string, data?: FormData, options?: ApiRequestOptions): Promise<Blob>
  // 执行自定义API
  custom(name: string, data?: FormData, options?: ApiRequestOptions): Promise<any>
  // 取消请求
  cancel(requestId?: string): void
  // 取消所有请求
  cancelAll(): void
  // 获取API状态
  getState(type?: ApiOperationType): ApiState
  // 清除缓存
  clearCache(key?: string): void
  // 监听事件
  on<K extends keyof ApiEvents>(event: K, handler: ApiEvents[K]): void
  // 移除事件监听
  off<K extends keyof ApiEvents>(event: K, handler?: ApiEvents[K]): void
  // 触发事件
  emit<K extends keyof ApiEvents>(event: K, ...args: Parameters<ApiEvents[K]>): void
}

// API缓存接口
export interface ApiCache {
  // 获取缓存
  get(key: string): any
  // 设置缓存
  set(key: string, value: any, ttl?: number): void
  // 删除缓存
  delete(key: string): void
  // 清空缓存
  clear(): void
  // 检查缓存是否存在
  has(key: string): boolean
  // 获取缓存键列表
  keys(): string[]
}

// API拦截器接口
export interface ApiInterceptor {
  // 请求拦截器
  request?: {
    // 成功处理
    onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
    // 错误处理
    onRejected?: (error: any) => any
  }
  // 响应拦截器
  response?: {
    // 成功处理
    onFulfilled?: (response: AxiosResponse) => any | Promise<any>
    // 错误处理
    onRejected?: (error: any) => any
  }
}

// API中间件接口
export interface ApiMiddleware {
  // 中间件名称
  name: string
  // 执行顺序
  order?: number
  // 请求前处理
  beforeRequest?: (config: BaseApiConfig, options?: ApiRequestOptions) => BaseApiConfig | Promise<BaseApiConfig>
  // 响应后处理
  afterResponse?: (response: ApiResponse, config: BaseApiConfig) => any | Promise<any>
  // 错误处理
  onError?: (error: ApiError, config: BaseApiConfig) => any | Promise<any>
}

// API插件接口
export interface ApiPlugin {
  // 插件名称
  name: string
  // 插件版本
  version?: string
  // 安装插件
  install(manager: ApiManager): void
  // 卸载插件
  uninstall?(manager: ApiManager): void
  // 插件配置
  options?: Record<string, any>
}