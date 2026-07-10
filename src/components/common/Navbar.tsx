"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth.store";

import { cinemasApi } from "@/features/cinemas/cinemas.api";
import { Cinema } from "@/features/cinemas/cinemas.types";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import { MobileNavbar } from "./navbar/MobileNavbar";
import { useLanguage } from "@/features/language/useLanuage";

type NavKey = "home" | "cinemas" | "promotions" | "fb" | "tickets" | "more";

type NavbarProps = {
  showSearch?: boolean;
  showTicket?: boolean;
  showJoinNow?: boolean;
  showNotification?: boolean;
  showLanguage?: boolean;
  showBottomNav?: boolean;
  showMobileBottomNav?: boolean;
  showCinemaDropdown?: boolean;
  showLogo?: boolean;
  logoUrl?: string;
};

const Navbar = ({
  showSearch = true,
  showTicket = true,
  showJoinNow = true,
  showNotification = true,
  showLanguage = true,
  showBottomNav = true,
  showMobileBottomNav = true,
  showCinemaDropdown = true,
  showLogo = true,
  logoUrl = "/cinema-logo.png",
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const { currentLanguage, languagesList, setLanguage } = useLanguage();

  const [openLang, setOpenLang] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openCinema, setOpenCinema] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    cinemasApi
      .getCinemas()
      .then((res) => {
        setCinemas(res?.data || []);
      })
      .catch((err) => console.error("Failed to fetch cinemas:", err));
  }, []);

  const handleCinemaClick = (id: string) => {
    router.push(`/cinemas/${id}`);
    setOpenCinema(false);
  };

  const getActiveKey = (): NavKey | null => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/cinemas")) return "cinemas";
    if (pathname.startsWith("/promotions")) return "promotions";
    if (pathname.startsWith("/food-and-drinks")) return "fb";
    if (pathname.startsWith("/more")) return "more";
    return null;
  };

  const activeNav = getActiveKey();

  const notifications = [
    "🎬 New movie released",
    "🍿 Popcorn discount today",
    "🎟️ Booking confirmed",
  ];

  const navText = (key: NavKey) =>
    `transition-colors duration-200 ${
      activeNav === key
        ? "text-white font-semibold cursor-pointer"
        : "text-zinc-300 font-normal hover:text-white cursor-pointer"
    }`;

  const navIcon = (key: NavKey) =>
    `w-4 h-4 transition-colors duration-200 ${
      activeNav === key
        ? "text-red-500 cursor-pointer"
        : "text-zinc-400 group-hover:text-white cursor-pointer"
    }`;

  return (
    <>
      <DesktopNavbar
        showSearch={showSearch}
        showTicket={showTicket}
        showJoinNow={showJoinNow}
        showNotification={showNotification}
        showLanguage={showLanguage}
        showBottomNav={showBottomNav}
        showCinemaDropdown={showCinemaDropdown}
        showLogo={showLogo}
        logoUrl={logoUrl}
        logoFailed={logoFailed}
        setLogoFailed={setLogoFailed}
        hydrated={hydrated}
        user={user}
        router={router}
        openLang={openLang}
        setOpenLang={setOpenLang}
        openNotif={openNotif}
        setOpenNotif={setOpenNotif}
        notifications={notifications}
        openCinema={openCinema}
        setOpenCinema={setOpenCinema}
        cinemas={cinemas}
        handleCinemaClick={handleCinemaClick}
        activeNav={activeNav}
        navText={navText}
        navIcon={navIcon}
      />

      <MobileNavbar
        showTicket={showTicket}
        showNotification={showNotification}
        showLanguage={showLanguage}
        showSearch={showSearch}
        showCinemaDropdown={showCinemaDropdown}
        showMobileBottomNav={showMobileBottomNav}
        logoUrl={logoUrl}
        logoFailed={logoFailed}
        setLogoFailed={setLogoFailed}
        openNotif={openNotif}
        setOpenNotif={setOpenNotif}
        openLang={openLang}
        setOpenLang={setOpenLang}
        language={currentLanguage}
        languages={languagesList}
        setLanguage={(langObj) => setLanguage(langObj.code)}
        openCinema={openCinema}
        setOpenCinema={setOpenCinema}
        cinemas={cinemas}
        handleCinemaClick={handleCinemaClick}
        activeNav={activeNav}
      />
    </>
  );
};

export default Navbar;
