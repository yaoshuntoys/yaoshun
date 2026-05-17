import { Layout, Menu } from 'antd';

import type { AppMenuItem } from '@/config';
import AppLogo from '@/layouts/components/AppLogo';
import { toMenuItems } from '@/layouts/utils/menuItems';

const { Sider } = Layout;

interface Props {
  collapsed: boolean;
  isDark: boolean;
  selectedKeys: string[];
  openKeys: string[];
  items: AppMenuItem[];
  onOpenChange: (keys: string[]) => void;
}

export default function AppSidebar({
  collapsed,
  isDark,
  selectedKeys,
  openKeys,
  items,
  onOpenChange,
}: Props) {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={248}
      collapsedWidth={80}
      theme={isDark ? 'dark' : 'light'}
      className="admin-layout-sider"
    >
      <AppLogo collapsed={collapsed} isDark={isDark} />
      <Menu
        theme={isDark ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => onOpenChange(keys as string[])}
        items={toMenuItems(items)}
        className="admin-layout-menu"
      />
    </Sider>
  );
}
