"use client";

import { useState, use } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import MovieGrid from "@/features/movies/components/MovieGrid";
import ShowtimeFilters from "@/features/movies/components/movie-details/ShowtimeFilters";
import TabNavigation from "@/features/movies/components/movie-details/TabNavigation";
import { movieData } from "@/features/movies/data/movieListings";
import CinemaHeroBanner from "@/features/cinemas/components/CinemaHeroBanner";
import CinemaInfoTab from "@/features/cinemas/components/CinemaInfoTab";
const CINEMA_DETAILS = {
  id: "legend-271-mega-mall",
  name: "Legend 271 Mega Mall",
  address: "Chip Mong Mega Mall, 3rd Floor",
  imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
  halls: "7",
  openingHours: "09:30 - 22:30",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.2829285072045!2d104.9122394!3d11.5312386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ea99bc96081ab29%3A0x6bdeba623838ab84!2sChip%20Mong%20271%20Mega%20Mall!5e0!3m2!1sen!2skh!4v1719223000000!5m2!1sen!2skh",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CinemaDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  const [activeTab, setActiveTab] = useState<"showtime" | "detail">("showtime");
  const [selectedDate, setSelectedDate] = useState("24");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(
    CINEMA_DETAILS.name,
  );

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Decorative Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/15 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <CinemaHeroBanner cinema={CINEMA_DETAILS} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-6">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="relative mt-4 overflow-hidden w-full">
            {/* SHOWTIME TAB SECTION */}
            <div
              className={`space-y-8 transition-all duration-500 ease-out transformation ${
                activeTab === "showtime"
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none absolute top-0 left-0 w-full"
              }`}
            >
              <ShowtimeFilters
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedLocationFilter={selectedLocationFilter}
                setSelectedLocationFilter={setSelectedLocationFilter}
              />

              <div className="pt-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-6">
                  Now Showing
                </h2>
                <MovieGrid movies={movieData} />
              </div>
            </div>

            {/* DETAIL TAB SECTION */}
            <CinemaInfoTab
              cinema={CINEMA_DETAILS}
              isActive={activeTab === "detail"}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
