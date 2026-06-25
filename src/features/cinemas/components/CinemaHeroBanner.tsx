"use client";

import Link from "next/link";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";

interface CinemaHeroBannerProps {
  cinema: {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
  };
}

export default function CinemaHeroBanner({ cinema }: CinemaHeroBannerProps) {
  const cinemaBannerAsset: CarouselItem[] = [
    {
      id: cinema.id,
      src: cinema.imageUrl,
      title: cinema.name,
      publishDate: "2026-06-24",
    },
  ];

  return (
    <div className="relative w-full">
      <HeroCarousel
        carouselImg={cinemaBannerAsset}
        showBlurBackground={true}
        showDots={false}
        autoPlay={false}
      />

      <div className="absolute bottom-12 left-0 right-0 z-20 pointer-events-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col space-y-1.5 sm:space-y-2 p-4 max-w-xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {cinema.name}
            </h1>

            <div className="flex items-center gap-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-red-600 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold tracking-wide drop-shadow">
                {cinema.address}
              </span>
            </div>

            <div className="pt-1 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white/80">
              <Link
                href="/"
                className="hover:text-white transition-colors cursor-pointer drop-shadow"
              >
                Home
              </Link>
              <span className="text-white/40 drop-shadow">/</span>
              <Link
                href="/cinemas"
                className="hover:text-white transition-colors cursor-pointer drop-shadow"
              >
                Cinema
              </Link>
              <span className="text-white/40 drop-shadow">/</span>
              <span className="text-white font-bold drop-shadow">
                {cinema.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
