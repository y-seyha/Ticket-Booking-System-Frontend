import { apiRequest } from '@/lib/config/axios';
import type { AdminRefundListResponse, AdminRefund, RefundFilters } from './refunds.types';

export function listAllRefunds(params?: RefundFilters): Promise<AdminRefundListResponse> {
  return apiRequest<AdminRefundListResponse>('get', '/refunds/admin', undefined, { params });
}

export function refundTicket(ticketId: string): Promise<AdminRefund> {
  return apiRequest<AdminRefund>('patch', `/refunds/admin/${ticketId}/refund`);
}

export function getRefundsExportUrl(params?: RefundFilters): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);
  return `${baseUrl}/refunds/admin/export?${searchParams.toString()}`;
}
