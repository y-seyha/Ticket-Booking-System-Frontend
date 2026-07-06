"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Armchair, Layers } from "lucide-react";
import {
  SeatLayoutVariant,
  StrippedTemplateSeat,
} from "../seat-templates.types";
import { SeatType } from "@/features/screen/screen.types";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  layouts: SeatLayoutVariant[];
  initialLayoutIdx: number; // 👈 Added missing prop definition
}

export const SEAT_COLORS: Record<SeatType, string> = {
  STANDARD:
    "bg-zinc-800 text-zinc-400 hover:bg-blue-500/20 hover:text-blue-400 border-zinc-700/60 dark:bg-zinc-800 dark:border-zinc-700",
  VIP: "bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 border-amber-500/40 font-bold",
  COUPLE:
    "bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/40 w-16",
  WHEELCHAIR:
    "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border-emerald-500/40",
};

export function DetailModal({
  isOpen,
  onClose,
  templateName,
  layouts,
  initialLayoutIdx,
}: DetailModalProps) {
  const [prevInitialIdx, setPrevInitialIdx] =
    useState<number>(initialLayoutIdx);
  const [activeLayoutIdx, setActiveLayoutIdx] =
    useState<number>(initialLayoutIdx);

  if (initialLayoutIdx !== prevInitialIdx) {
    setPrevInitialIdx(initialLayoutIdx);
    setActiveLayoutIdx(initialLayoutIdx);
  }

  const currentLayout = layouts[activeLayoutIdx] || null;
  const targetSeats = currentLayout ? currentLayout.seats : [];

  // Group seats by row index
  const rowsGroup = useMemo(() => {
    return targetSeats.reduce(
      (acc, seat) => {
        if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
        acc[seat.seatRow].push(seat);
        return acc;
      },
      {} as Record<string, StrippedTemplateSeat[]>,
    );
  }, [targetSeats]);

  const sortedRows = useMemo(() => Object.keys(rowsGroup).sort(), [rowsGroup]);

  const maxRowSeatsCount = useMemo(() => {
    return Math.max(...Object.values(rowsGroup).map((r) => r.length), 1);
  }, [rowsGroup]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cinema Seating Chart: ${templateName}`}
      className="max-w-5xl w-full"
    >
      <div className="space-y-6">
        {/* VARIANT VERSION TAB SELECTION ROUTER PANEL */}
        {layouts.length > 1 && (
          <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-x-auto border border-zinc-200/40 dark:border-zinc-800/60">
            <span className="text-xs font-bold font-mono px-2 text-zinc-400 flex items-center gap-1 shrink-0">
              <Layers className="h-3 w-3" /> Layout Variants:
            </span>
            {layouts.map((variant, index) => (
              <button
                key={variant.layoutId}
                type="button"
                onClick={() => setActiveLayoutIdx(index)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeLayoutIdx === index
                    ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                {variant.layoutName}
              </button>
            ))}
          </div>
        )}

        {/* Color Indicators Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
          {Object.keys(SEAT_COLORS).map((type) => (
            <div key={type} className="flex items-center gap-2.5">
              <div
                className={`h-6 w-6 rounded-md border flex items-center justify-center ${SEAT_COLORS[type as SeatType].split(" ")[0]}`}
              >
                <Armchair className="h-3 w-3" />
              </div>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
                {type === "COUPLE"
                  ? "Couple Box"
                  : `${type.toLowerCase()} Seat`}
              </span>
            </div>
          ))}
        </div>

        {/* Cinematic Screen Vector */}
        <div className="relative w-full max-w-2xl mx-auto pt-4 flex flex-col items-center justify-center">
          <div className="w-[110%] h-8 border-t-4 border-zinc-300 dark:border-zinc-700 rounded-[100%] absolute top-0 bg-gradient-to-b from-zinc-200/30 via-transparent dark:from-zinc-800/10" />
          <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase mt-2">
            SCREEN
          </span>
        </div>

        {/* Dynamic Theater Grid Canvas */}
        <div className="overflow-auto max-h-[500px] p-8 bg-zinc-950 rounded-2xl border border-zinc-900 shadow-2xl flex flex-col items-center custom-scrollbar">
          {targetSeats.length === 0 ? (
            <span className="text-sm font-semibold text-zinc-500 py-12">
              No layout configuration maps generated.
            </span>
          ) : (
            <div className="min-w-max space-y-4 py-4 flex flex-col items-center">
              {sortedRows.map((rowName) => {
                const rowSeats = rowsGroup[rowName].sort(
                  (a, b) => a.seatNumber - b.seatNumber,
                );
                const dynamicPyramidPadding =
                  ((maxRowSeatsCount - rowSeats.length) * 18) / 2;

                return (
                  <div
                    key={rowName}
                    className="flex items-center justify-center gap-4 group transition-all"
                    style={{
                      paddingLeft: `${dynamicPyramidPadding}px`,
                      paddingRight: `${dynamicPyramidPadding}px`,
                    }}
                  >
                    <span className="w-8 font-mono text-xs font-black text-zinc-600 dark:text-zinc-500 text-right uppercase">
                      {rowName}
                    </span>
                    <div className="flex gap-2 items-center justify-center">
                      {rowSeats.map((seat) => (
                        <div
                          key={seat.id}
                          title={`Seat ${seat.seatRow}-${seat.seatNumber} (${seat.seatType})`}
                          className={`h-9 w-9 rounded-lg flex flex-col items-center justify-center select-none cursor-pointer transition-all hover:-translate-y-1 hover:scale-110 shadow-sm ${SEAT_COLORS[seat.seatType] || "bg-zinc-700 text-white"}`}
                        >
                          <Armchair className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-[9px] font-mono font-bold tracking-tighter">
                            {rowName}
                            {seat.seatNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="w-8 font-mono text-xs font-black text-zinc-600 dark:text-zinc-500 text-left uppercase">
                      {rowName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Capacity Panel Summary Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <span>
            Active Variant:{" "}
            <strong className="text-zinc-700 dark:text-zinc-300">
              {currentLayout?.layoutName || "None"}
            </strong>
          </span>
          <span className="text-zinc-900 dark:text-zinc-50 font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
            {targetSeats.length} Structural Nodes Configured
          </span>
        </div>
      </div>
    </Modal>
  );
}
