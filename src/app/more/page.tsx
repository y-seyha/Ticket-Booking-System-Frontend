"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Info,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Ticket,
  MapPin,
  Gift,
  Languages,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/features/auth/auth.hook";
import { useLanguageStore } from "@/features/language/language.store";

interface RowItem {
  icon: ReactNode;
  label: string;
  path?: string;
  badge?: string;
}

interface RowSection {
  title: string;
  items: RowItem[];
}

export default function MorePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const currentLanguage = useLanguageStore((s) => s.language);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      router.replace("/");
      return;
    }

    // Create a listener handler for real-time viewport changes
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        router.replace("/");
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout process met an error:", error);
    }
  };


  const sections: RowSection[] = [
    {
      title: "Cinema Experience",
      items: [
        {
          icon: <Ticket className="w-4 h-4 text-zinc-500" />,
          label: "My Tickets & History",
          path: "/my-tickets",
        },
        {
          icon: <MapPin className="w-4 h-4 text-zinc-500" />,
          label: "Cinema Locations",
          path: "/cinemas",
        },
        {
          icon: <Gift className="w-4 h-4 text-zinc-500" />,
          label: "Promotions",
          path: "/promotions",
        },
      ],
    },
    {
      title: "Support & Legal",
      items: [
        {
          icon: <Info className="w-4 h-4 text-zinc-500" />,
          label: "About Legend Cinema",
          path: "/about-us",
        },
        {
          icon: <ShieldCheck className="w-4 h-4 text-zinc-500" />,
          label: "Terms & Conditions",
          path: "/terms-&-conditions",
        },
        {
          icon: <HelpCircle className="w-4 h-4 text-zinc-500" />,
          label: "Contact & Support",
          path: "/contact",
        },
        {
          icon: <Languages className="w-4 h-4 text-zinc-500" />,
          label: "App Language",
          badge: currentLanguage,
        },
      ],
    },
  ];

  return (
    <div className="h-screen w-screen bg-black flex flex-col text-white select-none relative overflow-hidden antialiased md:hidden">
      {/* Cinematic Ambient Background Blur */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen">
        <div className="w-[600px] h-[500px] bg-red-950/15 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      {/* Main container optimized to prevent unwanted scrolling while keeping content elastic */}
      <main className="flex-1 w-full pt-32 pb-28 px-4 relative z-10 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out">
        <div className="space-y-6">
          <h1 className="text-xs font-mono font-bold tracking-[0.2em] px-1 text-zinc-400 uppercase">
            More Configurations
          </h1>

          {/* PROFILE / ACCOUNT TRIGGER */}
          <div
            onClick={() => router.push("/profile")}
            className="flex items-center justify-between p-5 bg-zinc-950/80 border border-white/15 rounded-2xl backdrop-blur-2xl active:bg-white/5 transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-inner flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-white tracking-wide truncate">
                  My Profile
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 font-medium truncate">
                  Manage personal data & settings
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 flex-shrink-0" />
          </div>

          {/* DYNAMICALLY MAPPED SECTIONS */}
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase px-1">
                {section.title}
              </h2>
              <div className="bg-zinc-950/60 border border-white/10 rounded-2xl backdrop-blur-2xl overflow-hidden shadow-xl">
                {section.items.map((item, itemIdx) => {
                  const isLast = itemIdx === section.items.length - 1;
                  const rowClass = `w-full flex items-center gap-4 px-5 py-4 text-sm text-zinc-200 ${
                    !isLast ? "border-b border-white/5" : ""
                  }`;

                  if (item.path) {
                    return (
                      <button
                        key={itemIdx}
                        onClick={() => router.push(item.path!)}
                        className={`${rowClass} active:bg-white/5 transition text-left`}
                      >
                        {item.icon}
                        <span className="flex-1 font-semibold tracking-wide">
                          {item.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                      </button>
                    );
                  }

                  return (
                    <div key={itemIdx} className={rowClass}>
                      {item.icon}
                      <span className="flex-1 font-semibold tracking-wide">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 bg-zinc-900/60 px-2.5 py-1 rounded-md border border-white/5 uppercase">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* LOGOUT SYSTEM DIRECTIVE */}
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 mt-6 p-4 bg-red-950/20 border border-red-500/20 text-red-400 font-mono font-bold text-xs uppercase tracking-widest rounded-2xl active:bg-red-500/20 transition-all duration-200 shadow-md cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </main>
    </div>
  );
}
