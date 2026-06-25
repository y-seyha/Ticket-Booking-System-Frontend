"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";
import FoodCinemaSelectionCard, {
  FoodCinemaLocation,
} from "@/features/foods-and-beverage/components/FoodCinemaSelectionCard";

const FOOD_CINEMA_LOCATIONS: FoodCinemaLocation[] = [
  {
    id: "legend-271-mega-mall",
    name: "Legend 271 Mega Mall",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-eden-garden",
    name: "Legend Eden Garden",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-exchange-square",
    name: "Legend Exchange Square",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-k-mall",
    name: "Legend K Mall",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-mean-chey",
    name: "Legend Mean Chey",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-midtown",
    name: "Legend Midtown",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-noro-mall",
    name: "Legend Noro Mall",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-olympia",
    name: "Legend Olympia",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-sensok",
    name: "Legend SenSok",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-siem-reap",
    name: "Legend Siem Reap",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-sihanoukville",
    name: "Legend Sihanoukville",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
  {
    id: "legend-tuol-kork",
    name: "Legend Tuol Kork",
    imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
  },
];

const foodDrinksBanner: CarouselItem[] = [
  {
    id: "food-drinks-banner",
    src: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
    title: "Food & Beverage Selection",
    publishDate: "2026-06-24",
  },
];

export default function FoodAndDrinksPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <HeroCarousel
          carouselImg={foodDrinksBanner}
          showBlurBackground={true}
          showDots={false}
          autoPlay={false}
        />

        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-10 space-y-8">
          {/* Label Heading: Significantly bigger and cleaner alignment */}
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Choose Cinema
            </h1>
          </div>

          {/* 2-Column Selection List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {FOOD_CINEMA_LOCATIONS.map((cinema) => (
              <FoodCinemaSelectionCard key={cinema.id} cinema={cinema} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
