"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Shield, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import { authApi } from "@/features/auth/auth.api";

export default function SidebarUser() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    async function fetchCurrentUser() {
      if (user) return;

      try {
        setIsLoading(true);
        const res = await authApi.me();

        if (res && res.user) {
          setUser(res.user);
        }
      } catch (error) {
        console.error("Failed to fetch current user session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, [user, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-xl p-2 bg-zinc-50 border border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800/60 animate-pulse">
        <div className="h-9 w-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const email = user?.email || "unauthenticated@system.local";
  const role = user?.role || "ADMIN";
  const avatarUrl = user?.profile?.avatar;

  const firstName = user?.profile?.firstName || "";
  const lastName = user?.profile?.lastName || "";

  const emailPrefix = email.split("@")[0];

  const fullName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : emailPrefix;

  const initials = firstName
    ? `${firstName[0]}${lastName ? lastName[0] : ""}`.toUpperCase()
    : emailPrefix.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl p-2 bg-zinc-50 border border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800/60">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={fullName}
          width={36}
          height={36}
          className="h-9 w-9 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {user ? initials : <UserIcon className="h-4 w-4 text-zinc-400" />}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {fullName}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 shrink-0">
            <Shield className="h-2.5 w-2.5" />
            {role}
          </span>
        </div>
        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {email}
        </span>
      </div>
    </div>
  );
}
