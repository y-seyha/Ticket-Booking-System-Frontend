"use client";

import Image from "next/image";
import Link from "next/link";

export interface CinemaLocation {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
}

interface CinemaCardProps {
  cinema: CinemaLocation;
}

export default function CinemaLocationCard({ cinema }: CinemaCardProps) {
  return (
    <Link
      href={`/cinemas/${cinema.id}`}
      className="block group/card bg-zinc-900/10 rounded-2xl overflow-hidden border border-white/20 hover:border-zinc-700/60 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Outer image layout wrapper */}
      <div className="w-full p-4 pb-0 relative overflow-hidden">
        {/* Thumbnail Aspect Wrapper Container */}
        <div className="relative aspect-[6/5] w-full overflow-hidden rounded-xl bg-zinc-950/80">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={cinema.imageUrl}
              alt={cinema.name}
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
      <div className="p-4 pt-3.5 space-y-2">
        <h3 className="font-bold text-base sm:text-lg text-zinc-100 group-hover/card:text-red-500 transition-colors duration-200 line-clamp-1 tracking-tight">
          {cinema.name}
        </h3>

        {/* Pin Location line section with optimized gap spacing */}
        <div className="flex items-start gap-2 text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span className="text-sm font-normal text-zinc-400 line-clamp-1 leading-normal">
            {cinema.address}
          </span>
        </div>
      </div>
    </Link>
  );
}
