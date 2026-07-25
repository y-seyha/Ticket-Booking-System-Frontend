import { apiRequest } from '@/lib/config/axios';
import type { AdminPaymentListResponse, AdminPaymentDetail, PaymentAdminFilters } from './admin-payments.types';

export function listAllPayments(params?: PaymentAdminFilters): Promise<AdminPaymentListResponse> {
  return apiRequest<AdminPaymentListResponse>('get', '/payments/admin', undefined, { params });
}

export function getPaymentById(id: string): Promise<AdminPaymentDetail> {
  return apiRequest<AdminPaymentDetail>('get', `/payments/admin/${id}`);
}

export function getPaymentsExportUrl(params?: PaymentAdminFilters): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.provider) searchParams.set('provider', params.provider);
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);
  return `${baseUrl}/payments/admin/export?${searchParams.toString()}`;
}
