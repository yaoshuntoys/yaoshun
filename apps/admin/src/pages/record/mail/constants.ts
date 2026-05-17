import type { Dayjs } from 'dayjs';

import type { FormField } from '@/components/ConfigurableForm';
import type { MailRecord } from '@/types';

export interface MailRecordSearchForm extends Record<string, unknown> {
  keyword?: string;
  scene?: string;
  status?: string;
  dateRange?: [Dayjs, Dayjs] | null;
}

export const mailSceneOptions = [
  { label: '留言通知', value: 'message_notification' },
  { label: '重置密码', value: 'password_reset' },
  { label: '测试邮件', value: 'test' },
];

export const mailStatusOptions = [
  { label: '发送成功', value: 'sent' },
  { label: '发送失败', value: 'failed' },
  { label: '已跳过', value: 'skipped' },
];

export const mailRecordInitialValues: MailRecordSearchForm = {
  keyword: '',
  scene: undefined,
  status: undefined,
  dateRange: null,
};

export const mailRecordFields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: { placeholder: '搜索收件人、主题、内容或错误原因', allowClear: true },
  },
  {
    name: 'scene',
    type: 'select',
    componentProps: { placeholder: '发送场景', allowClear: true },
    options: mailSceneOptions,
  },
  {
    name: 'status',
    type: 'select',
    componentProps: { placeholder: '发送状态', allowClear: true },
    options: mailStatusOptions,
  },
  {
    name: 'dateRange',
    type: 'dateRange',
    componentProps: { placeholder: ['开始时间', '结束时间'], showTime: true, allowClear: true },
  },
];

export const sceneLabels: Record<MailRecord['scene'], string> = {
  message_notification: '留言通知',
  password_reset: '重置密码',
  test: '测试邮件',
};

export const statusColors: Record<MailRecord['status'], string> = {
  sent: 'success',
  failed: 'error',
  skipped: 'default',
};

export const statusLabels: Record<MailRecord['status'], string> = {
  sent: '发送成功',
  failed: '发送失败',
  skipped: '已跳过',
};
