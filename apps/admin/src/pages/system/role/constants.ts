import type { FormField } from '@/components/ConfigurableForm/types';

export interface RoleFilter extends Record<string, unknown> {
  keyword?: string;
  status?: string;
}

export const roleFields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: {
      placeholder: '搜索角色名称 / 编码',
      allowClear: true,
    },
  },
  {
    name: 'status',
    type: 'select',
    componentProps: {
      placeholder: '角色状态',
      allowClear: true,
    },
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'inactive' },
    ],
  },
];
