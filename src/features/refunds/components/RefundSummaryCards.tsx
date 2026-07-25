'use client';

interface RefundSummaryCardsProps {
  totalRefunded: number;
  totalTickets: number;
  loading?: boolean;
}

export function RefundSummaryCards({ totalRefunded, totalTickets, loading }: RefundSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1,2].map(i => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse mb-2" />
            <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Refunded</p>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">${totalRefunded.toLocaleString()}</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Refunded Tickets</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalTickets.toLocaleString()}</p>
      </div>
    </div>
  );
}
