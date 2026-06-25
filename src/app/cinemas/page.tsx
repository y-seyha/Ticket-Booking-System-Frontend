"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";
import CinemaLocationCard, {
  CinemaLocation,
} from "@/features/cinemas/components/CinemaLocationCard";

const CINEMA_LOCATIONS: CinemaLocation[] = [
  {
    id: "legend-271-mega-mall",
    name: "Legend 271 Mega Mall",
    address: "Chip Mong Mega Mall, 3rd Floor",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
  },
  {
    id: "legend-eden-garden",
    name: "Legend Eden Garden",
    address: "Eden Garden, Phnom Penh Center",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
  },
  {
    id: "legend-exchange-square",
    name: "Legend Exchange Square",
    address: "2nd Floor, The Exchange Square",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
  },
];

const staticCinemaBanner: CarouselItem[] = [
  {
    id: "cinema-page-banner",
    src: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    title: "Legend Cinema | Legend Premium Cinema",
    publishDate: "2026-06-24",
  },
];

export default function CinemasPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCinemas = CINEMA_LOCATIONS.filter(
    (cinema) =>
      cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <HeroCarousel
          carouselImg={staticCinemaBanner}
          showBlurBackground={true}
          showDots={false}
          autoPlay={false}
        />

        {/* Layout Grid Containment Block */}
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-4 md:mt-6 space-y-6">
          {/* Label Heading */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Cinema:
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 text-white placeholder-white/50 text-base border border-white/10 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all backdrop-blur-md"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
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

          {/* Location Grid List */}
          {filteredCinemas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {filteredCinemas.map((cinema) => (
                <CinemaLocationCard key={cinema.id} cinema={cinema} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              No matching cinema locations found.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
