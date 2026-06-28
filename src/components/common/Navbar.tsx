"use client";

import { useState, FC, useEffect } from "react";
import {
  Search,
  Ticket,
  User,
  Bell,
  ChevronDown,
  MapPin,
  Home,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { GB, KH } from "country-flag-icons/react/3x2";
import { useRouter, usePathname } from "next/navigation";
import { LuPopcorn } from "react-icons/lu";
import { CiSquareMore } from "react-icons/ci";
import { useAuthStore } from "@/features/auth/auth.store";
import { cinemasApi } from "@/features/cinemas/cinemas.api";
import { Cinema } from "@/features/cinemas/cinemas.types";

type NavKey = "home" | "cinemas" | "promotions" | "fb" | "tickets" | "more";

type Language = {
  code: string;
  label: string;
  Flag: FC;
};

const languages: Language[] = [
  { code: "en", label: "English", Flag: GB },
  { code: "kh", label: "Khmer", Flag: KH },
];

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
  const [language, setLanguage] = useState(languages[0]);
  const [openLang, setOpenLang] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openCinema, setOpenCinema] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    cinemasApi
      .getCinemas()
      .then((res) => {
        // Assuming your API returns { data: [...] } or just the array
        setCinemas(res?.data);
      })
      .catch((err) => console.error("Failed to fetch cinemas:", err));
  }, []);

  const handleCinemaClick = (id: string) => {
    router.push(`/cinemas/${id}`);
    setOpenCinema(false); // Close dropdown
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

  // const cinemas: Cinema[] = [
  //   { id: 1, name: "Eden Cinema", location: "Phnom Penh", image: logoUrl },
  //   { id: 2, name: "Toul Kork Cinema", location: "Phnom Penh", image: logoUrl },
  //   { id: 3, name: "Aeon 1 Cinema", location: "Phnom Penh", image: logoUrl },
  // ];

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
      <nav className="fixed inset-x-0 top-0 z-[9999] text-white bg-zinc-950/70 backdrop-blur-xl border-b border-white/10 py-1 md:py-2 transition-colors duration-300">
        {/* TOP BAR  */}
        <div className="hidden md:grid grid-cols-3 items-center max-w-7xl mx-auto px-4 md:px-23 lg:px-25 py-2">
          {/* LEFT */}
          <div className="flex justify-start">
            {showSearch && (
              <div className="relative group w-[260px]">
                <input
                  placeholder="Search Movies..."
                  className="w-full bg-white/5 text-base px-5 py-1.5 rounded-full border border-white/10 outline-none
                  transition-all duration-250
                  hover:border-white/40 focus:border-white
                  hover:shadow-[0_0_10px_rgba(255,255,255,0.12)]
                  focus:shadow-[0_0_14px_rgba(255,255,255,0.20)]"
                />
                <Search className="absolute right-5 top-2.5 w-4 h-4 text-zinc-400 group-focus:text-white transition-colors" />
              </div>
            )}
          </div>

          {/* CENTER  */}
          {showLogo && (
            <div className="flex justify-center">
              <Link href="/" className="cursor-pointer">
                {!logoFailed ? (
                  <img
                    src={logoUrl}
                    onError={() => setLogoFailed(true)}
                    className="h-7 md:h-9 object-contain"
                    alt="Logo"
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
              <div className="hidden md:flex items-center gap-3">
                {showTicket && (
                  <button className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:border-white/30 transition cursor-pointer">
                    <Ticket className="w-4 h-4" />
                    <span className="hidden md:inline">Ticket</span>
                  </button>
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
                        <User className="w-4 h-4" />
                        <span>Join Now</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/profile")}
                        className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm whitespace-nowrap hover:border-white/30 transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-red-400" />
                        <span>Profile</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* NOTIFICATION */}
            {showNotification && (
              <div className="relative">
                <button
                  onClick={() => setOpenNotif(!openNotif)}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {openNotif && (
                  <div className="absolute right-0 mt-2 w-72 bg-black/95 border border-white/10 rounded-xl overflow-hidden shadow-xl z-[120]">
                    <div className="px-4 py-1.5 text-xs text-zinc-400 border-b border-white/10">
                      Notifications
                    </div>
                    {notifications.map((n, i) => (
                      <div
                        key={i}
                        className="px-4 py-2.5 text-sm hover:bg-white/10"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LANGUAGE */}
            {showLanguage && (
              <div className="relative">
                <button
                  onClick={() => setOpenLang(!openLang)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <language.Flag />
                  </span>

                  <span className="text-sm font-medium uppercase">
                    {language.code}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openLang ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openLang && (
                  <div className="absolute right-0 mt-2 w-44 bg-black/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                    {languages.map((lang) => {
                      const FlagIcon = lang.Flag;

                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang);
                            setOpenLang(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/10 ${
                            language.code === lang.code ? "bg-white/10" : ""
                          }`}
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
                )}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM NAV  */}
        {showBottomNav && (
          <div className="hidden md:block border-t border-white/5 mt-1">
            <div className="max-w-7xl mx-auto px-6 px-23 h-10 flex items-center justify-between">
              {/* NAV LEFT */}
              <div className="flex gap-10 text-sm md:text-base px-2">
                <Link href="/" className="flex items-center gap-2 group">
                  <Home className={navIcon("home")} />
                  <span className={navText("home")}>Home</span>
                </Link>

                <Link href="/cinemas" className="flex items-center gap-2 group">
                  <MapPin className={navIcon("cinemas")} />
                  <span className={navText("cinemas")}>Cinemas</span>
                </Link>

                <Link
                  href="/promotions"
                  className="flex items-center gap-2 group"
                >
                  <Tag className={navIcon("promotions")} />
                  <span className={navText("promotions")}>Offers</span>
                </Link>

                <Link
                  href="/food-and-drinks"
                  className="flex items-center gap-2 group"
                >
                  <LuPopcorn className={navIcon("fb")} />
                  <span className={navText("fb")}>F&B</span>
                </Link>
              </div>

              {/* CINEMA DROPDOWN WRAPPER */}
              {showCinemaDropdown && (
                <div className="relative">
                  <button
                    onClick={() => setOpenCinema(!openCinema)}
                    className="flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">All Cinemas</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${openCinema ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* DROPDOWN CONTAINER WITH SMOOTH ANIMATION */}
                  <div
                    className={`absolute right-0 mt-2 w-80 bg-zinc-950/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${
                      openCinema
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {/* HEADER */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-zinc-300">
                        Cinema Locations
                      </span>
                    </div>

                    {/* LIST */}
                    <div className="max-h-[300px] overflow-y-auto">
                      {cinemas.map((c, index) => (
                        <button
                          key={c.id}
                          onClick={() => handleCinemaClick(c.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left
              ${index !== cinemas.length - 1 ? "border-b border-white/5" : ""}`}
                        >
                          <img
                            src={c.image?.url || "/fallback-image.png"}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-800"
                            alt={c.name}
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

      {/* MOBILE TOP BAR  */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[9999] text-white backdrop-blur-xl border-b border-white/10">
        <div className="h-16 px-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            {showTicket && (
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Ticket className="w-5 h-5" />
              </button>
            )}

            {showNotification && (
              <button
                onClick={() => setOpenNotif(!openNotif)}
                className="w-10 h-10  flex items-center justify-center rounded-full z-[100] bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <Bell className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="cursor-pointer">
              {!logoFailed ? (
                <img
                  src={logoUrl}
                  onError={() => setLogoFailed(true)}
                  className="h-8 object-contain"
                  alt="Logo"
                />
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
              <button className="w-10 h-10 flex items-center justify-center">
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
                  All Cinemas
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
                {/* CINEMA ITEMS */}
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
                      <img
                        src={c.image?.url || "/fallback-image.png"}
                        className="w-10 h-10 rounded-lg object-cover bg-zinc-800"
                        alt={c.name}
                      />
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

      {/* MOBILE FOOTER NAV  */}
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
                ${
                  activeNav === "home"
                    ? "scale-110 -translate-y-[1px] text-white"
                    : "scale-100 text-zinc-300"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${
                    activeNav === "home"
                      ? "bg-red-500 opacity-100"
                      : "bg-white/5 opacity-0"
                  }`}
                />
                <Home
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    activeNav === "home" ? "scale-110" : "scale-100"
                  }`}
                />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${
                  activeNav === "home" ? "text-white" : "text-zinc-400"
                }`}
              >
                Home
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
                ${
                  activeNav === "promotions"
                    ? "scale-110 -translate-y-[1px] text-white"
                    : "scale-100 text-zinc-300"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${
                    activeNav === "promotions"
                      ? "bg-red-500 opacity-100"
                      : "bg-white/5 opacity-0"
                  }`}
                />
                <Tag className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${
                  activeNav === "promotions" ? "text-white" : "text-zinc-400"
                }`}
              >
                Offers
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
                ${
                  activeNav === "cinemas"
                    ? "scale-110 -translate-y-[1px] text-white"
                    : "scale-100 text-zinc-300"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${
                    activeNav === "cinemas"
                      ? "bg-red-500 opacity-100"
                      : "bg-white/5 opacity-0"
                  }`}
                />
                <MapPin className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${
                  activeNav === "cinemas" ? "text-white" : "text-zinc-400"
                }`}
              >
                Cinemas
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
                ${
                  activeNav === "fb"
                    ? "scale-110 -translate-y-[1px] text-white"
                    : "scale-100 text-zinc-300"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${
                    activeNav === "fb"
                      ? "bg-red-500 opacity-100"
                      : "bg-white/5 opacity-0"
                  }`}
                />
                <LuPopcorn className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${
                  activeNav === "fb" ? "text-white" : "text-zinc-400"
                }`}
              >
                F&B
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
                ${
                  activeNav === "more"
                    ? "scale-110 -translate-y-[1px] text-white"
                    : "scale-100 text-zinc-300"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500
                  ${
                    activeNav === "more"
                      ? "bg-red-500 opacity-100"
                      : "bg-white/5 opacity-0"
                  }`}
                />
                <CiSquareMore className="w-5 h-5 relative z-10" />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${
                  activeNav === "more" ? "text-white" : "text-zinc-400"
                }`}
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

export default Navbar;
