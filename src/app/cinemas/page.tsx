import { Suspense } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";

import { cinemasApi } from "@/features/cinemas/cinemas.api";
import { Cinema } from "@/features/cinemas/cinemas.types";
import { CinemaLocation } from "@/features/cinemas/components/CinemaLocationCard";
import CinemaSearchList from "@/features/cinemas/components/CinemaSearchList";

const staticCinemaBanner: CarouselItem[] = [
  {
    id: "cinema-page-banner",
    src: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    title: "Legend Cinema | Legend Premium Cinema",
    publishDate: "2026-06-24",
  },
];

export default async function CinemasPage() {
  let initialCinemas: CinemaLocation[] = [];
  let errorMsg = "";

  try {
    const response = await cinemasApi.getCinemas();
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

    initialCinemas = response.data.map((cinema: Cinema) => ({
      id: cinema.id,
      name: cinema.name,
      address: `${cinema.location}, ${cinema.city}`,
      imageUrl: cinema.image?.url
        ? cinema.image.url
        : cinema.imageId
          ? `${baseUrl}/files/${cinema.imageId}`
          : "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    }));
  } catch (error) {
    console.error("Error loading cinemas on server:", error);
    errorMsg = "Failed to load cinema locations. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <HeroCarousel
          carouselImg={staticCinemaBanner}
          showBlurBackground
          showDots={false}
          autoPlay={false}
        />

        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-4 md:mt-6 space-y-6">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase tracking-wider">
            Cinemas
          </h1>

          {errorMsg ? (
            <div className="text-center py-16 text-red-500 font-medium bg-red-950/10 border border-red-900/30 rounded-2xl">
              {errorMsg}
            </div>
          ) : (
            <Suspense fallback={<CinemaSkeletonGrid />}>
              <CinemaSearchList initialCinemas={initialCinemas} />
            </Suspense>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CinemaSkeletonGrid() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-14 w-full bg-white/5 rounded-xl border border-white/10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-white/5 rounded-2xl border border-white/5"
          />
        ))}
      </div>
    </div>
  );
}
