import { Modal, Form, Input, Select, Checkbox, Divider } from 'antd';
import type { Permission, Role } from '@/types';

interface Props {
  open: boolean;
  loading: boolean;
  role: Role | null;
  permissions: Permission[];
  onCancel: () => void;
  onFinish: (values: {
    code: string;
    name: string;
    description?: string;
    status: Role['status'];
    permissionCodes?: string[];
  }) => void;
}

function groupPermissions(permissions: Permission[]) {
  return permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {});
}

export default function RoleFormModal({
  open,
  loading,
  role,
  permissions,
  onCancel,
  onFinish,
}: Props) {
  const [form] = Form.useForm();
  const groupedPermissions = groupPermissions(permissions);
  const selectedPermissionCodes =
    (Form.useWatch('permissionCodes', form) as string[] | undefined) ?? [];

  const handlePermissionGroupChange = (
    modulePermissions: Permission[],
    values: Array<string | number>,
  ) => {
    const moduleCodes = modulePermissions.map((item) => item.code);
    const remainingCodes = selectedPermissionCodes.filter(
      (code) => !moduleCodes.includes(code),
    );
    form.setFieldsValue({
      permissionCodes: [...remainingCodes, ...values.map(String)],
    });
  };

  return (
    <Modal
      title={role ? '编辑角色' : '新增角色'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={860}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue({
            code: role?.code,
            name: role?.name,
            description: role?.description ?? undefined,
            status: role?.status ?? 'active',
            permissionCodes: role?.permissionCodes ?? [],
          });
          return;
        }

        form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="例如：内容运营" />
        </Form.Item>

        <Form.Item
          name="code"
          label="角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
        >
          <Input placeholder="例如：content_manager" disabled={!!role?.isSystem} />
        </Form.Item>

        <Form.Item name="description" label="角色说明">
          <Input.TextArea rows={3} placeholder="请输入角色说明" />
        </Form.Item>

        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择角色状态' }]}>
          <Select
            options={[
              { label: '启用', value: 'active' },
              { label: '停用', value: 'inactive' },
            ]}
          />
        </Form.Item>
        <Divider orientation={'left' as never}>权限分配</Divider>

        <Form.Item name="permissionCodes" hidden>
          <Select mode="multiple" options={[]} />
        </Form.Item>

        {Object.entries(groupedPermissions).map(([module, items]) => (
          <div key={module} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>{module}</div>
            <Checkbox.Group
              value={selectedPermissionCodes.filter((code) =>
                items.some((permission) => permission.code === code),
              )}
              options={items.map((permission) => ({
                label: `${permission.name}${permission.description ? ` (${permission.description})` : ''}`,
                value: permission.code,
              }))}
              onChange={(values) => handlePermissionGroupChange(items, values)}
            />
          </div>
        ))}
      </Form>
    </Modal>
  );
}
