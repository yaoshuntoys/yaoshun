import type { Permission } from '@/types';

export const permissionCodes = {
  dashboardView: 'dashboard.view',
  customerMessageManage: 'customer.message.manage',
  contentProductManage: 'content.product.manage',
  contentNewsManage: 'content.news.manage',
  contentMediaManage: 'content.media.manage',
  contentFaqManage: 'content.faq.manage',
  contentPartnerManage: 'content.partner.manage',
  pageManage: 'page.manage',
  recordLogView: 'record.log.view',
  recordMailView: 'record.mail.view',
  systemAccountManage: 'system.account.manage',
  systemRoleManage: 'system.role.manage',
  settingEnterpriseManage: 'setting.enterprise.manage',
  settingMailManage: 'setting.mail.manage',
} as const;

export type PermissionCode =
  (typeof permissionCodes)[keyof typeof permissionCodes];

type PermissionDefinition = Omit<Permission, 'id'> & {
  code: PermissionCode;
};

export const permissionDefinitions: Record<
  PermissionCode,
  PermissionDefinition
> = {
  [permissionCodes.dashboardView]: {
    code: permissionCodes.dashboardView,
    name: '查看仪表盘',
    module: '仪表盘',
    description: '查看后台运营概览与统计数据',
    sortOrder: 1,
  },
  [permissionCodes.customerMessageManage]: {
    code: permissionCodes.customerMessageManage,
    name: '客户留言管理',
    module: '客户管理',
    description: '查看、处理客户留言信息',
    sortOrder: 2,
  },
  [permissionCodes.contentProductManage]: {
    code: permissionCodes.contentProductManage,
    name: '产品中心管理',
    module: '内容管理',
    description: '维护产品中心内容',
    sortOrder: 3,
  },
  [permissionCodes.contentNewsManage]: {
    code: permissionCodes.contentNewsManage,
    name: '新闻中心管理',
    module: '内容管理',
    description: '维护新闻中心内容',
    sortOrder: 6,
  },
  [permissionCodes.contentMediaManage]: {
    code: permissionCodes.contentMediaManage,
    name: '多媒体库管理',
    module: '内容管理',
    description: '维护媒体文件与目录',
    sortOrder: 7,
  },
  [permissionCodes.contentFaqManage]: {
    code: permissionCodes.contentFaqManage,
    name: '常见问题管理',
    module: '内容管理',
    description: '维护常见问题内容',
    sortOrder: 9,
  },
  [permissionCodes.contentPartnerManage]: {
    code: permissionCodes.contentPartnerManage,
    name: '合作客户管理',
    module: '内容管理',
    description: '维护合作客户内容',
    sortOrder: 10,
  },
  [permissionCodes.pageManage]: {
    code: permissionCodes.pageManage,
    name: '页面管理',
    module: '页面管理',
    description: '维护关于我们、联系我们等页面配置',
    sortOrder: 11,
  },
  [permissionCodes.recordLogView]: {
    code: permissionCodes.recordLogView,
    name: '操作日志查看',
    module: '操作记录',
    description: '查看后台操作日志',
    sortOrder: 12,
  },
  [permissionCodes.recordMailView]: {
    code: permissionCodes.recordMailView,
    name: '邮件记录查看',
    module: '操作记录',
    description: '查看邮件发送记录',
    sortOrder: 13,
  },
  [permissionCodes.systemAccountManage]: {
    code: permissionCodes.systemAccountManage,
    name: '账号管理',
    module: '系统管理',
    description: '维护后台账号信息',
    sortOrder: 14,
  },
  [permissionCodes.systemRoleManage]: {
    code: permissionCodes.systemRoleManage,
    name: '角色管理',
    module: '系统管理',
    description: '维护角色与权限分配',
    sortOrder: 15,
  },
  [permissionCodes.settingEnterpriseManage]: {
    code: permissionCodes.settingEnterpriseManage,
    name: '企业设置',
    module: '系统设置',
    description: '维护企业基础信息配置',
    sortOrder: 16,
  },
  [permissionCodes.settingMailManage]: {
    code: permissionCodes.settingMailManage,
    name: '邮件设置',
    module: '系统设置',
    description: '维护邮件通道与通知配置',
    sortOrder: 17,
  },
};

export function getPermissionCatalogByCodes(
  codes: readonly string[],
): Permission[] {
  const seen = new Set<string>();
  let nextId = 1;

  return codes.flatMap((code) => {
    if (seen.has(code)) {
      return [];
    }

    const definition = permissionDefinitions[code as PermissionCode];
    if (!definition) {
      return [];
    }

    seen.add(code);

    return [
      {
        id: nextId++,
        ...definition,
      },
    ];
  });
}
