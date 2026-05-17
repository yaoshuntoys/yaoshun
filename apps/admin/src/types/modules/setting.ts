export interface MailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  notifyOnContact: boolean;
  notifyOnPasswordReset: boolean;
  hasPassword?: boolean;
}

export interface EnterpriseConfig {
  companyName: string;
  companyNameEn?: string;
  brandName?: string;
  brandNameEn?: string;
  companyLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsapp?: string;
  wechat?: string;
  address?: string;
  addressEn?: string;
  foundedAt?: string;
  registeredCapital?: string;
  businessScope?: string;
  keywords?: string;
  description?: string;
  website?: string;
  copyright?: string;
  icp?: string;
}
