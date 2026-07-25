'use client';

interface BookingSummaryCardsProps {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  expired: number;
  loading?: boolean;
}

export function BookingSummaryCards({ total, confirmed, pending, cancelled, expired, loading }: BookingSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse mb-2" />
            <div className="h-8 w-12 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total', value: total, color: 'text-zinc-900 dark:text-zinc-50' },
    { label: 'Confirmed', value: confirmed, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Pending', value: pending, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Cancelled', value: cancelled, color: 'text-red-600 dark:text-red-400' },
    { label: 'Expired', value: expired, color: 'text-zinc-500 dark:text-zinc-400' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
