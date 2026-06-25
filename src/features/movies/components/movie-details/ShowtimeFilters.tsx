import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { dateTabs } from "@/features/movies/data/movieListings";
import MovieDateTabs from "../MovieDateTabs";

interface ShowtimeFiltersProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (loc: string) => void;
}

const LOCATIONS_LIST = [
  "All Locations",
  "Legend 271 Mega Mall",
  "Legend Eden Garden",
];

export default function ShowtimeFilters({
  selectedDate,
  setSelectedDate,
  selectedLocationFilter,
  setSelectedLocationFilter,
}: ShowtimeFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Dropdown element selection box */}
      <div className="relative w-full z-30">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-sm font-bold text-zinc-200 cursor-pointer backdrop-blur-md"
        >
          <span>{selectedLocationFilter}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50"
            >
              <div className="p-1.5 space-y-0.5">
                {LOCATIONS_LIST.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocationFilter(loc);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold cursor-pointer ${
                      selectedLocationFilter === loc
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Row  */}
      <div className="bg-zinc-950/40 p-2.5 rounded-2xl backdrop-blur-sm texwhite overflow-x-auto patches-scroll">
        <MovieDateTabs
          dateTabs={dateTabs}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>
    </div>
  );
}
