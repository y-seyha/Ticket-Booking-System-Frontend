export interface AdminBookingBasicAccount {
  email: string;
  profile: { firstName: string | null; lastName: string | null } | null;
}

export interface AdminPayment {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  transactionRef: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  booking: {
    id: string;
    bookingCode: string;
    totalPrice: number;
    status: string;
    account: AdminBookingBasicAccount | null;
    showtime: { startTime: string; movie: { title: string } | null } | null;
  } | null;
}

export interface AdminPaymentDetailSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  seatType: string;
}

export interface AdminPaymentDetailTicket {
  id: string;
  qrCode: string;
  status: string;
}

export interface AdminPaymentDetailBookingSeat {
  id: string;
  price: number;
  seat: AdminPaymentDetailSeat | null;
  ticket: AdminPaymentDetailTicket | null;
}

export interface AdminPaymentDetailFoodItem {
  id: string;
  quantity: number;
  unitPrice: number;
  foodItem: { id: string; name: string; price: number } | null;
}

export interface AdminPaymentDetailBooking {
  id: string;
  bookingCode: string;
  totalPrice: number;
  status: string;
  account: AdminBookingBasicAccount | null;
  showtime: {
    startTime: string;
    endTime: string;
    basePrice: number;
    movie: { id: string; title: string; language: string } | null;
    screen: {
      id: string;
      name: string;
      type: string;
      theater: { id: string; name: string } | null;
    } | null;
  } | null;
  bookingSeats: AdminPaymentDetailBookingSeat[];
  foodItems: AdminPaymentDetailFoodItem[];
}

export interface AdminPaymentDetail extends AdminPayment {
  booking: AdminPaymentDetailBooking | null;
}

export interface AdminPaymentListResponse {
  data: AdminPayment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentAdminFilters {
  status?: string;
  provider?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
