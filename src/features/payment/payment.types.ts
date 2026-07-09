export type PaymentProvider = "CASH" | "STRIPE" | "PAYPAL" | "VNPAY" | "KHQR";

export type BookingStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "EXPIRED" | "FAILED";

export interface CreateCheckoutDto {
  paymentProvider?: PaymentProvider;
}

export interface PayDto {
  paymentId: string;
}

export interface CheckoutResponse {
  bookingId: string;
  bookingCode: string;
  totalAmount: number;
  bookingStatus: BookingStatus;
  bookingExpiresAt: string;
  paymentId: string;
  paymentProvider: PaymentProvider;
  paymentStatus: PaymentStatus;
  paymentExpiresAt: string;
  paymentUrl?: string;
  qrCode?: string;
}

export interface PaymentSuccessResponse {
  message: string;
  bookingId: string;
  bookingStatus: BookingStatus;
  paymentId: string;
  paymentStatus: PaymentStatus;
  paidAt: string;
}
