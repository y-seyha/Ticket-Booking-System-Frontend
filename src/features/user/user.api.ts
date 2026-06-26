import { apiRequest } from "@/lib/config/axios";
import {
  UserResponse,
  UpdateProfileDto,
  UserMessageResponse,
  PaginatedUsersResponse,
} from "./user.types";

export const userApi = {
  getMyProfile() {
    return apiRequest<UserResponse>("get", "/users/me");
  },

  updateMyProfile(dto: UpdateProfileDto, file?: File) {
    const formData = new FormData();

    if (dto.firstName?.trim())
      formData.append("firstName", dto.firstName.trim());
    if (dto.lastName?.trim()) formData.append("lastName", dto.lastName.trim());
    if (dto.phone?.trim()) formData.append("phone", dto.phone.trim());

    if (file) {
      formData.append("avatar", file);
    }

    return apiRequest<UserResponse, FormData>("patch", "/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  disableMyAccount() {
    return apiRequest<UserMessageResponse>("delete", "/users/me");
  },

  // ADMIN CONTROL MANAGEMENT
  getAllUsers(page = 1, limit = 10) {
    return apiRequest<PaginatedUsersResponse>(
      "get",
      `/users?page=${page}&limit=${limit}`,
    );
  },

  getUserById(id: string) {
    return apiRequest<UserResponse>("get", `/users/${id}`);
  },

  banUser(id: string) {
    return apiRequest<UserResponse>("patch", `/users/${id}/ban`);
  },

  unbanUser(id: string) {
    return apiRequest<UserResponse>("patch", `/users/${id}/unban`);
  },

  changeUserRole(id: string, role: "USER" | "ADMIN") {
    return apiRequest<UserResponse, { role: string }>(
      "patch",
      `/users/${id}/role`,
      { role },
    );
  },

  deleteUser(id: string) {
    return apiRequest<UserMessageResponse>("delete", `/users/${id}`);
  },
};
