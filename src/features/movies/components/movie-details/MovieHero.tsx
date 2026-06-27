"use client";

import Image from "next/image";
import { useState } from "react";
import TrailerModal from "./TrailerModal";

interface MovieDetails {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  language: string;
  releaseDate: string;
  poster: string | null;
  backdrop: string | null;
  trailerYoutubeId: string | null;
}

interface MovieHeroProps {
  movie: MovieDetails;
}

export default function MovieHero({ movie }: MovieHeroProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-linear-to-b md:bg-linear-to-r from-zinc-950 via-zinc-950/95 to-zinc-900/30 border border-zinc-900/60 rounded-2xl md:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-10 flex flex-col-reverse md:flex-row items-center justify-between mb-8 gap-6 md:gap-8 z-10">
      <div className="relative z-10 w-full md:max-w-md space-y-4 sm:space-y-5 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
          {movie.title}
        </h1>

        <div className="pt-4 border-t border-zinc-900/80 md:border-none">
          <div className="flex flex-col gap-y-3.5 text-xs sm:text-sm text-zinc-400 text-left">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">
                Language:{" "}
                <strong className="text-white font-semibold">
                  {movie.language}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">
                Duration:{" "}
                <strong className="text-white font-semibold">
                  {movie.durationMinutes} mins
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">
                Release Date:{" "}
                <strong className="text-white font-semibold">
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-white rounded font-black text-[10px] tracking-wide shadow-sm">
                General
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full sm:w-3/4 md:w-1/2 flex justify-center md:justify-end items-center h-50 sm:h-65 md:h-72.5 z-10">
        <div className="relative h-full w-auto aspect-16/10 md:aspect-2/3 rounded-xl overflow-hidden group shadow-2xl border border-zinc-800/60">
          {movie.backdrop && (
            <Image
              src={movie.backdrop}
              alt={movie.title}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setIsTrailerOpen(true)}
              disabled={!movie.trailerYoutubeId}
              className={`p-4 sm:p-5 rounded-full text-white shadow-xl transition-all cursor-pointer ${
                movie.trailerYoutubeId
                  ? "bg-red-600 hover:bg-red-500 shadow-red-600/30"
                  : "bg-zinc-700 opacity-50 cursor-not-allowed"
              }`}
              title={
                movie.trailerYoutubeId ? "Play Trailer" : "Trailer Unavailable"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 translate-x-px"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {movie.trailerYoutubeId && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          youtubeId={movie.trailerYoutubeId}
        />
      )}
    </section>
  );
}
