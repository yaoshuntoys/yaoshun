import { Space, Typography } from 'antd';

import { APP_NAME } from '@/config';

const { Text } = Typography;

interface Props {
  collapsed: boolean;
  isDark: boolean;
}

export default function AppLogo({ collapsed, isDark }: Props) {
  return (
    <div
      className={`admin-logo ${
        collapsed ? 'admin-logo-collapsed' : 'admin-logo-expanded'
      } ${isDark ? 'admin-logo-dark' : 'admin-logo-light'}`}
    >
      <Space>
        <img
          src="/favicon-rounded-192.png"
          alt={APP_NAME}
          className="admin-logo-image"
        />
        {!collapsed && (
          <Text
            strong
            className={`admin-logo-text ${
              isDark ? 'admin-logo-text-dark' : 'admin-logo-text-light'
            }`}
          >
            {APP_NAME}
          </Text>
        )}
      </Space>
    </div>
  );
}
