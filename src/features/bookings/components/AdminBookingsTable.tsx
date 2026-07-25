'use client';

import type { AdminBooking } from '../bookings.types';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  CANCELLED: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
  EXPIRED: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-900/20 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-800',
};

interface AdminBookingsTableProps {
  data: AdminBooking[];
  loading?: boolean;
  onSelect: (id: string) => void;
}

export function AdminBookingsTable({ data, loading, onSelect }: AdminBookingsTableProps) {
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
        <p className="text-sm text-zinc-400 text-center py-8">No bookings found</p>
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
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Movie</th>
              <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Showtime</th>
              <th className="text-right py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Seats</th>
              <th className="text-right py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Amount</th>
              <th className="text-center py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-zinc-500 dark:text-zinc-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => {
              const accountName = [booking.account?.profile?.firstName, booking.account?.profile?.lastName].filter(Boolean).join(' ') || booking.account?.email || 'N/A';
              const showtimeDate = booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleDateString() : 'N/A';
              const showtimeTime = booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              return (
                <tr
                  key={booking.id}
                  className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                  onClick={() => onSelect(booking.id)}
                >
                  <td className="py-3 px-4 font-mono text-xs text-zinc-800 dark:text-zinc-200">{booking.bookingCode}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 max-w-[160px] truncate">{accountName}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 max-w-[180px] truncate">{booking.showtime?.movie?.title || 'N/A'}</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    {showtimeDate} {showtimeTime}
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{booking.bookingSeats.length}</td>
                  <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300 font-medium">${booking.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status] || 'bg-zinc-50 text-zinc-600'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(booking.createdAt).toLocaleDateString()}
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
