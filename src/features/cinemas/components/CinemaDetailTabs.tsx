"use client";

import { useState } from "react";
import TabNavigation from "@/features/movies/components/movie-details/TabNavigation";
import ShowtimeFilters from "@/features/movies/components/movie-details/ShowtimeFilters";
import MovieGrid from "@/features/movies/components/MovieGrid";
import CinemaInfoTab from "@/features/cinemas/components/CinemaInfoTab";
import { movieData } from "@/features/movies/data/movieListings";
interface CinemaDetailTabsProps {
  cinemaDetails: {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
    halls: string;
    openingHours: string;
    mapUrl: string;
  };
}

export default function CinemaDetailTabs({
  cinemaDetails,
}: CinemaDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"showtime" | "detail">("showtime");
  const [selectedDate, setSelectedDate] = useState("24");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(
    cinemaDetails.name,
  );

  const locations = [cinemaDetails.name];

  const dateTabs = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: d.getDate().toString(),
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      isoDate: d.toISOString(),
    };
  });

  return (
    <>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative mt-4 overflow-hidden w-full">
        {/* SHOWTIME TAB SECTION */}
        <div
          className={`space-y-8 transition-all duration-500 ease-out transformation ${
            activeTab === "showtime"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none absolute top-0 left-0 w-full"
          }`}
        >
          <ShowtimeFilters
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedLocationFilter={selectedLocationFilter}
            setSelectedLocationFilter={setSelectedLocationFilter}
            locations={locations}
            dateTabs={dateTabs}
          />

          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-6">
              Now Showing
            </h2>
            <MovieGrid movies={movieData} />
          </div>
        </div>

        {/* DETAIL TAB SECTION */}
        <CinemaInfoTab
          cinema={cinemaDetails}
          isActive={activeTab === "detail"}
        />
      </div>
    </>
  );
}
