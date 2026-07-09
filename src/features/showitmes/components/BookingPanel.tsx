"use client";

import { useRouter } from "next/navigation";

interface BookingPanelProps {
  showtime: {
    id: string;
    basePrice: number;
    movie: { title: string };
    startTime: string;
    seats: Array<{
      id: string;
      seatRow: string;
      seatNumber: number;
      status: "AVAILABLE" | "LOCKED" | "BOOKED";
      finalPrice: number;
    }>;
  };
  onClearCart: () => Promise<void>;
  onSubmit: () => void; // Added validation click callback from parent view state
}

export default function BookingPanel({
  showtime,
  onClearCart,
  onSubmit,
}: BookingPanelProps) {
  const router = useRouter();
  const selectedSeats = showtime.seats;

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + seat.finalPrice,
    0,
  );

  return (
    <div className="w-full max-w-md bg-zinc-950/70 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl shadow-2xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Decorative top ambient bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-500 via-red-400 to-red-600 opacity-90 shadow-[0_1px_10px_rgba(239,68,68,0.3)]" />

      {/* Movie Details Header */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3 bg-red-500 rounded-sm" />
          <span className="text-[10px] font-black tracking-[0.25em] text-red-500 uppercase">
            Your Ticket Selection
          </span>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight leading-snug uppercase">
          {showtime.movie.title}
        </h2>

        {/* Date & Time Badges */}
        <div className="flex flex-wrap gap-2 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-zinc-300 shadow-sm">
            <svg
              className="w-3 h-3 text-zinc-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 5V3m12 2V3M3 9h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(showtime.startTime).toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-red-400 shadow-sm">
            <svg
              className="w-3 h-3 text-red-500/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0"
              />
            </svg>
            {new Date(showtime.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="h-[1px] w-full bg-zinc-900/80 my-5" />

      {/* Selected Seats Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">
            Seats Reserved ({selectedSeats.length})
          </h3>
        </div>

        {selectedSeats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-9 border border-dashed border-zinc-800/60 rounded-xl bg-zinc-950/40">
            <svg
              className="w-6 h-6 text-zinc-700 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <p className="text-xs text-zinc-600 font-semibold tracking-wide">
              No seats chosen from map yet
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {selectedSeats.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border border-zinc-800/80 text-zinc-100 rounded-xl text-xs font-bold shadow-sm hover:border-zinc-700/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase font-sans font-extrabold tracking-wider text-zinc-500">
                      Assigned Location
                    </span>
                    <span className="font-mono text-sm">
                      Row {s.seatRow} — Seat {s.seatNumber}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-zinc-300 font-semibold text-right">
                  ${s.finalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Summary & Action Area */}
      <div className="bg-zinc-950/90 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-zinc-900/60">
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Total Payable
            </span>
            <p className="text-[9px] text-zinc-600 font-medium">
              VAT &amp; Booking fees included
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-white tracking-tight font-mono bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex gap-2">
          {selectedSeats.length > 0 && (
            <button
              onClick={onClearCart}
              className="px-4 bg-zinc-900/80 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 rounded-xl transition-all duration-150 flex items-center justify-center group active:scale-[0.96]"
              title="Clear Selections"
            >
              <svg
                className="w-4 h-4 transition-colors group-hover:text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M4 7h16"
                />
              </svg>
            </button>
          )}

          <button
            disabled={selectedSeats.length === 0}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-500/5 transition-all duration-150 hover:from-red-400 hover:to-red-500 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:bg-none disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border disabled:border-zinc-800/80 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
            onClick={onSubmit} 
          >
            {selectedSeats.length === 0
              ? "Select Seats To Continue"
              : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}
