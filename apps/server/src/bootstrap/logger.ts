import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export function createAppLogger() {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf((info) => {
          const timestamp =
            typeof info.timestamp === 'string' ? info.timestamp : '';
          const context =
            typeof info.context === 'string' ? info.context : 'App';
          const ms = typeof info.ms === 'string' ? info.ms : '';
          const message =
            typeof info.message === 'string'
              ? info.message
              : JSON.stringify(info.message);

          return `${timestamp} [${context}] ${info.level}: ${message} ${ms}`;
        }),
      ),
    }),
  ];

  if (!process.env.VERCEL) {
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: process.env.LOG_DIR || 'logs',
        filename: 'application-%DATE%.log',
        auditFile:
          process.env.LOG_AUDIT_FILE ||
          `${process.env.LOG_DIR || 'logs'}/.application-audit.json`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    );
  }

  return WinstonModule.createLogger({ transports });
}
