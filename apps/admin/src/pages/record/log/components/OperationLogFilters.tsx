import type { Dayjs } from 'dayjs';

import type { FormField } from '@/components/ConfigurableForm/types';

export interface OperationLogFiltersValue extends Record<string, unknown> {
  keyword?: string;
  module?: string;
  dateRange?: [Dayjs, Dayjs] | null;
}

export const operationLogFields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: {
      placeholder: '搜索操作人、操作内容或详情',
      allowClear: true,
    },
  },
  {
    name: 'module',
    type: 'select',
    options: [
      { label: '认证管理', value: '认证管理' },
      { label: '账号管理', value: '账号管理' },
      { label: '分类管理', value: '分类管理' },
      { label: '文章管理', value: '文章管理' },
      { label: '文件夹管理', value: '文件夹管理' },
      { label: '多媒体库', value: '多媒体库' },
      { label: '系统配置', value: '系统配置' },
      { label: '留言管理', value: '留言管理' },
      { label: '操作日志', value: '操作日志' },
    ],
    componentProps: {
      placeholder: '选择模块',
      allowClear: true,
    },
  },
  {
    name: 'dateRange',
    type: 'dateRange',
    componentProps: {
      placeholder: ['开始时间', '结束时间'],
      allowClear: true,
      showTime: true,
    },
  },
];
