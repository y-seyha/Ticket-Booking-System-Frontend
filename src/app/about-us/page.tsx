"use client";

import Link from "next/link";
import Image from "next/image";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

export default function AboutUsPage() {
  usePageTitle("About Us");
  const cinemaHeroImage = "/courousel/legend-cinema-hall.jpeg";

  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";

  const th = (key: string): string => {
    const lookupKey = key as keyof typeof translations;
    return translations[lookupKey]?.[langCode] || translations[lookupKey]?.["en"] || key;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between overflow-x-hidden relative">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      {/* BACKGROUND BLUR IMAGE */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden h-[80vh]">
        <div className="absolute inset-0 will-change-transform transform-gpu opacity-40 sm:opacity-50">
          <Image
            src={cinemaHeroImage}
            alt=""
            fill
            priority
            className="object-cover scale-110 blur-[40px] sm:blur-[80px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
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
                alt={th("aboutLegendCinema")}
                width={1200}
                height={750}
                priority
                sizes="(max-w-1024px) 100vw, 896px"
                className="w-full h-auto object-contain block"
              />
            </div>

            {/* BREADCRUMB */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-medium min-w-0 mb-4">
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
              <span className="text-zinc-300 truncate">
                {th("aboutLegendCinema")}
              </span>
            </nav>

            {/* MAIN COPY AND TEXT BODY */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white break-words">
                {th("aboutLegendCinema")}
              </h1>

              <div className="text-xs sm:text-sm text-white leading-relaxed space-y-4 font-normal">
                <p>{th("aboutSubtitle")}</p>
                <p>{th("aboutParagraph1")}</p>
                <p>{th("aboutParagraph2")}</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}