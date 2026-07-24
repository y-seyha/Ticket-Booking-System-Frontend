'use client';

import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
] as const;

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const activePreset = useMemo(() => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffDays = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    return PRESETS.find(p => p.days === diffDays);
  }, [from, to]);

  const handlePreset = (days: number) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    onChange(fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-zinc-400" />
        <input
          type="date"
          value={from}
          onChange={e => onChange(e.target.value, to)}
          className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300"
        />
        <span className="text-xs text-zinc-400">to</span>
        <input
          type="date"
          value={to}
          onChange={e => onChange(from, e.target.value)}
          className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300"
        />
      </div>
      <div className="flex gap-1.5">
        {PRESETS.map(preset => (
          <button
            key={preset.days}
            onClick={() => handlePreset(preset.days)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              activePreset?.days === preset.days
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
