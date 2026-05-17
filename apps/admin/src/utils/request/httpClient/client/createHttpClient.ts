import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import { compose } from '@/utils/request/httpClient/client/compose';
import { executeRequest } from '@/utils/request/httpClient/client/executeRequest';
import type { HttpClientOptions, HttpContext, HttpMiddleware, RequestOptions } from '@/utils/request/httpClient/client/types';

export function createHttpClient(options: HttpClientOptions = {}) {
  const instance = axios.create(options.axiosConfig);
  const baseMiddlewares = [...(options.middlewares ?? [])];

  const request = async <T = unknown>(requestOptions: RequestOptions<T>) => {
    const {
      middlewares: runtimeMiddlewares = [],
      middlewareOptions,
      ...restRequestOptions
    } = requestOptions;
    const requestConfig = restRequestOptions as InternalAxiosRequestConfig;

    const context: HttpContext<T> = {
      client: instance,
      request: requestConfig,
      meta: {
        middlewareOptions,
      },
    };

    const sendRequest: HttpMiddleware<T> = async (ctx) => {
      await executeRequest(ctx);
    };
    const pipeline = compose<T>([
      ...(baseMiddlewares as HttpMiddleware<T>[]),
      ...(runtimeMiddlewares as HttpMiddleware<T>[]),
      sendRequest,
    ]);
    await pipeline(context);

    if (context.error) {
      throw context.error;
    }
    if (context.result !== undefined) {
      return context.result;
    }
    if (context.response) {
      return context.response.data;
    }
    return undefined as T;
  };

  return {
    instance,
    request,
    get: <T = unknown>(url: string, params?: unknown, config: RequestOptions<T> = {}) =>
      request<T>({
        ...config,
        method: 'GET',
        url,
        params,
      }),
    post: <T = unknown>(url: string, data?: unknown, config: RequestOptions<T> = {}) =>
      request<T>({
        ...config,
        method: 'POST',
        url,
        data,
      }),
    put: <T = unknown>(url: string, data?: unknown, config: RequestOptions<T> = {}) =>
      request<T>({
        ...config,
        method: 'PUT',
        url,
        data,
      }),
    patch: <T = unknown>(url: string, data?: unknown, config: RequestOptions<T> = {}) =>
      request<T>({
        ...config,
        method: 'PATCH',
        url,
        data,
      }),
    delete: <T = unknown>(url: string, config: RequestOptions<T> = {}) =>
      request<T>({
        ...config,
        method: 'DELETE',
        url,
      }),
  };
}
