import { apiRequest } from '@/lib/config/axios';
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
  EventSummary,
} from './analytics.types';

export interface DateRangeParams {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface AnalyticsEventQuery {
  name?: string;
  category?: string;
  source?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>('get', '/dashboard/summary');
}

export function getRevenue(params?: DateRangeParams) {
  return apiRequest<RevenueResponse>('get', '/dashboard/revenue', undefined, { params });
}

export function getBookingStats(params?: DateRangeParams) {
  return apiRequest<BookingResponse>('get', '/dashboard/bookings', undefined, { params });
}

export function getUserStats(params?: DateRangeParams) {
  return apiRequest<UserResponse>('get', '/dashboard/users', undefined, { params });
}

export function getMoviePerformance(params?: DateRangeParams) {
  return apiRequest<MoviePerformance[]>('get', '/dashboard/movies', undefined, { params });
}

export function getFoodBeverageStats(params?: DateRangeParams) {
  return apiRequest<FoodBeverageResponse>('get', '/dashboard/food-beverage', undefined, { params });
}

export function getOccupancy(params?: DateRangeParams) {
  return apiRequest<OccupancyResponse>('get', '/dashboard/occupancy', undefined, { params });
}

export function getPeakTimes(params?: DateRangeParams) {
  return apiRequest<PeakTimesResponse>('get', '/dashboard/peak-times', undefined, { params });
}

export function trackEvent(body: {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  pageUrl?: string;
}) {
  return apiRequest<{ id: string; success: boolean }>('post', '/analytics/track', body);
}

export function getAnalyticsEvents(params?: AnalyticsEventQuery) {
  return apiRequest<AnalyticsEventListResponse>('get', '/analytics/events', undefined, { params });
}

export function getEventSummary(params?: DateRangeParams) {
  return apiRequest<EventSummary>('get', '/analytics/events/summary', undefined, { params });
}

export function getExportUrl(type: string, params?: DateRangeParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  const searchParams = new URLSearchParams({ type });
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);
  if (params?.groupBy) searchParams.set('groupBy', params.groupBy);
  return `${baseUrl}/analytics/reports/export?${searchParams.toString()}`;
}
