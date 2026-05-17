import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Article } from '@/types';

interface Props {
  onEdit: (record: Article) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (record: Article, checked: boolean) => void;
  switchingIds: Set<number>;
}

export function createNewsColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  switchingIds,
}: Props) {
  const columns: ColumnsType<Article> = [
    {
      title: '中文标题',
      dataIndex: 'titleZh',
      key: 'titleZh',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: Article['category']) => <Tag>{category}</Tag>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 180,
      ellipsis: true,
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: (a: Article, b: Article) => a.viewCount - b.viewCount,
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_: Article['status'], record: Article) => (
        <Switch
          checked={record.status === 'published'}
          checkedChildren="上架"
          unCheckedChildren="下架"
          loading={switchingIds.has(record.id)}
          onChange={(checked) => onToggleStatus(record, checked)}
        />
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 180,
      render: (date?: string) => (date ? new Date(date).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: Article) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这篇文章吗？" onConfirm={() => onDelete(record.id)}>
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
