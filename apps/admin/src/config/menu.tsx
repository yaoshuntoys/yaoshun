import {
  AppstoreOutlined,
  CommentOutlined,
  DashboardOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  MailOutlined,
  LayoutOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  ScheduleOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { getPermissionCatalogByCodes, permissionCodes } from '@/config/permissions';
import { pageMetaList } from '@/pages/page/config';
import type { Permission } from '@/types';

export interface AppMenuConfigItem {
  key: string;
  title: string;
  icon?: ReactNode;
  permissions?: string[];
  children?: AppMenuConfigItem[];
}

export interface AppMenuItem extends AppMenuConfigItem {
  label: ReactNode;
  children?: AppMenuItem[];
}

const pageIconMap: Record<string, ReactNode> = {
  home: <LayoutOutlined />,
  products: <ShoppingOutlined />,
  solutions: <ScheduleOutlined />,
  about: <InfoCircleOutlined />,
  faq: <QuestionCircleOutlined />,
  news: <ReadOutlined />,
  privacy: <ScheduleOutlined />,
  terms: <ScheduleOutlined />,
};

const pageMenuItems: AppMenuConfigItem[] = pageMetaList.map((item) => ({
  key: `/page/${item.routePath}`,
  title: item.title,
  icon: pageIconMap[item.key] ?? <ScheduleOutlined />,
  permissions: [permissionCodes.pageManage],
}));

export const menuConfig: AppMenuConfigItem[] = [
  {
    key: '/dashboard',
    title: '仪表盘',
    icon: <DashboardOutlined />,
    permissions: [permissionCodes.dashboardView],
  },
  {
    key: '/customer',
    title: '客户管理',
    icon: <TeamOutlined />,
    children: [
      {
        key: '/customer/message',
        title: '客户留言',
        icon: <CommentOutlined />,
        permissions: [permissionCodes.customerMessageManage],
      },
    ],
  },
  {
    key: '/content',
    title: '内容管理',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '/content/product',
        title: '商品管理',
        icon: <ShoppingOutlined />,
        permissions: [permissionCodes.contentProductManage],
      },
      {
        key: '/content/news',
        title: '新闻管理',
        icon: <ReadOutlined />,
        permissions: [permissionCodes.contentNewsManage],
      },
      {
        key: '/content/faq',
        title: '常见问题',
        icon: <QuestionCircleOutlined />,
        permissions: [permissionCodes.contentFaqManage],
      },
      {
        key: '/content/partner',
        title: '合作客户',
        icon: <UsergroupAddOutlined />,
        permissions: [permissionCodes.contentPartnerManage],
      },
      {
        key: '/content/media',
        title: '多媒体库',
        icon: <PictureOutlined />,
        permissions: [permissionCodes.contentMediaManage],
      },
    ],
  },
  {
    key: '/page',
    title: '页面管理',
    icon: <LayoutOutlined />,
    children: pageMenuItems,
  },
  {
    key: '/setting',
    title: '系统设置',
    icon: <SettingOutlined />,
    children: [
      {
        key: '/setting/enterprise',
        title: '企业设置',
        icon: <TeamOutlined />,
        permissions: [permissionCodes.settingEnterpriseManage],
      },
      {
        key: '/setting/mail',
        title: '邮件设置',
        icon: <MailOutlined />,
        permissions: [permissionCodes.settingMailManage],
      },
    ],
  },
  {
    key: '/record',
    title: '操作记录',
    icon: <HistoryOutlined />,
    children: [
      {
        key: '/record/log',
        title: '操作日志',
        icon: <HistoryOutlined />,
        permissions: [permissionCodes.recordLogView],
      },
      {
        key: '/record/mail',
        title: '邮件记录',
        icon: <MailOutlined />,
        permissions: [permissionCodes.recordMailView],
      },
    ],
  },
];

function createMenuItems(items: AppMenuConfigItem[]): AppMenuItem[] {
  return items.map((item) => ({
    ...item,
    label: item.children?.length
      ? item.title
      : <Link to={item.key}>{item.title}</Link>,
    children: item.children ? createMenuItems(item.children) : undefined,
  }));
}

function collectMenuPermissionCodes(items: AppMenuConfigItem[]): string[] {
  return items.flatMap((item) => [
    ...(item.permissions ?? []),
    ...(item.children ? collectMenuPermissionCodes(item.children) : []),
  ]);
}

export const menuItems = createMenuItems(menuConfig);

export const menuPermissionCatalog: Permission[] = getPermissionCatalogByCodes(
  collectMenuPermissionCodes(menuConfig),
);
