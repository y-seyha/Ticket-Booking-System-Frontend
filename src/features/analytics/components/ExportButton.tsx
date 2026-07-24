'use client';

import { Download } from 'lucide-react';
import { getExportUrl } from '../analytics.api';

interface ExportButtonProps {
  type: string;
  from?: string;
  to?: string;
  groupBy?: string;
  label?: string;
}

type GroupByValue = 'day' | 'week' | 'month' | 'year';

export function ExportButton({ type, from, to, groupBy, label = 'Export CSV' }: ExportButtonProps) {
  const handleExport = () => {
    const url = getExportUrl(type, { from, to, groupBy } as { from?: string; to?: string; groupBy?: 'day' | 'week' | 'month' | 'year' });
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
