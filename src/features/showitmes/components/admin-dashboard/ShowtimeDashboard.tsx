"use client";

import { useState, useMemo, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Search, Plus, CalendarCheck2, CalendarDays, X, Loader2 } from "lucide-react";
import SmoothSelect from "@/components/ui/SmoothSelect";
import { useShowtimes } from "../../useShowtimes";

import {
  CreateBulkScheduleDto,
  Screen,
  Showtime,
  ShowtimeStatus,
} from "../../showtimes.types";
import { ShowtimeTable } from "./ShowtimeTable";
import { ShowtimeFormModal } from "./ShowtimeFormModal";
import { ShowtimeDeleteConfirmModal } from "./ShowtimeDeleteConfirmModal";
import { ShowtimeDetailsModal } from "./ShowtimeDetailsModal";
import { useMovies } from "@/features/movies/useMovies";
import { useScreen } from "@/features/screen/useScreen";
import { MovieStatus } from "@/features/movies/movie.type";
import { apiRequest } from "@/lib/config/axios";
import { showtimesApi } from "../../showtimes.api";
import { ShowtimeBulkFormModal } from "./ShowtimeBulkFormModal";

type ShowtimePayload = Omit<
  Showtime,
  "id" | "movie" | "screen" | "createdAt" | "updatedAt"
> & {
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: ShowtimeStatus;
};

