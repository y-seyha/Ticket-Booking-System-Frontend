'use client';

import { useEffect, useState } from 'react';
import { getBookingById, cancelBooking } from '../bookings.api';
import type { AdminBooking } from '../bookings.types';
import { X, AlertCircle } from 'lucide-react';
import ConfirmModal from '@/components/common/ConfirmModal';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  CANCELLED: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
  EXPIRED: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-900/20 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-800',
};

interface BookingDetailModalProps {
  bookingId: string | null;
  onClose: () => void;
  onCancelled?: () => void;
}

export function BookingDetailModal({ bookingId, onClose, onCancelled }: BookingDetailModalProps) {
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) { setBooking(null); return; }
    setLoading(true);
    setError('');
    getBookingById(bookingId)
      .then((data) => setBooking(data))
      .catch((err: Error) => setError(err.message || 'Failed to load booking'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (!bookingId) return null;

  const accountName = [booking?.account?.profile?.firstName, booking?.account?.profile?.lastName].filter(Boolean).join(' ') || booking?.account?.email || 'N/A';
  const movieTitle = booking?.showtime?.movie?.title || 'N/A';
  const showtimeDate = booking?.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleString() : 'N/A';

  const handleCancel = async () => {
    if (!bookingId) return;
    setShowCancelConfirm(false);
    setCancelling(true);
    setError('');
    try {
      const updated = await cancelBooking(bookingId);
      setBooking(updated);
      onCancelled?.();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as Error)?.message || 'Failed to cancel booking';
      setError(message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        variant="danger"
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Booking Detail</h3>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">{booking?.bookingCode || 'Loading...'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />)}
          </div>
        ) : error && !booking ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
            <button onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Close</button>
          </div>
        ) : booking ? (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Status</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status] || ''}`}>{booking.status}</span>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Total Amount</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">${booking.totalPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">User</p>
                <p className="text-zinc-700 dark:text-zinc-300">{accountName}</p>
                <p className="text-xs text-zinc-400">{booking.account?.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Movie</p>
                <p className="text-zinc-700 dark:text-zinc-300">{movieTitle}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Showtime</p>
                <p className="text-zinc-700 dark:text-zinc-300">{showtimeDate}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Created</p>
                <p className="text-zinc-700 dark:text-zinc-300">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Seats</h4>
              <div className="space-y-1">
                {booking.bookingSeats.map((bs) => (
                  <div key={bs.id} className="flex justify-between text-sm bg-zinc-50 dark:bg-zinc-900 rounded-lg px-3 py-2">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {bs.seat ? `${bs.seat.seatRow}${bs.seat.seatNumber} (${bs.seat.seatType})` : 'N/A'}
                    </span>
                    <span className="text-zinc-500">${bs.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {booking.foodItems.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Food & Beverage</h4>
                <div className="space-y-1">
                  {booking.foodItems.map((fi) => (
                    <div key={fi.id} className="flex justify-between text-sm bg-zinc-50 dark:bg-zinc-900 rounded-lg px-3 py-2">
                      <span className="text-zinc-700 dark:text-zinc-300">{fi.foodItem?.name || 'N/A'} x{fi.quantity}</span>
                      <span className="text-zinc-500">${(fi.unitPrice * fi.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {booking.payment && (
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Payment</h4>
                <div className="grid grid-cols-2 gap-3 text-sm bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3">
                  <div>
                    <p className="text-xs text-zinc-500">Provider</p>
                    <p className="text-zinc-700 dark:text-zinc-300">{booking.payment.provider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Status</p>
                    <p className="text-zinc-700 dark:text-zinc-300">{booking.payment.status}</p>
                  </div>
                  {booking.payment.transactionRef && (
                    <div className="col-span-2">
                      <p className="text-xs text-zinc-500">Transaction Ref</p>
                      <p className="text-zinc-700 dark:text-zinc-300 font-mono text-xs">{booking.payment.transactionRef}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelling}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
    </>
  );
}
