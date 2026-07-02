import { apiRequest } from "@/lib/config/axios";
import type {
  Screen,
  CreateScreenPayload,
  UpdateScreenPayload,
} from "./screen.types";

export const screensApi = {
  findAll() {
    return apiRequest<Screen[]>("get", "/screens");
  },

  findOne(id: string) {
    return apiRequest<Screen>("get", `/screens/${id}`);
  },

  create(payload: CreateScreenPayload) {
    return apiRequest<Screen>("post", "/screens", payload);
  },

  update(id: string, payload: UpdateScreenPayload) {
    return apiRequest<Screen>("patch", `/screens/${id}`, payload);
  },

  remove(id: string) {
    return apiRequest<{ success: boolean; message: string }>(
      "delete",
      `/screens/${id}`,
    );
  },
};
