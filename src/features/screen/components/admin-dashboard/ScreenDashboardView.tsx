"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Plus, Loader2, ShieldAlert } from "lucide-react";
import { useScreen } from "../../useScreen";
import type { Screen } from "../../screen.types";
import ScreenTable from "./ScreenTable";
import ScreenDetailModal from "./ScreenDetailModal";
import ScreenFilters from "./ScreenFilters";
import ScreenFormModal from "./ScreenFormModal";
import DeleteScreenModal from "./DeleteScreenModal";

interface AxiosErrorLike {
  response?: {
    status?: number;
  };
  status?: number;
}

export default function ScreenDashboardView() {
  const { loading, getScreens } = useScreen();
  const [screens, setScreens] = useState<Screen[]>([]);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const hasFetched = useRef(false);

  // Data table states
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal UI Triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [screenToEdit, setScreenToEdit] = useState<Screen | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchAllScreens = useCallback(async () => {
    if (isUnauthorized) return;

    try {
      const data = await getScreens();
      setScreens(Array.isArray(data) ? data : []);
      setIsUnauthorized(false);
    } catch (err) {
      const error = err as AxiosErrorLike;
      if (error?.response?.status === 401 || error?.status === 401) {
        setIsUnauthorized(true);
      }
    }
  }, [getScreens, isUnauthorized]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAllScreens();
      hasFetched.current = true;
    }
  }, [fetchAllScreens]);

  // Filter and Search Pipeline
  const filteredScreens = useMemo(() => {
    return screens.filter((screen) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesName = screen.name?.toLowerCase().includes(query);
        const matchesTheater = screen.theater?.name
          ?.toLowerCase()
          .includes(query);
        if (!matchesName && !matchesTheater) return false;
      }

      if (selectedType !== "ALL" && screen.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [screens, search, selectedType]);

  // Client Side Pagination math
  const maxPage = Math.ceil(filteredScreens.length / limit) || 1;
  const currentPage = page > maxPage ? maxPage : page;

  const paginatedScreens = useMemo(() => {
    const offset = (currentPage - 1) * limit;
    return filteredScreens.slice(offset, offset + limit);
  }, [filteredScreens, currentPage, limit]);

  // Dynamic Auth State UI View
  if (isUnauthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl mb-4 border border-red-100 dark:border-red-900/50">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Access Denied
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
          Your credentials are unauthorized to view these system assets. Please
          re-authenticate or log into an administrative account.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 antialiased">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Cinematic Screens
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage theater setups, technical configurations, and layout seat
              options.
            </p>
          </div>
          <button
            onClick={() => {
              setScreenToEdit(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Screen
          </button>
        </div>

        {/* Filter Toolbar Component */}
        <ScreenFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          selectedType={selectedType}
          onTypeChange={(val) => {
            setSelectedType(val);
            setPage(1);
          }}
        />

        {/* Main Content Grid */}
        {loading && screens.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-zinc-400" />
            <p className="text-sm text-zinc-500">
              Syncing theater blueprints...
            </p>
          </div>
        ) : (
          <ScreenTable
            screens={paginatedScreens}
            totalCount={filteredScreens.length}
            currentPage={currentPage}
            maxPage={maxPage}
            onPageChange={setPage}
            onViewDetail={setSelectedScreen}
            onEditClick={(screen) => {
              setScreenToEdit(screen);
              setIsFormOpen(true);
            }}
            onDeleteClick={(id, name) => setDeleteTarget({ id, name })}
          />
        )}

        {/* Inspector Details View Drawer/Modal */}
        {selectedScreen && (
          <ScreenDetailModal
            screen={selectedScreen}
            onClose={() => setSelectedScreen(null)}
          />
        )}

        {/* Create & Edit Shared Form Modal */}
        <ScreenFormModal
          isOpen={isFormOpen}
          screenToEdit={screenToEdit}
          onClose={() => {
            setIsFormOpen(false);
            setScreenToEdit(null);
          }}
          onSuccess={fetchAllScreens}
        />

        {/* Delete Confirmation Modal */}
        <DeleteScreenModal
          target={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchAllScreens}
        />
      </div>
    </div>
  );
}
