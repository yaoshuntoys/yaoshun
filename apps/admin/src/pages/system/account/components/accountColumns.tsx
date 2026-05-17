import { DeleteOutlined, EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Space, Switch, Tag, Typography } from 'antd';

import type { User } from '@/types';

const { Text } = Typography;

interface Options {
  onEdit: (record: User) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (record: User) => void;
  onResetPassword: (record: User) => void;
}

export function createAccountColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword,
}: Options) {
  return [
    {
      title: '头像',
      key: 'avatar',
      width: 80,
      render: () => <Avatar icon={<UserOutlined />} size="large" />,
    },
    {
      title: '账号信息',
      key: 'info',
      render: (_: unknown, record: User) => (
        <div>
          <Text strong>{record.nickname || record.name}</Text>
          <div className="text-xs text-slate-400">
            {record.username}{record.email ? ` | ${record.email}` : ''}
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string, record: User) => (
        <Space>
          <Tag color={role === 'admin' ? 'red' : 'blue'}>
            {record.roleName || role}
          </Tag>
          {record.isSystem ? <Tag color="gold">系统账号</Tag> : null}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: User) => (
        <Switch
          checked={status === 'active'}
          onChange={() => onToggleStatus(record)}
          checkedChildren="启用"
          unCheckedChildren="停用"
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 180,
      render: (date: string) => date || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => date ? date.slice(0, 10) : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
            disabled={record.isSystem}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<LockOutlined />}
            size="small"
            onClick={() => onResetPassword(record)}
          >
            重置密码
          </Button>
          <Popconfirm
            title={record.isSystem ? '系统账号不支持删除' : '确定要删除这个账号吗？'}
            onConfirm={() => onDelete(record.id)}
            disabled={record.isSystem}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" disabled={record.isSystem}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
}
