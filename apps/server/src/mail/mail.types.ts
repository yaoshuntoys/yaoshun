import type { MailConfigDto } from '../setting/dto/mail-config.dto';

export type MailScene = 'message_notification' | 'password_reset' | 'test';
export type MailStatus = 'sent' | 'failed' | 'skipped';

export interface SendMailInput {
  scene: MailScene;
  toEmail: string;
  subject: string;
  content: string;
  recordContent?: string;
  relatedType?: string;
  relatedId?: number;
  config?: MailConfigDto;
}

export interface SmtpMailPayload {
  toEmail: string;
  subject: string;
  content: string;
}
