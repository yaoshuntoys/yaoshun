import { Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  sceneLabels,
  statusColors,
  statusLabels,
} from '@/pages/record/mail/constants';
import type { MailRecord } from '@/types';

const { Paragraph, Text } = Typography;

export function createMailRecordColumns(): ColumnsType<MailRecord> {
  return [
    {
      title: '发送场景',
      dataIndex: 'scene',
      key: 'scene',
      width: 120,
      render: (scene: MailRecord['scene']) => sceneLabels[scene] || scene,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: MailRecord['status']) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '收件人',
      dataIndex: 'toEmail',
      key: 'toEmail',
      width: 220,
    },
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      width: 220,
    },
    {
      title: '邮件内容',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <Tooltip title={<div className="max-w-[480px] whitespace-pre-wrap">{content}</div>}>
          <Paragraph ellipsis={{ rows: 2 }} className="!mb-0">
            {content}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: '失败原因',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      width: 220,
      render: (errorMessage?: string | null) =>
        errorMessage ? <Text type="danger">{errorMessage}</Text> : '-',
    },
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
  ];
}
