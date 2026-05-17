import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Role } from '@/types';

interface Options {
  onEdit: (record: Role) => void;
  onDelete: (record: Role) => void;
  onToggleStatus: (record: Role) => void;
}

export function createRoleColumns({
  onEdit,
  onDelete,
  onToggleStatus,
}: Options): ColumnsType<Role> {
  return [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 160,
      render: (value: string, record: Role) => (
        <Space direction="vertical" size={2}>
          <span>{value}</span>
          <span style={{ color: '#64748b', fontSize: 12 }}>{record.code}</span>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '权限数',
      dataIndex: 'permissionCount',
      key: 'permissionCount',
      width: 100,
    },
    {
      title: '账号数',
      dataIndex: 'accountCount',
      key: 'accountCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: Role['status'], record: Role) => (
        <Space>
          <Tag color={status === 'active' ? 'success' : 'default'}>
            {status === 'active' ? '启用' : '停用'}
          </Tag>
          <Switch
            checked={status === 'active'}
            checkedChildren="启用"
            unCheckedChildren="停用"
            onChange={() => onToggleStatus(record)}
            disabled={record.isSystem}
          />
        </Space>
      ),
    },
    {
      title: '系统角色',
      dataIndex: 'isSystem',
      key: 'isSystem',
      width: 100,
      render: (value: boolean) => (
        <Tag color={value ? 'blue' : 'default'}>{value ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (value: string) => new Date(value).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: Role) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            disabled={record.isSystem}
          >
            编辑
          </Button>
          <Popconfirm
            title={record.isSystem ? '系统角色不支持删除' : '确定要删除该角色吗？'}
            onConfirm={() => onDelete(record)}
            disabled={record.isSystem}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.isSystem}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
}
