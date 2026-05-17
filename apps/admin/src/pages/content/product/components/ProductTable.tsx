import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Product } from '@/types';

interface Props {
  onEdit: (record: Product) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (record: Product, checked: boolean) => void;
  switchingIds: Set<number>;
}

export function createProductColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  switchingIds,
}: Props) {
  const columns: ColumnsType<Product> = [
    {
      title: '中文标题',
      dataIndex: 'titleZh',
      key: 'titleZh',
      ellipsis: true,
    },
    {
      title: '产品 ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 140,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: Product['category']) => <Tag>{category.toUpperCase()}</Tag>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 180,
      ellipsis: true,
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_: Product['status'], record: Product) => (
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
      title: '素材数',
      dataIndex: 'images',
      key: 'images',
      width: 90,
      render: (images: Product['images']) => images?.length ?? 0,
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
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个产品吗？" onConfirm={() => onDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return columns;
}
