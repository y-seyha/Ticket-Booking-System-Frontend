"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { showtimesApi } from "./showtimes.api";
import {
  Showtime,
  CreateShowtimeDto,
  UpdateShowtimeDto,
  ShowtimeStatus,
} from "./showtimes.types";

export function useShowtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShowtimes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await showtimesApi.getAll();
      setShowtimes(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load showtimes.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchShowtimes();
  }, [fetchShowtimes]);

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

      setShowtimes((prev) => prev.filter((showtime) => showtime.id !== id));

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
    refresh: fetchShowtimes,
    createShowtime,
    updateShowtime,
    toggleShowtimeStatus,
    deleteShowtime,
  };
}
