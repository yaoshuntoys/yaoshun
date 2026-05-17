import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type HttpMiddleware<T = unknown> = (
  context: HttpContext<T>,
  next: () => Promise<void>,
) => Promise<void> | void;

export interface HttpContext<T = unknown> {
  client: import('axios').AxiosInstance;
  request: InternalAxiosRequestConfig;
  response?: AxiosResponse<T>;
  result?: T;
  error?: unknown;
  meta: Record<string, unknown>;
}

export interface HttpClientOptions {
  axiosConfig?: AxiosRequestConfig;
  middlewares?: HttpMiddleware[];
}

export interface MiddlewareRequestOptions {
  disableErrorMessage?: boolean;
  disableAuthRedirect?: boolean;
}

export type RequestOptions<T = unknown> = AxiosRequestConfig & {
  middlewares?: HttpMiddleware<T>[];
  middlewareOptions?: MiddlewareRequestOptions;
};
