"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { MOVIE_DETAILS_MOCK } from "@/features/movies/data/movieDetails";
import MovieHero from "@/features/movies/components/movie-details/MovieHero";
import TabNavigation from "@/features/movies/components/movie-details/TabNavigation";
import ShowtimeFilters from "@/features/movies/components/movie-details/ShowtimeFilters";
import LocationAccordionList from "@/features/movies/components/movie-details/LocationAccordionList";

export default function MovieDetailsPage() {
  const params = useParams();
  const movieId = (params?.id as string) || "shake-rattle-roll";

  const movie =
    MOVIE_DETAILS_MOCK[movieId as keyof typeof MOVIE_DETAILS_MOCK] ||
    MOVIE_DETAILS_MOCK["shake-rattle-roll"];

  const [selectedDate, setSelectedDate] = useState("24");
  const [activeTab, setActiveTab] = useState<"showtime" | "detail">("showtime");
  const [selectedLocationFilter, setSelectedLocationFilter] =
    useState("All Locations");

  const displayedLocations = movie.showtimesByLocation.filter(
    (loc) =>
      selectedLocationFilter === "All Locations" ||
      loc.name === selectedLocationFilter,
  );

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Dynamic Background Backdrop Blur Element */}
      <div className="absolute inset-x-0 top-0 z-0 pointer-events-none select-none overflow-hidden h-[340px] sm:h-[420px] md:h-[480px] lg:h-[540px] will-change-transform transform-gpu pt-20 md:pt-24">
        <img
          src={movie.backdrop}
          alt=""
          className="object-cover w-full h-full scale-125 blur-[80px] sm:blur-[110px] opacity-60"
        />
        <div className="absolute inset-0 bg-black/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <Navbar />

    
      <main className="flex-1 pb-24 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 sm:pt-32 md:pt-36 lg:pt-40">
        {/* Ambient background glow layout */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] md:w-[850px] h-[320px] sm:h-[600px] md:h-[850px] bg-red-600/35 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none z-0 transform-gpu" />

        <MovieHero movie={movie} />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === "showtime" ? (
            <motion.div
              key="showtime-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 w-full relative z-10"
            >
              <h2 className="text-xl sm:text-[22px] md:text-2xl font-black tracking-tight text-zinc-100">
                Available Showtimes
              </h2>

              <ShowtimeFilters
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedLocationFilter={selectedLocationFilter}
                setSelectedLocationFilter={setSelectedLocationFilter}
              />

              <LocationAccordionList displayedLocations={displayedLocations} />
            </motion.div>
          ) : (
            <motion.section
              key="detail-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full text-zinc-200 leading-relaxed space-y-4 relative z-10"
            >
              <h3 className="font-black text-white text-xl sm:text-[22px] md:text-2xl tracking-tight">
                Synopsis
              </h3>
              <p className="text-zinc-200 leading-relaxed text-sm sm:text-base font-normal antialiased">
                {movie.description}
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
