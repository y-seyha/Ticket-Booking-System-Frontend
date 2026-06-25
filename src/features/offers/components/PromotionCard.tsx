"use client";

import Image from "next/image";
import Link from "next/link";

export interface Promotion {
  id: string;
  title: string;
  imageUrl: string;
  slug: string;
}

interface PromotionCardProps {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  if (!promotion) return null;

  return (
    <Link
      href={`/promotions/${promotion.slug || ""}`}
      className="block group/card bg-zinc-900/10 rounded-2xl overflow-hidden border border-white/20 hover:border-zinc-700/60 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Outer image layout wrapper */}
      <div className="w-full p-4 pb-0 relative overflow-hidden">
        {/* Thumbnail Aspect Wrapper Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-950/80">
          {/* Dedicated inner div storing the Image component */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={promotion.imageUrl || "/fallback-placeholder.jpg"}
              alt={promotion.title || "Promotion Banner"}
              fill
              sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 380px"
              className="object-cover select-none transition-transform duration-500 ease-out group-hover/card:scale-105"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Details Typography Block */}
      <div className="p-4 pt-3.5 pb-5">
        <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover/card:text-red-500 transition-colors duration-200 line-clamp-2 tracking-tight leading-snug h-12 overflow-hidden">
          {promotion.title}
        </h3>
      </div>
    </Link>
  );
}
