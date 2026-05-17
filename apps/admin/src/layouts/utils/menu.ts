import type { AppMenuItem } from '@/config';

import { hasPermission } from '@/utils/permission';

export function findMenuParentKeys(
  items: AppMenuItem[],
  targetKey: string,
  ancestors: string[] = [],
): string[] {
  for (const item of items) {
    if (item.key === targetKey) {
      return ancestors;
    }

    if (item.children?.length) {
      const next = findMenuParentKeys(
        item.children,
        targetKey,
        [...ancestors, item.key],
      );

      if (next.length) {
        return next;
      }
    }
  }

  return [];
}

export function filterMenuItemsByPermissions(
  items: AppMenuItem[],
  permissions: string[] | undefined,
): AppMenuItem[] {
  return items
    .map((item) => {
      const nextChildren = item.children
        ? filterMenuItemsByPermissions(item.children, permissions)
        : undefined;

      const canAccessSelf = hasPermission(permissions, item.permissions);
      const hasVisibleChildren = Boolean(nextChildren && nextChildren.length > 0);

      if (!canAccessSelf && !hasVisibleChildren) {
        return null;
      }

      return {
        ...item,
        children: nextChildren,
      };
    })
    .filter(Boolean) as AppMenuItem[];
}
