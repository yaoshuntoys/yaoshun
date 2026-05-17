import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message?: string | string[];
  [key: string]: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let exceptionData: Record<string, unknown> | null = null;
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as ExceptionResponse;
      message = exceptionResponse.message || exception.message;
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const { message: _message, error: _error, statusCode: _statusCode, ...rest } =
          exceptionResponse;
        void _message;
        void _error;
        void _statusCode;
        if (Object.keys(rest).length > 0) {
          exceptionData = rest;
        }
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} failed: ${this.getExceptionMessage(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      data: exceptionData,
      code: status,
      message: Array.isArray(message) ? message[0] : message, // 处理 class-validator 返回的数组错误
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getExceptionMessage(exception: unknown) {
    if (exception instanceof Error) {
      return exception.message;
    }

    if (typeof exception === 'string') {
      return exception;
    }

    return JSON.stringify(exception);
  }
}
