'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  DashboardSummary,
  RevenueResponse,
  BookingResponse,
  UserResponse,
  MoviePerformance,
  FoodBeverageResponse,
  OccupancyResponse,
  PeakTimesResponse,
  AnalyticsEventListResponse,
} from '../analytics.types';
import {
  getDashboardSummary,
  getRevenue,
  getBookingStats,
  getUserStats,
  getMoviePerformance,
  getFoodBeverageStats,
  getOccupancy,
  getPeakTimes,
  getAnalyticsEvents,
} from '../analytics.api';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardSummary(): AsyncState<DashboardSummary> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<DashboardSummary>>({
    data: null, loading: true, error: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getDashboardSummary();
      setState({ data, loading: false, error: null });
    } catch (err: unknown) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useRevenue(params?: { from?: string; to?: string; groupBy?: 'day' | 'week' | 'month' | 'year' }) {
  const [state, setState] = useState<AsyncState<RevenueResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getRevenue(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to, params?.groupBy]);

  return state;
}

export function useBookingStats(params?: { from?: string; to?: string }) {
  const [state, setState] = useState<AsyncState<BookingResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getBookingStats(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to]);

  return state;
}

export function useUserStats(params?: { from?: string; to?: string }) {
  const [state, setState] = useState<AsyncState<UserResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getUserStats(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to]);

  return state;
}

export function useMoviePerformance(params?: { from?: string; to?: string }) {
  const [state, setState] = useState<AsyncState<MoviePerformance[]>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getMoviePerformance(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to]);

  return state;
}

export function useFoodBeverageStats(params?: { from?: string; to?: string }) {
  const [state, setState] = useState<AsyncState<FoodBeverageResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getFoodBeverageStats(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to]);

  return state;
}

export function useOccupancy(params?: { from?: string; to?: string }) {
  const [state, setState] = useState<AsyncState<OccupancyResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getOccupancy(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to]);

  return state;
}

export function usePeakTimes(params?: { from?: string; to?: string }) {
  const [state, setState] = useState<AsyncState<PeakTimesResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getPeakTimes(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.from, params?.to]);

  return state;
}

export function useAnalyticsEvents(params?: {
  name?: string; category?: string; source?: string;
  from?: string; to?: string; page?: number; limit?: number;
}) {
  const [state, setState] = useState<AsyncState<AnalyticsEventListResponse>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState(prev => ({ ...prev, loading: true }));
    getAnalyticsEvents(params).then(data => {
      if (mounted) setState({ data, loading: false, error: null });
    }).catch(err => {
      if (mounted) setState({ data: null, loading: false, error: (err as Error).message });
    });
    return () => { mounted = false; };
  }, [params?.name, params?.category, params?.source, params?.from, params?.to, params?.page, params?.limit]);

  return state;
}
