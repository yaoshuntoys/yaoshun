import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';

import {
  createRole,
  deleteRole,
  getRoleDetail,
  getRolePage,
  toggleRole,
  updateRole,
} from '@/api/permission';
import { menuPermissionCatalog } from '@/config';
import PageContainer from '@/components/PageContainer';
import { SearchTable, type SearchResult, type SearchTableInstance } from '@/components/SearchTable';
import type { Role } from '@/types';
import RoleFormModal from '@/pages/system/role/components/RoleFormModal';
import { createRoleColumns } from '@/pages/system/role/components/roleColumns';
import { roleFields, type RoleFilter } from '@/pages/system/role/constants';

export default function RoleManager() {
  const tableRef = useRef<SearchTableInstance>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const searchFn = async (
    params: RoleFilter & { page: number; pageSize: number },
  ): Promise<SearchResult<Role>> => {
    const res = await getRolePage({
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

  const handleEdit = async (record: Role) => {
    const detail = await getRoleDetail({ id: record.id });
    setEditingRole(detail);
    setModalOpen(true);
  };

  const handleDelete = async (record: Role) => {
    await deleteRole({ id: record.id });
    message.success('角色删除成功');
    tableRef.current?.refresh();
  };

  const handleToggleStatus = async (record: Role) => {
    await toggleRole({ id: record.id });
    message.success(`角色已${record.status === 'active' ? '停用' : '启用'}`);
    tableRef.current?.refresh();
  };

  const handleSubmit = async (values: {
    code: string;
    name: string;
    description?: string;
    status: Role['status'];
    permissionCodes?: string[];
  }) => {
    setSaving(true);
    try {
      if (editingRole) {
        await updateRole({
          id: editingRole.id,
          ...values,
          permissionCodes: values.permissionCodes ?? [],
        });
        message.success('角色更新成功');
      } else {
        await createRole({
          ...values,
          permissionCodes: values.permissionCodes ?? [],
        });
        message.success('角色创建成功');
      }
      setModalOpen(false);
      setEditingRole(null);
      tableRef.current?.reload();
    } finally {
      setSaving(false);
    }
  };

  const columns = createRoleColumns({
    onEdit: (record) => void handleEdit(record),
    onDelete: (record) => void handleDelete(record),
    onToggleStatus: (record) => void handleToggleStatus(record),
  });

  return (
    <PageContainer
      title="角色管理"
      description="使用 RBAC 模型维护角色、权限集合和账号可分配范围。"
      extra={(
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRole(null);
            setModalOpen(true);
          }}
        >
          新增角色
        </Button>
      )}
    >
      <SearchTable<Role, RoleFilter>
        ref={tableRef}
        fields={roleFields}
        columns={columns}
        searchFn={searchFn}
      />

      <RoleFormModal
        open={modalOpen}
        loading={saving}
        role={editingRole}
        permissions={menuPermissionCatalog}
        onCancel={() => {
          setModalOpen(false);
          setEditingRole(null);
        }}
        onFinish={(values) => void handleSubmit(values)}
      />
    </PageContainer>
  );
}
