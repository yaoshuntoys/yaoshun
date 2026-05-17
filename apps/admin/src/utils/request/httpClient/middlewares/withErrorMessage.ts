import type { HttpContext, HttpMiddleware, MiddlewareRequestOptions } from '@/utils/request/httpClient/client/types';

export interface ErrorMessageMiddlewareOptions {
  showMessage: (message: string, error: unknown) => void | Promise<void>;
}

function isEnabled(context: HttpContext, key: keyof MiddlewareRequestOptions) {
  const options = context.meta.middlewareOptions as MiddlewareRequestOptions | undefined;
  if (!options) {
    return true;
  }
  return options[key] !== true;
}

export function withErrorMessage(options: ErrorMessageMiddlewareOptions): HttpMiddleware {
  return async (context, next) => {
    await next();
    if (!context.error) {
      return;
    }
    if (!isEnabled(context, 'disableErrorMessage')) {
      return;
    }
    const message = context.error instanceof Error ? context.error.message : String(context.error);
    await options.showMessage(message, context.error);
  };
}
