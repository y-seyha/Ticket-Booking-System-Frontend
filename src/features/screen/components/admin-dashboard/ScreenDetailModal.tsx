
"use client";

import { X, Grid } from "lucide-react";
import type { Screen } from "../../screen.types";

interface DetailModalProps {
  screen: Screen;
  onClose: () => void;
}

export default function ScreenDetailModal({
  screen,
  onClose,
}: DetailModalProps) {
  const getSeatColor = (type: string, status: string) => {
    if (status === "INACTIVE")
      return "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600";
    switch (type) {
      case "VIP":
        return "bg-amber-500 text-white";
      case "COUPLE":
        return "bg-rose-500 text-white";
      case "WHEELCHAIR":
        return "bg-blue-500 text-white";
      default:
        return "bg-emerald-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Title */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Grid className="h-5 w-5 text-zinc-400" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {screen.name} Configuration Specs
              </h2>
              <p className="text-xs text-zinc-400">
                {screen.theater?.name || "Independent Terminal Setup"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Metrics Panels Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide block mb-0.5">
                Projection Spec
              </span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {screen.type}
              </span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide block mb-0.5">
                System Identifier
              </span>
              <span className="text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-200">
                {screen.id.substring(0, 8)}
              </span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide block mb-0.5">
                Template Layout
              </span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {screen.template?.name || "Custom Layer Matrix"}
              </span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide block mb-0.5">
                Active Total Nodes
              </span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {screen.seats?.length || 0} Positions
              </span>
            </div>
          </div>

          {/* Visual Interactive Map Representation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Theater Seat Blueprint Layout Map
            </h3>

            {/* Projector Screen Marker Design */}
            <div className="w-2/3 mx-auto mb-10 text-center">
              <div className="h-1.5 w-full bg-zinc-300 dark:bg-zinc-700 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-1" />
              <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                FRONT SCREEN PROJECTION STAGE
              </span>
            </div>

            {/* Generated Structural Seat Maps Rendering */}
            {!screen.seats || screen.seats.length === 0 ? (
              <div className="py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-400 text-sm">
                No individual seating coordinates mapped to this blueprint
                structure matrix.
              </div>
            ) : (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-x-auto">
                <div className="min-w-[600px] flex flex-col items-center justify-center gap-3 p-4">
                  {/* Sorting seats sequentially into grid layout configurations */}
                  <div className="grid grid-cols-10 gap-2">
                    {[...screen.seats]
                      .sort(
                        (a, b) =>
                          a.seatRow.localeCompare(b.seatRow) ||
                          a.seatNumber - b.seatNumber,
                      )
                      .map((seat) => (
                        <div
                          key={seat.id}
                          className={`h-8 w-8 text-[10px] font-bold rounded-lg flex items-center justify-center select-none shadow-xs transition-transform ${getSeatColor(seat.seatType, seat.status)}`}
                          title={`Row ${seat.seatRow}-${seat.seatNumber} Type: ${seat.seatType} Status: ${seat.status}`}
                        >
                          {seat.seatRow}
                          {seat.seatNumber}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Legend Footer */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-600 block" /> Regular
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-500 block" /> VIP
              Premium
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-rose-500 block" /> Couple
              Suite
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-blue-500 block" /> Accessible
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-zinc-200 dark:bg-zinc-800 block" />{" "}
              Inactive/Broken
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
