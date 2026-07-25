'use client';

interface PaymentSummaryCardsProps {
  totalRevenue: number;
  byProvider: { provider: string; total: number }[];
  loading?: boolean;
}

export function PaymentSummaryCards({ totalRevenue, byProvider, loading }: PaymentSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse mb-2" />
            <div className="h-8 w-20 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Revenue</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${totalRevenue.toLocaleString()}</p>
      </div>
      {byProvider.map((p) => (
        <div key={p.provider} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">{p.provider}</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${p.total.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
