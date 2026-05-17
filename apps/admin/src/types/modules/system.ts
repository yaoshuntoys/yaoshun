export interface Permission {
  id: number;
  code: string;
  name: string;
  module: string;
  description?: string | null;
  sortOrder?: number;
}

export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: 'active' | 'inactive';
  isSystem: boolean;
  permissionCodes: string[];
  permissions: Permission[];
  permissionCount: number;
  accountCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  name?: string;
  nickname?: string;
  email?: string;
  role?: string;
  isSystem?: boolean;
  roleName?: string;
  permissions?: string[];
  permissionDetails?: Permission[];
  status?: 'active' | 'inactive';
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
