import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  deleteProduct,
  getProductPage,
  updateProduct,
} from '@/api/product';
import type { FormField } from '@/components/ConfigurableForm';
import PageContainer from '@/components/PageContainer';
import {
  SearchTable,
  type SearchResult,
  type SearchTableInstance,
} from '@/components/SearchTable';
import { createProductColumns } from '@/pages/content/product/components/ProductTable';
import type { Product } from '@/types';

interface ProductSearchForm extends Record<string, unknown> {
  keyword?: string;
  category?: Product['category'];
  status?: Product['status'];
}

const fields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: { placeholder: '搜索标题 / 描述', allowClear: true },
  },
  {
    name: 'category',
    type: 'select',
    options: [
      { label: '成品玩具项目', value: 'finished-toys' },
      { label: '玩具结构件与部件', value: 'parts-structures' },
      { label: '工艺配套能力', value: 'process-support' },
      { label: '配件与包装', value: 'accessories' },
    ],
    componentProps: { placeholder: '分类', allowClear: true },
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

export default function ProductList() {
  const navigate = useNavigate();
  const tableRef = useRef<SearchTableInstance>(null);
  const [switchingIds, setSwitchingIds] = useState<Set<number>>(new Set());

  const handleAdd = () => {
    navigate('/content/product/create');
  };

  const handleEdit = (record: Product) => {
    navigate(`/content/product/edit/${record.id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    message.success('删除成功');
    tableRef.current?.refresh();
  };

  const handleToggleStatus = async (record: Product, checked: boolean) => {
    setSwitchingIds((prev) => new Set(prev).add(record.id));
    try {
      await updateProduct(record.id, {
        status: checked ? 'active' : 'inactive',
      });
      message.success(checked ? '产品已上架' : '产品已下架');
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
    params: ProductSearchForm & { page: number; pageSize: number },
  ): Promise<SearchResult<Product>> => {
    const res = await getProductPage({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword || undefined,
      category: params.category,
      status: params.status,
    });

    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  const columns = createProductColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    switchingIds,
  });

  return (
    <PageContainer
      title="产品中心"
      description="统一维护产品展示内容，支持搜索、编辑和上下架切换。"
      extra={(
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加产品
        </Button>
      )}
    >
      <SearchTable<Product, ProductSearchForm>
        ref={tableRef}
        initialValues={{ keyword: '', category: undefined, status: undefined }}
        fields={fields}
        columns={columns}
        searchFn={searchFn}
      />
    </PageContainer>
  );
}
