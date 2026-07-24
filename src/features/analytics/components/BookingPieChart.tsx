'use client';

import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import type { BookingStat } from '../analytics.types';

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: '#10b981',
  PENDING: '#f59e0b',
  CANCELLED: '#ef4444',
  EXPIRED: '#6b7280',
};

interface BookingPieChartProps {
  data: BookingStat[];
  loading?: boolean;
}

export function BookingPieChart({ data, loading }: BookingPieChartProps) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      name: d.status.charAt(0) + d.status.slice(1).toLowerCase(),
      value: d.count,
      color: STATUS_COLORS[d.status] || '#6366f1',
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="h-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 flex items-center justify-center">
        <p className="text-sm text-zinc-400">No booking data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Bookings by Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e4e4e7',
                background: '#fff',
                fontSize: '12px',
              }}
              formatter={(value, name) => [value, name]}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
