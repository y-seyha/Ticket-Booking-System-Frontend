"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/auth.store";
import SeatMap from "@/features/showitmes/components/SeatMap";
import BookingPanel from "@/features/showitmes/components/BookingPanel";
import {
  showtimesApi,
  BackendCartResponse,
} from "@/features/showitmes/showtimes.api";
import { useSeatSocket } from "@/features/showitmes/hooks/useSeatSocket";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const router = useRouter();
  const { id } = useParams() as { id: string };

  // Extract user identity state to protect checkout access
  const user = useAuthStore((s) => s.user);

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateSeatStatuses = useCallback(
    (
      updater: (
        seats: Seat[],
      ) => { id: string; status: "AVAILABLE" | "LOCKED" | "BOOKED" }[],
    ) => {
      setShowtime((prev) => {
        if (!prev) return prev;
        const updates = updater(prev.screen.seats);
        const updateMap = new Map(updates.map((u) => [u.id, u.status]));
        return {
          ...prev,
          screen: {
            ...prev.screen,
            seats: prev.screen.seats.map((s) => ({
              ...s,
              status: updateMap.get(s.id) ?? s.status,
            })),
          },
        };
      });
    },
    [],
  );

  useSeatSocket(id, {
    onSeatLocked: (data) => {
      updateSeatStatuses((seats) =>
        seats
          .filter((s) => s.id === data.seatId && s.status === "AVAILABLE")
          .map((s) => ({ id: s.id, status: "LOCKED" as const })),
      );
    },

    onSeatUnlocked: (data) => {
      updateSeatStatuses((seats) =>
        seats
          .filter((s) => s.id === data.seatId && s.status === "LOCKED")
          .map((s) => ({ id: s.id, status: "AVAILABLE" as const })),
      );
    },

    onSeatsBooked: (data) => {
      const booked = new Set(data.seatIds);
      updateSeatStatuses((seats) =>
        seats
          .filter((s) => booked.has(s.id) && s.status === "LOCKED")
          .map((s) => ({ id: s.id, status: "BOOKED" as const })),
      );
    },

    onSeatsExpired: (data) => {
      const expired = new Set(data.seatIds);
      updateSeatStatuses((seats) =>
        seats
          .filter((s) => expired.has(s.id) && s.status !== "AVAILABLE")
          .map((s) => ({ id: s.id, status: "AVAILABLE" as const })),
      );
    },
  });

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
        const expired = selectedSeats;
        setSelectedSeats([]);
        setTimeLeft(null);
        updateSeatStatuses(() =>
          expired.map((s) => ({ id: s.id, status: "AVAILABLE" as const })),
        );
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

    if (!user) {
      toast.error(
        "Authentication required. Please log in to hold or reserve seats.",
      );
      router.push("/auth/login");
      return;
    }

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
        updateSeatStatuses(() => [{ id: seatId, status: "AVAILABLE" }]);
      } else {
        if (seat.status !== "AVAILABLE") {
          alert("This seat is currently unavailable.");
          return;
        }

        await showtimesApi.lockSeat(payload);
        setSelectedSeats((prev) => [...prev, { ...seat, status: "LOCKED" }]);
        updateSeatStatuses(() => [{ id: seatId, status: "LOCKED" }]);
      }
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
      const locked = selectedSeats;
      await showtimesApi.clearCart();
      setSelectedSeats([]);
      setTimeLeft(null);
      updateSeatStatuses(() =>
        locked.map((s) => ({ id: s.id, status: "AVAILABLE" as const })),
      );
    } catch (err) {
      console.error("Failed to clear cart session completely:", err);
    }
  };

  /**
   * Evaluates session security conditions before transferring context to the payment system
   */
  const handleProceedToFood = () => {
    if (!user) {
      toast.error(
        "Authentication required. Please log in to complete your ticket purchase.",
      );
      router.push("/auth/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to proceed.");
      return;
    }

    router.push(`/showtime/${id}/food`);
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

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-700/[0.07] rounded-full blur-[160px] pointer-events-none z-0" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10">
        <div className="mb-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push("/")}
                  className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="text-zinc-700" />

              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.back()}
                  className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                >
                  Movie
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="text-zinc-700" />

              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold tracking-wide">
                  Showtime
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/20 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-zinc-900/80 shadow-2xl relative overflow-hidden">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  1. Choose Seats
                </h2>
                {timeLeft !== null && (
                  <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    HELD: {formatTime(timeLeft)}
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
              onSubmit={handleProceedToFood}
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
