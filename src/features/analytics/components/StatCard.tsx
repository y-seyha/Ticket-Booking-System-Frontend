'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel, loading }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {trend !== undefined && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend)}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</span>
            )}
            {trendLabel && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{trendLabel}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
