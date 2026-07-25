'use client';

import { Search } from 'lucide-react';

const STATUSES = ['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'];

interface BookingFiltersProps {
  status: string;
  search: string;
  from: string;
  to: string;
  onStatusChange: (s: string) => void;
  onSearchChange: (s: string) => void;
  onFromChange: (s: string) => void;
  onToChange: (s: string) => void;
}

export function BookingFilters({ status, search, from, to, onStatusChange, onSearchChange, onFromChange, onToChange }: BookingFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              status === s
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by code, user, movie..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
          />
        </div>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
        />
        <span className="text-xs text-zinc-400">to</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
        />
      </div>
    </div>
  );
}
