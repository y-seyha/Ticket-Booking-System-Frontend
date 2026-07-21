"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

export default function ContactPage() {
  usePageTitle("Contact");
  const cinemaHeroImage = "/courousel/contact-hero.jpg";

  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";

  const th = (key: string): string => {
    const lookupKey = key as keyof typeof translations;
    return translations[lookupKey]?.[langCode] || translations[lookupKey]?.["en"] || key;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between overflow-x-hidden relative">
      {/* BACKGROUND BLUR IMAGE & SHADOW GRADIENT LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden h-[90vh]">
        <div className="absolute inset-0 will-change-transform transform-gpu opacity-65 sm:opacity-75">
          <Image
            src={cinemaHeroImage}
            alt=""
            fill
            priority
            className="object-cover scale-110 blur-[50px] sm:blur-[60px]"
          />
        </div>
        {/* Integrated smooth gradient to cleanly fade image context into dark footer layout */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-red-950/10 to-transparent" />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar showCinemaDropdown={false} />

        <main className="flex-1 text-white pt-28 sm:pt-28 md:pt-36 lg:pt-40 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full min-w-0">
            {/* PROMOTION / HERO IMAGE DISPLAY */}
            <div className="overflow-hidden rounded-xl sm:rounded-3xl border border-zinc-900/80 shadow-2xl w-full bg-zinc-950/40 backdrop-blur-sm mb-6">
              <Image
                src={cinemaHeroImage}
                alt={th("contactUs")}
                width={1200}
                height={750}
                priority
                sizes="(max-w-1024px) 100vw, 896px"
                className="w-full h-auto object-contain block"
              />
            </div>

            {/* BREADCRUMB */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-medium min-w-0 mb-6">
              <Link
                href="/"
                className="hover:text-white transition-colors shrink-0"
              >
                {th("homeBreadcrumb")}
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 text-zinc-700 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
              <span className="text-zinc-300 truncate">{th("contactUs")}</span>
            </nav>

            {/* MAIN COPY AND INFRASTRUCTURE GRID */}
            <div className="space-y-6 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white break-words">
                {th("contactInfoTitle")}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* CARD 1: HOTLINE GROUP */}
                <div className="rounded-xl sm:rounded-2xl border border-zinc-900/80 bg-zinc-950/40 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col">
                  <div className="bg-zinc-900/40 px-5 py-4 border-b border-zinc-900/80">
                    <h3 className="text-sm sm:text-base font-bold tracking-wide text-white uppercase">
                      {th("hotlineLabel")}
                    </h3>
                  </div>

                  <div className="p-5 flex-1 flex flex-col gap-3">
                    {/* Phone Row */}
                    <a
                      href="tel:081300400"
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-700/80 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-green-500 group-hover:scale-105 transition-transform shrink-0">
                        <Phone size={16} />
                      </div>
                      <span className="text-sm text-white font-normal">
                        081 300 400
                      </span>
                    </a>

                    {/* Messenger Row */}
                    <a
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-700/80 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-pink-500 group-hover:scale-105 transition-transform shrink-0">
                        <MessageSquare size={16} />
                      </div>
                      <span className="text-sm text-white font-normal">
                        {th("messengerLabel")}
                      </span>
                    </a>

                    {/* Email Row */}
                    <a
                      href="mailto:info@legend.com.kh"
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-700/80 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-red-500 group-hover:scale-105 transition-transform shrink-0">
                        <Mail size={16} />
                      </div>
                      <span className="text-sm text-white font-normal break-all">
                        info@legend.com.kh
                      </span>
                    </a>
                  </div>
                </div>

                {/* CARD 2: ADVERTISING & PARTNERSHIP */}
                <div className="rounded-xl sm:rounded-2xl border border-zinc-900/80 bg-zinc-950/40 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col">
                  <div className="bg-zinc-900/40 px-5 py-4 border-b border-zinc-900/80">
                    <h3 className="text-sm sm:text-base font-bold tracking-wide text-white uppercase">
                      {th("advertisingLabel")}
                    </h3>
                  </div>

                  <div className="p-5 flex-1 flex flex-col gap-3">
                    {/* Phone Row */}
                    <a
                      href="tel:087888045"
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-700/80 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-green-500 group-hover:scale-105 transition-transform shrink-0">
                        <Phone size={16} />
                      </div>
                      <span className="text-sm text-white font-normal">
                        087 888 045
                      </span>
                    </a>

                    {/* Email Row */}
                    <a
                      href="mailto:sales@legend.com.kh"
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-700/80 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-red-500 group-hover:scale-105 transition-transform shrink-0">
                        <Mail size={16} />
                      </div>
                      <span className="text-sm text-white font-normal break-all">
                        sales@legend.com.kh
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}