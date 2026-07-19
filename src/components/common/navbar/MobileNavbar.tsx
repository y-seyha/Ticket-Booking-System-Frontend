"use client";

import { FC } from "react";
import {
  Search,
  Ticket,
  ChevronDown,
  MapPin,
  Home,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LuPopcorn } from "react-icons/lu";
import { CiSquareMore } from "react-icons/ci";
import { Cinema } from "@/features/cinemas/cinemas.types";
import { LanguageCode } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

type NavKey = "home" | "cinemas" | "promotions" | "fb" | "tickets" | "more";

type Language = {
  code: LanguageCode;
  label: string;
  Flag: FC;
};

interface MobileNavbarProps {
  showTicket: boolean;
  showNotification: boolean;
  showLanguage: boolean;
  showSearch: boolean;
  showCinemaDropdown: boolean;
  showMobileBottomNav: boolean;
  logoUrl: string;
  logoFailed: boolean;
  setLogoFailed: (failed: boolean) => void;
  openNotif: boolean;
  setOpenNotif: (open: boolean) => void;
  openLang: boolean;
  setOpenLang: (open: boolean) => void;
  language: Language;
  languages: Language[];
  setLanguage: (lang: Language) => void;
  openCinema: boolean;
  setOpenCinema: (open: boolean) => void;
  cinemas: Cinema[];
  handleCinemaClick: (id: string) => void;
  activeNav: NavKey | null;
  onSearchClick: () => void;
}

