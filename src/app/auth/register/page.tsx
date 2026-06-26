"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/auth.hook";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { RegisterRequest } from "@/features/auth/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await register(data);

      router.push(
        `/auth/verify-request?email=${encodeURIComponent(data.email)}`,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        onOAuthRegister={(provider) => {
          toast.loading(`Redirecting to ${provider}...`);
          setTimeout(() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${provider}`;
          }, 500);
        }}
      />
    </>
  );
}
