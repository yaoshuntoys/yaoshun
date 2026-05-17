import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Image, Popconfirm, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Partner } from '@/types';

interface Props {
  onEdit: (record: Partner) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (record: Partner, checked: boolean) => void;
  switchingIds: Set<number>;
}

export function createPartnerColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  switchingIds,
}: Props) {
  const columns: ColumnsType<Partner> = [
    {
      title: '客户名称',
      dataIndex: 'nameZh',
      key: 'nameZh',
      minWidth: 220,
      render: (_value: string, record: Partner) => (
        <Space size={4} direction="vertical">
          <span>{record.nameZh}</span>
          <span className="text-xs text-slate-400">{record.nameEn}</span>
        </Space>
      ),
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 120,
      render: (logo?: string | null) => (
        logo ? (
          <Image
            src={logo}
            alt="partner-logo"
            width={52}
            height={52}
            className="rounded-lg object-contain"
            preview={false}
          />
        ) : (
          <Tag>未配置</Tag>
        )
      ),
    },
    {
      title: '官网',
      dataIndex: 'website',
      key: 'website',
      minWidth: 180,
      ellipsis: true,
      render: (website?: string | null) => (
        website ? (
          <a href={website} target="_blank" rel="noreferrer" className="text-sky-600">
            <Space size={4}>
              <LinkOutlined />
              <span>{website}</span>
            </Space>
          </a>
        ) : (
          '-'
        )
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_value: Partner['status'], record: Partner) => (
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
      render: (_value: unknown, record: Partner) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除这个合作客户吗？" onConfirm={() => onDelete(record.id)}>
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
