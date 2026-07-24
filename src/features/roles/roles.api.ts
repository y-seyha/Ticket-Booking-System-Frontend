import { apiRequest } from "@/lib/config/axios";
import { RoleResponse, CreateRoleDto, UpdateRoleDto, DeleteRoleResponse } from "./roles.types";

export const rolesApi = {
  getAll() {
    return apiRequest<RoleResponse[]>("get", "/roles");
  },

  getById(id: string) {
    return apiRequest<RoleResponse>("get", `/roles/${id}`);
  },

  create(dto: CreateRoleDto) {
    return apiRequest<RoleResponse, CreateRoleDto>("post", "/roles", dto);
  },

  update(id: string, dto: UpdateRoleDto) {
    return apiRequest<RoleResponse, UpdateRoleDto>("patch", `/roles/${id}`, dto);
  },

  delete(id: string) {
    return apiRequest<DeleteRoleResponse>("delete", `/roles/${id}`);
  },
};