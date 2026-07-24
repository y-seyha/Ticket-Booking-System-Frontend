export interface RoleResponse {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Record<string, boolean> | null;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  id: string;
  name: string;
  description?: string;
  permissions?: Record<string, boolean>;
}

export interface UpdateRoleDto {
  id?: string;
  name?: string;
  description?: string;
  permissions?: Record<string, boolean>;
}

export interface DeleteRoleResponse {
  message: string;
}