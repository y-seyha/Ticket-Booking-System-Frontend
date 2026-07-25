export interface AdminRefundAccountProfile {
  firstName: string | null;
  lastName: string | null;
}

export interface AdminRefundAccount {
  email: string;
  profile: AdminRefundAccountProfile | null;
}

export interface AdminRefundShowtime {
  startTime: string;
  movie: { title: string } | null;
}

export interface AdminRefundPayment {
  provider: string;
  amount: number;
  status: string;
}

export interface AdminRefundBooking {
  id: string;
  bookingCode: string;
  totalPrice: number;
  account: AdminRefundAccount | null;
  showtime: AdminRefundShowtime | null;
  payment: AdminRefundPayment | null;
}

export interface AdminRefundSeat {
  seatRow: string;
  seatNumber: number;
  seatType: string;
}

export interface AdminRefund {
  id: string;
  qrCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  booking: AdminRefundBooking | null;
  seat: AdminRefundSeat | null;
}

export interface AdminRefundListResponse {
  data: AdminRefund[];
  meta: {
    total: number;
  };
}

export interface RefundFilters {
  search?: string;
  from?: string;
  to?: string;
}
