"use client";

import { useAuth } from "@/features/auth/auth.hook";
import LoginForm from "@/features/auth/components/LoginForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login({ email, password });

      if (
        response &&
        "requiresTwoFactor" in response &&
        response.requiresTwoFactor
      ) {
        toast.success("Two-factor authentication required.");
        router.push(`/auth/verify-2fa?tempToken=${response.tempToken}`);
        return;
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.requiresTwoFactor
      ) {
        const { tempToken } = error.response.data;
        toast.info("Please enter your 2FA verification code.");
        router.push(`/auth/verify-2fa?tempToken=${tempToken}`);
        return;
      }

      let errorMessage = "Invalid email or password.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        onOAuthLogin={(provider) => {
          toast.loading(`Redirecting to ${provider}...`);
          setTimeout(() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${provider}`;
          }, 500);
        }}
        onForgotPassword={() => {
          router.push("/auth/forgot-password");
        }}
      />
    </>
  );
}
