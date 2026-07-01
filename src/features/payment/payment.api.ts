import { apiRequest } from "@/lib/config/axios";
import {
  CreateCheckoutDto,
  CheckoutResponse,
  PayDto,
  PaymentSuccessResponse,
} from "./payment.types";

export const paymentApi = {
  createCheckout: (payload: CreateCheckoutDto) =>
    apiRequest<CheckoutResponse>("post", "/checkout", payload),

  payCash: (payload: PayDto) =>
    apiRequest<PaymentSuccessResponse>("post", "/payments/cash", payload),
};
