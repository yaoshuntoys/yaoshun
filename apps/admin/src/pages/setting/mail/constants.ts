import type { MailConfig } from '@/types';

export const defaultMailConfig: MailConfig = {
  smtpHost: 'smtp.gmail.com',
  smtpPort: 465,
  smtpSecure: true,
  username: 'yaoshuntoys@gmail.com',
  password: '',
  fromName: 'Yaoshun Toys',
  fromEmail: 'yaoshuntoys@gmail.com',
  notifyOnContact: true,
  notifyOnPasswordReset: true,
};
