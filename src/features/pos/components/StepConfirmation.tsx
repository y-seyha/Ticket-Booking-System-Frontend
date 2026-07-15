"use client";

import { CheckCircle, Ticket, Receipt, ShoppingBag } from "lucide-react";
import type { PosSeat, PosFoodItem } from "../pos.types";
import type { Showtime } from "@/features/showitmes/showtimes.types";

interface StepConfirmationProps {
  bookingCode: string;
  showtime: Showtime;
  seats: PosSeat[];
  foods: PosFoodItem[];
  grandTotal: number;
  onNewSale: () => void;
}

export default function StepConfirmation({
  bookingCode,
  showtime,
  seats,
  foods,
  grandTotal,
  onNewSale,
}: StepConfirmationProps) {
  const handlePrint = () => window.print();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-xl font-black text-white">Payment Successful</h2>
        <p className="text-sm text-zinc-500">Booking confirmed</p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 print:border-black print:bg-white print:text-black">
        <div className="text-center border-b border-zinc-800 pb-4 print:border-gray-300">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            CineBook Cinema
          </p>
          <p className="text-2xl font-mono font-black text-white mt-1 print:text-black">
            {bookingCode.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-zinc-500" />
            <span className="font-bold text-white print:text-black">
              {showtime.movie.title}
            </span>
          </div>
          <p className="text-zinc-400 print:text-gray-600 pl-6">
            {new Date(showtime.startTime).toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            —{" "}
            {new Date(showtime.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-4 space-y-2 print:border-gray-300">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            Seats
          </p>
          <div className="flex flex-wrap gap-2">
            {seats.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-mono font-bold print:bg-gray-200 print:text-black"
              >
                {s.seatRow}{s.seatNumber}
              </span>
            ))}
          </div>
        </div>

        {foods.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2 print:border-gray-300">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3 h-3" />
              F&B
            </p>
            {foods.map((f) => (
              <div
                key={f.item.id}
                className="flex justify-between text-sm text-zinc-400 print:text-gray-600"
              >
                <span>
                  {f.item.name} x{f.quantity}
                </span>
                <span className="font-mono text-white print:text-black">
                  ${(f.item.price * f.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-zinc-800 pt-4 flex justify-between items-center print:border-gray-300">
          <span className="text-sm font-bold text-zinc-300 print:text-black">
            Total Paid
          </span>
          <span className="text-2xl font-black text-white font-mono print:text-black">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 py-3.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4" />
          Print Receipt
        </button>
        <button
          onClick={onNewSale}
          className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
        >
          New Sale
        </button>
      </div>
    </div>
  );
}
