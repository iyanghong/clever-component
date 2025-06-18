/**
 * 响应数据模型
 */

// 基础响应模型
export interface ResponseBaseModel<T = any> {
  code: number
  message: string
  data: T
  success?: boolean
  timestamp?: number
  total?: number
}

// 分页响应模型
export interface PageResponseModel<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages?: number
}

// 列表响应模型
export interface ListResponseModel<T = any> extends ResponseBaseModel<PageResponseModel<T>> {}

// 详情响应模型
export interface DetailResponseModel<T = any> extends ResponseBaseModel<T> {}

// 操作响应模型
export interface OperationResponseModel extends ResponseBaseModel<boolean> {}

export type BaseApiFn<T extends Record<string, any> = any> = ((params: T) => ResponseBaseModel<T>) | ((params: T) => Promise<ResponseBaseModel<T>>)
export type GetApiFn<T extends Record<string, any> = any> = BaseApiFn<T>
export type CreateApiFn<T extends Record<string, any> = any> = BaseApiFn<T>
export type UpdateApiFn<T extends Record<string, any> = any> = BaseApiFn<T>
export type GetAllApiFn<T extends Record<string, any> = any> = BaseApiFn<T>
export type DeleteApiFn<T extends Record<string, any> = any> = BaseApiFn<T>
export type GetPageApiFn<T extends Record<string, any> = any> =
    ((params: T) => ResponseBaseModel<PageResponseModel<T>>)
    | ((params: T) => Promise<ResponseBaseModel<PageResponseModel<T>>>)
    
// API响应状态码
export enum ResponseCode {
  SUCCESS = 0,
  ERROR = -1,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

// API响应消息
export const ResponseMessage = {
  [ResponseCode.SUCCESS]: '操作成功',
  [ResponseCode.ERROR]: '操作失败',
  [ResponseCode.UNAUTHORIZED]: '未授权',
  [ResponseCode.FORBIDDEN]: '禁止访问',
  [ResponseCode.NOT_FOUND]: '资源不存在',
  [ResponseCode.SERVER_ERROR]: '服务器错误'
}