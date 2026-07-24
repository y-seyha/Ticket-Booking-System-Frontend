'use client';

import type { MoviePerformance } from '../analytics.types';

interface MoviePerformanceTableProps {
  data: MoviePerformance[];
  loading?: boolean;
}

export function MoviePerformanceTable({ data, loading }: MoviePerformanceTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <p className="text-sm text-zinc-400 text-center py-8">No movie data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Movie Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="text-left py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Movie</th>
              <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Bookings</th>
              <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Revenue</th>
              <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Seats Sold</th>
              <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Avg/Booking</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((movie, i) => (
              <tr key={movie.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 w-4">{i + 1}</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{movie.title}</span>
                  </div>
                </td>
                <td className="text-right py-2.5 px-2 text-zinc-700 dark:text-zinc-300">{movie.totalBookings}</td>
                <td className="text-right py-2.5 px-2 text-zinc-700 dark:text-zinc-300">${movie.totalRevenue.toLocaleString()}</td>
                <td className="text-right py-2.5 px-2 text-zinc-700 dark:text-zinc-300">{movie.totalSeatsSold}</td>
                <td className="text-right py-2.5 px-2 text-zinc-700 dark:text-zinc-300">${movie.avgRevenuePerBooking.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
