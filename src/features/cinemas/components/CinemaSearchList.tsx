"use client";

import { useState, useMemo, useTransition } from "react";
import CinemaLocationCard, {
  CinemaLocation,
} from "@/features/cinemas/components/CinemaLocationCard";

interface CinemaSearchListProps {
  initialCinemas: CinemaLocation[];
}

export default function CinemaSearchList({
  initialCinemas,
}: CinemaSearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

  const filteredCinemas = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) return initialCinemas;

    return initialCinemas.filter(
      (cinema) =>
        cinema.name.toLowerCase().includes(normalizedQuery) ||
        cinema.address.toLowerCase().includes(normalizedQuery),
    );
  }, [initialCinemas, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="relative w-full group">
        <input
          type="text"
          placeholder="Search Location..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-white/5 text-white placeholder-white/40 text-base border border-white/10 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all backdrop-blur-md group-hover:border-white/20"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-focus-within:text-white/70 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      {/* Grid List Display */}
      {filteredCinemas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredCinemas.map((cinema) => (
            <CinemaLocationCard key={cinema.id} cinema={cinema} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800/60 rounded-2xl bg-zinc-900/10 backdrop-blur-sm">
          <p className="text-lg font-medium text-zinc-400">
            No matching locations found
          </p>
          <p className="text-sm text-zinc-600 mt-1">
            Try adjusting keywords or check spelling.
          </p>
        </div>
      )}
    </div>
  );
}
