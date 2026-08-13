"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Film, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchApi } from "../search.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchMovieResult } from "../search.types";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [movies, setMovies] = useState<SearchMovieResult[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset transient state in-place when the dialog opens (avoids render cascades)
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setMovies([]);
      setHasFetched(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll while the dialog is open
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const fetchMovies = useCallback(async (q: string) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const res = await searchApi.search(q, 20);
      if (requestId !== requestIdRef.current) return;
      setMovies(res.movies);
      setHasFetched(true);
    } catch {
      if (requestId === requestIdRef.current) setMovies([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      fetchMovies(debouncedQuery.trim() ? debouncedQuery : "");
    }, 0);
    return () => clearTimeout(timer);
  }, [debouncedQuery, open, fetchMovies]);

  const handleSelect = (id: string) => {
    router.push(`/movies/${id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-99999 md:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          <div
            className="relative flex h-full flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed header + search input */}
            <div className="shrink-0 pt-14 px-4 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Search Movies
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full bg-white/10 text-white text-base pl-12 pr-12 py-3.5 rounded-xl border border-white/20 outline-none placeholder:text-zinc-500 focus:border-red-500/50 transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setMovies([]);
                      setHasFetched(false);
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable results below the search input */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
              {loading && movies.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                </div>
              )}

              {!loading && hasFetched && movies.length === 0 && (
                <p className="text-center text-zinc-500 text-sm pt-10">
                  {query.trim()
                    ? `No results found for "${query}"`
                    : "No movies available"}
                </p>
              )}

              {movies.length > 0 && (
                <div className="space-y-1">
                  <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {movies.length} {movies.length === 1 ? "movie" : "movies"}
                  </p>
                  {movies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleSelect(movie.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
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
                            <Film className="w-4 h-4 text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {movie.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {movie.language} &middot; {movie.durationMinutes} min
                        </p>
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
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}