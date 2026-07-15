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
};
