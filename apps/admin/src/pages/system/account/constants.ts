import type { FormField } from '@/components/ConfigurableForm/types';
import type { Role } from '@/types';

export type AccountFilter = {
  keyword?: string;
  role?: string;
  status?: string;
};

export function createAccountFields(roles: Role[] = []): FormField[] {
  return [
    {
      name: 'keyword',
      label: '关键词',
      type: 'input',
      componentProps: { placeholder: '搜索用户名或昵称', allowClear: true },
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      componentProps: { placeholder: '选择角色', allowClear: true },
      options: roles.map((role) => ({
        label: role.name,
        value: role.code,
      })),
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      componentProps: { placeholder: '选择状态', allowClear: true },
      options: [
        { label: '启用', value: 'active' },
        { label: '停用', value: 'inactive' },
      ],
    },
  ];
}
