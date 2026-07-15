"use client";

import { useState } from "react";
import type { PosCompletedOrder } from "../pos.types";
import { Banknote, QrCode, Search } from "lucide-react";

function loadOrders(): PosCompletedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("pos-completed-orders");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PosOrderHistory() {
  const [orders] = useState<PosCompletedOrder[]>(loadOrders);
  const [search, setSearch] = useState("");

  const filtered = search
    ? orders.filter(
        (o) =>
          o.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
          o.movieTitle.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-white uppercase tracking-wide">
          Order History
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Recent POS transactions
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by movie or booking code..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 font-medium">
          {orders.length === 0
            ? "No orders yet today"
            : "No results found"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-[10px] uppercase tracking-wider border-b border-zinc-800">
                <th className="text-left py-3 px-2 font-bold">Booking Code</th>
                <th className="text-left py-3 px-2 font-bold">Movie</th>
                <th className="text-left py-3 px-2 font-bold">Seats</th>
                <th className="text-left py-3 px-2 font-bold">Time</th>
                <th className="text-right py-3 px-2 font-bold">Amount</th>
                <th className="text-center py-3 px-2 font-bold">Method</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-800/60 hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="py-3 px-2">
                    <span className="font-mono text-[10px] font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                      {order.bookingCode.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-white font-semibold">
                    {order.movieTitle}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {order.seats.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-zinc-400">
                    {new Date(order.showtime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-white">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {order.paymentMethod === "CASH" ? (
                      <Banknote className="w-4 h-4 text-green-400 inline" />
                    ) : (
                      <QrCode className="w-4 h-4 text-blue-400 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
