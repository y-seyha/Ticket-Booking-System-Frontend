'use client';

import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DateRangePicker } from '@/features/analytics/components/DateRangePicker';
import { ExportButton } from '@/features/analytics/components/ExportButton';
import { useOccupancy } from '@/features/analytics/hooks/useDashboard';

export default function OccupancyReportPage() {
  usePageTitle('Occupancy Report');

  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const occupancy = useOccupancy({ from, to });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Occupancy Report
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Seat utilization rates across movies, theaters, and time slots
          </p>
        </div>
        <ExportButton type="occupancy" from={from} to={to} />
      </div>

      <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t); }} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Occupancy Rate</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {occupancy.loading ? '...' : `${occupancy.data?.overall.occupancyRate ?? 0}%`}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Capacity</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {occupancy.loading ? '...' : occupancy.data?.overall.totalCapacity.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Seats Occupied</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {occupancy.loading ? '...' : occupancy.data?.overall.totalOccupied.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Showtimes</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {occupancy.loading ? '...' : occupancy.data?.overall.totalShowtimes ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Occupancy by Movie</h3>
          {occupancy.loading ? (
            <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(occupancy.data?.byMovie ?? []).slice(0, 10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:opacity-20" />
                  <XAxis dataKey="title" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', background: '#fff', fontSize: '12px' }}
                    formatter={(value) => [`${value}%`, 'Occupancy']}
                  />
                  <Bar dataKey="occupancyRate" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Occupancy by Hour</h3>
          {occupancy.loading ? (
            <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancy.data?.byHour ?? []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:opacity-20" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}:00`} />
                  <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', background: '#fff', fontSize: '12px' }}
                    formatter={(value) => [`${value}%`, 'Occupancy']}
                    labelFormatter={(label) => `${label}:00`}
                  />
                  <Bar dataKey="occupancyRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Occupancy by Theater</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-2 text-zinc-500 dark:text-zinc-400 font-medium">Theater</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Occupancy</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Occupied</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Capacity</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Showtimes</th>
                </tr>
              </thead>
              <tbody>
                {occupancy.data?.byTheater.map(t => (
                  <tr key={t.id} className="border-b border-zinc-50 dark:border-zinc-800/50">
                    <td className="py-2 text-zinc-700 dark:text-zinc-300">
                      {t.name}
                      <span className="text-xs text-zinc-400 ml-1">({t.city})</span>
                    </td>
                    <td className="text-right py-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        t.occupancyRate >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        t.occupancyRate >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {t.occupancyRate}%
                      </span>
                    </td>
                    <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">{t.occupied}</td>
                    <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">{t.capacity}</td>
                    <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">{t.showtimes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!occupancy.data?.byTheater.length && (
              <p className="text-sm text-zinc-400 text-center py-4">No theater occupancy data</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Movie Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-2 text-zinc-500 dark:text-zinc-400 font-medium">Movie</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Occupancy</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Seats</th>
                  <th className="text-right py-2 text-zinc-500 dark:text-zinc-400 font-medium">Showtimes</th>
                </tr>
              </thead>
              <tbody>
                {occupancy.data?.byMovie.map(m => (
                  <tr key={m.id} className="border-b border-zinc-50 dark:border-zinc-800/50">
                    <td className="py-2 text-zinc-700 dark:text-zinc-300">{m.title}</td>
                    <td className="text-right py-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        (m.occupancyRate ?? 0) >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        (m.occupancyRate ?? 0) >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {m.occupancyRate}%
                      </span>
                    </td>
                    <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">{m.occupied}/{m.capacity}</td>
                    <td className="text-right py-2 text-zinc-700 dark:text-zinc-300">{m.showtimes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!occupancy.data?.byMovie.length && (
              <p className="text-sm text-zinc-400 text-center py-4">No movie occupancy data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
