"use client";

import type { Showtime } from "@/features/showitmes/showtimes.types";
import type { PosSeat, PosFoodItem } from "../pos.types";
import type { MockFoodItem } from "../data/mockFoods";
import { Ticket, Minus, ShoppingCart } from "lucide-react";

interface StepReviewOrderProps {
  showtime: Showtime;
  seats: PosSeat[];
  foods: PosFoodItem[];
  totalBasePrice: number;
  totalSeatPrice: number;
  totalFoodPrice: number;
  grandTotal: number;
  mockFoods: MockFoodItem[];
  onAddFood: (item: MockFoodItem) => void;
  onRemoveFood: (itemId: string) => void;
  onBack: () => void;
  onProceed: () => void;
}

export default function StepReviewOrder({
  showtime,
  seats,
  foods,
  totalBasePrice,
  totalSeatPrice,
  totalFoodPrice,
  grandTotal,
  mockFoods,
  onAddFood,
  onRemoveFood,
  onBack,
  onProceed,
}: StepReviewOrderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wide">
            Review Order
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {showtime.movie.title} —{" "}
            {new Date(showtime.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <Ticket className="w-3.5 h-3.5" />
            Tickets ({seats.length})
          </h3>
          {seats.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-mono text-white font-bold">
                  Row {s.seatRow} — Seat {s.seatNumber}
                </span>
              </div>
              <span className="text-sm font-mono text-zinc-300">
                ${(totalBasePrice / seats.length + s.surcharge).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            Food & Beverage
          </h3>

          {foods.length > 0 && (
            <div className="space-y-2 mb-4">
              {foods.map((f) => (
                <div
                  key={f.item.id}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white font-medium">
                      {f.item.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      x{f.quantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-zinc-300">
                      ${(f.item.price * f.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveFood(f.item.id)}
                      className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {mockFoods.map((item) => {
              const inCart = foods.find((f) => f.item.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onAddFood(item)}
                  className="flex flex-col items-start p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all text-left cursor-pointer active:scale-[0.98]"
                >
                  <span className="text-xs font-bold text-white">
                    {item.name}
                  </span>
                  <span className="text-xs text-zinc-500 mt-0.5">
                    ${item.price.toFixed(2)}
                  </span>
                  {inCart && (
                    <span className="text-[10px] text-red-400 font-bold mt-1">
                      x{inCart.quantity} in cart
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-28 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Tickets ({seats.length})</span>
              <span className="font-mono text-white">
                ${totalBasePrice.toFixed(2)}
              </span>
            </div>
            {totalSeatPrice > 0 && (
              <div className="flex justify-between text-zinc-400">
                <span>Seat surcharges</span>
                <span className="font-mono text-white">
                  ${totalSeatPrice.toFixed(2)}
                </span>
              </div>
            )}
            {totalFoodPrice > 0 && (
              <div className="flex justify-between text-zinc-400">
                <span>Food & Beverage</span>
                <span className="font-mono text-white">
                  ${totalFoodPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-300">Total</span>
            <span className="text-2xl font-black text-white font-mono">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-bold transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={onProceed}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
