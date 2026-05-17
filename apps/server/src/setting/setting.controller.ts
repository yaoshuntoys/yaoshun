import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { SettingService } from './setting.service';
import { EnterpriseConfigDto } from './dto/enterprise-config.dto';
import { MailConfigDto } from './dto/mail-config.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OperationLog } from '../log/decorators/operation-log.decorator';
import { MailService } from '../mail/mail.service';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';

@ApiTags('系统配置')
@ApiBearerAuth()
@Controller('admin/settings')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly mailService: MailService,
  ) {}

  @Get('mail')
  @ApiOperation({ summary: '获取邮件配置' })
  @RequirePermissions(PERMISSIONS.SETTING_MAIL_MANAGE)
  getMailConfig() {
    return this.settingService.getMailConfig();
  }

  @Post('mail')
  @ApiOperation({ summary: '保存邮件配置' })
  @RequirePermissions(PERMISSIONS.SETTING_MAIL_MANAGE)
  @OperationLog({
    module: '系统配置',
    action: '保存邮件配置',
    details: ({ body }) =>
      `保存邮件配置：SMTP ${String(body.smtpHost)}:${String(body.smtpPort)}，发件人 ${String(body.fromEmail)}`,
  })
  saveMailConfig(@Body() mailConfigDto: MailConfigDto) {
    return this.settingService.saveMailConfig(mailConfigDto);
  }

  @Post('mail/test')
  @ApiOperation({ summary: '校验邮件配置' })
  @RequirePermissions(PERMISSIONS.SETTING_MAIL_MANAGE)
  @OperationLog({
    module: '系统配置',
    action: '校验邮件配置',
    details: ({ body }) =>
      `校验邮件配置：SMTP ${String(body.smtpHost)}:${String(body.smtpPort)}，账号 ${String(body.username)}`,
  })
  testMailConfig(@Body() mailConfigDto: MailConfigDto) {
    return this.settingService
      .mergeMailConfigWithStoredPassword(mailConfigDto)
      .then((config) => this.mailService.sendTestMail(config));
  }

  @Get('enterprise')
  @ApiOperation({ summary: '获取企业设置' })
  @RequirePermissions(PERMISSIONS.SETTING_ENTERPRISE_MANAGE)
  getEnterpriseConfig() {
    return this.settingService.getEnterpriseConfig();
  }

  @Get('enterprise/revisions')
  @ApiOperation({ summary: '获取企业设置历史版本' })
  @RequirePermissions(PERMISSIONS.SETTING_ENTERPRISE_MANAGE)
  getEnterpriseRevisions() {
    return this.settingService.findEnterpriseRevisions();
  }

  @Post('enterprise')
  @ApiOperation({ summary: '保存企业设置' })
  @RequirePermissions(PERMISSIONS.SETTING_ENTERPRISE_MANAGE)
  @OperationLog({
    module: '系统设置',
    action: '保存企业设置',
    details: ({ body }) =>
      `保存企业设置：${String(body.companyName ?? 'unknown')}`,
  })
  saveEnterpriseConfig(
    @Body() enterpriseConfigDto: EnterpriseConfigDto,
    @Req() request: Request & { user?: { username?: string } },
  ) {
    return this.settingService.saveEnterpriseConfig(
      enterpriseConfigDto,
      request.user?.username,
    );
  }

  @Post('enterprise/rollback/:revisionId')
  @ApiOperation({ summary: '恢复企业设置历史版本' })
  @RequirePermissions(PERMISSIONS.SETTING_ENTERPRISE_MANAGE)
  @OperationLog({
    module: '系统设置',
    action: '恢复企业设置历史',
    details: ({ params }) =>
      `恢复企业设置历史：#${String(params.revisionId ?? 'unknown')}`,
  })
  rollbackEnterpriseConfig(
    @Param('revisionId') revisionId: string,
    @Req() request: Request & { user?: { username?: string } },
  ) {
    return this.settingService.rollbackEnterpriseConfig(
      revisionId,
      request.user?.username,
    );
  }
}
