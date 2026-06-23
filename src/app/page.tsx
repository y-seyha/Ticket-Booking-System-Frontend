"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import carouselImages from "@/features/movies/data/carouselImages";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroCarousel
          carouselImg={carouselImages}
          showBlurBackground
          showDots
          autoPlay
        />
      </main>

      <Footer />
    </div>
  );
}
