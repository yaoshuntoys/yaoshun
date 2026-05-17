import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Space, Typography } from 'antd';

import type { User } from '@/types';

const { Header } = Layout;
const { Text } = Typography;

interface Props {
  collapsed: boolean;
  isDark: boolean;
  unreadCount: number;
  showMessageEntry: boolean;
  user?: User | null;
  onToggleSidebar: () => void;
  onOpenMessages: () => void;
  onOpenProfile: () => void;
  onOpenPassword: () => void;
  onLogout: () => void;
}

const userMenuItems = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人设置',
  },
  {
    key: 'password',
    icon: <SafetyOutlined />,
    label: '修改密码',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
    danger: true,
  },
];

export default function AppHeader({
  collapsed,
  isDark,
  unreadCount,
  showMessageEntry,
  user,
  onToggleSidebar,
  onOpenMessages,
  onOpenProfile,
  onOpenPassword,
  onLogout,
}: Props) {
  const actionTextClass = collapsed
    ? ''
    : isDark
      ? 'admin-header-user-text-dark'
      : 'admin-header-user-text-light';

  const iconButtonClass = `admin-header-icon-button ${
    isDark ? 'admin-header-icon-button-dark' : 'admin-header-icon-button-light'
  }`;

  return (
    <Header
      className={`admin-layout-header ${
        isDark ? 'admin-layout-header-dark' : 'admin-layout-header-light'
      } ${collapsed ? 'admin-layout-header-collapsed' : ''}`}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleSidebar}
        className={iconButtonClass}
      />
      <Space size={16}>
        {showMessageEntry ? (
          <Badge count={unreadCount} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              className={iconButtonClass}
              onClick={onOpenMessages}
            />
          </Badge>
        ) : null}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: ({ key }) => {
              if (key === 'profile') {
                onOpenProfile();
                return;
              }

              if (key === 'password') {
                onOpenPassword();
                return;
              }

              if (key === 'logout') {
                onLogout();
              }
            },
          }}
          placement="bottomRight"
        >
          <Space className="admin-header-user">
            <Avatar icon={<UserOutlined />} />
            {!collapsed && (
              <Text className={actionTextClass}>
                {user?.name || user?.username}
              </Text>
            )}
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
