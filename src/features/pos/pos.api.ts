import { apiRequest } from "@/lib/config/axios";
import type { Movie } from "@/features/movies/movie.type";
import { showtimesApi, type RawSeat } from "@/features/showitmes/showtimes.api";
import { paymentApi } from "@/features/payment/payment.api";

export interface SeatMapSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  surcharge: number;
}

export interface CashierOrder {
  id: string;
  bookingCode: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  account: {
    id: string;
    email: string;
    profile?: { firstName: string; lastName: string } | null;
  };
  showtime: {
    startTime: string;
    movie: { title: string; durationMinutes: number; language: string };
    screen: { name: string; type: string; theater: { name: string; location: string } };
  };
  bookingSeats: Array<{
    id: string;
    price: number;
    seat: { seatRow: string; seatNumber: number; seatType: string };
    ticket?: { qrCode: string; status: string } | null;
  }>;
  payment: {
    provider: string;
    status: string;
    amount: number;
    paidAt: string | null;
  } | null;
}

export const posApi = {
  getMovies: (date: string) =>
    apiRequest<Movie[]>("get", "/showtimes/active/listings", undefined, {
      params: { status: "NOW_SHOWING", date },
    }),

  getShowtimes: (movieId: string) => showtimesApi.getByMovie(movieId),

  getSeatMap: async (showtimeId: string): Promise<SeatMapSeat[]> => {
    const raw = (await showtimesApi.getSeatMap(showtimeId)) as unknown as RawSeat[];
    return raw.map((s) => ({
      id: s.id,
      seatRow: s.seatRow,
      seatNumber: s.seatNumber,
      posX: s.posX,
      posY: s.posY,
      seatType: s.seatType,
      surcharge: Number(s.surcharge || 0),
      status:
        s.status === "BOOKED"
          ? "BOOKED"
          : s.status === "LOCKED"
            ? "LOCKED"
            : "AVAILABLE",
    }));
  },

  lockSeat: (seatId: string, showtimeId: string) =>
    showtimesApi.lockSeat({ seatId, showtimeId }),

  unlockSeat: (seatId: string, showtimeId: string) =>
    showtimesApi.unlockSeat({ seatId, showtimeId }),

  clearCart: () => showtimesApi.clearCart(),

  checkout: (paymentProvider: "CASH" | "KHQR") =>
    paymentApi.createCheckout({ paymentProvider }),

  payCash: (paymentId: string) => paymentApi.payCash({ paymentId }),

  getOrders: (params?: { startDate?: string; endDate?: string; movieTitle?: string }) =>
    apiRequest<CashierOrder[]>("get", "/tickets/orders", undefined, { params }),
};
