import { SetMetadata } from '@nestjs/common';
import type { Request } from 'express';

export interface RequestUser {
  userId?: number;
  username?: string;
}

export interface OperationLogContext {
  request: Request & { user?: RequestUser };
  body: Record<string, unknown>;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  result: unknown;
}

export interface OperationLogOptions {
  module: string;
  action: string;
  details?: string | ((context: OperationLogContext) => string);
}

export const OPERATION_LOG_KEY = 'operation_log';

export const OperationLog = (options: OperationLogOptions) =>
  SetMetadata(OPERATION_LOG_KEY, options);
