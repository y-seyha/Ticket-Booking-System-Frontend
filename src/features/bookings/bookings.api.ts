import { apiRequest } from '@/lib/config/axios';
import type { AdminBookingListResponse, AdminBooking, BookingFilters } from './bookings.types';

export function listAllBookings(params?: BookingFilters): Promise<AdminBookingListResponse> {
  return apiRequest<AdminBookingListResponse>('get', '/bookings/admin', undefined, { params });
}

export function getBookingById(id: string): Promise<AdminBooking> {
  return apiRequest<AdminBooking>('get', `/bookings/admin/${id}`);
}

export function cancelBooking(id: string): Promise<AdminBooking> {
  return apiRequest<AdminBooking>('patch', `/bookings/admin/${id}/cancel`);
}

export function getBookingsExportUrl(params?: BookingFilters): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);
  return `${baseUrl}/bookings/admin/export?${searchParams.toString()}`;
}
