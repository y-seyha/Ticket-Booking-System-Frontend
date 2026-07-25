export interface AdminAccountProfile {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatar: string | null;
}

export interface AdminAccount {
  id: string;
  email: string;
  profile: AdminAccountProfile | null;
}

export interface AdminMovie {
  id: string;
  title: string;
  language: string;
  posterId: string | null;
}

export interface AdminTheater {
  id: string;
  name: string;
}

export interface AdminScreen {
  id: string;
  name: string;
  type: string;
  theater: AdminTheater | null;
}

export interface AdminShowtime {
  id: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  movie: AdminMovie | null;
  screen: AdminScreen | null;
}

export interface AdminSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  seatType: string;
}

export interface AdminTicketRef {
  id: string;
  qrCode: string;
  status: string;
  validatedAt: string | null;
}

export interface AdminBookingSeat {
  id: string;
  price: number;
  seat: AdminSeat | null;
  ticket: AdminTicketRef | null;
}

export interface AdminFoodItem {
  id: string;
  name: string;
  price: number;
}

export interface AdminBookingFoodItem {
  id: string;
  quantity: number;
  unitPrice: number;
  foodItem: AdminFoodItem | null;
}

export interface AdminPaymentRef {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  transactionRef: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  bookingCode: string;
  totalPrice: number;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  account: AdminAccount | null;
  showtime: AdminShowtime | null;
  bookingSeats: AdminBookingSeat[];
  foodItems: AdminBookingFoodItem[];
  payment: AdminPaymentRef | null;
  tickets: AdminTicketRef[];
}

export interface BookingMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminBookingListResponse {
  data: AdminBooking[];
  meta: BookingMeta;
}

export interface BookingFilters {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
