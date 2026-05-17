import { useState } from 'react';
import { message } from 'antd';

import { changePassword, getProfile, updateProfile } from '@/api';
import type { User } from '@/types';

interface Params {
  user: User | null;
  setUser: (user: User) => void;
}

export function useAccountSettings({ user, setUser }: Params) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleOpenProfile = async () => {
    if (!user || !user.permissions) {
      setProfileLoading(true);
      try {
        const profile = await getProfile();
        setUser(profile);
      } finally {
        setProfileLoading(false);
      }
    }

    setProfileOpen(true);
  };

  const handleSubmitProfile = async (values: {
    name?: string;
    nickname?: string;
    email?: string;
  }) => {
    setProfileLoading(true);
    try {
      const updatedUser = await updateProfile({
        name: values.name?.trim() || undefined,
        nickname: values.nickname?.trim() || undefined,
        email: values.email?.trim() || undefined,
      });
      setUser(updatedUser);
      setProfileOpen(false);
      message.success('个人资料更新成功');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSubmitPassword = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    setPasswordLoading(true);
    try {
      const updatedUser = await changePassword(values);
      setUser(updatedUser);
      setPasswordOpen(false);
      message.success('密码修改成功');
    } finally {
      setPasswordLoading(false);
    }
  };

  return {
    profileOpen,
    setProfileOpen,
    passwordOpen,
    setPasswordOpen,
    profileLoading,
    passwordLoading,
    handleOpenProfile,
    handleSubmitProfile,
    handleSubmitPassword,
  };
}
