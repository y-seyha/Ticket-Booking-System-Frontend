'use client';

import type { AdminRefund } from '../refunds.types';

interface AdminRefundsTableProps {
  data: AdminRefund[];
  loading?: boolean;
  onSelect: (refund: AdminRefund) => void;
}

export function AdminRefundsTable({ data, loading, onSelect }: AdminRefundsTableProps) {
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
        <p className="text-sm text-zinc-400 text-center py-8">No refunds found</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">QR Code</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Booking Code</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">User</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Movie</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Seat</th>
              <th className="text-right py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Refunded At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((refund) => {
              const accountName = [refund.booking?.account?.profile?.firstName, refund.booking?.account?.profile?.lastName].filter(Boolean).join(' ') || refund.booking?.account?.email || 'N/A';
              const seatStr = refund.seat ? `${refund.seat.seatRow}${refund.seat.seatNumber}` : 'N/A';
              return (
                <tr
                  key={refund.id}
                  className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                  onClick={() => onSelect(refund)}
                >
                  <td className="py-3 px-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">{refund.qrCode}</td>
                  <td className="py-3 px-4 font-mono text-xs text-zinc-800 dark:text-zinc-200">{refund.booking?.bookingCode || 'N/A'}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 max-w-[160px] truncate">{accountName}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 max-w-[180px] truncate">{refund.booking?.showtime?.movie?.title || 'N/A'}</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{seatStr}</td>
                  <td className="py-3 px-4 text-right text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(refund.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
