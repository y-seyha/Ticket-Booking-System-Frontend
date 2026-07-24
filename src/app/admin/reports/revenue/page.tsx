'use client';

import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { RevenueChart } from '@/features/analytics/components/RevenueChart';
import { DateRangePicker } from '@/features/analytics/components/DateRangePicker';
import { ExportButton } from '@/features/analytics/components/ExportButton';
import { useRevenue } from '@/features/analytics/hooks/useDashboard';

const GROUP_OPTIONS: { label: string; value: 'day' | 'week' | 'month' | 'year' }[] = [
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' },
];

export default function RevenueReportPage() {
  usePageTitle('Revenue Report');

  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const revenue = useRevenue({ from, to, groupBy });

  const totalRevenue = revenue.data?.dataPoints.reduce((s, d) => s + d.revenue, 0) ?? 0;
  const totalTicket = revenue.data?.dataPoints.reduce((s, d) => s + d.ticketRevenue, 0) ?? 0;
  const totalFood = revenue.data?.dataPoints.reduce((s, d) => s + d.foodRevenue, 0) ?? 0;
  const totalTransactions = revenue.data?.dataPoints.reduce((s, d) => s + d.count, 0) ?? 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Revenue Report
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track revenue trends across your cinema platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton type="revenue" from={from} to={to} groupBy={groupBy as string} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t); }} />
        <div className="flex gap-1.5">
          {GROUP_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setGroupBy(opt.value)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                groupBy === opt.value
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Ticket Revenue</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${totalTicket.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Food & Beverage</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${totalFood.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Transactions</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalTransactions}</p>
        </div>
      </div>

      <RevenueChart data={revenue.data?.dataPoints ?? []} loading={revenue.loading} />

      {!revenue.loading && revenue.data && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Revenue Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Period</th>
                  <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Revenue</th>
                  <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Tickets</th>
                  <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">F&B</th>
                  <th className="text-right py-2 px-2 text-zinc-500 dark:text-zinc-400 font-medium">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {revenue.data.dataPoints.map((d, i) => (
                  <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50">
                    <td className="py-2 px-2 text-zinc-700 dark:text-zinc-300">{d.date}</td>
                    <td className="text-right py-2 px-2 text-zinc-700 dark:text-zinc-300">${d.revenue.toFixed(2)}</td>
                    <td className="text-right py-2 px-2 text-zinc-700 dark:text-zinc-300">${d.ticketRevenue.toFixed(2)}</td>
                    <td className="text-right py-2 px-2 text-zinc-700 dark:text-zinc-300">${d.foodRevenue.toFixed(2)}</td>
                    <td className="text-right py-2 px-2 text-zinc-700 dark:text-zinc-300">{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
