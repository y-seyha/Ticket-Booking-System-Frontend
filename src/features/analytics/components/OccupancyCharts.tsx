'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { OccupancyResponse } from '../analytics.types';

interface OccupancyChartsProps {
  data: OccupancyResponse | null;
  loading: boolean;
}

export function OccupancyCharts({ data, loading }: OccupancyChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Occupancy by Movie</h3>
        {loading ? (
          <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(data?.byMovie ?? []).slice(0, 10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
        {loading ? (
          <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.byHour ?? []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
  );
}
