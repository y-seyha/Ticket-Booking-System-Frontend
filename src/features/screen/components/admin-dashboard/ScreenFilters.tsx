"use client";

import SmoothSelect from "@/components/ui/SmoothSelect";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedCinema: string;
  onCinemaChange: (value: string) => void;
  cinemaOptions: { value: string; label: string }[];
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
}

export default function ScreenFilters({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCinema,
  onCinemaChange,
  cinemaOptions,
  sortOrder,
  onSortOrderChange,
}: FilterProps) {
  const techTypeOptions = [
    { value: "ALL", label: "All Tech Types" },
    { value: "STANDARD", label: "Standard" },
    { value: "IMAX", label: "IMAX" },
    { value: "VIP", label: "VIP Lounge" },
    { value: "DOLBY_ATMOS", label: "Dolby Atmos" },
  ];

  const sortOptions = [
    { value: "ASC", label: "Alphabetical (A - Z)" },
    { value: "DESC", label: "Alphabetical (Z - A)" },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full xl:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          placeholder="Search screen or theater name..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-zinc-900 dark:text-zinc-100 transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Smooth Select Filter Elements Wrapper */}
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1 sm:mb-0 mb-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        {/* Sort Order dropdown wrapper */}
        <div className="w-full sm:w-48">
          <SmoothSelect
            options={sortOptions}
            selectedValue={sortOrder}
            onChange={onSortOrderChange}
            placeholder="Sort options..."
          />
        </div>

        {/* Cinema selection dropdown wrapper */}
        <div className="w-full sm:w-56">
          <SmoothSelect
            options={cinemaOptions}
            selectedValue={selectedCinema}
            onChange={onCinemaChange}
            placeholder="All Cinemas complexes..."
          />
        </div>

        {/* Technical screen capabilities dropdown wrapper */}
        <div className="w-full sm:w-44">
          <SmoothSelect
            options={techTypeOptions}
            selectedValue={selectedType}
            onChange={onTypeChange}
            placeholder="All Tech Types"
          />
        </div>
      </div>
    </div>
  );
}
