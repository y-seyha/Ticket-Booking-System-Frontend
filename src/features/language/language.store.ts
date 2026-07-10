import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LanguageCode = "en" | "kh";

interface LanguageState {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en", 
      setLanguage: (code) => set({ language: code }),
    }),
    {
      name: "cinema-language-storage", 
      storage: createJSONStorage(() => localStorage), 
    },
  ),
);
