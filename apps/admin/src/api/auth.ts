import { http } from '@/utils/request';
import type { User } from '@/types';

export interface LoginResponse {
  access_token: string;
  user: User;
}

let profileRequest: Promise<User> | null = null;

function getProfileOnce() {
  if (!profileRequest) {
    profileRequest = http
      .get<User>('/api/v1/admin/auth/profile')
      .catch((err) => {
        profileRequest = null;
        throw err;
      })
      .finally(() => {
        profileRequest = null;
      });
  }

  return profileRequest;
}

/** 用户登录 */
export const login = (data: { username: string; password: string }) =>
  http.post<LoginResponse>('/api/v1/admin/auth/login', data);

/** 通过邮箱找回密码 */
export const forgotPassword = (data: { email: string }) =>
  http.post<{ message: string }>('/api/v1/admin/auth/forgot-password', data);

/** 通过邮件令牌重置密码 */
export const resetForgottenPassword = (data: { token: string; newPassword: string }) =>
  http.post<{ message: string }>('/api/v1/admin/auth/reset-password', data);

/** 退出登录 */
export const logout = () => http.post('/api/v1/admin/auth/logout');

/** 获取当前登录用户信息 */
export const getProfile = () => getProfileOnce();

/** 更新个人资料 */
export const updateProfile = (data: Pick<User, 'name' | 'nickname' | 'email'>) =>
  http.put<User>('/api/v1/admin/auth/profile', data);

/** 修改当前用户密码 */
export const changePassword = (data: { oldPassword: string; newPassword: string }) =>
  http.put<User>('/api/v1/admin/auth/password', data);
