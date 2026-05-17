import * as bcrypt from "bcrypt";

import { PERMISSION_DEFINITIONS } from "../../src/permission/permission.constants";
import type { SeedPrisma } from "./client";

export async function seedAuth(prisma: SeedPrisma) {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const editorPassword = await bcrypt.hash("editor123", 12);

  await prisma.role.upsert({
    where: { code: "admin" },
    update: {
      name: "管理员",
      description: "系统管理员，默认拥有全部后台权限",
      status: "active",
      isSystem: true,
      sortOrder: 0,
    },
    create: {
      code: "admin",
      name: "管理员",
      description: "系统管理员，默认拥有全部后台权限",
      status: "active",
      isSystem: true,
      sortOrder: 0,
    },
  });

  await prisma.role.upsert({
    where: { code: "editor" },
    update: {
      name: "编辑员",
      description: "内容编辑角色，默认拥有常用内容维护权限",
      status: "active",
      isSystem: true,
      sortOrder: 10,
    },
    create: {
      code: "editor",
      name: "编辑员",
      description: "内容编辑角色，默认拥有常用内容维护权限",
      status: "active",
      isSystem: true,
      sortOrder: 10,
    },
  });

  await prisma.account.upsert({
    where: { username: "admin" },
    update: {
      email: "admin@yaoshuntoys.com",
      name: "超级管理员",
      nickname: "超级管理员",
      role: "admin",
      isSystem: true,
      status: "active",
    },
    create: {
      username: "admin",
      password: adminPassword,
      email: "admin@yaoshuntoys.com",
      name: "超级管理员",
      nickname: "超级管理员",
      role: "admin",
      isSystem: true,
      status: "active",
    },
  });

  await prisma.account.upsert({
    where: { username: "editor" },
    update: {
      email: "editor@yaoshuntoys.com",
      name: "内容编辑",
      nickname: "内容编辑",
      role: "editor",
      isSystem: true,
      status: "active",
    },
    create: {
      username: "editor",
      password: editorPassword,
      email: "editor@yaoshuntoys.com",
      name: "内容编辑",
      nickname: "内容编辑",
      role: "editor",
      isSystem: true,
      status: "active",
    },
  });

  const permissionMap = new Map<string, number>();
  for (const permission of PERMISSION_DEFINITIONS) {
    const saved = await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        name: permission.name,
        module: permission.module,
        description: permission.description,
        sortOrder: permission.sortOrder,
        isSystem: true,
      },
      create: {
        code: permission.code,
        name: permission.name,
        module: permission.module,
        description: permission.description,
        sortOrder: permission.sortOrder,
        isSystem: true,
      },
    });
    permissionMap.set(permission.code, saved.id);
  }

  const rolePermissionCodes = {
    admin: PERMISSION_DEFINITIONS.map((item) => item.code),
    editor: [
      "dashboard.view",
      "content.product.manage",
      "content.news.manage",
      "content.media.manage",
      "content.faq.manage",
      "content.partner.manage",
      "page.manage",
      "customer.message.manage",
      "record.mail.view",
      "setting.enterprise.manage",
    ],
  };

  for (const [roleCode, permissionCodes] of Object.entries(
    rolePermissionCodes,
  )) {
    const role = await prisma.role.findUnique({ where: { code: roleCode } });
    if (!role) continue;

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    for (const permissionCode of permissionCodes) {
      const permissionId = permissionMap.get(permissionCode);
      if (!permissionId) continue;

      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId },
      });
    }
  }
}
