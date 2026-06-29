import { Showtime } from "@/app/movies/[id]/page";
import { apiRequest } from "@/lib/config/axios";

export interface RawSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";
  status: "ACTIVE" | "MAINTENANCE" | "LOCKED" | "BOOKED";
  surcharge: number;
}

interface SeatActionPayload {
  seatId: string;
  showtimeId: string;
}

export interface BackendCartResponse {
  user: { id: string; email: string };
  items: Array<{
    lockId: string;
    expiresAt: string;
    movie: { id: string; title: string };
    seat: { id: string; row: string; number: number; type: string };
  }>;
  summary: { itemCount: number; totalAmount: number };
}

export const showtimesApi = {
  getById: (id: string) => apiRequest<Showtime>("get", `/showtimes/${id}`),

  getSeatMap: (showtimeId: string) =>
    apiRequest<RawSeat[]>("get", `/seats/map/${showtimeId}`),

  lockSeat: (payload: SeatActionPayload) =>
    apiRequest<{ message?: string }>("post", `/seats/lock`, payload),

  unlockSeat: (payload: SeatActionPayload) =>
    apiRequest<{ message?: string }>(
      "delete",
      `/seats/unlock`,
      undefined, 
      { data: payload }, 
    ),

  getCart: () => apiRequest<BackendCartResponse>("get", `/seats/cart`),

  clearCart: () =>
    apiRequest<{ message?: string }>("delete", `/seats/cart/clear`),
};
