"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface FilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export default function ScreenFilters({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
}: FilterProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          placeholder="Search screen or theater name..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-zinc-900 dark:text-zinc-100 transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="ALL">All Tech Types</option>
          <option value="STANDARD">Standard</option>
          <option value="IMAX">IMAX</option>
          <option value="VIP">VIP Lounge</option>
          <option value="DOLBY_ATMOS">Dolby Atmos</option>
        </select>
      </div>
    </div>
  );
}
