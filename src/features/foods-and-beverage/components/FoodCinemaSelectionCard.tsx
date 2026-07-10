"use client";

import { Cinema } from "@/features/cinemas/cinemas.types";
import Image from "next/image";
import Link from "next/link";

interface FoodCinemaSelectionCardProps {
  cinema: Cinema;
}

export default function FoodCinemaSelectionCard({
  cinema,
}: FoodCinemaSelectionCardProps) {
  return (
    <Link
      href={`/food-and-drinks/${cinema.id}`}
      className="group flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 hover:bg-zinc-800/40 hover:border-zinc-700/80 transition-all duration-200 cursor-pointer backdrop-blur-sm"
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        {/* Cinema Thumbnail */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700/50">
          <Image
            src={cinema.image?.url || "/images/cinema-placeholder.jpg"}
            alt={cinema.name}
            fill
            sizes="64px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text Container: Uses truncate to handle very long names */}
        <div className="flex flex-col truncate">
          <span className="text-sm font-bold text-white truncate">
            {cinema.name}
          </span>
          <span className="text-xs text-zinc-400 truncate">
            {cinema.location}
          </span>
        </div>
      </div>

      {/* Right Chevron Arrow */}
      <div className="text-zinc-600 group-hover:text-white transition-all duration-150 pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
