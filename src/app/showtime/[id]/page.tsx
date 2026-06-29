"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import SeatMap from "@/features/showitmes/components/SeatMap";
import BookingPanel from "@/features/showitmes/components/BookingPanel";
import {
  showtimesApi,
  BackendCartResponse,
} from "@/features/showitmes/showtimes.api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

type SeatType = "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";

interface Seat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: SeatType;
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  surcharge: number;
}

interface Movie {
  title: string;
  description: string | null;
  durationMinutes: number;
  language: string;
  releaseDate: Date;
  poster: { url: string } | null;
}

interface Showtime {
  id: string;
  movie: Movie;
  screen: {
    seats: Seat[];
  };
  basePrice: number;
  startTime: string;
}

interface RawSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: SeatType;
  status: "ACTIVE" | "MAINTENANCE" | "LOCKED" | "BOOKED";
  surcharge: number;
}

interface RawShowtime {
  id: string;
  basePrice: string | number;
  startTime: string;
  movie: {
    title: string;
    description: string | null;
    durationMinutes: number;
    language: string;
    releaseDate: string;
    poster: { url: string } | null;
  };
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ShowtimePage() {
  const { id } = useParams() as { id: string };
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refreshSeatLayout = useCallback(async () => {
    if (!id) return;
    try {
      const showtimeData = (await showtimesApi.getById(
        id,
      )) as unknown as RawShowtime;
      const liveSeats = (await showtimesApi.getSeatMap(
        id,
      )) as unknown as RawSeat[];

      if (!Array.isArray(liveSeats)) {
        console.error(
          "Expected array from seat layout map, but received:",
          liveSeats,
        );
        return;
      }

      const mappedSeats: Seat[] = liveSeats.map((s) => ({
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

      setShowtime({
        id: showtimeData.id,
        movie: {
          ...showtimeData.movie,
          releaseDate: new Date(showtimeData.movie.releaseDate),
        },
        basePrice: Number(showtimeData.basePrice),
        startTime: showtimeData.startTime,
        screen: {
          seats: mappedSeats,
        },
      });

      try {
        const cartData =
          (await showtimesApi.getCart()) as unknown as BackendCartResponse;

        if (
          cartData &&
          Array.isArray(cartData.items) &&
          cartData.items.length > 0
        ) {
          const activeCartSelections = mappedSeats.filter((seat) =>
            cartData.items.some((item) => item.seat.id === seat.id),
          );
          setSelectedSeats(activeCartSelections);

          const earliestExpiry = Math.min(
            ...cartData.items.map((item) => new Date(item.expiresAt).getTime()),
          );
          const secondsLeft = Math.max(
            0,
            Math.floor((earliestExpiry - Date.now()) / 1000),
          );

          setTimeLeft(secondsLeft > 0 ? secondsLeft : null);
        } else {
          setSelectedSeats([]);
          setTimeLeft(null);
        }
      } catch (cartErr) {
        console.warn("Could not synchronize user layout cart status:", cartErr);
        setSelectedSeats([]);
        setTimeLeft(null);
      }
    } catch (err) {
      console.error("Failed loading layout presentation records:", err);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const initLoad = async () => {
      setLoading(true);
      await refreshSeatLayout();
      if (isMounted) setLoading(false);
    };

    initLoad();
    return () => {
      isMounted = false;
    };
  }, [refreshSeatLayout]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      timerRef.current = setTimeout(() => {
        setSelectedSeats([]);
        setTimeLeft(null);
        refreshSeatLayout();
      }, 0);
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, refreshSeatLayout]);

  const handleToggle = async (seatId: string) => {
    if (!showtime) return;

    const seat = showtime.screen.seats.find((s) => s.id === seatId);
    if (!seat) return;

    const isAlreadySelected = selectedSeats.some((s) => s.id === seatId);
    const payload = { seatId, showtimeId: id };

    try {
      if (isAlreadySelected) {
        await showtimesApi.unlockSeat(payload);
        setSelectedSeats((prev) => {
          const updated = prev.filter((s) => s.id !== seatId);
          if (updated.length === 0) setTimeLeft(null);
          return updated;
        });
      } else {
        if (seat.status !== "AVAILABLE") {
          alert("This seat is currently unavailable.");
          return;
        }

        await showtimesApi.lockSeat(payload);
        setSelectedSeats((prev) => [...prev, { ...seat, status: "LOCKED" }]);
        if (selectedSeats.length === 0) setTimeLeft(60);
      }

      await refreshSeatLayout();
    } catch (err) {
      console.error(
        "Error communicating ticket locks with network service:",
        err,
      );
      const errorObj = err as AxiosErrorResponse;
      const serverMessage = errorObj?.response?.data?.message;
      alert(
        serverMessage || "This seat is unavailable or locked by another user.",
      );
    }
  };

  const handleClearCart = async () => {
    try {
      await showtimesApi.clearCart();
      setSelectedSeats([]);
      setTimeLeft(null);
      await refreshSeatLayout();
    } catch (err) {
      console.error("Failed to clear cart session completely:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-400">
        <div className="w-10 h-10 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500/80 animate-pulse">
          Loading Live Layout Map...
        </p>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-2 text-zinc-400">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm font-semibold">
          Showtime presentation not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 font-sans antialiased relative overflow-x-hidden">
      <Navbar />

      {/* Dynamic Scrolling Ambient Red Glow Aura Centerpieces */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-700/[0.07] rounded-full blur-[160px] pointer-events-none z-0" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-36 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/20 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-zinc-900/80 shadow-2xl relative overflow-hidden">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  1. Choose Seats
                </h2>
                {timeLeft !== null && (
                  <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg text-xs font-bold text-red-400 animate-pulse flex items-center gap-1.5 font-mono">
                    <span>⏰</span> HELD: {formatTime(timeLeft)}
                  </div>
                )}
              </div>

              <SeatMap
                seats={showtime.screen.seats}
                selectedIds={selectedSeats.map((s) => s.id)}
                onToggleSeat={handleToggle}
              />
            </div>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-28 transition-all duration-300">
            <BookingPanel
              onClearCart={handleClearCart}
              showtime={{
                ...showtime,
                seats: selectedSeats.map((s) => ({
                  id: s.id,
                  seatRow: s.seatRow,
                  seatNumber: s.seatNumber,
                  status: s.status,
                  finalPrice: showtime.basePrice + s.surcharge,
                })),
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
