import { useEffect, useMemo, useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Role, User } from '@/types';
import {
  getAccountPage,
  deleteAccount,
  updateAccount,
  createAccount,
  toggleAccountStatus,
  resetAccountPassword,
  getAssignableRoleList,
} from '@/api';
import PageContainer from '@/components/PageContainer';
import { SearchTable, type SearchResult } from '@/components/SearchTable';
import { createAccountFields, type AccountFilter } from '@/pages/system/account/constants';
import AccountFormModal from '@/pages/system/account/components/AccountFormModal';
import { createAccountColumns } from '@/pages/system/account/components/accountColumns';
import ResetPasswordModal from '@/pages/system/account/components/ResetPasswordModal';

export default function AccountManager() {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    const fetchRoles = async () => {
      const roleList = await getAssignableRoleList();
      setRoles(roleList);
    };

    void fetchRoles();
  }, []);

  const searchFn = async (
    params: AccountFilter & { page: number; pageSize: number },
  ): Promise<SearchResult<User>> => {
    const res = await getAccountPage(params);
    return {
      data: res.list,
      pagination: { page: res.page, pageSize: res.pageSize, total: res.total },
    };
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    setFormModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount({ id });
      message.success('删除成功');
      setTableKey((prev) => prev + 1);
    } catch {
      // handled by middleware
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleAccountStatus({ id: user.id });
      message.success(`账号已${user.status === 'active' ? '停用' : '启用'}`);
      setTableKey((prev) => prev + 1);
    } catch {
      // handled by middleware
    }
  };

  const handleFormSubmit = async (values: Partial<User> & { password?: string }) => {
    try {
      if (editingUser) {
        await updateAccount({ id: editingUser.id, ...values });
        message.success('更新成功');
      } else {
        await createAccount(values as Partial<User> & { password: string });
        message.success('创建成功');
      }
      setFormModalOpen(false);
      setTableKey((prev) => prev + 1);
    } catch {
      // handled by middleware
    }
  };

  const handlePasswordSubmit = async (values: { password: string }) => {
    if (!selectedUser) return;
    try {
      await resetAccountPassword({ id: selectedUser.id, password: values.password });
      message.success('密码重置成功');
      setPasswordModalOpen(false);
    } catch {
      // handled by middleware
    }
  };

  const handleOpenResetPassword = (record: User) => {
    setSelectedUser(record);
    setPasswordModalOpen(true);
  };

  const columns = createAccountColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    onResetPassword: handleOpenResetPassword,
  });

  const accountFields = useMemo(() => createAccountFields(roles), [roles]);

  return (
    <PageContainer
      title="账号管理"
      description="集中维护后台账号、角色归属、启停状态与密码重置。"
      extra={(
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null);
            setFormModalOpen(true);
          }}
        >
          添加账号
        </Button>
      )}
    >
      <SearchTable<User, AccountFilter>
        key={tableKey}
        fields={accountFields}
        columns={columns}
        searchFn={searchFn}
      />

      <AccountFormModal
        open={formModalOpen}
        editingUser={editingUser}
        roles={roles}
        onCancel={() => setFormModalOpen(false)}
        onFinish={handleFormSubmit}
      />

      <ResetPasswordModal
        open={passwordModalOpen}
        account={selectedUser}
        onCancel={() => setPasswordModalOpen(false)}
        onFinish={handlePasswordSubmit}
      />
    </PageContainer>
  );
}
