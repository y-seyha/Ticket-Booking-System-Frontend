"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";
import {
  LoginRequest,
  Verify2FARequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  ReactivateAccountRequest,
  RegisterRequest,
} from "./auth.types";
import { ApiErrorResponse } from "@/types/api-error";

type ApiErrorLike = {
  response?: {
    data?: ApiErrorResponse;
  };
  message?: string;
};

export function useAuth() {
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const getErrorMessage = (err: unknown): string => {
    const error = err as ApiErrorLike;

    return (
      error?.response?.data?.message || error?.message || "Something went wrong"
    );
  };

  const login = async (data: LoginRequest) => {
    try {
      const res = await authApi.login(data);

      if ("requiresTwoFactor" in res) {
        toast("2FA required");
        return res;
      }

      setUser(res.user); // backend already sets cookies

      toast.success("Login successful");
      router.push("/");

      return res;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // ✅ REGISTER
  const register = async (data: RegisterRequest) => {
    try {
      const res = await authApi.register(data);

      toast.success(res.message);
      router.push("/login"); // or "/" if auto-login

      return res;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await authApi.logout(); // clears httpOnly cookies
    } finally {
      clearAuth();
      toast.success("Logged out");
      router.push("/login");
    }
  };

  // ✅ 2FA
  const verify2FA = async (data: Verify2FARequest) => {
    try {
      const res = await authApi.verify2FA(data);

      setUser(res.user);
      toast.success("2FA verified");
      router.push("/");

      return res;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // optional flows
  const forgotPassword = async (data: ForgotPasswordRequest) => {
    const res = await authApi.forgotPassword(data);
    toast.success("Reset email sent");
    return res;
  };

  const resetPassword = async (token: string, data: ResetPasswordRequest) => {
    const res = await authApi.resetPassword(token, data);
    toast.success("Password reset successful");
    router.push("/login");
    return res;
  };

  const reactivate = async (data: ReactivateAccountRequest) => {
    const res = await authApi.reactivate(data);
    toast.success("Reactivation email sent");
    return res;
  };

  return {
    login,
    register,
    logout,
    verify2FA,
    forgotPassword,
    resetPassword,
    reactivate,
  };
}
