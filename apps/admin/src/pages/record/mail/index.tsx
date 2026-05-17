import { getMailRecordPage } from '@/api/mail';
import PageContainer from '@/components/PageContainer';
import { SearchTable, type SearchResult } from '@/components/SearchTable';
import { createMailRecordColumns } from '@/pages/record/mail/components/mailRecordColumns';
import {
  mailRecordFields,
  mailRecordInitialValues,
  type MailRecordSearchForm,
} from '@/pages/record/mail/constants';
import type { MailRecord } from '@/types';

export default function MailRecordPage() {
  const columns = createMailRecordColumns();

  const searchFn = async (
    params: MailRecordSearchForm & { page: number; pageSize: number },
  ): Promise<SearchResult<MailRecord>> => {
    const res = await getMailRecordPage({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword,
      scene: params.scene,
      status: params.status,
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
      title="邮件记录"
      description="查询系统发送的测试邮件、留言通知和密码重置邮件投递结果。"
    >
      <SearchTable<MailRecord, MailRecordSearchForm>
        initialValues={mailRecordInitialValues}
        fields={mailRecordFields}
        columns={columns}
        searchFn={searchFn}
      />
    </PageContainer>
  );
}
