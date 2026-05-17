import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteNews, getNewsPage, updateNews } from '@/api/article';
import type { FormField } from '@/components/ConfigurableForm';
import PageContainer from '@/components/PageContainer';
import {
  SearchTable,
  type SearchResult,
  type SearchTableInstance,
} from '@/components/SearchTable';
import { createNewsColumns } from '@/pages/content/news/components/NewsTable';
import type { Article } from '@/types';

interface NewsSearchForm extends Record<string, unknown> {
  keyword?: string;
  category?: Article['category'];
  status?: Article['status'];
}

const fields: FormField[] = [
  {
    name: 'keyword',
    type: 'input',
    componentProps: { placeholder: '搜索标题 / 摘要', allowClear: true },
  },
  {
    name: 'category',
    type: 'select',
    options: [
      { label: '公司新闻', value: 'company' },
      { label: '产品动态', value: 'product' },
      { label: '展会活动', value: 'events' },
      { label: '行业洞察', value: 'insights' },
      { label: '资质荣誉', value: 'awards' },
    ],
    componentProps: { placeholder: '分类', allowClear: true },
  },
  {
    name: 'status',
    type: 'select',
    options: [
      { label: '草稿', value: 'draft' },
      { label: '已发布', value: 'published' },
      { label: '已归档', value: 'archived' },
    ],
    componentProps: { placeholder: '状态', allowClear: true },
  },
];

export default function ArticleList() {
  const navigate = useNavigate();
  const tableRef = useRef<SearchTableInstance>(null);
  const [switchingIds, setSwitchingIds] = useState<Set<number>>(new Set());

  const handleAdd = () => {
    navigate('/content/news/create');
  };

  const handleEdit = (record: Article) => {
    navigate(`/content/news/edit/${record.id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteNews(id);
    message.success('删除成功');
    tableRef.current?.refresh();
  };

  const handleToggleStatus = async (record: Article, checked: boolean) => {
    setSwitchingIds((prev) => new Set(prev).add(record.id));
    try {
      await updateNews(record.id, {
        status: checked ? 'published' : 'draft',
        publishedAt: checked
          ? record.publishedAt || new Date().toISOString()
          : null,
      });
      message.success(checked ? '新闻已上架' : '新闻已下架');
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
    params: NewsSearchForm & { page: number; pageSize: number },
  ): Promise<SearchResult<Article>> => {
    const res = await getNewsPage({
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

  const columns = createNewsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    switchingIds,
  });

  return (
    <PageContainer
      title="新闻管理"
      description="管理官网新闻与资讯内容，支持分类筛选、编辑和发布开关。"
      extra={(
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建新闻
        </Button>
      )}
    >
      <SearchTable<Article, NewsSearchForm>
        ref={tableRef}
        initialValues={{ keyword: '', category: undefined, status: undefined }}
        fields={fields}
        columns={columns}
        searchFn={searchFn}
      />
    </PageContainer>
  );
}
