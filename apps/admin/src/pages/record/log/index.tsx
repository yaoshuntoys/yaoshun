import { useRef } from 'react';

import { getOperationLogPage } from '@/api/log';
import PageContainer from '@/components/PageContainer';
import { SearchTable, type SearchResult, type SearchTableInstance } from '@/components/SearchTable';
import type { OperationLog } from '@/types';
import OperationLogActions from '@/pages/record/log/components/OperationLogActions';
import { operationLogFields, type OperationLogFiltersValue } from '@/pages/record/log/components/OperationLogFilters';
import { createOperationLogColumns } from '@/pages/record/log/components/operationLogColumns';

export default function OperationLogPage() {
  const tableRef = useRef<SearchTableInstance>(null);
  const columns = createOperationLogColumns();

  const searchFn = async (
    params: OperationLogFiltersValue & { page: number; pageSize: number },
  ): Promise<SearchResult<OperationLog>> => {
    const res = await getOperationLogPage({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword || undefined,
      module: params.module,
      startTime: params.dateRange?.[0]?.toISOString(),
      endTime: params.dateRange?.[1]?.toISOString(),
    });

    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  return (
    <PageContainer
      title="操作日志"
      description="记录后台关键操作、登录行为与模块流转，便于审计和问题追溯。"
    >
      <SearchTable<OperationLog, OperationLogFiltersValue>
        ref={tableRef}
        searchBarExtra={
          <OperationLogActions
            onRefresh={() => tableRef.current?.refresh()}
          />
        }
        initialValues={{
          keyword: '',
          module: undefined,
          dateRange: null,
        }}
        fields={operationLogFields}
        columns={columns}
        searchFn={searchFn}
      />
    </PageContainer>
  );
}
