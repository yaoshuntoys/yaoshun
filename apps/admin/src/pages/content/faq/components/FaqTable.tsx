import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { FaqItem } from '@/types';

interface Props {
  onEdit: (record: FaqItem) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (record: FaqItem, checked: boolean) => void;
  switchingIds: Set<number>;
}

export function createFaqColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  switchingIds,
}: Props) {
  const columns: ColumnsType<FaqItem> = [
    {
      title: '问题',
      dataIndex: 'questionZh',
      key: 'questionZh',
      minWidth: 260,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'categoryLabelZh',
      key: 'categoryLabelZh',
      width: 160,
      render: (_value: string, record: FaqItem) => (
        <Space size={4} direction="vertical">
          <Tag>{record.categoryLabelZh}</Tag>
          <span className="text-xs text-slate-400">{record.categoryKey}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_value: FaqItem['status'], record: FaqItem) => (
        <Switch
          checked={record.status === 'active'}
          checkedChildren="上架"
          unCheckedChildren="下架"
          loading={switchingIds.has(record.id)}
          onChange={(checked) => onToggleStatus(record, checked)}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
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
      fixed: 'right',
      render: (_value: unknown, record: FaqItem) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除这个问题吗？" onConfirm={() => onDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return columns;
}
