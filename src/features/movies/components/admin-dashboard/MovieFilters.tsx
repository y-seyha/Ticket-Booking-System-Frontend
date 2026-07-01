"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { MovieQueryFilters } from "../../movies.api";
import { MovieStatus } from "../../movie.type";

interface MovieFiltersProps {
  filters: MovieQueryFilters;
  onFilterChange: (updates: Partial<MovieQueryFilters>) => void;
}

const STATUS_LABELS: Record<MovieStatus | "ALL", string> = {
  ALL: "All Statuses",
  [MovieStatus.NOW_SHOWING]: "Now Showing",
  [MovieStatus.COMING_SOON]: "Coming Soon",
  [MovieStatus.ARCHIVED]: "Archived",
};

export default function MovieFilters({
  filters,
  onFilterChange,
}: MovieFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const parentSearchRef = useRef(filters.search || "");

  useEffect(() => {
    if (filters.search !== parentSearchRef.current) {
      parentSearchRef.current = filters.search || "";
      setSearchTerm(filters.search || "");
    }
  }, [filters.search]);

  // Debounced search trigger for user input typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const currentParentSearch = filters.search || "";
      if (searchTerm !== currentParentSearch) {
        parentSearchRef.current = searchTerm;
        onFilterChange({ search: searchTerm || undefined, page: 1 });
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filters.search, onFilterChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusSelect = (status: MovieStatus | "") => {
    onFilterChange({
      status: status || undefined,
      page: 1,
    });
    setIsOpen(false);
  };

  const currentStatusLabel =
    STATUS_LABELS[filters.status as MovieStatus] || STATUS_LABELS.ALL;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
      {/* Search Input Container */}
      <div className="relative flex-1 max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-50" />
        <input
          type="text"
          placeholder="Search inventory by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
        />
      </div>

      {/* Smooth Custom Dropdown */}
      <div className="relative w-full sm:w-64" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-zinc-700 outline-none transition-all hover:bg-zinc-50/50 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
        >
          <span>{currentStatusLabel}</span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ease-in-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Animated Popover */}
        <div
          className={`absolute right-0 z-10 mt-2 w-full origin-top-right rounded-xl border border-zinc-100 bg-white p-1.5 shadow-lg shadow-zinc-200/50 outline-none transition-all duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {/* Options */}
          <button
            type="button"
            onClick={() => handleStatusSelect("")}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          >
            <span>All Statuses</span>
            {!filters.status && (
              <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
            )}
          </button>

          {Object.values(MovieStatus).map((status) => {
            const isSelected = filters.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusSelect(status)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                  isSelected
                    ? "font-medium text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <span>{STATUS_LABELS[status]}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
