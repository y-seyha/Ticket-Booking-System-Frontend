export type NotificationType =
  | "BOOKING_CONFIRMATION"
  | "BOOKING_CANCELLATION"
  | "EMAIL_VERIFICATION"
  | "PASSWORD_RESET"
  | "ACCOUNT_REACTIVATE"
  | "UPCOMING_SHOWTIME"
  | "PAYMENT_RECEIVED"
  | "SYSTEM";

export type NotificationChannel = "PUSH" | "IN_APP" | "EMAIL";

export interface Notification {
  id: string;
  accountId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, string> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPage {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export interface DeviceTokenResponse {
  message: string;
}
