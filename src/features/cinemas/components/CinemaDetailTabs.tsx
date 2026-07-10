"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TabNavigation from "@/features/movies/components/movie-details/TabNavigation";
import ShowtimeFilters from "@/features/movies/components/movie-details/ShowtimeFilters";
import MovieGrid from "@/features/movies/components/MovieGrid";
import CinemaInfoTab from "@/features/cinemas/components/CinemaInfoTab";

import { cinemasApi } from "../cinemas.api";
import type { Cinema, TheaterMovieSchedule } from "../cinemas.types";

interface CinemaDetailTabsProps {
  cinemaDetails: Cinema & {
    mapUrl: string;
    halls: string;
    openingHours: string;
  };
}

interface DateTabItem {
  day: string;
  date: string;
  month: string;
  dateString: string;
}

const generateDateTabs = (): DateTabItem[] => {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: d.getDate().toString(),
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      dateString: d.toISOString(),
    };
  });
};

const STATIC_DATE_TABS = generateDateTabs();

const fadeVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
} as const;

export default function CinemaDetailTabs({
  cinemaDetails,
}: CinemaDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"showtime" | "detail">("showtime");

  const [selectedDate, setSelectedDate] = useState<string>(
    STATIC_DATE_TABS[0].dateString,
  );
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>(
    cinemaDetails.name,
  );

  const [movies, setMovies] = useState<TheaterMovieSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const locations = [cinemaDetails.name];

  useEffect(() => {
    if (activeTab !== "showtime") return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await cinemasApi.getTheaterMovies(
          cinemaDetails.id,
          selectedDate,
        );
        setMovies(response?.data || []);
      } catch (error) {
        console.error("Failed to load showtimes:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [selectedDate, cinemaDetails.id, activeTab]);

  const handleDateSelect = (dateStr: string) => {
    startTransition(() => {
      setSelectedDate(dateStr);
    });
  };

  const isCurrentlyFiltering = loading || isPending;

  const formattedDmyLabel = (() => {
    if (!selectedDate) return "";
    const activeMatch = STATIC_DATE_TABS.find(
      (t) => t.dateString === selectedDate,
    );
    if (activeMatch) return `${activeMatch.month} ${activeMatch.date}`;
    return new Date(selectedDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  })();

  return (
    <>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative mt-4 overflow-hidden w-full">
        {/* SHOWTIME TAB SECTION */}
        <div
          className={`space-y-8 transition-all duration-500 ease-out transform ${
            activeTab === "showtime"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none absolute top-0 left-0 w-full"
          }`}
        >
          <ShowtimeFilters
            selectedDate={selectedDate}
            setSelectedDate={handleDateSelect}
            selectedLocationFilter={selectedLocationFilter}
            setSelectedLocationFilter={setSelectedLocationFilter}
            locations={locations}
            dateTabs={STATIC_DATE_TABS}
          />

          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-6">
              Now Showing
            </h2>

            <div className="relative w-full min-h-[400px] flex flex-col">
              <AnimatePresence mode="wait">
                {isCurrentlyFiltering ? (
                  <motion.div
                    key="loading"
                    variants={fadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 w-full h-64 flex items-center justify-center z-20 bg-black/5 backdrop-blur-[1px]"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600" />
                  </motion.div>
                ) : movies.length > 0 ? (
                  <motion.div
                    key={`grid-${selectedDate}`}
                    variants={fadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                  >
                    <MovieGrid movies={movies} selectedDate={selectedDate} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-${selectedDate}`}
                    variants={fadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full flex flex-col items-center justify-center text-center py-20 px-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 mb-4 flex items-center justify-center text-amber-500/80">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>

                    <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
                      No Sessions Available
                    </h3>

                    <p className="text-sm text-zinc-500 max-w-xs mt-1.5 loading-relaxed">
                      No sessions found for{" "}
                      <span className="text-zinc-400 font-medium">
                        {formattedDmyLabel}
                      </span>
                      . Try checking an adjacent date.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* DETAIL TAB SECTION */}
        <CinemaInfoTab
          cinema={{
            halls: cinemaDetails.halls,
            openingHours: cinemaDetails.openingHours,
            mapUrl: cinemaDetails.mapUrl,
            address: `${cinemaDetails.location}, ${cinemaDetails.city}`,
          }}
          isActive={activeTab === "detail"}
        />
      </div>
    </>
  );
}
