export interface NestedProfile {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarId: string | null;
  avatar?: BackendAvatar | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BANNED" | "INACTIVE";
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: NestedProfile | null;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export interface UserMessageResponse {
  message: string;
  success: boolean;
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface BackendAvatar {
  id: string;
  url: string;
  description: string;
}
