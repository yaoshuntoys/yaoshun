import { DeleteOutlined, EditOutlined, LoginOutlined, PlusOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { OperationLog } from '@/types';

const { Text } = Typography;

const moduleColors: Record<string, string> = {
  '认证管理': 'blue',
  '账号管理': 'cyan',
  '分类管理': 'geekblue',
  '文章管理': 'green',
  '文件夹管理': 'purple',
  '多媒体库': 'orange',
  '系统配置': 'red',
  '留言管理': 'gold',
  '操作日志': 'default',
};

const actionIcons: Record<string, React.ReactNode> = {
  '登录': <LoginOutlined />,
  '创建文章': <PlusOutlined />,
  '更新产品': <EditOutlined />,
  '删除文件': <DeleteOutlined />,
  '上传文件': <PlusOutlined />,
  '修改配置': <SettingOutlined />,
};

export function createOperationLogColumns(): ColumnsType<OperationLog> {
  return [
    {
      title: '操作人',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (username?: string) => (
        <Space>
          <UserOutlined />
          <Text>{username || 'anonymous'}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (action: string) => (
        <Space>
          {actionIcons[action] || <EditOutlined />}
          <Text>{action}</Text>
        </Space>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) => (
        <Tag color={moduleColors[module] || 'default'}>{module}</Tag>
      ),
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (ip?: string) => <Tag color="default">{ip || '-'}</Tag>,
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a: OperationLog, b: OperationLog) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];
}
