import axios from 'axios';
import type { AxiosError } from 'axios';

import type { HttpContext, HttpMiddleware, MiddlewareRequestOptions } from '@/utils/request/httpClient/client/types';
import { HttpError } from '@/utils/request/httpClient/middlewares/withAxiosErrorNormalize';

export interface AuthRedirectMiddlewareOptions {
  onUnauthorized: (error: unknown) => void | Promise<void>;
  statusCode?: number;
}

function isEnabled(context: HttpContext, key: keyof MiddlewareRequestOptions) {
  const options = context.meta.middlewareOptions as MiddlewareRequestOptions | undefined;
  if (!options) {
    return true;
  }
  return options[key] !== true;
}

function getStatus(error: unknown): number | undefined {
  if (error instanceof HttpError) {
    return error.status;
  }
  if (axios.isAxiosError(error)) {
    return (error as AxiosError).response?.status;
  }
  return undefined;
}

export function withUnauthorizedRedirect(options: AuthRedirectMiddlewareOptions): HttpMiddleware {
  const statusCode = options.statusCode ?? 401;
  return async (context, next) => {
    await next();
    if (!context.error) {
      return;
    }
    if (!isEnabled(context, 'disableAuthRedirect')) {
      return;
    }
    if (getStatus(context.error) !== statusCode) {
      return;
    }
    await options.onUnauthorized(context.error);
  };
}
