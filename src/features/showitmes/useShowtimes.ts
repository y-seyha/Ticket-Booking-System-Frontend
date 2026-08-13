"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { showtimesApi } from "./showtimes.api";
import {
  Showtime,
  CreateShowtimeDto,
  UpdateShowtimeDto,
  ShowtimeStatus,
  ShowtimeQuery,
  PaginationMeta,
} from "./showtimes.types";

export interface ShowtimeFilters {
  search?: string;
  movieId?: string;
  screenId?: string;
  theaterId?: string;
  status?: ShowtimeStatus;
  date?: string;
}

export function useShowtimes(options?: { limit?: number }) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: options?.limit ?? 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<ShowtimeFilters>({});
  const [page, setPageState] = useState(1);

  const fetchShowtimes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const query: ShowtimeQuery = {
      page,
      limit: options?.limit ?? 10,
      ...filters,
    };
    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined),
    ) as ShowtimeQuery;

    try {
      const response = await showtimesApi.getAll(cleanQuery);
      setShowtimes(response.data);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load showtimes.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, filters, options?.limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchShowtimes();
  }, [fetchShowtimes]);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setActiveFilters = useCallback(
    (next: Partial<ShowtimeFilters>) => {
      setFilters((prev) => ({ ...prev, ...next }));
      setPageState(1);
    },
    [],
  );

  const createShowtime = async (dto: CreateShowtimeDto) => {
    setError(null);

    try {
      const created = await showtimesApi.create(dto);

      await fetchShowtimes();

      toast.success("Showtime created successfully.");

      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create showtime.";

      setError(message);
      toast.error(message);

      throw err;
    }
  };

  const updateShowtime = async (id: string, dto: UpdateShowtimeDto) => {
    setError(null);

    try {
      const updated = await showtimesApi.update(id, dto);

      await fetchShowtimes();

      toast.success("Showtime updated successfully.");

      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update showtime.";

      setError(message);
      toast.error(message);

      throw err;
    }
  };

  const toggleShowtimeStatus = async (
    id: string,
    currentStatus: ShowtimeStatus,
  ) => {
    setError(null);

    const nextStatus =
      currentStatus === ShowtimeStatus.SCHEDULED
        ? ShowtimeStatus.ACTIVE
        : ShowtimeStatus.SCHEDULED;

    try {
      const updated = await showtimesApi.updateStatus(id, nextStatus);

      setShowtimes((prev) =>
        prev.map((showtime) => (showtime.id === id ? updated : showtime)),
      );

      toast.success("Showtime status updated.");

      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update showtime status.";

      setError(message);
      toast.error(message);

      throw err;
    }
  };

  const deleteShowtime = async (id: string) => {
    setError(null);

    try {
      await showtimesApi.delete(id);

      const remaining = showtimes.filter((showtime) => showtime.id !== id);
      setShowtimes(remaining);

      if (remaining.length === 0 && pagination.page > 1) {
        setPage(pagination.page - 1);
      }

      toast.success("Showtime deleted successfully.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete showtime.";

      setError(message);
      toast.error(message);

      throw err;
    }
  };

  return {
    showtimes,
    loading,
    error,
    pagination,
    filters,
    setFilters: setActiveFilters,
    setPage,
    refresh: fetchShowtimes,
    createShowtime,
    updateShowtime,
    toggleShowtimeStatus,
    deleteShowtime,
  };
}