"use client";

import { FC, useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export type LanguageCode = "en" | "kh";

interface LanguageState {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
}

type LanguageConfigItem = {
  code: LanguageCode;
  label: string;
  Flag: FC;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (code) => set({ language: code }),
    }),
    {
      name: "cinema-language-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage,
      ),
    },
  ),
);

const USFlag: FC = () => (
  <svg viewBox="0 0 741 390" className="w-full h-full rounded-sm">
    <path fill="#b22234" d="M0 0h741v390H0z" />
    <path
      stroke="#fff"
      strokeWidth="30"
      d="M0 45h741M0 105h741M0 165h741M0 225h741M0 285h741M0 345h741"
    />
    <path fill="#3c3b6e" d="M0 0h296.4v210H0z" />
    <g fill="#fff">
      <circle cx="24.7" cy="15" r="3" />
      <circle cx="74.1" cy="15" r="3" />
      <circle cx="123.5" cy="15" r="3" />
      <circle cx="172.9" cy="15" r="3" />
      <circle cx="222.3" cy="15" r="3" />
      <circle cx="271.7" cy="15" r="3" />
    </g>
  </svg>
);

const KHFlag: FC = () => (
  <svg viewBox="0 0 25 16" className="w-full h-full rounded-sm">
    <path fill="#032ea1" d="M0 0h25v16H0z" />
    <path fill="#e00025" d="M0 4h25v8H0z" />
    <path
      fill="#fff"
      d="M12.5 5.5l.8 1.8h1.9l-1.5 1.1.6 1.8-1.8-1.1-1.8 1.1.6-1.8-1.5-1.1h1.9z"
    />
  </svg>
);

const LANGUAGES_MAP: Record<LanguageCode, LanguageConfigItem> = {
  en: { code: "en", label: "English", Flag: USFlag },
  kh: { code: "kh", label: "ភាសាខ្មែរ", Flag: KHFlag },
};

const LANGUAGES_ARRAY = Object.values(LANGUAGES_MAP);

export const useLanguage = () => {
  const currentLangCode = useLanguageStore((state) => state.language);
  const setLanguageStore = useLanguageStore((state) => state.setLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsubFinish = useLanguageStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useLanguageStore.persist.hasHydrated()) {
      queueMicrotask(() => {
        setIsHydrated(true);
      });
    }

    return () => {
      unsubFinish();
    };
  }, []);

  const currentLanguage = LANGUAGES_MAP[currentLangCode] || LANGUAGES_MAP.en;

  return {
    currentLanguage,
    languagesList: LANGUAGES_ARRAY,
    setLanguage: setLanguageStore,
    isStoreReady: isHydrated,
  };
};
