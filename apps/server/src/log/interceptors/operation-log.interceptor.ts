import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { tap } from 'rxjs/operators';
import type { Observable } from 'rxjs';

import { LogService } from '../log.service';
import {
  OPERATION_LOG_KEY,
  type OperationLogContext,
  type OperationLogOptions,
  type RequestUser,
} from '../decorators/operation-log.decorator';

type RequestWithUser = Request & {
  user?: RequestUser;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OperationLogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly logService: LogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<OperationLogOptions>(
      OPERATION_LOG_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options || context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return next.handle().pipe(
      tap((result) => {
        const contextData: OperationLogContext = {
          request,
          body: request.body ?? {},
          params: request.params ?? {},
          query: request.query ?? {},
          result,
        };

        const details =
          typeof options.details === 'function'
            ? options.details(contextData)
            : (options.details ?? options.action);

        const resultUser = this.extractResultUser(result);
        const requestUser = request.user;

        void this.logService
          .create({
            userId: requestUser?.userId ?? resultUser?.id,
            username:
              requestUser?.username ??
              resultUser?.username ??
              this.readString(request.body?.username) ??
              'anonymous',
            module: options.module,
            action: options.action,
            details,
            ip: this.extractIp(request),
            userAgent: this.readString(request.headers['user-agent']),
          })
          .catch((error: unknown) => {
            this.logger.error(
              `Failed to write operation log: ${String(error)}`,
            );
          });
      }),
    );
  }

  private extractIp(request: RequestWithUser): string | undefined {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0]?.trim() || request.ip;
    }
    return request.ip;
  }

  private extractResultUser(
    result: unknown,
  ): { id?: number; username?: string } | undefined {
    if (!result || typeof result !== 'object') return undefined;
    const maybeUser = (result as { user?: { id?: number; username?: string } })
      .user;
    if (!maybeUser || typeof maybeUser !== 'object') return undefined;
    return maybeUser;
  }

  private readString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }
}
