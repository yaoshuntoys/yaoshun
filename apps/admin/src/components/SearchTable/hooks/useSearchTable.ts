import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type Ref,
} from 'react';

import { Form } from 'antd';

import type {
  Pagination,
  SearchTableInstance,
  SearchTableProps,
} from '@/components/SearchTable/types';

interface Params<T extends object, F extends Record<string, unknown>>
  extends Pick<
    SearchTableProps<T, F>,
    | 'defaultPageSize'
    | 'enableRowSelection'
    | 'initialValues'
    | 'onSearchValuesChange'
    | 'onSelectionChange'
    | 'searchFn'
  > {
  ref: Ref<SearchTableInstance>;
}

export function useSearchTable<T extends object, F extends Record<string, unknown>>({
  ref,
  searchFn,
  initialValues,
  defaultPageSize = 10,
  enableRowSelection = false,
  onSelectionChange,
  onSearchValuesChange,
}: Params<T, F>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [lastSearchValues, setLastSearchValues] = useState<F | undefined>();
  const [form] = Form.useForm<F>();

  const fetchData = useCallback(
    async (formData: F, page: number, pageSizeOverride?: number) => {
      const pageSize = pageSizeOverride ?? pagination.pageSize;
      setLoading(true);
      try {
        const result = await searchFn({ ...formData, page, pageSize });
        setData(result.data);
        setPagination(result.pagination);
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize, searchFn],
  );

  const handleSearch = useCallback(
    (formData: F) => {
      setLastSearchValues(formData);
      onSearchValuesChange?.(formData);
      void fetchData(formData, 1);
    },
    [fetchData, onSearchValuesChange],
  );

  const handleReset = useCallback(() => {
    const values = form.getFieldsValue() as F;
    setLastSearchValues(values);
    onSearchValuesChange?.(values);
    void fetchData(values, 1);
  }, [fetchData, form, onSearchValuesChange]);

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      const current = lastSearchValues ?? (form.getFieldsValue() as F);
      const newPage = pageSize !== pagination.pageSize ? 1 : page;
      void fetchData(current, newPage, pageSize);
    },
    [fetchData, form, lastSearchValues, pagination.pageSize],
  );

  useImperativeHandle(ref, () => ({
    reload: () => handleSearch(form.getFieldsValue() as F),
    refresh: () => void fetchData(form.getFieldsValue() as F, pagination.page),
    getFieldsValue: () => form.getFieldsValue() as Record<string, unknown>,
  }));

  useEffect(() => {
    if (!enableRowSelection || !onSelectionChange) return;
    const selected = data.filter((row) => (row as { __selected__?: boolean }).__selected__);
    onSelectionChange(selected);
  }, [data, enableRowSelection, onSelectionChange]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues as never);
    }

    const initial = (form.getFieldsValue() as F) ?? ({} as F);
    setLastSearchValues(initial);
    void fetchData(initial, 1);
  }, [fetchData, form, initialValues]);

  return {
    data,
    form,
    loading,
    pagination,
    handlePaginationChange,
    handleReset,
    handleSearch,
  };
}
