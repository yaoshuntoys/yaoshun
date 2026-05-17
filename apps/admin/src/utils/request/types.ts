import type { AxiosRequestConfig } from 'axios';

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export class HttpError extends Error {
  status?: number;
  code?: number | string;
  requestId?: string;

  constructor(
    message: string,
    options?: { status?: number; code?: number | string; requestId?: string },
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = options?.status;
    this.code = options?.code;
    this.requestId = options?.requestId;
  }
}

/** 扩展的 Axios 请求配置 */
export interface ExtendedRequestConfig extends AxiosRequestConfig {
  /** 是否跳过错误处理（不显示 toast） */
  silent?: boolean;
}

/** 请求配置选项 */
export interface RequestOptions extends Omit<
  ExtendedRequestConfig,
  'url' | 'method' | 'data' | 'params'
> {
  /** 是否跳过错误处理（不显示 toast） */
  silent?: boolean;
}

/** HTTP 客户端 */
export interface HttpClient {
  /** 通用请求方法 */
  request<T = unknown>(config: ExtendedRequestConfig): Promise<T>;
  /** GET 请求 */
  get<T = unknown>(url: string, params?: unknown, options?: RequestOptions): Promise<T>;
  /** POST 请求 */
  post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T>;
  /** PUT 请求 */
  put<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T>;
  /** DELETE 请求 */
  delete<T = unknown>(url: string, params?: unknown, options?: RequestOptions): Promise<T>;
}
