"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import SmoothSelect from "@/components/ui/SmoothSelect";
import { Showtime, ShowtimeStatus } from "../../showtimes.types";

export interface ShowtimeFormPayload {
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: ShowtimeStatus;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ShowtimeFormPayload) => Promise<void>;
  editingShowtime: Showtime | null;
  movies: { value: string; label: string }[];
  screens: { value: string; label: string }[];
}

const formatToLocalDateTimeString = (dateInput: string | Date): string => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function ShowtimeFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingShowtime,
  movies,
  screens,
}: FormModalProps) {
  // Functional state initializers safely isolate local inputs
  const [movieId, setMovieId] = useState(() => editingShowtime?.movieId || "");
  const [screenId, setScreenId] = useState(
    () => editingShowtime?.screenId || "",
  );

  const [startTime, setStartTime] = useState(() =>
    editingShowtime
      ? formatToLocalDateTimeString(editingShowtime.startTime)
      : "",
  );
  const [endTime, setEndTime] = useState(() =>
    editingShowtime ? formatToLocalDateTimeString(editingShowtime.endTime) : "",
  );

  const [basePrice, setBasePrice] = useState(
    () => editingShowtime?.basePrice.toString() || "5.50",
  );
  const [status, setStatus] = useState<ShowtimeStatus>(
    () => editingShowtime?.status || ShowtimeStatus.SCHEDULED,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const finalStart =
        startTime.includes("Z") || startTime.includes("+")
          ? startTime
          : `${startTime}:00+07:00`;

      const finalEnd =
        endTime.includes("Z") || endTime.includes("+")
          ? endTime
          : `${endTime}:00+07:00`;

      await onSubmit({
        movieId,
        screenId,
        startTime: new Date(finalStart).toISOString(),
        endTime: new Date(finalEnd).toISOString(),
        basePrice: parseFloat(basePrice),
        status,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = Object.values(ShowtimeStatus).map((val) => ({
    value: val,
    label: val.charAt(0) + val.slice(1).toLowerCase(),
  }));

  // useEffect(() => {
  //   if (editingShowtime) {
  //     setMovieId(editingShowtime.movieId);
  //     setScreenId(editingShowtime.screenId);
  //     setStartTime(formatToLocalDateTimeString(editingShowtime.startTime));
  //     setEndTime(formatToLocalDateTimeString(editingShowtime.endTime));
  //     setBasePrice(editingShowtime.basePrice.toString());
  //     setStatus(editingShowtime.status);
  //   }
  // }, [editingShowtime]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={
        editingShowtime ? "Edit Runtime Allocation" : "Deploy New Matrix Window"
      }
      className="max-w-xl w-full"
    >
      <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmoothSelect
            label="Target Title Element"
            options={movies}
            selectedValue={movieId}
            onChange={setMovieId}
            placeholder="Select custom movie metadata"
            disabled={!!editingShowtime || isSubmitting}
          />

          <SmoothSelect
            label="Screen Location Target"
            options={screens}
            selectedValue={screenId}
            onChange={setScreenId}
            placeholder="Select screening hall"
            disabled={!!editingShowtime || isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Initialization Stream
            </label>
            <input
              type="datetime-local"
              required
              disabled={isSubmitting}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Termination Pipeline
            </label>
            <input
              type="datetime-local"
              required
              disabled={isSubmitting}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Base Cost Index ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
              placeholder="5.50"
            />
          </div>

          <SmoothSelect
            label="System State Context"
            options={statusOptions}
            selectedValue={status}
            onChange={(val) => setStatus(val as ShowtimeStatus)}
            placeholder="State tier tracker"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium text-xs cursor-pointer"
          >
            Cancel Allocation
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition font-medium text-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? "Syncing Clusters..."
              : editingShowtime
                ? "Commit Corrections"
                : "Deploy Window"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
