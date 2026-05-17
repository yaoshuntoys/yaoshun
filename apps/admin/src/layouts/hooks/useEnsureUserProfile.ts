import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { getProfile } from '@/api';
import type { User } from '@/types';

interface Params {
  user: User | null;
  logout: () => void;
  setUser: (user: User) => void;
}

export function useEnsureUserProfile({
  user,
  logout,
  setUser,
}: Params) {
  const navigate = useNavigate();
  const isRefreshing = useRef(false);

  useEffect(() => {
    // 避免重复刷新，只在用户存在且没有权限信息时刷新
    if (!user || user.permissions || isRefreshing.current) {
      return;
    }

    const refreshProfile = async () => {
      isRefreshing.current = true;
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        // 静默失败，不强制登出，避免影响正常登录流程
        console.warn('Failed to refresh profile');
      } finally {
        isRefreshing.current = false;
      }
    };

    void refreshProfile();
  }, [logout, navigate, setUser, user]);
}
