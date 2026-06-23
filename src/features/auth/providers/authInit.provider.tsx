"use client";

import { useEffect, useRef } from "react";
import { authApi } from "@/features/auth/auth.api";
import { useAuthStore } from "@/features/auth/auth.store";

export function AuthInitProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const init = async () => {
      try {
        const res = await authApi.me();
        setUser(res.user);
      } catch {
        clearAuth();
      } finally {
        setHydrated(true);
      }
    };

    init();
  }, [setUser, clearAuth, setHydrated]);

  return <>{children}</>;
}
