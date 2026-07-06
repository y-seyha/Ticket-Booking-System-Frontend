import { apiRequest } from "@/lib/config/axios";
import {
  CreateShowtimeDto,
  Showtime,
  ShowtimeStatus,
  UpdateShowtimeDto,
} from "./showtimes.types";

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
    apiRequest<{ message?: string }>("delete", `/seats/unlock`, undefined, {
      data: payload,
    }),

  getCart: () => apiRequest<BackendCartResponse>("get", `/seats/cart`),

  clearCart: () =>
    apiRequest<{ message?: string }>("delete", `/seats/cart/clear`),

  //-- admin operation
  getAll: async (): Promise<Showtime[]> => {
    return await apiRequest<Showtime[]>("get", "/showtimes");
  },

  getOne: async (id: string): Promise<Showtime> => {
    return await apiRequest<Showtime>("get", `/showtimes/${id}`);
  },

  create: async (dto: CreateShowtimeDto): Promise<Showtime> => {
    return await apiRequest<Showtime>("post", "/showtimes", dto);
  },

  update: async (id: string, dto: UpdateShowtimeDto): Promise<Showtime> => {
    return await apiRequest<Showtime>("patch", `/showtimes/${id}`, dto);
  },

  updateStatus: async (
    id: string,
    status: ShowtimeStatus,
  ): Promise<Showtime> => {
    return await apiRequest<Showtime>("patch", `/showtimes/${id}/status`, {
      status,
    });
  },

  delete: async (id: string): Promise<void> => {
    return await apiRequest<void>("delete", `/showtimes/${id}`);
  },
};
