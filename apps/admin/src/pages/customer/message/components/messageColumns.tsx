import { Badge, Button, Space, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { Message } from '@/api/message';

interface Options {
  onView: (record: Message) => void | Promise<void>;
  onDelete: (record: Message) => void;
}

export function createMessageColumns({ onView, onDelete }: Options): ColumnsType<Message> {
  return [
    {
      title: '状态',
      dataIndex: 'isRead',
      width: 96,
      render: (isRead: boolean) =>
        isRead ? (
          <Tag color="default">已读</Tag>
        ) : (
          <Tag color="error" style={{ fontWeight: 600 }}>
            <Badge color="#ff4d4f" text={<span style={{ color: '#cf1322', fontWeight: 600 }}>未读</span>} />
          </Tag>
        ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 140,
      ellipsis: true,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
        },
      }),
      render: (value: string, record: Message) =>
        record.isRead ? value : <span style={{ fontWeight: 600, color: '#cf1322' }}>{value}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 130,
      render: (value: string) => value || '-',
    },
    {
      title: '主题',
      dataIndex: 'subject',
      width: 180,
      ellipsis: true,
      render: (value: string) => value || '-',
    },
    {
      title: '留言内容',
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => new Date(value).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: Message) => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>
            查看
          </Button>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
}
