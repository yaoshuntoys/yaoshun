import type { FormField } from '@/components/ConfigurableForm';

export interface MessageSearchForm extends Record<string, unknown> {
  keyword?: string;
  isRead?: string;
}

export const messageInitialValues: MessageSearchForm = {
  keyword: '',
  isRead: 'false',
};

export const messageFields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: { placeholder: '搜索姓名/邮箱/主题', allowClear: true },
  },
  {
    name: 'isRead',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '未读', value: 'false' },
      { label: '已读', value: 'true' },
    ],
    componentProps: { placeholder: '状态', allowClear: true },
  },
];

export function resolveMessageReadStatus(value?: string) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}
