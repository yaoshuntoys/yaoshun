import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  deleteFaq,
  getFaqPage,
  updateFaq,
} from '@/api/faq';
import type { FormField } from '@/components/ConfigurableForm';
import PageContainer from '@/components/PageContainer';
import {
  SearchTable,
  type SearchResult,
  type SearchTableInstance,
} from '@/components/SearchTable';
import { createFaqColumns } from '@/pages/content/faq/components/FaqTable';
import type { FaqItem } from '@/types';

interface FaqSearchForm extends Record<string, unknown> {
  keyword?: string;
  categoryKey?: string;
  status?: FaqItem['status'];
}

const fields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: { placeholder: '搜索问题 / 答案 / 分类', allowClear: true },
  },
  {
    name: 'categoryKey',
    type: 'input',
    componentProps: { placeholder: '分类标识', allowClear: true },
  },
  {
    name: 'status',
    type: 'select',
    options: [
      { label: '上架', value: 'active' },
      { label: '下架', value: 'inactive' },
    ],
    componentProps: { placeholder: '状态', allowClear: true },
  },
];

export default function FaqList() {
  const navigate = useNavigate();
  const tableRef = useRef<SearchTableInstance>(null);
  const [switchingIds, setSwitchingIds] = useState<Set<number>>(new Set());

  const handleAdd = () => {
    navigate('/content/faq/create');
  };

  const handleEdit = (record: FaqItem) => {
    navigate(`/content/faq/edit/${record.id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteFaq(id);
    message.success('常见问题已删除');
    tableRef.current?.refresh();
  };

  const handleToggleStatus = async (record: FaqItem, checked: boolean) => {
    setSwitchingIds((prev) => new Set(prev).add(record.id));
    try {
      await updateFaq(record.id, {
        status: checked ? 'active' : 'inactive',
      });
      message.success(checked ? '问题已上架' : '问题已下架');
      tableRef.current?.refresh();
    } finally {
      setSwitchingIds((prev) => {
        const next = new Set(prev);
        next.delete(record.id);
        return next;
      });
    }
  };

  const searchFn = async (
    params: FaqSearchForm & { page: number; pageSize: number },
  ): Promise<SearchResult<FaqItem>> => {
    const res = await getFaqPage({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword || undefined,
      categoryKey: params.categoryKey || undefined,
      status: params.status,
    });

    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  return (
    <PageContainer
      title="常见问题"
      description="将官网 FAQ 独立成内容表维护，支持分类、排序和上下架。"
      extra={(
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增问题
        </Button>
      )}
    >
      <SearchTable<FaqItem, FaqSearchForm>
        ref={tableRef}
        initialValues={{ keyword: '', categoryKey: '', status: undefined }}
        fields={fields}
        columns={createFaqColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
          onToggleStatus: handleToggleStatus,
          switchingIds,
        })}
        searchFn={searchFn}
      />
    </PageContainer>
  );
}
