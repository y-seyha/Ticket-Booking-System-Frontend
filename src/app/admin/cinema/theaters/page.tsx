"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Loader2,
  SlidersHorizontal,
  RotateCcw,
  X,
} from "lucide-react";
import { cinemasApi } from "@/features/cinemas/cinemas.api";
import { Cinema, Pagination } from "@/features/cinemas/cinemas.types";
import { useDebounce } from "@/hooks/useDebounce";
import TheaterTable from "@/features/cinemas/components/admin-dashboard/TheaterTable";
import TheaterFormModal from "@/features/cinemas/components/admin-dashboard/TheaterFormModal";
import DeleteTheaterModal from "@/features/cinemas/components/admin-dashboard/DeleteTheaterModal";

type StatusFilterType = "ALL" | "ACTIVE" | "INACTIVE";

export default function TheaterDashboard() {
  const [theaters, setTheaters] = useState<Cinema[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const debouncedSearch = useDebounce(search, 400);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Cinema | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await cinemasApi.getCinemas({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      });
      setTheaters(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch theaters", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Action Handlers
  const handleOpenAdd = () => {
    setSelectedTheater(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: Cinema) => {
    setSelectedTheater(t);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (t: Cinema) => {
    setSelectedTheater(t);
    setIsDeleteOpen(true);
  };

  const dynamicCityList = useMemo(() => {
    const cities = theaters.map((t) => t.city).filter(Boolean);
    return Array.from(new Set(cities));
  }, [theaters]);

  const filteredTheaters = useMemo(() => {
    return theaters.filter((t) => {
      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchesCity = cityFilter === "ALL" || t.city === cityFilter;
      return matchesStatus && matchesCity;
    });
  }, [theaters, statusFilter, cityFilter]);

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setCityFilter("ALL");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen transition-colors duration-200">
      {/* Header Deck Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Theater Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your physical cinema locations, technical settings, and
            operation status options.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:scale-[0.98] transition-all dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 w-full sm:w-auto self-stretch sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Theater
        </button>
      </div>

      {/* Interactive Controls & Filters Suite */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Main Global Text Search input */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              placeholder="Search theaters by name, location..."
              className="w-full pl-10 pr-10 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 focus:bg-white dark:focus:bg-zinc-950 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
            ) : (
              search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )
            )}
          </div>

          {/* Filtering Dropdown Group Options */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>

            {/* Status Option Select Panel */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilterType)
              }
              className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Operational</option>
              <option value="INACTIVE">Inactive / Closed</option>
            </select>

            {/* City Option Select Panel */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <option value="ALL">All Cities</option>
              {dynamicCityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Clear Filters Reset Button */}
            {(statusFilter !== "ALL" ||
              cityFilter !== "ALL" ||
              search !== "") && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Core View Area */}
      <TheaterTable
        theaters={filteredTheaters}
        currentPage={pagination.page}
        limit={pagination.limit}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleOpenDelete}
        isLoading={isLoading}
      />

      <TheaterFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        theater={selectedTheater}
        onSuccess={fetchData}
      />

      <DeleteTheaterModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        theaterName={selectedTheater?.name || ""}
        onConfirm={async () => {
          if (selectedTheater) {
            await cinemasApi.deleteCinema(selectedTheater.id);
            fetchData();
            setIsDeleteOpen(false);
          }
        }}
      />
    </div>
  );
}
