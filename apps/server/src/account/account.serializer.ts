import { Prisma } from '@prisma/client';

export const ACCOUNT_SELECT = Prisma.validator<Prisma.AccountSelect>()({
  id: true,
  username: true,
  email: true,
  name: true,
  nickname: true,
  role: true,
  isSystem: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  roleConfig: {
    select: {
      code: true,
      name: true,
      isSystem: true,
      status: true,
      permissions: {
        select: {
          permission: {
            select: {
              code: true,
              name: true,
              module: true,
            },
          },
        },
      },
    },
  },
});

export type AccountWithRelations = Prisma.AccountGetPayload<{
  select: typeof ACCOUNT_SELECT;
}>;

export function serializeAccount(account: AccountWithRelations) {
  const permissions = account.roleConfig.permissions.map(
    (item) => item.permission,
  );

  return {
    id: account.id,
    username: account.username,
    email: account.email,
    name: account.name,
    nickname: account.nickname,
    role: account.role,
    isSystem: account.isSystem || account.roleConfig.isSystem,
    roleName: account.roleConfig.name,
    permissions: permissions.map((item) => item.code),
    permissionDetails: permissions,
    status: account.status,
    lastLoginAt: account.lastLoginAt,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
