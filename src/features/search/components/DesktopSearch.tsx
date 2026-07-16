"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchApi } from "../search.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchMovieResult } from "../search.types";

export default function DesktopSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const [movies, setMovies] = useState<SearchMovieResult[]>([]);

  const fetchMovies = useCallback(async (q: string) => {
    cancelRef.current = false;
    try {
      const res = await searchApi.search(q, 20);
      if (!cancelRef.current) {
        setMovies(res.movies);
        setOpen(true);
      }
    } catch {
      if (!cancelRef.current) setMovies([]);
    }
  }, []);

  const fetchAllActive = useCallback(async () => {
    cancelRef.current = false;
    try {
      const res = await searchApi.search("", 20);
      if (!cancelRef.current) {
        setMovies(res.movies);
        setOpen(true);
      }
    } catch {
      if (!cancelRef.current) setMovies([]);
    }
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    fetchMovies(debouncedQuery);
    return () => { cancelRef.current = true; };
  }, [debouncedQuery, fetchMovies]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);
      setQuery("");
      setMovies([]);
      router.push(`/movies/${id}`);
    },
    [router],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setMovies([]);
    setOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (!query.trim() && movies.length === 0) fetchAllActive();
            else if (movies.length > 0) setOpen(true);
          }}
          placeholder="Search movies..."
          className="w-full bg-white/5 text-white text-sm pl-11 pr-10 py-2 rounded-full border border-white/10 outline-none placeholder:text-zinc-500 focus:border-red-500/50 focus:bg-white/10 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && movies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto p-3 space-y-1">
              {movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelect(movie.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer group"
                >
                  <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                    {movie.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="w-4 h-4 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                      {movie.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <span>{movie.language}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {movie.durationMinutes} min
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        movie.status === "NOW_SHOWING"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {movie.status === "NOW_SHOWING"
                        ? "Now Showing"
                        : "Coming Soon"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
