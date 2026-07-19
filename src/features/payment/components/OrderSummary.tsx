import { Ticket, ShoppingCart } from "lucide-react";

interface SeatItem {
  label: string;
  type: string;
}

interface FoodItemDisplay {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  movieTitle: string;
  showtimeDetails: string;
  seats: SeatItem[];
  foodItems?: FoodItemDisplay[];
  totalAmount: number;
}

export default function OrderSummary({
  movieTitle,
  showtimeDetails,
  seats = [],
  foodItems = [],
  totalAmount = 0,
}: OrderSummaryProps) {
  const seatCount = seats?.length || 0;

  return (
    <div className="w-full space-y-6">
      <div className="pb-5 border-b border-zinc-800/60 space-y-1">
        <p className="text-[11px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
          Review Booking
        </p>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl break-words leading-tight">
          {movieTitle || "Selected Feature"}
        </h2>
        <p className="text-xs text-zinc-400 font-medium tracking-normal pt-0.5">
          {showtimeDetails || "Loading scheduling context..."}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
          Tickets ({seatCount})
        </p>

        {seatCount === 0 ? (
          <div className="py-4 text-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/40">
            <p className="text-xs text-zinc-500 italic">No seats designated.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-2.5 max-h-[280px] overflow-y-auto pr-1.5 
                       scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent 
                       [&::-webkit-scrollbar]:w-1.5
                       [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:bg-zinc-800
                       [&::-webkit-scrollbar-thumb]:rounded-full
                       hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
          >
            {seats.map((seat, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 transition-all duration-200 hover:border-zinc-700/50 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <Ticket className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-mono text-xs font-bold text-white tracking-wide truncate">
                      Seat {seat.label}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider truncate">
                      {seat.type} Tier
                    </p>
                  </div>
                </div>
                <div className="h-4 w-[1px] border-l border-dashed border-zinc-800" />
              </div>
            ))}
          </div>
        )}
      </div>

      {foodItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold tracking-[0.15em] text-zinc-500 uppercase flex items-center gap-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            Food & Beverage
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {foodItems.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-500">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-mono text-xs font-bold text-white tracking-wide truncate">
                      {f.name}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-500">x{f.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-mono text-zinc-300 shrink-0">
                  ${(Number(f.price) * f.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-5 border-t border-zinc-800/60 flex items-center justify-between">
        <span className="text-xs font-medium tracking-tight text-zinc-400">
          Total Payable
        </span>
        <span className="text-2xl font-semibold text-white tracking-tight font-sans">
          ${Number(totalAmount).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
