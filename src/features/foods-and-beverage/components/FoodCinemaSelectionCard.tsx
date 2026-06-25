"use client";

import Image from "next/image";
import Link from "next/link";

export interface FoodCinemaLocation {
  id: string;
  name: string;
  imageUrl?: string;
}

interface FoodCinemaSelectionCardProps {
  cinema: FoodCinemaLocation;
}

export default function FoodCinemaSelectionCard({
  cinema,
}: FoodCinemaSelectionCardProps) {
  return (
    <Link
      href={`/food-and-drinks/${cinema.id}`}
      className="group flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 hover:bg-zinc-800/40 hover:border-zinc-700/80 transition-all duration-200 cursor-pointer backdrop-blur-sm"
    >
      <div className="flex items-center space-x-4">
        {/* Cinema Thumbnail Image - Increased size here */}
        <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700/50">
          <Image
            src={cinema.imageUrl || "/images/cinema-placeholder.jpg"}
            alt={cinema.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Cinema Title */}
        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors duration-150">
          {cinema.name}
        </span>
      </div>

      {/* Right Chevron Arrow */}
      <div className="text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all duration-150 pr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </Link>
  );
}
