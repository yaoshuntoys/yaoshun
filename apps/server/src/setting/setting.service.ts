import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ContentRevisionService } from '../content-revision/content-revision.service';
import { MediaReferenceService } from '../media-reference/media-reference.service';
import { PrismaService } from '../prisma/prisma.service';
import { EnterpriseConfigDto } from './dto/enterprise-config.dto';
import { MailConfigDto } from './dto/mail-config.dto';

export type MailConfigResponse = Omit<MailConfigDto, 'password'> & {
  password?: string;
  hasPassword: boolean;
};

@Injectable()
export class SettingService {
  private readonly singletonId = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly revisionService: ContentRevisionService,
    private readonly mediaReferenceService: MediaReferenceService,
  ) {}

  async getMailConfig(): Promise<MailConfigResponse> {
    const config = await this.getStoredMailConfig();
    return this.toMailConfigResponse(config);
  }

  async getMailConfigForSending(): Promise<MailConfigDto> {
    return this.getStoredMailConfig();
  }

  async saveMailConfig(mailConfigDto: MailConfigDto): Promise<MailConfigResponse> {
    const current = await this.getStoredMailConfig();
    const normalized = this.normalizeMailConfig(
      this.mergeMailConfig(mailConfigDto, current),
    );

    await this.prisma.mailSetting.upsert({
      where: { id: this.singletonId },
      update: normalized,
      create: { id: this.singletonId, ...normalized },
    });

    return this.toMailConfigResponse(normalized);
  }

  testMailConfig(mailConfigDto: MailConfigDto) {
    const normalized = this.normalizeMailConfig(mailConfigDto);

    return {
      valid: true,
      config: this.toMailConfigResponse(normalized),
      message: '邮件配置格式校验通过，请使用发送测试邮件验证 SMTP 连通性。',
    };
  }

  async mergeMailConfigWithStoredPassword(mailConfigDto: MailConfigDto) {
    const current = await this.getStoredMailConfig();
    return this.normalizeMailConfig(this.mergeMailConfig(mailConfigDto, current));
  }

  async getEnterpriseConfig(): Promise<EnterpriseConfigDto> {
    const setting = await this.prisma.enterpriseSetting.findUnique({
      where: { id: this.singletonId },
    });

    if (!setting) {
      const defaults = this.buildDefaultEnterpriseConfig();
      await this.prisma.enterpriseSetting.create({
        data: { id: this.singletonId, ...defaults },
      });
      return defaults;
    }

    return this.normalizeEnterpriseConfig(this.nullsToUndefined(setting));
  }

  async getPublicEnterpriseConfig(): Promise<EnterpriseConfigDto> {
    return this.getEnterpriseConfig();
  }

  async saveEnterpriseConfig(
    enterpriseConfigDto: EnterpriseConfigDto,
    operatorName?: string,
  ): Promise<EnterpriseConfigDto> {
    const normalized = this.normalizeEnterpriseConfig(enterpriseConfigDto);

    await this.prisma.$transaction(async (tx) => {
      await tx.enterpriseSetting.upsert({
        where: { id: this.singletonId },
        update: normalized,
        create: { id: this.singletonId, ...normalized },
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'enterprise-setting',
        entityId: this.singletonId,
        action: 'update',
        operatorName,
        summary: `保存企业设置：${normalized.companyName}`,
        snapshot: normalized,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'enterprise-setting',
        entityId: this.singletonId,
        displayName: normalized.companyName,
        content: normalized,
      });
    });

    return normalized;
  }

  findEnterpriseRevisions() {
    return this.revisionService.findRevisions(
      'enterprise-setting',
      this.singletonId,
    );
  }

  async rollbackEnterpriseConfig(revisionId: string | number, operatorName?: string) {
    const revision = await this.revisionService.findRevision(
      'enterprise-setting',
      this.singletonId,
      revisionId,
    );
    const snapshot = this.normalizeEnterpriseConfig(
      revision.snapshot as Partial<EnterpriseConfigDto>,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.enterpriseSetting.upsert({
        where: { id: this.singletonId },
        update: snapshot,
        create: { id: this.singletonId, ...snapshot },
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'enterprise-setting',
        entityId: this.singletonId,
        action: 'rollback',
        operatorName,
        summary: `恢复企业设置历史版本 #${revision.version}`,
        snapshot,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'enterprise-setting',
        entityId: this.singletonId,
        displayName: snapshot.companyName,
        content: snapshot,
      });
    });

    return snapshot;
  }

  private async getStoredMailConfig(): Promise<MailConfigDto> {
    const setting = await this.prisma.mailSetting.findUnique({
      where: { id: this.singletonId },
    });

    if (!setting) {
      const defaults = this.buildDefaultMailConfig();
      await this.prisma.mailSetting.create({
        data: { id: this.singletonId, ...defaults },
      });
      return defaults;
    }

    return this.normalizeMailConfig(setting);
  }

  private toMailConfigResponse(config: MailConfigDto): MailConfigResponse {
    return {
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpSecure: config.smtpSecure,
      username: config.username,
      password: '',
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      notifyOnContact: config.notifyOnContact,
      notifyOnPasswordReset: config.notifyOnPasswordReset,
      hasPassword: Boolean(config.password),
    };
  }

  private buildDefaultMailConfig(): MailConfigDto {
    const smtpPort = Number(
      this.configService.get<string>('EMAIL_PORT') ?? 465,
    );
    const username =
      this.configService.get<string>('EMAIL_USER') ?? 'yaoshuntoys@gmail.com';

    return {
      smtpHost: this.configService.get<string>('EMAIL_HOST') ?? 'smtp.gmail.com',
      smtpPort,
      smtpSecure:
        (this.configService.get<string>('EMAIL_SECURE') ?? '').toLowerCase() ===
          'true' || smtpPort === 465,
      username,
      password: this.configService.get<string>('EMAIL_PASS') ?? '',
      fromName:
        this.configService.get<string>('EMAIL_FROM_NAME') ?? 'Yaoshun Toys',
      fromEmail: this.configService.get<string>('EMAIL_FROM') ?? username,
      notifyOnContact:
        (
          this.configService.get<string>('EMAIL_NOTIFY_ON_CONTACT') ?? 'true'
        ).toLowerCase() !== 'false',
      notifyOnPasswordReset:
        (
          this.configService.get<string>('EMAIL_NOTIFY_ON_PASSWORD_RESET') ??
          'true'
        ).toLowerCase() !== 'false',
    };
  }

  private normalizeMailConfig(
    mailConfig?: Partial<MailConfigDto>,
  ): MailConfigDto {
    const defaults = this.buildDefaultMailConfig();

    return {
      smtpHost: this.pickString(mailConfig?.smtpHost, defaults.smtpHost),
      smtpPort: Number(mailConfig?.smtpPort ?? defaults.smtpPort),
      smtpSecure: mailConfig?.smtpSecure ?? defaults.smtpSecure,
      username: this.pickString(mailConfig?.username, defaults.username),
      password: this.pickString(mailConfig?.password, defaults.password),
      fromName: this.pickString(mailConfig?.fromName, defaults.fromName),
      fromEmail: this.pickString(mailConfig?.fromEmail, defaults.fromEmail),
      notifyOnContact: mailConfig?.notifyOnContact ?? defaults.notifyOnContact,
      notifyOnPasswordReset:
        mailConfig?.notifyOnPasswordReset ?? defaults.notifyOnPasswordReset,
    };
  }

  private pickString(value: string | undefined | null, fallback: string) {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  private mergeMailConfig(
    incoming: MailConfigDto,
    current: MailConfigDto,
  ): MailConfigDto {
    return {
      ...incoming,
      password: this.pickString(incoming.password, current.password),
    };
  }

  private buildDefaultEnterpriseConfig(): EnterpriseConfigDto {
    return {
      companyName: '东莞市尧顺科技有限公司',
      companyNameEn: 'Dongguan Yaoshun Technology Co., Ltd.',
      brandName: '尧顺玩具',
      brandNameEn: 'Yaoshun Toys',
      companyLogo: '/favicon-rounded-192.png',
      contactEmail:
        this.configService.get<string>('EMAIL_USER') ?? 'yaoshuntoys@gmail.com',
      contactPhone: '+86 18780083256',
      whatsapp: '+86 18780083256',
      wechat: '',
      address: '中国广东省东莞市茶山镇伟兴路3号',
      addressEn: 'No. 3, Weixing Road, Chashan Town, Dongguan, Guangdong, China',
      foundedAt: '2016-08-26',
      registeredCapital: '300 万元人民币',
      businessScope:
        '搭建玩具、定制玩具、益智玩具、拼插类塑胶玩具、定制管材型材、高精密注塑件以及玩具 OEM/ODM 定制化开发。',
      keywords:
        '东莞市尧顺科技有限公司,Yaoshun Toys,Dongguan Yaoshun Technology,玩具OEM,玩具ODM,搭建玩具,定制玩具,益智玩具,塑胶玩具,精密注塑',
      description:
        '东莞市尧顺科技有限公司成立于 2016 年，是一家集设计、开模、生产、质控与出口协同于一体的东莞源头玩具工厂，为全球客户提供搭建玩具、定制玩具与玩具 OEM/ODM 定制化开发服务。',
      website: 'https://www.yaoshuntoys.com',
      copyright: 'Copyright © Dongguan Yaoshun Technology Co., Ltd.',
      icp: '',
    };
  }

  private normalizeEnterpriseConfig(
    config?: Partial<EnterpriseConfigDto>,
  ): EnterpriseConfigDto {
    const defaults = this.buildDefaultEnterpriseConfig();

    return {
      companyName: this.pickString(config?.companyName, defaults.companyName),
      companyNameEn: this.pickString(
        config?.companyNameEn,
        defaults.companyNameEn ?? '',
      ),
      brandName: this.pickString(config?.brandName, defaults.brandName ?? ''),
      brandNameEn: this.pickString(
        config?.brandNameEn,
        defaults.brandNameEn ?? '',
      ),
      companyLogo: this.pickString(config?.companyLogo, defaults.companyLogo ?? ''),
      contactEmail: this.pickString(
        config?.contactEmail,
        defaults.contactEmail ?? '',
      ),
      contactPhone: this.pickString(
        config?.contactPhone,
        defaults.contactPhone ?? '',
      ),
      whatsapp: this.pickString(config?.whatsapp, defaults.whatsapp ?? ''),
      wechat: this.pickString(config?.wechat, defaults.wechat ?? ''),
      address: this.pickString(config?.address, defaults.address ?? ''),
      addressEn: this.pickString(config?.addressEn, defaults.addressEn ?? ''),
      foundedAt: this.pickString(config?.foundedAt, defaults.foundedAt ?? ''),
      registeredCapital: this.pickString(
        config?.registeredCapital,
        defaults.registeredCapital ?? '',
      ),
      businessScope: this.pickString(
        config?.businessScope,
        defaults.businessScope ?? '',
      ),
      keywords: this.pickString(config?.keywords, defaults.keywords ?? ''),
      description: this.pickString(
        config?.description,
        defaults.description ?? '',
      ),
      website: this.pickString(config?.website, defaults.website ?? ''),
      copyright: this.pickString(
        config?.copyright,
        defaults.copyright ?? '',
      ),
      icp: this.pickString(config?.icp, defaults.icp ?? ''),
    };
  }

  private nullsToUndefined<T extends Record<string, unknown>>(value: T) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        entry === null ? undefined : entry,
      ]),
    ) as Partial<EnterpriseConfigDto>;
  }
}
