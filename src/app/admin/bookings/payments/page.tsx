'use client';

import { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { listAllPayments, getPaymentsExportUrl } from '@/features/payment/admin-payments.api';
import type { AdminPayment, AdminPaymentListResponse } from '@/features/payment/admin-payments.types';
import { PaymentSummaryCards } from '@/features/payment/components/PaymentSummaryCards';
import { PaymentFilters } from '@/features/payment/components/PaymentFilters';
import { AdminPaymentsTable } from '@/features/payment/components/AdminPaymentsTable';
import { PaymentDetailModal } from '@/features/payment/components/PaymentDetailModal';
import { Download, AlertCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  usePageTitle('Payments');

  const [data, setData] = useState<AdminPayment[]>([]);
  const [meta, setMeta] = useState<AdminPaymentListResponse['meta'] | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toLocaleDateString('en-CA');
  });
  const [to, setTo] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoading) {
        setInitialLoading(true);
      } else {
        setRefreshing(true);
      }
      setError('');
      try {
        const res = await listAllPayments({
          status: status || undefined,
          provider: provider || undefined,
          from,
          to,
        });
        if (!mountedRef.current) return;
        setData(res.data || []);
        setMeta(res.meta || null);
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        setData([]);
        setMeta(null);
        setError((err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as Error)?.message || 'Failed to load payments');
      } finally {
        if (mountedRef.current) {
          setInitialLoading(false);
          setRefreshing(false);
        }
      }
    };
    fetchData();
  }, [status, provider, from, to]);

  const totalRevenue = data.reduce((s: number, p: AdminPayment) => s + Number(p.amount), 0);
  const byProviderMap = data.reduce((acc: Record<string, number>, p: AdminPayment) => {
    acc[p.provider] = (acc[p.provider] || 0) + Number(p.amount);
    return acc;
  }, {} as Record<string, number>);
  const byProvider = Object.entries(byProviderMap).map(([provider, total]) => ({ provider, total }));

  const showLoading = initialLoading || (refreshing && data.length === 0);

  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Payments</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">All payment transactions</p>
        </div>
        <div className="flex items-center gap-2">
          {refreshing && data.length > 0 && (
            <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
          )}
          <a
            href={getPaymentsExportUrl({ status: status || undefined, provider: provider || undefined, from, to })}
            download
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
        </div>
      </div>

      <PaymentSummaryCards totalRevenue={totalRevenue} byProvider={byProvider} loading={showLoading} />
      <PaymentFilters status={status} provider={provider} from={from} to={to} onStatusChange={setStatus} onProviderChange={setProvider} onFromChange={setFrom} onToChange={setTo} />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <AdminPaymentsTable data={data} loading={showLoading} onSelect={setSelectedId} />

      {meta && (
        <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
          Page {meta.page} of {meta.totalPages} ({meta.total} total)
        </div>
      )}

      <PaymentDetailModal paymentId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
