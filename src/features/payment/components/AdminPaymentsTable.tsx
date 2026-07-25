'use client';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  SUCCESS: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  FAILED: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
  REFUNDED: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
  EXPIRED: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-900/20 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-800',
};

interface PaymentTableRow {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  booking: { bookingCode: string; account: { email: string } | null } | null;
}

interface AdminPaymentsTableProps {
  data: PaymentTableRow[];
  loading?: boolean;
  onSelect: (id: string) => void;
}

export function AdminPaymentsTable({ data, loading, onSelect }: AdminPaymentsTableProps) {
  if (loading && !data.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
        <p className="text-sm text-zinc-400 text-center py-8">No payments found</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Booking Code</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">User</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Provider</th>
              <th className="text-right py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Amount</th>
              <th className="text-center py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                onClick={() => onSelect(payment.id)}
              >
                <td className="py-3 px-4 font-mono text-xs text-zinc-800 dark:text-zinc-200">{payment.booking?.bookingCode || 'N/A'}</td>
                <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 max-w-[160px] truncate">{payment.booking?.account?.email || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{payment.provider}</span>
                </td>
                <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300 font-medium">
                  {payment.currency} {payment.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[payment.status] || ''}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-xs text-zinc-500 dark:text-zinc-400">
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
