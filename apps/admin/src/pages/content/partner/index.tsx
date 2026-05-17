import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  deletePartner,
  getPartnerPage,
  updatePartner,
} from '@/api/partner';
import type { FormField } from '@/components/ConfigurableForm';
import PageContainer from '@/components/PageContainer';
import {
  SearchTable,
  type SearchResult,
  type SearchTableInstance,
} from '@/components/SearchTable';
import { createPartnerColumns } from '@/pages/content/partner/components/PartnerTable';
import type { Partner } from '@/types';

interface PartnerSearchForm extends Record<string, unknown> {
  keyword?: string;
  status?: Partner['status'];
}

const fields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: { placeholder: '搜索客户名称', allowClear: true },
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

export default function PartnerList() {
  const navigate = useNavigate();
  const tableRef = useRef<SearchTableInstance>(null);
  const [switchingIds, setSwitchingIds] = useState<Set<number>>(new Set());

  const handleAdd = () => {
    navigate('/content/partner/create');
  };

  const handleEdit = (record: Partner) => {
    navigate(`/content/partner/edit/${record.id}`);
  };

  const handleDelete = async (id: number) => {
    await deletePartner(id);
    message.success('合作客户已删除');
    tableRef.current?.refresh();
  };

  const handleToggleStatus = async (record: Partner, checked: boolean) => {
    setSwitchingIds((prev) => new Set(prev).add(record.id));
    try {
      await updatePartner(record.id, {
        status: checked ? 'active' : 'inactive',
      });
      message.success(checked ? '合作客户已上架' : '合作客户已下架');
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
    params: PartnerSearchForm & { page: number; pageSize: number },
  ): Promise<SearchResult<Partner>> => {
    const res = await getPartnerPage({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword || undefined,
      status: params.status,
    });

    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  return (
    <PageContainer
      title="合作客户"
      description="维护首页合作客户展示内容，支持 Logo、官网地址和上下架状态管理。"
      extra={(
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增客户
        </Button>
      )}
    >
      <SearchTable<Partner, PartnerSearchForm>
        ref={tableRef}
        initialValues={{ keyword: '', status: undefined }}
        fields={fields}
        columns={createPartnerColumns({
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
