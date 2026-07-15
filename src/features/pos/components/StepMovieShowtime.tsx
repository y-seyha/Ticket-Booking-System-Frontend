"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "@/features/movies/movie.type";
import { posApi } from "../pos.api";
import { Loader2, Film } from "lucide-react";

interface StepMovieShowtimeProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectMovie: (movie: Movie, date: string) => void;
}

export default function StepMovieShowtime({
  selectedDate,
  onSelectDate,
  onSelectMovie,
}: StepMovieShowtimeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const dateTabs = useMemo(() => {
    const tabs: { label: string; dateString: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      tabs.push({
        label: d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
        dateString: `${year}-${month}-${day}`,
      });
    }
    return tabs;
  }, []);

  const dateStr = selectedDate || dateTabs[0]?.dateString || "";

  useEffect(() => {
    if (!dateStr) return;
    let cancelled = false;
    setLoading(true);
    const load = async () => {
      try {
        const data = await posApi.getMovies(dateStr);
        if (!cancelled) setMovies(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [dateStr]);

  const handleSelectDate = useCallback((d: string) => {
    onSelectDate(d);
  }, [onSelectDate]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    onSelectMovie(movie, dateStr);
  }, [onSelectMovie, dateStr]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-white uppercase tracking-wide">
          Select Movie
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Choose a movie and date
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {dateTabs.map((tab) => (
          <button
            key={tab.dateString}
            onClick={() => handleSelectDate(tab.dateString)}
            className={`relative shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              dateStr === tab.dateString
                ? "text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {dateStr === tab.dateString && (
              <motion.span
                layoutId="activeDateTab"
                className="absolute inset-0 rounded-xl bg-red-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 font-medium">
          No movies available for this date
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={dateStr}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {movies.map((movie) => (
              <motion.button
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectMovie(movie)}
                className="group relative flex flex-col items-start p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-red-500/50 hover:bg-zinc-900 transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="w-full aspect-[2/3] rounded-lg bg-zinc-800 mb-3 flex items-center justify-center overflow-hidden">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Film className="w-8 h-8 text-zinc-600" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {movie.durationMinutes} min
                </p>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
