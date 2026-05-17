import { forwardRef, type ReactElement, type Ref } from 'react';

import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useSearchTable } from '@/components/SearchTable/hooks/useSearchTable';
import styles from '@/components/SearchTable/index.module.css';
import { SearchBar } from '@/components/SearchTable/SearchBar';
import { normalizeSearchTableColumns } from '@/components/SearchTable/table';
import type {
  SearchTableInstance,
  SearchTableProps,
} from '@/components/SearchTable/types';

export type {
  SearchResult,
  SearchTableInstance,
  SearchTableProps,
} from '@/components/SearchTable/types';

const SearchTableInternal = <
  T extends object,
  F extends Record<string, unknown>,
>(
  {
    fields,
    initialValues,
    columns,
    searchFn,
    defaultPageSize = 10,
    enableRowSelection = false,
    searchBarExtra,
    onSelectionChange,
    onSearchValuesChange,
  }: SearchTableProps<T, F>,
  ref: Ref<SearchTableInstance>,
) => {
  const {
    data,
    form,
    loading,
    pagination,
    handlePaginationChange,
    handleReset,
    handleSearch,
  } = useSearchTable<T, F>({
    ref,
    searchFn,
    initialValues,
    defaultPageSize,
    enableRowSelection,
    onSelectionChange,
    onSearchValuesChange,
  });

  const normalizedColumns = normalizeSearchTableColumns(columns as ColumnsType<T>);

  return (
    <div className={styles.root}>
      <Card>
        <SearchBar
          fields={fields}
          form={form}
          initialValues={initialValues as Record<string, unknown> | undefined}
          onSearch={(values) => handleSearch(values as F)}
          onReset={handleReset}
          extraAction={searchBarExtra}
        />
      </Card>

      <Card className={styles.tableWrap}>
        <Table<T>
          rowKey={(record, index) =>
            ((record as { id?: string | number; key?: string | number }).id ??
              (record as { key?: string | number }).key ??
              index) as string | number
          }
          loading={loading}
          columns={normalizedColumns}
          dataSource={data}
          tableLayout="auto"
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            onChange: handlePaginationChange,
          }}
          rowSelection={
            enableRowSelection && onSelectionChange
              ? {
                  onChange: (_, selectedRows) =>
                    onSelectionChange(selectedRows),
                }
              : undefined
          }
        />
      </Card>
    </div>
  );
};

export const SearchTable = forwardRef(SearchTableInternal) as <
  T extends object,
  F extends Record<string, unknown>,
>(
  props: SearchTableProps<T, F> & { ref?: Ref<SearchTableInstance> },
) => ReactElement;
