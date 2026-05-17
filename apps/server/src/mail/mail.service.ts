import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

import { buildPaginatedResult, getPaginationParams } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { MailConfigDto } from '../setting/dto/mail-config.dto';
import { QueryMailRecordDto } from './dto/query-mail-record.dto';
import { buildDefaultMailConfig, normalizeMailConfig } from './mail-config';
import type { MailScene, MailStatus, SendMailInput } from './mail.types';
import { SmtpClientService } from './smtp-client.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly db: PrismaClient;

  constructor(
    prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly smtpClient: SmtpClientService,
  ) {
    this.db = prisma as unknown as PrismaClient;
  }

  async page(query: QueryMailRecordDto) {
    const { page, pageSize, skip } = getPaginationParams(query);

    const where: Prisma.MailRecordWhereInput = {};
    if (query.scene) where.scene = query.scene;
    if (query.status) where.status = query.status;
    if (query.keyword) {
      where.OR = [
        { toEmail: { contains: query.keyword, mode: 'insensitive' } },
        { subject: { contains: query.keyword, mode: 'insensitive' } },
        { content: { contains: query.keyword, mode: 'insensitive' } },
        { errorMessage: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }
    if (query.startTime || query.endTime) {
      const createdAt: Prisma.DateTimeFilter = {};
      if (query.startTime) createdAt.gte = new Date(query.startTime);
      if (query.endTime) createdAt.lte = new Date(query.endTime);
      where.createdAt = createdAt;
    }

    const [total, items] = await Promise.all([
      this.db.mailRecord.count({ where }),
      this.db.mailRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async sendTestMail(config: MailConfigDto) {
    const result = await this.sendMail({
      scene: 'test',
      toEmail: this.normalizeConfig(config).fromEmail,
      subject: 'Yaoshun Toys 邮件配置测试',
      content: [
        '这是一封来自 Yaoshun Toys 管理后台的测试邮件。',
        '',
        `SMTP: ${config.smtpHost}:${config.smtpPort}`,
        `账号: ${config.username}`,
        `发送时间: ${new Date().toLocaleString('zh-CN')}`,
      ].join('\n'),
      relatedType: 'setting',
      config,
    });

    return {
      ...result,
      message:
        result.status === 'sent'
          ? '测试邮件发送成功，请检查收件箱'
          : `测试邮件发送失败：${result.errorMessage ?? 'unknown error'}`,
    };
  }

  async sendMessageNotification(message: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
    createdAt?: Date;
  }) {
    const config = await this.getMailConfig();
    if (!config.notifyOnContact) {
      return this.createMailRecord({
        scene: 'message_notification',
        status: 'skipped',
        subject: `新留言通知：${message.subject || message.name}`,
        toEmail: config.fromEmail,
        fromEmail: config.fromEmail,
        content: message.message,
        relatedType: 'message',
        relatedId: message.id,
        errorMessage: '留言通知未开启，已跳过发送',
      });
    }

    return this.sendMail({
      scene: 'message_notification',
      toEmail: config.fromEmail,
      subject: `新留言通知：${message.subject || message.name}`,
      content: [
        '收到一条新的客户留言，请及时处理。',
        '',
        `姓名：${message.name}`,
        `邮箱：${message.email}`,
        `电话：${message.phone || '-'}`,
        `主题：${message.subject || '-'}`,
        `内容：${message.message}`,
        `提交时间：${(message.createdAt ?? new Date()).toLocaleString('zh-CN')}`,
      ].join('\n'),
      relatedType: 'message',
      relatedId: message.id,
      config,
    });
  }

  async sendPasswordResetNotification(account: {
    id: number;
    username: string;
    email?: string | null;
    name?: string | null;
    nickname?: string | null;
  }) {
    const config = await this.getMailConfig();
    const displayName = account.nickname || account.name || account.username;

    if (!config.notifyOnPasswordReset) {
      return this.createMailRecord({
        scene: 'password_reset',
        status: 'skipped',
        subject: `账号密码重置通知：${displayName}`,
        toEmail: account.email || '-',
        fromEmail: config.fromEmail,
        content: '管理员已重置账号密码，邮件内容不记录新密码。',
        relatedType: 'account',
        relatedId: account.id,
        errorMessage: '找回密码通知未开启，已跳过发送',
      });
    }

    if (!account.email) {
      return this.createMailRecord({
        scene: 'password_reset',
        status: 'skipped',
        subject: `账号密码重置通知：${displayName}`,
        toEmail: '-',
        fromEmail: config.fromEmail,
        content: '账号未配置邮箱，无法发送密码通知。',
        relatedType: 'account',
        relatedId: account.id,
        errorMessage: '账号未配置邮箱，无法发送密码通知',
      });
    }

    return this.sendMail({
      scene: 'password_reset',
      toEmail: account.email,
      subject: '账号密码已重置',
      content: [
        `您好，${displayName}：`,
        '',
        '您的后台账号密码已由管理员重置。',
        '为了账号安全，系统不会在邮件记录中保存新密码，请联系管理员获取临时登录信息并尽快修改密码。',
      ].join('\n'),
      relatedType: 'account',
      relatedId: account.id,
      config,
    });
  }

  async sendPasswordResetTokenNotification(account: {
    id: number;
    username: string;
    email?: string | null;
    name?: string | null;
    nickname?: string | null;
  }, reset: { token: string; expiresAt: Date }) {
    const config = await this.getMailConfig();
    const displayName = account.nickname || account.name || account.username;
    const resetBaseUrl =
      this.configService.get<string>('ADMIN_PASSWORD_RESET_URL') ||
      this.configService.get<string>('ADMIN_URL') ||
      '';
    const resetUrl = resetBaseUrl
      ? `${resetBaseUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(reset.token)}`
      : `请在 30 分钟内使用重置令牌完成密码重置。令牌：${reset.token}`;

    if (!account.email) {
      return this.createMailRecord({
        scene: 'password_reset',
        status: 'skipped',
        subject: `找回密码：${displayName}`,
        toEmail: '-',
        fromEmail: config.fromEmail,
        content: '账号未配置邮箱，无法发送找回密码链接。',
        relatedType: 'account',
        relatedId: account.id,
        errorMessage: '账号未配置邮箱，无法发送找回密码链接',
      });
    }

    return this.sendMail({
      scene: 'password_reset',
      toEmail: account.email,
      subject: '后台账号密码重置链接',
      content: [
        `您好，${displayName}：`,
        '',
        '请使用以下链接重置您的后台账号密码：',
        resetUrl,
        '',
        `链接有效期至：${reset.expiresAt.toLocaleString('zh-CN')}`,
        '如果不是您本人操作，请忽略此邮件。',
      ].join('\n'),
      recordContent: '已发送找回密码链接，邮件记录不保存重置链接或令牌。',
      relatedType: 'account',
      relatedId: account.id,
      config,
    });
  }

  private async sendMail(input: SendMailInput) {
    const config = input.config
      ? this.normalizeConfig(input.config)
      : await this.getMailConfig();

    try {
      await this.smtpClient.send(config, {
        toEmail: input.toEmail,
        subject: input.subject,
        content: input.content,
      });

      await this.createMailRecord({
        scene: input.scene,
        status: 'sent',
        subject: input.subject,
        toEmail: input.toEmail,
        fromEmail: config.fromEmail,
        content: input.recordContent ?? input.content,
        relatedType: input.relatedType,
        relatedId: input.relatedId,
      });

      return {
        status: 'sent' as MailStatus,
        toEmail: input.toEmail,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '邮件发送失败';
      this.logger.error(`Failed to send email [${input.scene}] to ${input.toEmail}: ${errorMessage}`);

      await this.createMailRecord({
        scene: input.scene,
        status: 'failed',
        subject: input.subject,
        toEmail: input.toEmail,
        fromEmail: config.fromEmail,
        content: input.recordContent ?? input.content,
        relatedType: input.relatedType,
        relatedId: input.relatedId,
        errorMessage,
      });

      return {
        status: 'failed' as MailStatus,
        toEmail: input.toEmail,
        errorMessage,
      };
    }
  }

  private async createMailRecord(data: {
    scene: MailScene;
    status: MailStatus;
    subject: string;
    toEmail: string;
    fromEmail: string;
    content: string;
    errorMessage?: string;
    relatedType?: string;
    relatedId?: number;
  }) {
    return this.db.mailRecord.create({ data });
  }

  private async getMailConfig(): Promise<MailConfigDto> {
    const setting = await this.db.mailSetting.findUnique({
      where: { id: 1 },
    });
    if (!setting) return buildDefaultMailConfig(this.configService);
    return this.normalizeConfig(setting);
  }

  private normalizeConfig(mailConfig?: Partial<MailConfigDto>): MailConfigDto {
    return normalizeMailConfig(this.configService, mailConfig);
  }
}
