"use client";

import { create } from "zustand";
import { User } from "./auth.types";

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  accessToken: null,
  hydrated: false,

  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null }),
  setHydrated: (v) => set({ hydrated: v }),
}));
