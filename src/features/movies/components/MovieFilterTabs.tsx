"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

type Mode = "showing" | "coming";

interface MovieFilterTabsProps {
  currentMode: Mode;
  onChangeMode: (mode: Mode) => void;
}

export default function MovieFilterTabs({
  currentMode,
  onChangeMode,
}: MovieFilterTabsProps) {
  const modes: Mode[] = ["showing", "coming"];
  const { currentLanguage } = useLanguage();

  const langCode = currentLanguage?.code || "en";

  const th = (key: keyof typeof translations): string => {
    return translations[key]?.[langCode] || translations[key]["en"];
  };

  return (
    <>
      {/* Mobile view switch */}
      <div className="sm:hidden flex bg-zinc-900 rounded-full border border-zinc-800 mt-4 mx-1">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeMode(mode)}
            className="relative flex-1 px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {currentMode === mode && (
              <motion.div
                layoutId="movie-mode"
                className="absolute inset-0 bg-red-600 rounded-full shadow-lg shadow-red-600/25"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                currentMode === mode ? "text-white" : "text-zinc-400"
              }`}
            >
              {mode === "showing" ? th("nowShowing") : th("comingSoon")}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop view switch */}
      <div className="hidden sm:flex items-center gap-5 text-2xl sm:text-3xl font-extrabold pb-2 tracking-tight">
        <button
          onClick={() => onChangeMode("showing")}
          className={`cursor-pointer transition-colors duration-200 ${
            currentMode === "showing"
              ? "text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {th("nowShowing")}
        </button>
        <span className="text-zinc-800 font-light select-none">|</span>
        <button
          onClick={() => onChangeMode("coming")}
          className={`cursor-pointer transition-colors duration-200 ${
            currentMode === "coming"
              ? "text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {th("comingSoon")}
        </button>
      </div>
    </>
  );
}
