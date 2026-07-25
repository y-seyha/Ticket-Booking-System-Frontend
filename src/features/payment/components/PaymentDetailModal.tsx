'use client';

import { useEffect, useState } from 'react';
import { getPaymentById } from '../admin-payments.api';
import type { AdminPaymentDetail } from '../admin-payments.types';
import { X, AlertCircle } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  SUCCESS: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  FAILED: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
  REFUNDED: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
  EXPIRED: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-900/20 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-800',
};

interface PaymentDetailModalProps {
  paymentId: string | null;
  onClose: () => void;
}

export function PaymentDetailModal({ paymentId, onClose }: PaymentDetailModalProps) {
  const [payment, setPayment] = useState<AdminPaymentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!paymentId) { setPayment(null); return; }
    setLoading(true);
    setError('');
    getPaymentById(paymentId)
      .then((data) => setPayment(data))
      .catch((err: Error) => setError(err.message || 'Failed to load payment'))
      .finally(() => setLoading(false));
  }, [paymentId]);

  if (!paymentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Payment Detail</h3>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">ID: {payment?.id?.slice(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />)}
          </div>
        ) : error && !payment ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
            <button onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-700">Close</button>
          </div>
        ) : payment ? (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Status</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[payment.status] || ''}`}>{payment.status}</span>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Amount</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{payment.currency} {payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Provider</p>
                <p className="text-zinc-700 dark:text-zinc-300">{payment.provider}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Booking</p>
                <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{payment.booking?.bookingCode || 'N/A'}</p>
              </div>
              {payment.transactionRef && (
                <div className="col-span-2">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Transaction Ref</p>
                  <p className="text-zinc-700 dark:text-zinc-300 font-mono text-xs break-all">{payment.transactionRef}</p>
                </div>
              )}
              {payment.paidAt && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Paid At</p>
                  <p className="text-zinc-700 dark:text-zinc-300">{new Date(payment.paidAt).toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Created</p>
                <p className="text-zinc-700 dark:text-zinc-300">{new Date(payment.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
