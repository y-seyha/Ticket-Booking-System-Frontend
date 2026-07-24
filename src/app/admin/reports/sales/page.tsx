'use client';

import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { DateRangePicker } from '@/features/analytics/components/DateRangePicker';
import { ExportButton } from '@/features/analytics/components/ExportButton';
import { useFoodBeverageStats, useMoviePerformance } from '@/features/analytics/hooks/useDashboard';

export default function SalesReportPage() {
  usePageTitle('Sales Report');

  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const food = useFoodBeverageStats({ from, to });
  const movies = useMoviePerformance({ from, to });

  const totalTicketRevenue = movies.data?.reduce((s, m) => s + m.totalRevenue, 0) ?? 0;
  const totalTicketsSold = movies.data?.reduce((s, m) => s + m.totalSeatsSold, 0) ?? 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sales Report
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Breakdown of ticket and food & beverage sales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton type="food_beverage" from={from} to={to} label="Export F&B" />
          <ExportButton type="movies" from={from} to={to} label="Export Movies" />
        </div>
      </div>

      <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t); }} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Ticket Revenue</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${totalTicketRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Tickets Sold</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalTicketsSold}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">F&B Revenue</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ${food.data?.totalRevenue.toLocaleString() ?? '0'}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">F&B Items Sold</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {food.data?.totalItemsSold ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">F&B by Category</h3>
          {food.loading ? (
            <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ) : (
            <div className="space-y-3">
              {(() => {
                const data = food.data;
                if (!data) return <p className="text-sm text-zinc-400">No F&B data available</p>;
                return data.byCategory.map(cat => {
                  const pct = data.totalRevenue > 0 ? ((cat.revenue / data.totalRevenue) * 100).toFixed(1) : '0';
                  return (
                    <div key={cat.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                        <span className="text-zinc-500">${cat.revenue.toFixed(2)} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                });
              })()}
              {!food.data?.byCategory.length && (
                <p className="text-sm text-zinc-400">No F&B data available</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Top Selling Items</h3>
          {food.loading ? (
            <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left py-2 text-zinc-500 dark:text-zinc-400 font-medium">Item</th>
                    <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Qty</th>
                    <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {food.data?.topItems.slice(0, 10).map(item => (
                    <tr key={item.id} className="border-b border-zinc-50 dark:border-zinc-800/50">
                      <td className="py-2 text-zinc-700 dark:text-zinc-300">{item.name}</td>
                      <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">{item.quantity}</td>
                      <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                  {!food.data?.topItems.length && (
                    <tr><td colSpan={3} className="py-4 text-center text-sm text-zinc-400">No sales data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
