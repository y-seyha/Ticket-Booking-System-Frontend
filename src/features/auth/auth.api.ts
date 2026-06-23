import { apiRequest } from "@/lib/config/axios";
import {
  AuthMessageResponse,
  CurrentUserResponse,
  Enable2FARequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ReactivateAccountRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  Setup2FAResponse,
  TwoFactorRequiredResponse,
  Verify2FARequest,
  Verify2FAResponse,
} from "./auth.types";

export const authApi = {
  register(data: RegisterRequest) {
    return apiRequest<RegisterResponse, RegisterRequest>(
      "post",
      "/auth/register",
      data,
    );
  },

  login(data: LoginRequest) {
    return apiRequest<LoginResponse | TwoFactorRequiredResponse, LoginRequest>(
      "post",
      "/auth/login",
      data,
    );
  },

  logout() {
    return apiRequest<AuthMessageResponse>("post", "/auth/logout");
  },

  me() {
    return apiRequest<CurrentUserResponse>("get", "/auth/me");
  },

  forgotPassword(data: ForgotPasswordRequest) {
    return apiRequest<AuthMessageResponse, ForgotPasswordRequest>(
      "post",
      "/auth/forgot-password",
      data,
    );
  },

  resetPassword(token: string, data: ResetPasswordRequest) {
    return apiRequest<AuthMessageResponse, ResetPasswordRequest>(
      "post",
      `/auth/reset-password?token=${token}`,
      data,
    );
  },

  reactivate(data: ReactivateAccountRequest) {
    return apiRequest<AuthMessageResponse, ReactivateAccountRequest>(
      "post",
      "/auth/reactivate",
      data,
    );
  },

  setup2FA() {
    return apiRequest<Setup2FAResponse>("post", "/auth/2fa/setup");
  },

  enable2FA(data: Enable2FARequest) {
    return apiRequest<AuthMessageResponse, Enable2FARequest>(
      "post",
      "/auth/2fa/enable",
      data,
    );
  },

  verify2FA(data: Verify2FARequest) {
    return apiRequest<Verify2FAResponse, Verify2FARequest>(
      "post",
      "/auth/2fa/verify",
      data,
    );
  },
};
