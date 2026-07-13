"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

interface OfferDetailsContentProps {
  currentOffer: {
    id: string;
    title: string;
    imageUrl: string;
    publishDate: string;
    promotionPeriod: string;
    description: string;
    bullets: string[];
  };
}

export default function OfferDetailsContent({
  currentOffer,
}: OfferDetailsContentProps) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full min-w-0">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 font-medium min-w-0">
        <Link
          href="/promotions"
          className="hover:text-white transition-colors shrink-0"
        >
          {th("promotionsTitle") || "Promotions"}
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-3 h-3 text-zinc-600 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="text-zinc-200 truncate">{currentOffer.title}</span>
      </nav>

      {/* FADING DIVIDER */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-4 sm:my-5" />

      {/* HEADER METADATA */}
      <div className="space-y-2 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white break-words">
          {currentOffer.title}
        </h1>

        <div className="flex items-center text-xs sm:text-sm text-zinc-400 gap-1.5 whitespace-nowrap overflow-hidden">
          <span className="text-white">
            {th("publishDateLabel") || "Publish Date:"}
          </span>
          <span className="text-white font-medium">
            {currentOffer.publishDate}
          </span>
        </div>
      </div>

      {/* PROMOTION IMAGE DISPLAY */}
      <div className="overflow-hidden rounded-xl sm:rounded-3xl border border-zinc-900/80 shadow-2xl w-full bg-zinc-950/40 backdrop-blur-sm mb-8">
        <Image
          src={currentOffer.imageUrl}
          alt={currentOffer.title}
          width={1200}
          height={750}
          priority
          sizes="(max-w-1024px) 100vw, 896px"
          className="w-full h-auto object-contain block"
        />
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
        <p className="font-normal text-zinc-200">{currentOffer.description}</p>

        {/* Terms and Rewards Bulleted Block */}
        {currentOffer.bullets && currentOffer.bullets.length > 0 && (
          <ul className="space-y-1.5 list-none pl-0">
            {currentOffer.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-300">
                <span className="text-red-500 shrink-0 mt-0.5">▪</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Promotion Validation Window Footer Tag */}
        {currentOffer.promotionPeriod && (
          <div className="pt-4 flex items-center gap-2 text-xs text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>
              {th("promotionPeriodLabel") || "Promotion Period:"}{" "}
              <strong className="text-zinc-300 font-medium">
                {currentOffer.promotionPeriod}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
