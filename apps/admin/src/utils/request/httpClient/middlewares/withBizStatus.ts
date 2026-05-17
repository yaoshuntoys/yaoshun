import type { HttpMiddleware } from '@/utils/request/httpClient/client/types';

export class BizError<T = unknown> extends Error {
  readonly code: unknown;
  readonly payload: T;
  constructor(message: string, code: unknown, payload: T) {
    super(message);
    this.name = 'BizError';
    this.code = code;
    this.payload = payload;
  }
}

export interface BizStatusOptions {
  codeField?: string;
  dataField?: string;
  messageField?: string;
  successCode?: string | number;
}

const DEFAULT_BIZ_OPTIONS: Required<BizStatusOptions> = {
  codeField: 'code',
  dataField: 'data',
  messageField: 'message',
  successCode: 0,
};

export function withBizStatus(options: BizStatusOptions = {}): HttpMiddleware {
  const merged = { ...DEFAULT_BIZ_OPTIONS, ...options };
  return async (context, next) => {
    await next();

    if (!context.response) {
      return;
    }

    const payload = context.response.data as Record<string, unknown>;
    const code = payload?.[merged.codeField];
    if (code !== merged.successCode) {
      const message = String(payload?.[merged.messageField] ?? '业务错误');
      context.error = new BizError(message, code, payload);
      return;
    }
    // 成功时提取 data 字段
    context.result = payload?.[merged.dataField] as unknown;
  };
}
