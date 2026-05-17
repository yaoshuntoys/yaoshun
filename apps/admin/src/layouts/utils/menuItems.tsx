import type { MenuProps } from 'antd';

import type { AppMenuItem } from '@/config';

type MenuItem = Required<MenuProps>['items'][number];

export function toMenuItems(items: AppMenuItem[]): MenuItem[] {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children ? toMenuItems(item.children) : undefined,
  }));
}
