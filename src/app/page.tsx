"use client";

import { useState } from "react";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import MovieFilterTabs from "@/features/movies/components/MovieFilterTabs";
import MovieDateTabs from "@/features/movies/components/MovieDateTabs";
import MovieGrid from "@/features/movies/components/MovieGrid";

import PromoCarousel from "@/features/movies/components/PromoCarousel";
import { promoCarouselData } from "@/features/movies/data/promoCarouselImages";

import carouselImages from "@/features/movies/data/carouselImages";
import { movieData, dateTabs } from "@/features/movies/data/movieListings";

type Mode = "showing" | "coming";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<Mode>("showing");
  const [selectedDate, setSelectedDate] = useState("24");

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-700/20 rounded-full blur-[140px]" />

        <div className="absolute inset-0 m-auto w-[400px] md:w-[700px] h-[300px] md:h-[350px] bg-red-600/35 rounded-full blur-[90px]" />
      </div>
      <Navbar />

      <main className="flex-1 pb-20 relative z-10">
        <HeroCarousel
          carouselImg={carouselImages}
          showBlurBackground
          showDots
          autoPlay
        />

        {/* Unified Layout Containment Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-6 md:mt-10">
          <MovieFilterTabs
            currentMode={currentMode}
            onChangeMode={setCurrentMode}
          />

          <MovieDateTabs
            dateTabs={dateTabs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <MovieGrid movies={movieData} />

          <PromoCarousel
            promos={promoCarouselData}
            autoPlay={true}
            className="mt-12 md:mt-16"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
