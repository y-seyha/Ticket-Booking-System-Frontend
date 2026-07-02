"use client";

import { useMemo } from "react";
import Modal from "@/components/ui/Modal";
import { Armchair } from "lucide-react";
import { ScreenTemplateSeat } from "../seat-templates.types";
import { SeatType } from "@/features/screen/screen.types";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  seats: ScreenTemplateSeat[];
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
  seats,
}: DetailModalProps) {
  // Group seats by their row index
  const rowsGroup = useMemo(() => {
    return seats.reduce(
      (acc, seat) => {
        if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
        acc[seat.seatRow].push(seat);
        return acc;
      },
      {} as Record<string, ScreenTemplateSeat[]>,
    );
  }, [seats]);

  const sortedRows = useMemo(() => Object.keys(rowsGroup).sort(), [rowsGroup]);

  // Find the maximum row size to precisely calculate staggered pyramid offsets
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
      <div className="space-y-8">
        {/* Color Indicators Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
          {Object.keys(SEAT_COLORS).map((type) => (
            <div key={type} className="flex items-center gap-2.5">
              <div
                className={`h-6 w-6 rounded-md border flex items-center justify-center ${
                  type === "REGULAR"
                    ? "bg-zinc-800 border-zinc-700 text-zinc-400"
                    : SEAT_COLORS[type as SeatType].split(" ")[0] +
                      " " +
                      SEAT_COLORS[type as SeatType].split(" ")[1]
                }`}
              >
                <Armchair className="h-3 w-3" />
              </div>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 tracking-wide">
                {type === "COUPLE"
                  ? "Couple Box"
                  : `${type.charAt(0) + type.slice(1).toLowerCase()} Seat`}
              </span>
            </div>
          ))}
        </div>

        {/* Cinematic Modern Curved Screen UI Anchor Element */}
        <div className="relative w-full max-w-2xl mx-auto pt-6 pb-2 flex flex-col items-center justify-center overflow-hidden">
          {/* Curved Screen Effect Glow Vector */}
          <div className="w-[110%] h-10 border-t-4 border-zinc-300 dark:border-zinc-700 rounded-[100%] absolute top-0 bg-gradient-to-b from-zinc-200/40 via-transparent to-transparent dark:from-zinc-800/20 pointer-events-none" />
          <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase mt-2">
            SCREEN
          </span>
        </div>

        {/* Dynamic Theater Grid Canvas Frame Wrapper Container */}
        <div className="overflow-auto max-h-[550px] p-8 bg-zinc-950 rounded-2xl border border-zinc-900 shadow-2xl flex flex-col items-center justify-center custom-scrollbar">
          <div className="min-w-max space-y-4 py-4 flex flex-col items-center">
            {sortedRows.map((rowName) => {
              const rowSeats = rowsGroup[rowName].sort(
                (a, b) => a.seatNumber - b.seatNumber,
              );
              const rowLength = rowSeats.length;

              // Generate automatic spacing offsets to build an organic theater pyramid layout
              const dynamicPyramidPadding =
                ((maxRowSeatsCount - rowLength) * 18) / 2;

              return (
                <div
                  key={rowName}
                  className="flex items-center justify-center gap-4 group transition-all duration-150"
                  style={{
                    paddingLeft: `${dynamicPyramidPadding}px`,
                    paddingRight: `${dynamicPyramidPadding}px`,
                  }}
                >
                  {/* Left Side Label Column */}
                  <span className="w-8 font-mono text-xs font-black text-zinc-600 dark:text-zinc-500 text-right select-none group-hover:text-zinc-400 transition-colors uppercase">
                    {rowName}
                  </span>

                  {/* Seat Grid Segment Container */}
                  <div className="flex gap-2 items-center justify-center">
                    {rowSeats.map((seat) => (
                      <div
                        key={seat.id}
                        title={`Seat ${seat.seatRow}-${seat.seatNumber} (${seat.seatType})`}
                        className={`h-9 w-9 rounded-lg border border-transparent flex flex-col items-center justify-center gap-0.5 select-none cursor-pointer transition-all duration-150 hover:-translate-y-1 hover:scale-115 hover:shadow-lg active:scale-95 py-0.5 ${
                          SEAT_COLORS[seat.seatType] || "bg-zinc-700 text-white"
                        }`}
                      >
                        <Armchair className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-[9px] font-mono font-bold tracking-tighter leading-none">
                          {rowName}
                          {seat.seatNumber}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Right Side Label Column */}
                  <span className="w-8 font-mono text-xs font-black text-zinc-600 dark:text-zinc-500 text-left select-none group-hover:text-zinc-400 transition-colors uppercase">
                    {rowName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capacity Overview Base Panel Element Row */}
        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <span>Total Seating Footprint:</span>
          <span className="text-zinc-900 dark:text-zinc-50 font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200/40 dark:border-zinc-700">
            {seats.length} Active System Nodes Configured
          </span>
        </div>
      </div>
    </Modal>
  );
}
