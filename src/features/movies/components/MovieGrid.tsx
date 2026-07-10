"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PosterFile {
  id: string;
  url: string;
  publicId: string;
  description?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface MovieItem {
  id: string;
  title: string;
  poster: string | PosterFile | null;
  releaseDate: string;
  isAdvanceTicket?: boolean;
  tags?: string[];
}

interface MovieGridProps {
  movies: MovieItem[];
  selectedDate?: string;
}

interface SafeMoviePosterProps {
  src: string | PosterFile | null;
  alt: string;
}

function SafeMoviePoster({ src, alt }: SafeMoviePosterProps) {
  const defaultFallback = "/fallback-poster.jpg";

  const getInitialUrl = (): string => {
    if (!src) return defaultFallback;
    if (typeof src === "string") {
      const trimmed = src.trim();
      return trimmed !== "" ? trimmed : defaultFallback;
    }
    if (
      typeof src === "object" &&
      "url" in src &&
      typeof src.url === "string"
    ) {
      const trimmed = src.url.trim();
      return trimmed !== "" ? trimmed : defaultFallback;
    }
    return defaultFallback;
  };

  const initialUrl = getInitialUrl();
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);

  return (
    <Image
      key={initialUrl}
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw"
      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
      onError={() => {
        if (imgSrc !== defaultFallback) {
          setImgSrc(defaultFallback);
        }
      }}
    />
  );
}
export default function MovieGrid({ movies, selectedDate }: MovieGridProps) {
  const formatReleaseDate = (rawDate: string) => {
    const date = new Date(rawDate);
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
  };

  return (
    <div className="mx-auto w-full max-w-none">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mt-8">
        {movies.map((movie) => (
          <Link
            href={
              selectedDate
                ? `/movies/${movie.id}?date=${selectedDate}`
                : `/movies/${movie.id}`
            }
            key={movie.id}
            className="group flex flex-col w-full max-w-[190px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] mx-auto min-w-0 cursor-pointer"
          >
            <div className="relative aspect-[2/3] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-md group-hover:border-zinc-700 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-500 transform-gpu">
              <SafeMoviePoster src={movie.poster} alt={movie.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
              {movie.isAdvanceTicket && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-md z-20 rounded-br-xl backdrop-blur-sm">
                  Advance
                </div>
              )}
            </div>

            <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between px-0.5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-zinc-400">
                  <span className="font-semibold text-zinc-500">
                    {formatReleaseDate(movie.releaseDate)}
                  </span>
                  {movie.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 border border-zinc-800/80 rounded bg-zinc-900/40 text-zinc-400 font-bold text-[8px] uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-300 group-hover:text-white line-clamp-2 leading-snug">
                  {movie.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
