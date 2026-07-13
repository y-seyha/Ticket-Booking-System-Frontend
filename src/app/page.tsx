"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import NoticeModal from "@/components/common/NoticeModal";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import MovieFilterTabs from "@/features/movies/components/MovieFilterTabs";
import MovieDateTabs from "@/features/movies/components/MovieDateTabs";
import MovieGrid from "@/features/movies/components/MovieGrid";

import PromoCarousel from "@/features/movies/components/PromoCarousel";
import { promoCarouselData } from "@/features/movies/data/promoCarouselImages";
import carouselImages from "@/features/movies/data/carouselImages";
import { apiRequest } from "@/lib/config/axios";
import { Movie, MovieItem } from "@/features/movies/movie.type";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

type Mode = "showing" | "coming";

interface DateTabItem {
  day: string;
  date: string;
  month: string;
  dateString: string;
}

interface MonthTabItem {
  id: string;
  label: string;
  value: string;
}

export default function Home() {
  const [currentMode, setCurrentMode] = useState<Mode>("showing");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  const langCode = currentLanguage?.code || "en";
  const th = (key: keyof typeof translations): string => {
    return translations[key]?.[langCode] || translations[key]["en"];
  };

  const generatedDateTabs = useMemo<DateTabItem[]>(() => {
    const tabs: DateTabItem[] = [];
    const localeString = langCode === "kh" ? "km-KH" : "en-US";

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      tabs.push({
        day: d
          .toLocaleDateString(localeString, { weekday: "short" })
          .toUpperCase(),
        date: d.getDate().toString(),
        month: d
          .toLocaleDateString(localeString, { month: "short" })
          .toUpperCase(),
        dateString,
      });
    }
    return tabs;
  }, [langCode]);

  const monthTabs = useMemo<MonthTabItem[]>(() => {
    const months: MonthTabItem[] = [];
    const now = new Date();
    const localeString = langCode === "kh" ? "km-KH" : "en-US";

    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        id: `${d.getFullYear()}-${d.getMonth()}`,
        label: d
          .toLocaleDateString(localeString, { month: "short", year: "numeric" })
          .toUpperCase(),
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      });
    }
    return months;
  }, [langCode]);

  const [selectedDate, setSelectedDate] = useState<string>(
    generatedDateTabs[0]?.dateString || "",
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthTabs[0]?.value || "",
  );

  const formattedDmyLabel = useMemo(() => {
    if (currentMode === "showing") {
      if (!selectedDate) return "";
      const [year, month, day] = selectedDate.split("-");
      return `${day}/${month}/${year}`;
    } else {
      const targetMonth = monthTabs.find((m) => m.value === selectedMonth);
      return targetMonth ? targetMonth.label : "";
    }
  }, [selectedDate, selectedMonth, currentMode, monthTabs]);

  const movieItems: MovieItem[] = movies.map((m) => ({
    id: m.id,
    title: m.title,
    poster: m.poster,
    releaseDate: m.releaseDate,
    isAdvanceTicket: (m.showtimes?.length ?? 0) > 0,
    tags: [],
  }));

  useEffect(() => {
    async function fetchActiveListings() {
      setIsLoading(true);

      try {
        if (currentMode === "showing") {
          if (!selectedDate) return;

          const activeShowtimes = await apiRequest<Movie[]>(
            "get",
            "/showtimes/active/listings",
            undefined,
            {
              params: {
                status: "NOW_SHOWING",
                date: selectedDate,
              },
            },
          );
          setMovies(activeShowtimes);
        } else {
          interface PaginatedMoviesResponse {
            data: Movie[];
            pagination: {
              total: number;
              page: number;
              limit: number;
              totalPages: number;
            };
          }

          const response = await apiRequest<PaginatedMoviesResponse>(
            "get",
            "/movies",
            undefined,
            {
              params: {
                status: "COMING_SOON",
                month: selectedMonth,
                page: 1,
                limit: 50,
              },
            },
          );

          setMovies(response.data || []);
        }
      } catch (error) {
        console.error("Error retrieving dashboard theater matrix:", error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveListings();
  }, [currentMode, selectedDate, selectedMonth]);

  const fadeVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
  } as const;

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden">
      <NoticeModal />

      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-200 md:w-325 h-150 md:h-175 bg-red-700/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 m-auto w-100 md:w-175 h-75 md:h-[350px] bg-red-600/35 rounded-full blur-[90px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-20 relative z-10">
        <HeroCarousel
          carouselImg={carouselImages}
          showBlurBackground
          showDots
          autoPlay
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-6 md:mt-10">
          <MovieFilterTabs
            currentMode={currentMode}
            onChangeMode={setCurrentMode}
          />

          <MovieDateTabs
            mode={currentMode}
            dateTabs={generatedDateTabs}
            monthTabs={monthTabs}
            selectedDate={
              currentMode === "showing" ? selectedDate : selectedMonth
            }
            onSelectDate={(val) => {
              if (currentMode === "showing") setSelectedDate(val);
              else setSelectedMonth(val);
            }}
          />

          <div className="relative w-full min-h-100 flex flex-col">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 w-full h-48 flex items-center justify-center z-20"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600" />
                </motion.div>
              ) : movies.length > 0 ? (
                <motion.div
                  key={`grid-${currentMode === "showing" ? selectedDate : selectedMonth}-${currentMode}`}
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <MovieGrid movies={movieItems} selectedDate={selectedDate} />
                </motion.div>
              ) : (
                <motion.div
                  key={`empty-${currentMode === "showing" ? selectedDate : selectedMonth}-${currentMode}`}
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex flex-col items-center justify-center text-center py-20 px-6"
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
                    {th("noSessionsTitle")}
                  </h3>

                  <p className="text-sm text-zinc-500 max-w-xs mt-1.5 leading-relaxed">
                    {th("noSessionsDescStart")}
                    <span className="text-zinc-400 font-medium">
                      {formattedDmyLabel}
                    </span>
                    {th("noSessionsDescEnd")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PromoCarousel
            promos={promoCarouselData}
            autoPlay={true}
            className="mt-16 md:mt-20"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
