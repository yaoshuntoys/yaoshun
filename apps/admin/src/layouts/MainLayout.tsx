import { useEffect } from 'react';
import { Layout } from 'antd';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';

import { APP_NAME, menuConfig, permissionCodes } from '@/config';
import { pageMetaByRoute } from '@/pages/page/config';
import AppHeader from '@/layouts/components/AppHeader';
import KeepAliveOutlet from '@/layouts/components/KeepAliveOutlet';
import AppTabs from '@/layouts/components/AppTabs';
import ChangePasswordModal from '@/layouts/components/ChangePasswordModal';
import ProfileSettingsModal from '@/layouts/components/ProfileSettingsModal';
import AppSidebar from '@/layouts/components/AppSidebar';
import '@/layouts/layout.css';
import { useAccountSettings } from '@/layouts/hooks/useAccountSettings';
import { useEnsureUserProfile } from '@/layouts/hooks/useEnsureUserProfile';
import { useLayoutMenu } from '@/layouts/hooks/useLayoutMenu';
import { useUnreadMessageCount } from '@/layouts/hooks/useUnreadMessageCount';
import PermissionGuard from '@/router/components/PermissionGuard';
import { getCurrentRouteHandle } from '@/router/helpers';
import { useAuthStore, useTabsStore, useThemeStore } from '@/stores';
import { hasPermission } from '@/utils/permission';

const { Content } = Layout;

function findMenuTitle(pathname: string): string | undefined {
  const exact = (items: typeof menuConfig): string | undefined => {
    for (const item of items) {
      if (item.key === pathname) return item.title;
      if (item.children) {
        const childTitle = exact(item.children);
        if (childTitle) return childTitle;
      }
    }
    return undefined;
  };

  return exact(menuConfig);
}

function getTabTitle(pathname: string, fallback?: string): string {
  const pageMatch = pathname.match(/^\/page\/([^/]+)/);
  if (pageMatch?.[1]) {
    return pageMetaByRoute[pageMatch[1]]?.title ?? fallback ?? '页面配置';
  }

  if (/^\/content\/product\/create$/.test(pathname)) return '新建商品';
  if (/^\/content\/product\/edit\//.test(pathname)) return '商品详情配置';
  if (/^\/content\/news\/create$/.test(pathname)) return '新建新闻';
  if (/^\/content\/news\/edit\//.test(pathname)) return '新闻详情配置';
  if (/^\/content\/faq\/create$/.test(pathname)) return '新增常见问题';
  if (/^\/content\/faq\/edit\//.test(pathname)) return '编辑常见问题';
  if (/^\/content\/partner\/create$/.test(pathname)) return '新增合作客户';
  if (/^\/content\/partner\/edit\//.test(pathname)) return '编辑合作客户';

  return findMenuTitle(pathname) ?? fallback ?? '未命名页面';
}

export default function MainLayout() {
  const location = useLocation();
  const matches = useMatches();
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, theme } = useThemeStore();
  const addTab = useTabsStore((state) => state.addTab);

  const isDark = theme === 'dark';
  const userPermissions = user?.permissions ?? [];
  const currentRouteHandle = getCurrentRouteHandle(matches);
  const canAccessCurrentRoute = hasPermission(
    userPermissions,
    currentRouteHandle?.permissionCodes,
  );
  const canAccessMessages = hasPermission(userPermissions, [
    permissionCodes.customerMessageManage,
  ]);
  const {
    filteredMenuItems,
    selectedKeys,
    openKeys,
    setManualOpenKeys,
  } = useLayoutMenu({
    pathname: location.pathname,
    sidebarCollapsed,
    permissions: userPermissions,
  });
  const unreadCount = useUnreadMessageCount(canAccessMessages);
  const {
    profileOpen,
    setProfileOpen,
    passwordOpen,
    setPasswordOpen,
    profileLoading,
    passwordLoading,
    handleOpenProfile,
    handleSubmitProfile,
    handleSubmitPassword,
  } = useAccountSettings({
    user,
    setUser,
  });

  useEffect(() => {
    const tabTitle = getTabTitle(location.pathname, currentRouteHandle?.title);
    document.title = tabTitle
      ? `${tabTitle} - ${APP_NAME}`
      : APP_NAME;
  }, [currentRouteHandle?.title, location.pathname]);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname.startsWith('/login')) {
      return;
    }

    const tabTitle = getTabTitle(location.pathname, currentRouteHandle?.title);

    addTab({
      key: location.pathname,
      title: tabTitle,
      path: `${location.pathname}${location.search}`,
      closable: location.pathname !== '/dashboard',
    });
  }, [
    addTab,
    currentRouteHandle?.title,
    location.pathname,
    location.search,
  ]);

  useEnsureUserProfile({ user, logout, setUser });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Layout className="admin-layout">
        <AppSidebar
          collapsed={sidebarCollapsed}
          isDark={isDark}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          items={filteredMenuItems}
          onOpenChange={setManualOpenKeys}
        />
        <Layout
          className="admin-layout-main"
          style={{ marginLeft: sidebarCollapsed ? 80 : 248 }}
        >
          <AppHeader
            collapsed={sidebarCollapsed}
            isDark={isDark}
            unreadCount={unreadCount}
            showMessageEntry={canAccessMessages}
            user={user}
            onToggleSidebar={toggleSidebar}
            onOpenMessages={() => navigate('/customer/message')}
            onOpenProfile={() => void handleOpenProfile()}
            onOpenPassword={() => setPasswordOpen(true)}
            onLogout={handleLogout}
          />
          <AppTabs />
          <Content
            className="admin-layout-content"
          >
            <PermissionGuard
              allowed={canAccessCurrentRoute}
              title={currentRouteHandle?.title}
            >
              <KeepAliveOutlet isDark={isDark} />
            </PermissionGuard>
          </Content>
        </Layout>
      </Layout>

      <ProfileSettingsModal
        open={profileOpen}
        loading={profileLoading}
        user={user}
        onCancel={() => setProfileOpen(false)}
        onSubmit={(values) => void handleSubmitProfile(values)}
      />

      <ChangePasswordModal
        open={passwordOpen}
        loading={passwordLoading}
        onCancel={() => setPasswordOpen(false)}
        onSubmit={(values) => void handleSubmitPassword(values)}
      />
    </>
  );
}
