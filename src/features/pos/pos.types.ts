import type { Movie } from "@/features/movies/movie.type";
import type { Showtime } from "@/features/showitmes/showtimes.types";
import type { FoodItem } from "@/features/foods-and-beverage/foods-and-beverage.types";

export type PosStepId =
  | "movie"
  | "showtime"
  | "seats"
  | "review"
  | "payment"
  | "confirmation";

export interface PosStep {
  id: PosStepId;
  label: string;
}

export const POS_STEPS: PosStep[] = [
  { id: "movie", label: "Movie" },
  { id: "showtime", label: "Showtime" },
  { id: "seats", label: "Seats" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Done" },
];

export type SeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED";
export type SeatType = "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";

export interface PosSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: SeatType;
  status: SeatStatus;
  surcharge: number;
}

export interface PosFoodItem {
  item: FoodItem;
  quantity: number;
}

export type PaymentMethod = "CASH" | "KHQR";

export interface PosCompletedOrder {
  bookingCode: string;
  bookingId: string;
  movieTitle: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
}

export interface KhqrData {
  qrCode: string;
  expiresAt: string;
  paymentId: string;
  bookingCode: string;
  bookingId: string;
  totalAmount: number;
}

export interface PosState {
  step: PosStepId;
  movie: Movie | null;
  showtime: Showtime | null;
  seats: PosSeat[];
  foods: PosFoodItem[];
  paymentMethod: PaymentMethod;
  bookingCode: string | null;
  bookingId: string | null;
  isProcessing: boolean;
  orders: PosCompletedOrder[];
  khqrData: KhqrData | null;
  selectedDate: string;
}