export const MobileNavbar: FC<MobileNavbarProps> = ({
  showTicket,
  showNotification,
  showLanguage,
  showSearch,
  showCinemaDropdown,
  showMobileBottomNav,
  logoUrl,
  logoFailed,
  setLogoFailed,
  openNotif,
  setOpenNotif,
  openLang,
  setOpenLang,
  language,
  languages,
  setLanguage,
  openCinema,
  setOpenCinema,
  cinemas,
  handleCinemaClick,
  activeNav,
  onSearchClick,
}) => {

  const t = (key: string) => {
    return (
      translations[key]?.[language.code] || translations[key]?.["en"] || key
    );
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[9999] text-white backdrop-blur-xl border-b border-white/10">
        <div className="h-16 px-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            {showTicket && (
              <Link
                href="/my-tickets"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <Ticket className="w-5 h-5" />
              </Link>
            )}

            {showNotification && (
              <div className="z-[100]">
                <NotificationBell
                  open={openNotif}
                  onToggle={() => setOpenNotif(!openNotif)}
                />
              </div>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="cursor-pointer">
              {!logoFailed ? (
                <div className="relative h-8 w-32">
                  <Image
                    src={logoUrl}
                    onError={() => setLogoFailed(true)}
                    fill
                    sizes="(max-width: 768px) 128px, 128px"
                    className="object-contain"
                    alt="Logo"
                    priority
                  />
                </div>
              ) : (
                <div className="font-bold text-sm">LEGEND</div>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-1 relative">
            {showLanguage && (
              <div className="relative">
                <button
                  onClick={() => setOpenLang(!openLang)}
                  className="flex items-center gap-2 px-2 h-10"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <language.Flag />
                  </span>
                  <span className="text-xs uppercase">{language.code}</span>
                  <ChevronDown
                    className={`w-4 h-4 opacity-70 transition-transform duration-300 ${
                      openLang ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-44 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50 origin-top transition-all duration-200 ease-out ${
                    openLang
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {languages.map((lang) => {
                    const FlagIcon = lang.Flag;

                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang);
                          setOpenLang(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/10 transition"
                      >
                        <span className="w-5 h-4 flex items-center justify-center">
                          <FlagIcon />
                        </span>
                        <span>{lang.label}</span>
                        <span className="ml-auto text-xs opacity-50 uppercase">
                          {lang.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {showSearch && (
              <button onClick={onSearchClick} className="w-10 h-10 flex items-center justify-center cursor-pointer">
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {showCinemaDropdown && (
          <div className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
            {/* TRIGGER BAR */}
            <div className="h-12 px-5 flex items-center justify-between">
              <button
                onClick={() => setOpenCinema(!openCinema)}
                className="flex items-center gap-3 flex-1"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-[15px] font-semibold tracking-wide text-white">
                  {t("allCinemas")}
                </span>
              </button>

              <button
                onClick={() => setOpenCinema(!openCinema)}
                className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/5 transition"
              >
                <ChevronDown
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    openCinema ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* SMOOTH ANIMATED LIST */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openCinema ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-4">
                <div className="flex flex-col">
                  {cinemas.map((c, index) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        handleCinemaClick(c.id);
                        setOpenCinema(false);
                      }}
                      className={`flex items-center gap-3 py-3 w-full text-left transition-colors
                      ${index !== cinemas.length - 1 ? "border-b border-white/5" : ""}`}
                    >
                      <div className="relative w-10 h-10 shrink-0">
                        <Image
                          src={c.image?.url || "/fallback-image.png"}
                          fill
                          sizes="40px"
                          className="rounded-lg object-cover bg-zinc-800"
                          alt={c.name}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">
                          {c.name}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {c.location}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE FOOTER NAV */}
      {showMobileBottomNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-black/30 backdrop-blur-xl">
          <div className="grid grid-cols-5 h-16">
            {/* HOME */}
            <Link
              href="/"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className={`relative w-10 h-10 flex items-center justify-center rounded-2xl
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
                ${activeNav === "home" ? "scale-110 -translate-y-[1px] text-white" : "scale-100 text-zinc-300"}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${activeNav === "home" ? "bg-red-500 opacity-100" : "bg-white/5 opacity-0"}`}
                />
                <Home
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${activeNav === "home" ? "scale-110" : "scale-100"}`}
                />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${activeNav === "home" ? "text-white" : "text-zinc-400"}`}
              >
                {t("home")}
              </span>
            </Link>

            {/* OFFERS */}
            <Link
              href="/promotions"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className={`relative w-10 h-10 flex items-center justify-center rounded-2xl
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
                ${activeNav === "promotions" ? "scale-110 -translate-y-[1px] text-white" : "scale-100 text-zinc-300"}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${activeNav === "promotions" ? "bg-red-500 opacity-100" : "bg-white/5 opacity-0"}`}
                />
                <Tag className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${activeNav === "promotions" ? "text-white" : "text-zinc-400"}`}
              >
                {t("offers")}
              </span>
            </Link>

            {/* CINEMAS */}
            <Link
              href="/cinemas"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className={`relative w-10 h-10 flex items-center justify-center rounded-2xl
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
                ${activeNav === "cinemas" ? "scale-110 -translate-y-[1px] text-white" : "scale-100 text-zinc-300"}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${activeNav === "cinemas" ? "bg-red-500 opacity-100" : "bg-white/5 opacity-0"}`}
                />
                <MapPin className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${activeNav === "cinemas" ? "text-white" : "text-zinc-400"}`}
              >
                {t("cinemas")}
              </span>
            </Link>

            {/* F&B */}
            <Link
              href="/food-and-drinks"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className={`relative w-10 h-10 flex items-center justify-center rounded-2xl
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
                ${activeNav === "fb" ? "scale-110 -translate-y-[1px] text-white" : "scale-100 text-zinc-300"}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${activeNav === "fb" ? "bg-red-500 opacity-100" : "bg-white/5 opacity-0"}`}
                />
                <LuPopcorn className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${activeNav === "fb" ? "text-white" : "text-zinc-400"}`}
              >
                {t("fb")}
              </span>
            </Link>

            {/* MORE */}
            <Link
              href="/more"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className={`relative w-10 h-10 flex items-center justify-center rounded-2xl
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
                ${activeNav === "more" ? "scale-110 -translate-y-[1px] text-white" : "scale-100 text-zinc-300"}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${activeNav === "more" ? "bg-red-500 opacity-100" : "bg-white/5 opacity-0"}`}
                />
                <CiSquareMore className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${activeNav === "more" ? "text-white" : "text-zinc-400"}`}
              >
                More
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
