"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import MovieHero from "@/features/movies/components/movie-details/MovieHero";
import TabNavigation from "@/features/movies/components/movie-details/TabNavigation";
import ShowtimeFilters from "@/features/movies/components/movie-details/ShowtimeFilters";
import LocationAccordionList from "@/features/movies/components/movie-details/LocationAccordionList";
import { apiRequest } from "@/lib/config/axios";
import { CalendarX } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  screenName: string;
  screenType: string;
  basePrice: string;
}

export interface LocationShowtimes {
  id: string;
  name: string;
  location: string;
  city: string;
  showtimes: Showtime[];
}

export interface MovieDetails {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  language: string;
  releaseDate: string;
  poster: string | null;
  backdrop: string | null;
  trailerYoutubeId: string | null;
  showtimesByLocation: LocationShowtimes[];
}

export default function MovieDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const movieId = params?.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isUpdatingDate, setIsUpdatingDate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"showtime" | "detail">("showtime");
  const [selectedLocationFilter, setSelectedLocationFilter] =
    useState("All Locations");

  const generatedDateTabs = useMemo(() => {
    const tabs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      // Create uniform UTC midnight timestamps matching your homepage layout
      const utcMidnight = new Date(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
      );

      tabs.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        date: d.getDate().toString(),
        month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
        dateString: utcMidnight.toISOString(),
      });
    }
    return tabs;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const queryDate = searchParams.get("date");
    if (queryDate) {
      try {
        const parsedDate = new Date(queryDate);
        if (!isNaN(parsedDate.getTime())) {
          return new Date(
            Date.UTC(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              0,
              0,
              0,
              0,
            ),
          ).toISOString();
        }
      } catch (e) {
        console.error("Error parsing date parameter:", e);
      }
    }

    // Fall back to the structured format of Tab index 0
    return generatedDateTabs[0]?.dateString ?? new Date().toISOString();
  });

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        if (!movie) {
          setInitialLoading(true);
        } else {
          setIsUpdatingDate(true);
        }

        const data = await apiRequest<MovieDetails>(
          "get",
          `/movies/${movieId}`,
          undefined,
          {
            params: {
              date: selectedDate,
            },
          },
        );
        setMovie(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
      } finally {
        setInitialLoading(false);
        setIsUpdatingDate(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, selectedDate]);

  const displayedLocations = useMemo(() => {
    if (!movie) return [];

    // Format target comparison string (YYYY-MM-DD)
    const targetDateStr = new Date(selectedDate).toISOString().split("T")[0];

    return movie.showtimesByLocation
      .filter(
        (loc) =>
          selectedLocationFilter === "All Locations" ||
          loc.name === selectedLocationFilter,
      )
      .map((loc) => {
        const filteredShowtimes = loc.showtimes.filter((showtime) => {
          const showtimeDateStr = new Date(showtime.startTime)
            .toISOString()
            .split("T")[0];
          return showtimeDateStr === targetDateStr;
        });

        return {
          ...loc,
          showtimes: filteredShowtimes,
        };
      })
      .filter((loc) => loc.showtimes.length > 0);
  }, [movie, selectedDate, selectedLocationFilter]);

  const hasShowtimes = displayedLocations.length > 0;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-red-500">
              Something went wrong
            </h2>
            <p className="text-zinc-400">
              {error || "Movie data could not be recovered."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const locationsList = [
    "All Locations",
    ...movie.showtimesByLocation.map((loc) => loc.name),
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      <div className="absolute inset-x-0 top-0 z-0 pointer-events-none select-none overflow-hidden h-85 sm:h-105 md:h-120 lg:h-135 will-change-transform transform-gpu pt-20 md:pt-24">
        {movie.backdrop && (
          <Image
            src={movie.backdrop}
            alt=""
            fill
            priority
            className="object-cover w-full h-full scale-125 blur-[110px] opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-black/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />
        <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-black to-transparent" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 sm:pt-32 md:pt-36 lg:pt-40">
        <div className="mb-10 mt-4 md:mt-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push("/")}
                  className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-zinc-500 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-zinc-800 mx-2" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-zinc-300 truncate max-w-[250px] sm:max-w-md">
                  {movie.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-150 md:w-212.5 h-80 sm:h-150 md:h-212.5 bg-red-600/35 rounded-full blur-[160px] pointer-events-none z-0 transform-gpu" />

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
                locations={locationsList}
                dateTabs={generatedDateTabs}
              />

              {isUpdatingDate ? (
                <div className="space-y-4 pt-2 animate-pulse">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border border-zinc-900 bg-zinc-900/20 rounded-xl p-5 space-y-4"
                    >
                      <div className="h-6 w-48 bg-zinc-800 rounded-md" />
                      <div className="space-y-2 pt-2">
                        <div className="h-4 w-24 bg-zinc-800/60 rounded" />
                        <div className="flex gap-2">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="h-10 w-32 bg-zinc-800/40 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-in fade-in duration-200">
                  {hasShowtimes ? (
                    <LocationAccordionList
                      key={selectedDate}
                      displayedLocations={displayedLocations}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="bg-zinc-900/50 p-4 rounded-full mb-4">
                        <CalendarX className="w-6 h-6 text-zinc-600" />
                      </div>
                      <h3 className="text-zinc-200 font-medium">
                        No showtimes available
                      </h3>
                      <p className="text-zinc-500 text-sm mt-1">
                        Try selecting a different date or location.
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                {movie.description || "No synopsis available for this film."}
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
