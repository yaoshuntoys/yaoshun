import { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';

import PageContainer from '@/components/PageContainer';
import { SearchTable, type SearchTableInstance, type SearchResult } from '@/components/SearchTable';
import { createMessage, getMessagePage, getMessageDetail, deleteMessage, type Message, type CreateMessagePayload } from '@/api/message';
import MessageDetailModal from '@/pages/customer/message/components/MessageDetailModal';
import MessageFormModal from '@/pages/customer/message/components/MessageFormModal';
import { createMessageColumns } from '@/pages/customer/message/components/messageColumns';
import {
  messageFields,
  messageInitialValues,
  resolveMessageReadStatus,
  type MessageSearchForm,
} from '@/pages/customer/message/constants';

export default function CustomerMessage() {
  const tableRef = useRef<SearchTableInstance>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailMessage, setDetailMessage] = useState<Message | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const searchFn = async (
    params: MessageSearchForm & { page: number; pageSize: number },
  ): Promise<SearchResult<Message>> => {
    const res = await getMessagePage({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword,
      isRead: resolveMessageReadStatus(params.isRead),
    });

    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  const handleView = async (record: Message) => {
    setDetailOpen(true);
    setDetailLoading(true);

    try {
      const detail = await getMessageDetail({ id: record.id });
      setDetailMessage(detail);
      tableRef.current?.reload();
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = (record: Message) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 "${record.name}" 的留言吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteMessage({ id: record.id });
        message.success('已删除');
        tableRef.current?.reload();
      },
    });
  };

  const handleCreate = async (values: CreateMessagePayload) => {
    setSubmitting(true);
    try {
      await createMessage({
        ...values,
        phone: values.phone?.trim() || undefined,
        subject: values.subject?.trim() || undefined,
      });
      message.success('留言提交成功');
      setCreateOpen(false);
      tableRef.current?.reload();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = createMessageColumns({
    onView: handleView,
    onDelete: handleDelete,
  });

  return (
    <PageContainer
      title="客户留言"
      description="默认展示未读留言，支持后台测试提交通道和详情追踪。"
      extra={(
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
        >
          新增留言
        </Button>
      )}
    >
      <SearchTable<Message, MessageSearchForm>
        ref={tableRef}
        initialValues={messageInitialValues}
        fields={messageFields}
        columns={columns}
        searchFn={searchFn}
      />

      <MessageFormModal
        open={createOpen}
        submitting={submitting}
        onCancel={() => setCreateOpen(false)}
        onFinish={handleCreate}
      />

      <MessageDetailModal
        open={detailOpen}
        loading={detailLoading}
        detail={detailMessage}
        onCancel={() => {
          setDetailOpen(false);
          setDetailMessage(null);
        }}
      />
    </PageContainer>
  );
}
