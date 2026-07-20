"use client";

import { FC } from "react";
import {
  Ticket,
  User as UserIcon,
  ChevronDown,
  MapPin,
  Home,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LuPopcorn } from "react-icons/lu";
import { Cinema } from "@/features/cinemas/cinemas.types";
import { useLanguage } from "@/features/language/useLanuage";
import DesktopSearch from "@/features/search/components/DesktopSearch";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

type NavKey = "home" | "cinemas" | "promotions" | "fb" | "tickets" | "more";

interface DesktopNavbarProps {
  showSearch: boolean;
  showTicket: boolean;
  showJoinNow: boolean;
  showNotification: boolean;
  showLanguage: boolean;
  showBottomNav: boolean;
  showCinemaDropdown: boolean;
  showLogo: boolean;
  logoUrl: string;
  logoFailed: boolean;
  setLogoFailed: (failed: boolean) => void;
  hydrated: boolean;
  user: unknown;
  router: { push: (url: string) => void };
  openLang: boolean;
  setOpenLang: (open: boolean) => void;
  openNotif: boolean;
  setOpenNotif: (open: boolean) => void;
  openCinema: boolean;
  setOpenCinema: (open: boolean) => void;
  cinemas: Cinema[];
  handleCinemaClick: (id: string) => void;
  activeNav: NavKey | null;
  navText: (key: NavKey) => string;
  navIcon: (key: NavKey) => string;
}

export const DesktopNavbar: FC<DesktopNavbarProps> = ({
  showSearch,
  showTicket,
  showJoinNow,
  showNotification,
  showLanguage,
  showBottomNav,
  showCinemaDropdown,
  showLogo,
  logoUrl,
  logoFailed,
  setLogoFailed,
  hydrated,
  user,
  router,
  openLang,
  setOpenLang,
  openNotif,
  setOpenNotif,
  openCinema,
  setOpenCinema,
  cinemas,
  handleCinemaClick,
  navText,
  navIcon,
}) => {
  const { currentLanguage, languagesList, setLanguage, isStoreReady, t } =
    useLanguage();

  return (
    <nav className="fixed inset-x-0 top-0 z-9999 text-white bg-zinc-950/70 backdrop-blur-xl border-b border-white/10 py-1 md:py-2 transition-colors duration-300 hidden md:block">
      <div className="grid grid-cols-3 items-center max-w-7xl mx-auto px-4 md:px-23 lg:px-25 py-2">
        {/* LEFT */}
        <div className="flex justify-start">
          {showSearch && <DesktopSearch />}
        </div>

        {/* CENTER */}
        {showLogo && (
          <div className="flex justify-center">
            <Link href="/" className="cursor-pointer">
              {!logoFailed ? (
                <Image
                  src={logoUrl}
                  onError={() => setLogoFailed(true)}
                  className="h-7 md:h-9 object-contain"
                  alt="Logo"
                  width={150}
                  height={36}
                  priority
                />
              ) : (
                <div className="text-center font-bold leading-tight">
                  LEGEND
                  <div className="text-[9px] tracking-[0.3em]">CINEMA</div>
                </div>
              )}
            </Link>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex justify-end items-center gap-3 lg:gap-5 min-w-0">
          {(showTicket || showJoinNow) && (
            <div className="flex items-center gap-3">
              {showTicket && (
                <Link
                  href="/ticket"
                  className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:border-white/30 transition cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span className="hidden md:inline">{t("ticket")}</span>
                </Link>
              )}

              {showJoinNow && (
                <>
                  {!hydrated ? (
                    <div className="w-24 h-9 rounded-full bg-white/10 animate-pulse" />
                  ) : !user ? (
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm whitespace-nowrap hover:border-white/30 transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>{t("joinNow")}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/profile")}
                      className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm whitespace-nowrap hover:border-white/30 transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-red-400" />
                      <span>{t("profile")}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* NOTIFICATION */}
          {showNotification && (
            <NotificationBell
              open={openNotif}
              onToggle={() => setOpenNotif(!openNotif)}
            />
          )}

          {/* LANGUAGE */}
          {showLanguage && (
            <div className="relative w-[75px] flex justify-end">
              {!isStoreReady ? (
                <div className="w-16 h-6 rounded bg-white/10 animate-pulse" />
              ) : (
                <>
                  <button
                    onClick={() => setOpenLang(!openLang)}
                    className="flex items-center gap-2 cursor-pointer bg-transparent border-none text-white outline-none"
                  >
                    <span className="w-5 h-5 flex items-center justify-center shadow-sm">
                      <currentLanguage.Flag />
                    </span>
                    <span className="text-sm font-medium uppercase tracking-wider">
                      {currentLanguage.code}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                        openLang ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openLang && (
                    <div className="absolute right-0 mt-2 w-44 bg-zinc-950/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                      {languagesList.map((lang) => {
                        const FlagIcon = lang.Flag;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setOpenLang(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 text-left cursor-pointer ${
                              currentLanguage.code === lang.code
                                ? "bg-white/10 text-red-400 font-medium"
                                : "text-zinc-200"
                            }`}
                          >
                            <span className="w-5 h-4 flex items-center justify-center shadow-sm">
                              <FlagIcon />
                            </span>
                            <span className="flex-1">{lang.label}</span>
                            <span className="text-xs opacity-40 uppercase font-mono">
                              {lang.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      {showBottomNav && (
        <div className="border-t border-white/5 mt-1">
          <div className="max-w-7xl mx-auto px-23 h-10 flex items-center justify-between">
            <div className="flex gap-10 text-sm md:text-base px-2">
              <Link href="/" className="flex items-center gap-2 group">
                <Home className={navIcon("home")} />
                <span className={navText("home")}>{t("home")}</span>
              </Link>
              <Link href="/cinemas" className="flex items-center gap-2 group">
                <MapPin className={navIcon("cinemas")} />
                <span className={navText("cinemas")}>{t("cinemas")}</span>
              </Link>
              <Link
                href="/promotions"
                className="flex items-center gap-2 group"
              >
                <Tag className={navIcon("promotions")} />
                <span className={navText("promotions")}>{t("offers")}</span>
              </Link>
              <Link
                href="/food-and-drinks"
                className="flex items-center gap-2 group"
              >
                <LuPopcorn className={navIcon("fb")} />
                <span className={navText("fb")}>{t("fb")}</span>
              </Link>
            </div>

            {showCinemaDropdown && (
              <div className="relative">
                <button
                  onClick={() => setOpenCinema(!openCinema)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">{t("allCinemas")}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${openCinema ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-80 bg-zinc-950/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${
                    openCinema
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-semibold text-zinc-300">
                      {t("cinemaLocations")}
                    </span>
                  </div>
                  <div className="max-h-75 overflow-y-auto">
                    {cinemas.map((c, index) => (
                      <button
                        key={c.id}
                        onClick={() => handleCinemaClick(c.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left
                        ${index !== cinemas.length - 1 ? "border-b border-white/5" : ""}`}
                      >
                        <Image
                          src={c.image?.url || "/fallback-image.png"}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-800"
                          alt={c.name}
                          width={40}
                          height={40}
                        />
                        <div>
                          <div className="text-sm font-medium text-white">
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
