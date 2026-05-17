import { ConfigService } from '@nestjs/config';

import { MailConfigDto } from '../setting/dto/mail-config.dto';

export function buildDefaultMailConfig(
  configService: ConfigService,
): MailConfigDto {
  const smtpPort = Number(configService.get<string>('EMAIL_PORT') ?? 465);
  const username =
    configService.get<string>('EMAIL_USER') ?? 'yaoshuntoys@gmail.com';

  return {
    smtpHost: configService.get<string>('EMAIL_HOST') ?? 'smtp.gmail.com',
    smtpPort,
    smtpSecure:
      (configService.get<string>('EMAIL_SECURE') ?? '').toLowerCase() ===
        'true' || smtpPort === 465,
    username,
    password: configService.get<string>('EMAIL_PASS') ?? '',
    fromName: configService.get<string>('EMAIL_FROM_NAME') ?? 'Yaoshun Toys',
    fromEmail: configService.get<string>('EMAIL_FROM') ?? username,
    notifyOnContact:
      (configService.get<string>('EMAIL_NOTIFY_ON_CONTACT') ?? 'true').toLowerCase() !==
      'false',
    notifyOnPasswordReset:
      (configService.get<string>('EMAIL_NOTIFY_ON_PASSWORD_RESET') ?? 'true').toLowerCase() !==
      'false',
  };
}

export function normalizeMailConfig(
  configService: ConfigService,
  mailConfig?: Partial<MailConfigDto>,
): MailConfigDto {
  const defaults = buildDefaultMailConfig(configService);

  return {
    smtpHost: pickString(mailConfig?.smtpHost, defaults.smtpHost),
    smtpPort: Number(mailConfig?.smtpPort ?? defaults.smtpPort),
    smtpSecure: mailConfig?.smtpSecure ?? defaults.smtpSecure,
    username: pickString(mailConfig?.username, defaults.username),
    password: pickString(mailConfig?.password, defaults.password),
    fromName: pickString(mailConfig?.fromName, defaults.fromName),
    fromEmail: pickString(mailConfig?.fromEmail, defaults.fromEmail),
    notifyOnContact: mailConfig?.notifyOnContact ?? defaults.notifyOnContact,
    notifyOnPasswordReset:
      mailConfig?.notifyOnPasswordReset ?? defaults.notifyOnPasswordReset,
  };
}

function pickString(value: string | undefined, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
