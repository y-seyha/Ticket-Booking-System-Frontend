"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";
import { Cinema } from "@/features/cinemas/cinemas.types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cinemasApi } from "@/features/cinemas/cinemas.api";
import FoodCinemaSelectionCard from "@/features/foods-and-beverage/components/FoodCinemaSelectionCard";
// import FoodCinemaSelectionCard, {
//   FoodCinemaLocation,
// } from "@/features/foods-and-beverage/components/FoodCinemaSelectionCard";

// const FOOD_CINEMA_LOCATIONS: FoodCinemaLocation[] = [
//   {
//     id: "legend-271-mega-mall",
//     name: "Legend 271 Mega Mall",
//     imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
//   },
//   {
//     id: "legend-eden-garden",
//     name: "Legend Eden Garden",
//     imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
//   },
//   {
//     id: "legend-exchange-square",
//     name: "Legend Exchange Square",
//     imageUrl: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
//   },
// ];

const foodDrinksBanner: CarouselItem[] = [
  {
    id: "food-drinks-banner",
    src: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
    title: "Food & Beverage Selection",
    publishDate: "2026-06-24",
    isClickable: false,
  },
];

export default function FoodAndDrinksPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    const fetchCinemas = async () => {
      try {
        setLoading(true);

        const res = await cinemasApi.getCinemas();
        if (!ignore) {
          setCinemas(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch cinemas:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchCinemas();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCinemaClick = (id: string) => {
    router.push(`/cinemas/${id}`);
  };
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
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Choose Cinema
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {loading ? (
              // Loading State: Showing 6 skeletons
              [...Array(6)].map((_, i) => <CinemaSkeleton key={i} />)
            ) : cinemas.length > 0 ? (
              // Success State: Mapping actual data
              cinemas.map((cinema) => (
                <div
                  key={cinema.id}
                  onClick={() => handleCinemaClick(cinema.id)}
                  className="cursor-pointer"
                >
                  <FoodCinemaSelectionCard cinema={cinema} />
                </div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full py-20 text-center text-zinc-500">
                No cinema locations found.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CinemaSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-zinc-800 flex-shrink-0" />
      <div className="space-y-2 w-full">
        <div className="h-4 bg-zinc-800 rounded w-1/2" />
        <div className="h-3 bg-zinc-800 rounded w-1/3" />
      </div>
    </div>
  );
}
