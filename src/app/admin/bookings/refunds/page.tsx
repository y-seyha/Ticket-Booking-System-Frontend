'use client';

import { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { listAllRefunds, getRefundsExportUrl } from '@/features/refunds/refunds.api';
import type { AdminRefund, AdminRefundListResponse } from '@/features/refunds/refunds.types';
import { RefundSummaryCards } from '@/features/refunds/components/RefundSummaryCards';
import { RefundFilters } from '@/features/refunds/components/RefundFilters';
import { AdminRefundsTable } from '@/features/refunds/components/AdminRefundsTable';
import { RefundDetailModal } from '@/features/refunds/components/RefundDetailModal';
import { Download, AlertCircle } from 'lucide-react';

export default function AdminRefundsPage() {
  usePageTitle('Refunds');

  const [data, setData] = useState<AdminRefund[]>([]);
  const [meta, setMeta] = useState<AdminRefundListResponse['meta'] | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toLocaleDateString('en-CA');
  });
  const [to, setTo] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [selectedRefund, setSelectedRefund] = useState<AdminRefund | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoading) {
        setInitialLoading(true);
      } else {
        setRefreshing(true);
      }
      setError('');
      try {
        const res = await listAllRefunds({ search: debouncedSearch || undefined, from, to });
        if (!mountedRef.current) return;
        setData(res.data || []);
        setMeta(res.meta || null);
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        setData([]);
        setMeta(null);
        setError((err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as Error)?.message || 'Failed to load refunds');
      } finally {
        if (mountedRef.current) {
          setInitialLoading(false);
          setRefreshing(false);
        }
      }
    };
    fetchData();
  }, [debouncedSearch, from, to]);

  const totalRefunded = data.reduce((s: number, r: AdminRefund) => s + Number(r.booking?.payment?.amount || 0), 0);

  const showLoading = initialLoading || (refreshing && data.length === 0);

  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Refunds</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Refunded tickets overview</p>
        </div>
        <div className="flex items-center gap-2">
          {refreshing && data.length > 0 && (
            <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
          )}
          <a
            href={getRefundsExportUrl({ from, to })}
            download
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
        </div>
      </div>

      <RefundSummaryCards totalRefunded={totalRefunded} totalTickets={data.length} loading={showLoading} />
      <RefundFilters search={search} from={from} to={to} onSearchChange={setSearch} onFromChange={setFrom} onToChange={setTo} />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <AdminRefundsTable data={data} loading={showLoading} onSelect={setSelectedRefund} />

      {meta && (
        <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
          {meta.total} total refunded tickets
        </div>
      )}

      <RefundDetailModal refund={selectedRefund} onClose={() => setSelectedRefund(null)} />
    </div>
  );
}
