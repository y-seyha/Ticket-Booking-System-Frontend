"use client";

import { useAuth } from "@/features/auth/auth.hook";
import LoginForm from "@/features/auth/components/LoginForm";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login({ email, password });
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
          window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${provider}`;
        }}
        onForgotPassword={() => {
          window.location.href = "/forgot-password";
        }}
      />
    </>
  );
}
