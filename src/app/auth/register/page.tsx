"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/auth.hook";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { RegisterRequest } from "@/features/auth/auth.types";

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const res = await register(data);

      console.log(res);
      setLoading(true); // switch to login after register (recommended)
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
          window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${provider}`;
        }}
      />
    </>
  );
}
