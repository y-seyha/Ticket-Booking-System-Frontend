"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMovies } from "@/features/movies/useMovies";
import MovieFilters from "@/features/movies/components/admin-dashboard/MovieFilters";
import MovieTable from "@/features/movies/components/admin-dashboard/MovieTable";
import DeleteMovieModal from "@/features/movies/components/admin-dashboard/DeleteMovieModal";
import { Movie } from "@/features/movies/movie.type";
import MovieFormModal, {
  CreateMoviePayload,
} from "@/features/movies/components/admin-dashboard/MovieFormModal";

export default function MovieDashboard() {
  const {
    movies,
    pagination,
    filters,
    isLoading,
    setFilters,
    changeStatus,
    createMovie,
    updateMovie,
    removeMovie,
  } = useMovies();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleOpenAddModal = () => {
    setSelectedMovie(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (payload: CreateMoviePayload) => {
    if (selectedMovie) {
      await updateMovie(selectedMovie.id, payload);
    } else {
      await createMovie(payload);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto box-border">
      {/* Header section with defensive flex-wrapping */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Movie Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Control system cinema catalogues, uploads, showtimes availability,
            and metadata.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shrink-0 w-full cursor-pointer sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add New Movie
        </button>
      </div>

      <div className="space-y-4 w-full">
        <MovieFilters
          filters={filters}
          onFilterChange={(updates) =>
            setFilters((prev) => ({ ...prev, ...updates }))
          }
        />

        {/* Added explicit swipe/overflow wrapper block around the content loaders and tables */}
        <div className="w-full overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
          <div className="min-w-full inline-block align-middle">
            {isLoading ? (
              <div className="space-y-3 p-4 w-full">
                <div className="h-10 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
                <div className="h-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl animate-pulse" />
              </div>
            ) : (
              <MovieTable
                movies={movies}
                onStatusChange={changeStatus}
                onEditClick={handleOpenEditModal}
                onDeleteClick={handleOpenDeleteModal}
              />
            )}
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800 w-full">
            <span className="text-xs text-zinc-500 order-2 sm:order-1">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() =>
                  setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))
                }
                className="w-1/2 sm:w-auto text-center rounded border border-zinc-200 px-3 py-1 text-xs font-medium bg-white hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))
                }
                className="w-1/2 sm:w-auto text-center rounded border border-zinc-200 px-3 py-1 text-xs font-medium bg-white hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <MovieFormModal
        key={selectedMovie ? `edit-${selectedMovie.id}` : "add-new"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        movie={selectedMovie}
      />

      <DeleteMovieModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        movieTitle={selectedMovie?.title || ""}
        onConfirm={() => selectedMovie && removeMovie(selectedMovie.id)}
      />
    </div>
  );
}
