"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Film } from "lucide-react";
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
  const cancelRef = useRef(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [movies, setMovies] = useState<SearchMovieResult[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasFetched(false);
      setQuery("");
      setMovies([]);
    }
  }, [open]);

  const fetchMovies = useCallback(async (q: string) => {
    cancelRef.current = false;
    try {
      const res = await searchApi.search(q, 20);
      if (!cancelRef.current) {
        setMovies(res.movies);
        setHasFetched(true);
      }
    } catch {
      if (!cancelRef.current) setMovies([]);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!debouncedQuery.trim()) {
      fetchMovies("");
      return;
    }
    fetchMovies(debouncedQuery);
    return () => { cancelRef.current = true; };
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
          className="fixed inset-0 z-99999 bg-black/90 backdrop-blur-md md:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="pt-16 px-4">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
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
                  onClick={() => { setQuery(""); setMovies([]); setHasFetched(false); inputRef.current?.focus(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {hasFetched && movies.length === 0 && (
              <p className="text-center text-zinc-500 text-sm">
                {query.trim() ? `No results found for "${query}"` : "No movies available"}
              </p>
            )}

            {movies.length > 0 && (
              <div className="space-y-1">
                {movies.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                      {movie.poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-4 h-4 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
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
                        {movie.status === "NOW_SHOWING" ? "Now Showing" : "Coming Soon"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
