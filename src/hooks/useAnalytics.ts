'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { event, pageview, trackInteraction } from '@/lib/analytics/ga4';

export function usePageViewTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url, document.title);
  }, [pathname, searchParams]);
}

export function useAnalytics() {
  return {
    trackEvent: useCallback(
      (name: string, params?: Record<string, unknown>) => event(name, params),
      [],
    ),
    trackInteraction: useCallback(
      (category: string, action: string, label?: string, value?: number) =>
        trackInteraction(category, action, label, value),
      [],
    ),
  };
}
