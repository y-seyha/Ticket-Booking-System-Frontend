import { apiRequest } from "@/lib/config/axios";
import {
  NotificationPage,
  UnreadCountResponse,
  DeviceTokenResponse,
} from "./notifications.types";

export const notificationsApi = {
  getHistory(params?: {
    status?: "read" | "unread";
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiRequest<NotificationPage>(
      "get",
      `/notifications${qs ? `?${qs}` : ""}`,
    );
  },

  getUnreadCount() {
    return apiRequest<UnreadCountResponse>("get", "/notifications/unread-count");
  },

  markAsRead(id: string) {
    return apiRequest<{ message: string }>("patch", `/notifications/${id}/read`);
  },

  markAllAsRead() {
    return apiRequest<{ message: string }>(
      "patch",
      "/notifications/read-all",
    );
  },

  registerToken(token: string, platform = "web") {
    return apiRequest<DeviceTokenResponse, { token: string; platform?: string }>(
      "post",
      "/notifications/register",
      { token, platform },
    );
  },

  unregisterToken(token: string) {
    return apiRequest<DeviceTokenResponse, { token: string }>(
      "delete",
      "/notifications/unregister",
      { token },
    );
  },
};
