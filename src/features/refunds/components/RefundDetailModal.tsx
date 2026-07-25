'use client';

import { X } from 'lucide-react';
import type { AdminRefund } from '../refunds.types';

interface RefundDetailModalProps {
  refund: AdminRefund | null;
  onClose: () => void;
}

export function RefundDetailModal({ refund, onClose }: RefundDetailModalProps) {
  if (!refund) return null;

  const accountName = [refund.booking?.account?.profile?.firstName, refund.booking?.account?.profile?.lastName].filter(Boolean).join(' ') || refund.booking?.account?.email || 'N/A';
  const seatStr = refund.seat ? `${refund.seat.seatRow}${refund.seat.seatNumber}` : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Refund Detail</h3>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">{refund.qrCode}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Booking Code</p>
              <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{refund.booking?.bookingCode}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">User</p>
              <p className="text-zinc-700 dark:text-zinc-300">{accountName}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Movie</p>
              <p className="text-zinc-700 dark:text-zinc-300">{refund.booking?.showtime?.movie?.title || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Seat</p>
              <p className="text-zinc-700 dark:text-zinc-300">{seatStr}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Refunded At</p>
              <p className="text-zinc-700 dark:text-zinc-300">{new Date(refund.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Payment</p>
              <p className="text-zinc-700 dark:text-zinc-300">{refund.booking?.payment?.status} ({refund.booking?.payment?.provider})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
