import axios from 'axios';
import type { AxiosError } from 'axios';

import type { HttpMiddleware } from '@/utils/request/httpClient/client/types';
import { BizError } from '@/utils/request/httpClient/middlewares/withBizStatus';

export class HttpError<T = unknown> extends Error {
  readonly status?: number;
  readonly payload?: T;
  constructor(message: string, status?: number, payload?: T) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;
  }
}

function extractBackendMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const message = (payload as { message?: unknown }).message;
  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    const firstMessage = message.find(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
    if (firstMessage) {
      return firstMessage;
    }
  }

  return undefined;
}

export function withAxiosErrorNormalize(): HttpMiddleware {
  return async (context, next) => {
    await next();
    if (!context.error) {
      return;
    }
    if (context.error instanceof BizError) {
      return;
    }
    if (axios.isAxiosError(context.error)) {
      const axiosError = context.error as AxiosError;
      const payload = axiosError.response?.data;
      const message =
        extractBackendMessage(payload)
        ?? axiosError.response?.statusText
        ?? axiosError.message;
      context.error = new HttpError(
        message,
        axiosError.response?.status,
        payload,
      );
    }
  };
}
