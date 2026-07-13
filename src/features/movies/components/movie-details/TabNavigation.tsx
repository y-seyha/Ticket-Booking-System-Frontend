"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

interface TabNavigationProps {
  activeTab: "showtime" | "detail";
  setActiveTab: (tab: "showtime" | "detail") => void;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";

  const th = (key: string): string => {
    const lookupKey = key as keyof typeof translations;
    return (
      translations[lookupKey]?.[langCode] ||
      translations[lookupKey]?.["en"] ||
      key
    );
  };

  return (
    <div className="flex justify-center items-center gap-8 text-base sm:text-lg font-black mt-10 mb-8 border-b border-zinc-900 pb-4 relative z-10">
      {(["showtime", "detail"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`cursor-pointer transition-colors relative tracking-wide pb-1 uppercase ${
            activeTab === tab
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {/* Dynamically looks up keys like th("showtime") or th("detail") */}
          {th(tab)}
          {activeTab === tab && (
            <motion.div
              layoutId="activeUnderline"
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
