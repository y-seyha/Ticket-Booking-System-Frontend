'use client';

const PROVIDERS = ['', 'CASH', 'KHQR', 'STRIPE', 'PAYPAL', 'VNPAY'];
const STATUSES = ['', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'EXPIRED'];

interface PaymentFiltersProps {
  status: string;
  provider: string;
  from: string;
  to: string;
  onStatusChange: (s: string) => void;
  onProviderChange: (s: string) => void;
  onFromChange: (s: string) => void;
  onToChange: (s: string) => void;
}

export function PaymentFilters({ status, provider, from, to, onStatusChange, onProviderChange, onFromChange, onToChange }: PaymentFiltersProps) {
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
        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>{p || 'All Providers'}</option>
          ))}
        </select>
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