export default function ShowtimeDashboard() {
  const {
    showtimes,
    loading: loadingShowtimes,
    pagination,
    filters,
    setFilters,
    setPage,
    createShowtime,
    updateShowtime,
    toggleShowtimeStatus,
    deleteShowtime,
  } = useShowtimes({ limit: 10 });

  const { movies, isLoading: loadingMovies } = useMovies({
    page: 1,
    limit: 100,
  });
  const { getScreens } = useScreen();

  const [dbScreens, setDbScreens] = useState<Screen[]>([]);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [activeShowtimeId, setActiveShowtimeId] = useState<string | null>(null);
  const [detailedShowtime, setDetailedShowtime] = useState<Showtime | null>(
    null,
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [activeShowtimeCtx, setActiveShowtimeCtx] = useState<Showtime | null>(
    null,
  );
  const [isMutating, setIsMutating] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState<boolean>(false);

  const handleBulkFormSubmit = async (
    bulkPayload: CreateBulkScheduleDto,
  ): Promise<void> => {
    try {
      setIsMutating(true);
      await showtimesApi.bulkCreate(bulkPayload);
      setIsBulkFormOpen(false);
    } catch (err) {
      console.error("Bulk scheduling configuration track failed:", err);
    } finally {
      setIsMutating(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    async function fetchScreenCollection() {
      try {
        setLoadingScreens(true);
        const data = await getScreens();
        if (isMounted) {
          setDbScreens(data || []);
        }
      } catch (err) {
        console.error("Failed to sync screens for selector options:", err);
      } finally {
        if (isMounted) setLoadingScreens(false);
      }
    }
    fetchScreenCollection();
    return () => {
      isMounted = false;
    };
  }, [getScreens]);

  const filterStatusOptions = [
    { value: "ALL", label: "All Runtime States" },
    { value: ShowtimeStatus.SCHEDULED, label: "Scheduled" },
    { value: ShowtimeStatus.CANCELLED, label: "Cancelled" },
    { value: ShowtimeStatus.FINISHED, label: "Finished" },
  ];

  const screenFilterOptions = useMemo(
    () => [
      { value: "ALL", label: "All Screen Venues" },
      ...dbScreens.map((s) => ({
        value: s.id,
        label: s.name ?? "Unknown Screen",
      })),
    ],
    [dbScreens],
  );

  const theaterFilterOptions = useMemo(() => {
    const theaterMap = new Map<string, string>();
    for (const screen of dbScreens) {
      const theaterId = screen.theater?.id;
      const theaterName = screen.theater?.name;
      if (theaterId && theaterName) {
        theaterMap.set(theaterId, theaterName);
      }
    }
    return [
      { value: "ALL", label: "All Theater Complexes" },
      ...Array.from(theaterMap.entries()).map(([id, name]) => ({
        value: id,
        label: name,
      })),
    ];
  }, [dbScreens]);

  const activeMovieOptions = useMemo(() => {
    return movies
      .filter(
        (m) =>
          m.status === MovieStatus.NOW_SHOWING ||
          m.status === MovieStatus.COMING_SOON,
      )
      .map((m) => ({
        value: m.id,
        label: m.title ?? "Unknown Movie",
      }));
  }, [movies]);

  const movieFilterOptions = useMemo(
    () => [{ value: "ALL", label: "All Movies" }, ...activeMovieOptions],
    [activeMovieOptions],
  );

  const activeScreenOptions = useMemo(() => {
    return dbScreens.map((s) => ({
      value: s.id,
      label: s.name ?? "Unknown Screen",
    }));
  }, [dbScreens]);

  useEffect(() => {
    if (searchInput === (filters.search ?? "")) return;
    const timer = setTimeout(() => {
      setFilters({ search: searchInput.trim() || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilters]);

  useEffect(() => {
    if (!activeShowtimeId) return;

    let isCurrentFetch = true;

    async function loadShowtimeDetails() {
      try {
        setIsLoadingDetails(true);
        const data = await apiRequest<Showtime>(
          "get",
          `showtimes/${activeShowtimeId}`,
        );
        if (isCurrentFetch) {
          setDetailedShowtime(data);
        }
      } catch (err) {
        console.error("Error pulling full details:", err);
      } finally {
        if (isCurrentFetch) {
          setIsLoadingDetails(false);
        }
      }
    }

    loadShowtimeDetails();

    return () => {
      isCurrentFetch = false;
    };
  }, [activeShowtimeId]);

  const handleToggleStatusSubmit = async () => {
    if (!activeShowtimeCtx) return;
    try {
      setIsMutating(true);
      await toggleShowtimeStatus(
        activeShowtimeCtx.id,
        activeShowtimeCtx.status,
      );
      setIsToggleOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpsertFormSubmit = async (payload: ShowtimePayload) => {
    if (activeShowtimeCtx) {
      await updateShowtime(activeShowtimeCtx.id, payload);
    } else {
      await createShowtime(payload);
    }
    setIsFormOpen(false);
  };

  const dashboardLoadingState =
    loadingShowtimes || loadingMovies || loadingScreens;

  return (
    <div>
      <div className="space-y-6">
        {/* Header Block Element */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
              <span>$</span> Showtimes Configuration Control Hub
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Configure system screen allocations, schedule dynamic temporal
              matrices, and calibrate base cost indexes.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsBulkFormOpen(true)}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-zinc-300 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 transition font-bold text-xs rounded-xl shadow-xs"
            >
              <CalendarCheck2 className="h-4 w-4 stroke-2" /> Bulk Generation
              Grid
            </button>
            <button
              onClick={() => {
                setActiveShowtimeCtx(null);
                setIsFormOpen(true);
              }}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition font-bold text-xs rounded-xl shadow-sm"
            >
              <Plus className="h-4 w-4 stroke-3" /> Add Runtime Window
            </button>
          </div>
        </div>

        {/* Filters Controls Panel */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/20 shadow-xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, screen, theater..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
            />
          </div>

          <div className="relative">
            <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="date"
              value={filters.date ?? ""}
              onChange={(e) =>
                setFilters({ date: e.target.value || undefined })
              }
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
            />
            {filters.date && (
              <button
                type="button"
                onClick={() => setFilters({ date: undefined })}
                title="Clear date filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer inline-flex items-center justify-center h-5 w-5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <SmoothSelect
            options={movieFilterOptions}
            selectedValue={filters.movieId ?? "ALL"}
            onChange={(value) =>
              setFilters({
                movieId: value === "ALL" ? undefined : value,
              })
            }
            placeholder="Filter by Movie"
          />

          <SmoothSelect
            options={screenFilterOptions}
            selectedValue={filters.screenId ?? "ALL"}
            onChange={(value) =>
              setFilters({
                screenId: value === "ALL" ? undefined : value,
              })
            }
            placeholder="Filter by Screen Venue"
          />

          <SmoothSelect
            options={theaterFilterOptions}
            selectedValue={filters.theaterId ?? "ALL"}
            onChange={(value) =>
              setFilters({
                theaterId: value === "ALL" ? undefined : value,
              })
            }
            placeholder="Filter by Theater Complex"
          />

          <SmoothSelect
            options={filterStatusOptions}
            selectedValue={filters.status ?? "ALL"}
            onChange={(value) =>
              setFilters({
                status:
                  value === "ALL" ? undefined : (value as ShowtimeStatus),
              })
            }
            placeholder="Filter by Status"
          />
        </div>

        {/* Showtime Table Component */}
        <ShowtimeTable
          loading={dashboardLoadingState}
          showtimes={showtimes}
          pagination={pagination}
          onPageChange={setPage}
          onOpenDetails={(st) => {
            setActiveShowtimeId(st.id);
          }}
          onOpenEdit={(st) => {
            setActiveShowtimeCtx(st);
            setIsFormOpen(true);
          }}
          onOpenDelete={(st) => {
            setActiveShowtimeCtx(st);
            setIsDeleteOpen(true);
          }}
          onOpenStatusToggle={(st) => {
            setActiveShowtimeCtx(st);
            setIsToggleOpen(true);
          }}
        />

        {/* Global Loading Spinner for Layout Retrieval */}
        {isLoadingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-xl">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Synchronizing grid systems...
              </span>
            </div>
          </div>
        )}

        {/* Status Alert Modal */}
        {isToggleOpen && activeShowtimeCtx && (
          <Modal
            isOpen={isToggleOpen}
            onClose={() => !isMutating && setIsToggleOpen(false)}
            title="Modify Live Lifecycle Context Track"
            className="max-w-md w-full"
          >
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <CalendarCheck2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Shift Runtime Allocation State?
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    You are changing the sequence tracking parameters of{" "}
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      {activeShowtimeCtx.movie?.title}
                    </span>
                    . This will affect reservation access streams immediately.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => setIsToggleOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium text-xs cursor-pointer"
                >
                  Keep State
                </button>
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={handleToggleStatusSubmit}
                  className="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 transition font-medium text-xs cursor-pointer min-w-30 flex items-center justify-center gap-2"
                >
                  {isMutating ? "Processing..." : "Commit Switch"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Form Modal Layer */}
        {isFormOpen && (
          <ShowtimeFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleUpsertFormSubmit}
            editingShowtime={activeShowtimeCtx}
            movies={activeMovieOptions}
            screens={activeScreenOptions}
          />
        )}

        {/* Delete Modal Layer */}
        {isDeleteOpen && activeShowtimeCtx && (
          <ShowtimeDeleteConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={async () => {
              await deleteShowtime(activeShowtimeCtx.id);
            }}
            movieTitle={activeShowtimeCtx.movie?.title}
            timeContext={new Date(
              activeShowtimeCtx.startTime,
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          />
        )}

        {/* Bulk Modal Layer */}
        {isBulkFormOpen && (
          <ShowtimeBulkFormModal
            isOpen={isBulkFormOpen}
            onClose={() => setIsBulkFormOpen(false)}
            onSubmit={handleBulkFormSubmit}
            movies={activeMovieOptions}
            screens={activeScreenOptions}
          />
        )}

        {/* Detailed Layout Interactive Seat Modal */}
        {detailedShowtime && (
          <ShowtimeDetailsModal
            isOpen={!!detailedShowtime}
            onClose={() => {
              setActiveShowtimeId(null);
              setDetailedShowtime(null);
            }}
            showtime={detailedShowtime}
          />
        )}
      </div>
    </div>
  );
}
