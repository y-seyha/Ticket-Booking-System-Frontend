"use client";

import { create } from "zustand";
import { User } from "./auth.types";

type AuthStore = {
  user: User | null;
  hydrated: boolean;

  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  hydrated: false,

  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
  setHydrated: (v) => set({ hydrated: v }),
}));
