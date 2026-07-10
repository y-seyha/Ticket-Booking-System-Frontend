"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import SmoothSelect from "@/components/ui/SmoothSelect";
import { Plus, X, Calendar, Clock } from "lucide-react";
import { CreateBulkScheduleDto } from "../../showtimes.types";

interface DropdownOption {
  value: string;
  label: string;
}

interface BulkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBulkScheduleDto) => Promise<void>;
  movies: DropdownOption[];
  screens: DropdownOption[];
}

export function ShowtimeBulkFormModal({
  isOpen,
  onClose,
  onSubmit,
  movies,
  screens,
}: BulkFormModalProps) {
  const [movieId, setMovieId] = useState<string>("");
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState<string>("6.50");
  const [cleaningBufferMinutes, setCleaningBufferMinutes] =
    useState<string>("15");

  // Dynamic Array Input Vectors
  const [dateInput, setDateInput] = useState<string>("");
  const [targetDates, setTargetDates] = useState<string[]>([]);

  const [slotInput, setSlotInput] = useState<string>("");
  const [dailySlots, setDailySlots] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const addDateToken = (): void => {
    if (dateInput && !targetDates.includes(dateInput)) {
      setTargetDates([...[...targetDates, dateInput].sort()]);
      setDateInput("");
    }
  };

  const removeDateToken = (target: string): void => {
    setTargetDates(targetDates.filter((d) => d !== target));
  };

  const addSlotToken = (): void => {
    if (slotInput && !dailySlots.includes(slotInput)) {
      setDailySlots([...[...dailySlots, slotInput].sort()]);
      setSlotInput("");
    }
  };

  const removeSlotToken = (target: string): void => {
    setDailySlots(dailySlots.filter((s) => s !== target));
  };

  const handleScreenToggle = (screenId: string): void => {
    setSelectedScreens((prev) =>
      prev.includes(screenId)
        ? prev.filter((id) => id !== screenId)
        : [...prev, screenId],
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (
      !movieId ||
      selectedScreens.length === 0 ||
      targetDates.length === 0 ||
      dailySlots.length === 0
    ) {
      alert("Please configure all mandatory array matrix nodes completely.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        movieId,
        screenIds: selectedScreens,
        targetDates,
        dailySlots,
        basePrice: parseFloat(basePrice),
        cleaningBufferMinutes: parseInt(cleaningBufferMinutes, 10),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title="Deploy Matrix Generation Schema Grid"
      className="max-w-2xl w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-3">
        {/* Core Metadata Selection Layer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-30">
          <div className="relative">
            <SmoothSelect
              label="Target Title Element"
              options={movies}
              selectedValue={movieId}
              onChange={setMovieId}
              placeholder="Select baseline movie metadata"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Screen Channels Matrix Target (Select Multiple)
            </label>
            <div className="max-h-24 overflow-y-auto p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1.5">
              {screens.map((screen) => (
                <label
                  key={screen.value}
                  className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none text-zinc-700 dark:text-zinc-300"
                >
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={selectedScreens.includes(screen.value)}
                    onChange={() => handleScreenToggle(screen.value)}
                    className="rounded text-zinc-950 dark:text-zinc-50 border-zinc-300 accent-zinc-900"
                  />
                  {screen.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Targets Generation Matrix Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* Target Dates Dynamic Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Target Calendar Tracking Days (YYYY-MM-DD)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                disabled={isSubmitting}
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              <button
                type="button"
                onClick={addDateToken}
                className="p-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl hover:opacity-80 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-20 overflow-y-auto">
              {targetDates.map((date) => (
                <span
                  key={date}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                >
                  <Calendar className="h-3 w-3 text-zinc-400" /> {date}
                  <X
                    className="h-3 w-3 cursor-pointer text-zinc-400 hover:text-red-500 ml-0.5"
                    onClick={() => removeDateToken(date)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Daily Slots Dynamic Configuration Vector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Daily Start Tracks Timeline Vectors (HH:MM)
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                disabled={isSubmitting}
                value={slotInput}
                onChange={(e) => setSlotInput(e.target.value)}
                className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              <button
                type="button"
                onClick={addSlotToken}
                className="p-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl hover:opacity-80 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-20 overflow-y-auto">
              {dailySlots.map((slot) => (
                <span
                  key={slot}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                >
                  <Clock className="h-3 w-3 text-zinc-400" /> {slot}
                  <X
                    className="h-3 w-3 cursor-pointer text-zinc-400 hover:text-red-500 ml-0.5"
                    onClick={() => removeSlotToken(slot)}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Metrics and Turnaround Allocations Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4 relative z-0">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Base Cost Index Matrix ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Turnaround Buffer Segments (Minutes)
            </label>
            <input
              type="number"
              min="0"
              required
              disabled={isSubmitting}
              value={cleaningBufferMinutes}
              onChange={(e) => setCleaningBufferMinutes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
        </div>

        {/* Action Button Controls Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6 relative z-0">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium text-xs cursor-pointer"
          >
            Cancel Generation
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              targetDates.length === 0 ||
              dailySlots.length === 0
            }
            className="px-4 py-2 rounded-xl text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition font-medium text-xs cursor-pointer disabled:opacity-40"
          >
            {isSubmitting ? "Compiling Clusters..." : "Generate Matrix Block"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
