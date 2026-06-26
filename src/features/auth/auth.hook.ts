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
import axios from "axios";

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

      setUser(res.user);
      router.push("/auth/login/success");

      return res;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (
          typeof err.response?.data === "string" &&
          err.response.data.startsWith("Cannot")
        ) {
          toast.error("Authentication service is temporarily unavailable.");
          throw err;
        }

        if (
          status === 429 ||
          message?.toLowerCase().includes("too many") ||
          message?.toLowerCase().includes("rate")
        ) {
          toast.error("Too many login attempts. Please try again later.");
          throw err;
        }

        if (status === 401 || status === 400) {
          toast.error("Invalid email or password.");
          throw err;
        }
      }

      toast.error("Unable to login. Please try again later.");
      throw err;
    }
  };

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

  const logout = async () => {
    try {
      await authApi.logout(); // clears httpOnly cookies
    } finally {
      clearAuth();
      toast.success("Logged out");
      router.push("/auth/login");
    }
  };

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
