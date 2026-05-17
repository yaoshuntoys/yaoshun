export interface OperationLog {
  id: number;
  userId?: number | null;
  username?: string;
  action: string;
  module: string;
  details: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export interface MailRecord {
  id: number;
  scene: 'message_notification' | 'password_reset' | 'test';
  status: 'sent' | 'failed' | 'skipped';
  subject: string;
  toEmail: string;
  fromEmail: string;
  content: string;
  errorMessage?: string | null;
  relatedType?: string | null;
  relatedId?: number | null;
  createdAt: string;
}
