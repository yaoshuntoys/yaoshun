import { useMemo, useState } from 'react';

import { menuItems, type AppMenuItem } from '@/config';
import {
  filterMenuItemsByPermissions,
  findMenuParentKeys,
} from '@/layouts/utils/menu';

interface Params {
  pathname: string;
  sidebarCollapsed: boolean;
  permissions?: string[];
}

interface Result {
  filteredMenuItems: AppMenuItem[];
  selectedKeys: string[];
  openKeys: string[];
  setManualOpenKeys: (keys: string[]) => void;
}

interface ManualOpenState {
  pathname: string;
  keys: string[];
}

export function useLayoutMenu({
  pathname,
  sidebarCollapsed,
  permissions,
}: Params): Result {
  const [manualOpenState, setManualOpenState] = useState<ManualOpenState>({
    pathname,
    keys: [],
  });

  const filteredMenuItems = useMemo(
    () => filterMenuItemsByPermissions(menuItems, permissions),
    [permissions],
  );
  const selectedKeys = useMemo(() => [pathname], [pathname]);
  const parentKeys = useMemo(
    () => findMenuParentKeys(filteredMenuItems, pathname),
    [filteredMenuItems, pathname],
  );
  const manualOpenKeys =
    manualOpenState.pathname === pathname ? manualOpenState.keys : parentKeys;
  const openKeys = sidebarCollapsed
    ? []
    : Array.from(new Set([...parentKeys, ...manualOpenKeys]));

  return {
    filteredMenuItems,
    selectedKeys,
    openKeys,
    setManualOpenKeys: (keys) => setManualOpenState({ pathname, keys }),
  };
}
