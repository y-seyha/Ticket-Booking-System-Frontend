"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateMoviePayload, MovieQueryFilters, moviesApi } from "./movies.api";
import { MovieStatus, Movie } from "./movie.type";

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const DEFAULT_FILTERS: MovieQueryFilters = { page: 1, limit: 10 };

export function useMovies(initialFilters: MovieQueryFilters = DEFAULT_FILTERS) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<MovieQueryFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);
  const filterStringKey = JSON.stringify(filters);

  useEffect(() => {
    let isMounted = true;
    async function syncMovies() {
      try {
        setIsLoading(true);
        const res = await moviesApi.findAll(filters);
        if (!isMounted) return;
        setMovies(res.data);
        setPagination(res.pagination);
      } catch {
        toast.error("Failed to sync system movie catalog data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    syncMovies();
    return () => {
      isMounted = false;
    };
  }, [filterStringKey, refreshKey]);

  const changeStatus = async (id: string, nextStatus: MovieStatus) => {
    try {
      await moviesApi.updateStatus(id, nextStatus);
      toast.success("Operational status modified successfully.");
      triggerRefresh();
    } catch (err) {
      const error = err as AxiosErrorResponse;
      toast.error(
        error.response?.data?.message || "Could not save operational changes.",
      );
    }
  };

  const createMovie = async (payload: CreateMoviePayload) => {
    try {
      await moviesApi.create(payload);
      toast.success("Movie logs instantiated successfully.");
      triggerRefresh();
    } catch {
      toast.error("Failed to commit creation entry.");
    }
  };

  const updateMovie = async (id: string, payload: CreateMoviePayload) => {
    try {
      await moviesApi.update(id, payload);
      toast.success("Movie configuration updated cleanly.");
      triggerRefresh();
    } catch {
      toast.error("Failed to commit target updates.");
    }
  };

  const removeMovie = async (id: string) => {
    try {
      await moviesApi.remove(id);
      toast.success("Entry removed smoothly.");
      triggerRefresh();
    } catch {
      toast.error("Failed to remove target movie listing entry.");
    }
  };

  return {
    movies,
    pagination,
    filters,
    isLoading,
    setFilters,
    changeStatus,
    createMovie,
    updateMovie,
    removeMovie,
  };
}
