"use client";

import { useEffect, useState, useCallback } from "react";
import { posApi, type CashierOrder } from "../pos.api";
import { Banknote, QrCode, Search, Calendar, TicketCheck, ShoppingCart } from "lucide-react";

export default function PosOrderHistory() {
  const [orders, setOrders] = useState<CashierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [movieSearch, setMovieSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (movieSearch.trim()) params.movieTitle = movieSearch.trim();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const data = await posApi.getOrders(params);
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [movieSearch, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);
  const orderCount = orders.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wide">
            Order History
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {orderCount} order{orderCount !== 1 ? "s" : ""} · $
            {totalRevenue.toFixed(2)} total
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={movieSearch}
            onChange={(e) => setMovieSearch(e.target.value)}
            placeholder="Search movie..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-700"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 font-medium">
          {movieSearch || startDate || endDate
            ? "No orders match your filters"
            : "No confirmed orders yet"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-[10px] uppercase tracking-wider border-b border-zinc-800">
                <th className="text-left py-3 px-2 font-bold">Booking</th>
                <th className="text-left py-3 px-2 font-bold">Movie</th>
                <th className="text-left py-3 px-2 font-bold">Theater</th>
                <th className="text-left py-3 px-2 font-bold">Seats</th>
                <th className="text-left py-3 px-2 font-bold">Date</th>
                <th className="text-right py-3 px-2 font-bold">Amount</th>
                <th className="text-center py-3 px-2 font-bold">Method</th>
                <th className="text-center py-3 px-2 font-bold">Tickets</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-800/60 hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="py-3 px-2">
                    <span className="font-mono text-[10px] font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                      {order.bookingCode.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-white font-semibold max-w-[180px] truncate">
                    {order.showtime.movie.title}
                  </td>
                  <td className="py-3 px-2 text-zinc-400 text-xs">
                    <div>{order.showtime.screen.theater.name}</div>
                    <div className="text-zinc-600">{order.showtime.screen.name}</div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {order.bookingSeats.map((bs) => (
                        <span
                          key={bs.id}
                          className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded"
                        >
                          {bs.seat.seatRow}{bs.seat.seatNumber}
                        </span>
                      ))}
                    </div>
                    {order.foodItems && order.foodItems.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-zinc-800/40">
                        {order.foodItems.map((fi) => (
                          <span
                            key={fi.id}
                            className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                          >
                            <ShoppingCart className="w-2.5 h-2.5" />
                            {fi.foodItem.name} x{fi.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(order.showtime.startTime).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                    <br />
                    {new Date(order.showtime.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-white whitespace-nowrap">
                    ${Number(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {order.payment?.provider === "CASH" ? (
                      <Banknote className="w-4 h-4 text-green-400 inline" />
                    ) : (
                      <QrCode className="w-4 h-4 text-blue-400 inline" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {order.bookingSeats.map((bs) => (
                        <span
                          key={bs.id}
                          className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded ${
                            bs.ticket?.status === "USED"
                              ? "bg-green-500/10 text-green-400"
                              : bs.ticket?.status === "ACTIVE"
                                ? "bg-zinc-500/10 text-zinc-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          <TicketCheck className="w-2.5 h-2.5" />
                          {bs.ticket?.status || "N/A"}
                        </span>
                      ))}
                    </div>
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
