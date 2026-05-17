import { Descriptions, Empty, Modal, Spin, Tag } from 'antd';

import type { Message } from '@/api/message';

interface Props {
  open: boolean;
  loading: boolean;
  detail: Message | null;
  onCancel: () => void;
}

export default function MessageDetailModal({
  open,
  loading,
  detail,
  onCancel,
}: Props) {
  return (
    <Modal
      title={detail?.subject || '留言详情'}
      open={open}
      width={600}
      footer={null}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {detail ? (
          <Descriptions column={1} bordered size="small" className="mt-4">
            <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{detail.email}</Descriptions.Item>
            {detail.phone && <Descriptions.Item label="电话">{detail.phone}</Descriptions.Item>}
            {detail.subject && <Descriptions.Item label="主题">{detail.subject}</Descriptions.Item>}
            <Descriptions.Item label="留言内容">
              <div className="whitespace-pre-wrap">{detail.message}</div>
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {new Date(detail.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {detail.isRead ? <Tag color="default">已读</Tag> : <Tag color="blue">未读</Tag>}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty description="暂无留言详情" className="mt-4" />
        )}
      </Spin>
    </Modal>
  );
}
