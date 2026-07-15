"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { Movie } from "@/features/movies/movie.type";
import type { Showtime } from "@/features/showitmes/showtimes.types";
import type {
  PosState,
  PosStepId,
  PosSeat,
  PaymentMethod,
  PosCompletedOrder,
  KhqrData,
} from "./pos.types";
import { posApi } from "./pos.api";
import { mockFoods, type MockFoodItem } from "./data/mockFoods";

const ORDERS_KEY = "pos-completed-orders";

function loadOrders(): PosCompletedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: PosCompletedOrder[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {}
}

function getStepIndex(step: PosStepId): number {
  const map: Record<PosStepId, number> = {
    movie: 0,
    showtime: 1,
    seats: 2,
    review: 3,
    payment: 4,
    confirmation: 5,
  };
  return map[step];
}

export function usePos() {
  const [state, setState] = useState<PosState>({
    step: "movie",
    movie: null,
    showtime: null,
    seats: [],
    foods: [],
    paymentMethod: "CASH",
    bookingCode: null,
    bookingId: null,
    isProcessing: false,
    orders: loadOrders(),
    khqrData: null,
    selectedDate: "",
  });

  const goTo = useCallback((step: PosStepId) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      const idx = getStepIndex(prev.step);
      if (idx <= 0) return prev;
      const steps: PosStepId[] = [
        "movie",
        "showtime",
        "seats",
        "review",
        "payment",
        "confirmation",
      ];
      return { ...prev, step: steps[idx - 1] };
    });
  }, []);

  const selectMovie = useCallback((movie: Movie, date: string) => {
    setState((prev) => ({
      ...prev,
      movie,
      showtime: null,
      seats: [],
      selectedDate: date,
      step: "showtime",
    }));
  }, []);

  const setSelectedDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, selectedDate: date }));
  }, []);

  const selectShowtime = useCallback((showtime: Showtime) => {
    setState((prev) => ({
      ...prev,
      showtime,
      seats: [],
      step: "seats",
    }));
  }, []);

  const selectSeats = useCallback((seats: PosSeat[]) => {
    setState((prev) => ({
      ...prev,
      seats,
      step: "review",
    }));
  }, []);

  const addFood = useCallback((item: MockFoodItem) => {
    setState((prev) => {
      const existing = prev.foods.find((f) => f.item.id === item.id);
      if (existing) {
        return {
          ...prev,
          foods: prev.foods.map((f) =>
            f.item.id === item.id ? { ...f, quantity: f.quantity + 1 } : f,
          ),
        };
      }
      return {
        ...prev,
        foods: [...prev.foods, { item, quantity: 1 }],
      };
    });
  }, []);

  const removeFood = useCallback((itemId: string) => {
    setState((prev) => {
      const existing = prev.foods.find((f) => f.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return {
          ...prev,
          foods: prev.foods.filter((f) => f.item.id !== itemId),
        };
      }
      return {
        ...prev,
        foods: prev.foods.map((f) =>
          f.item.id === itemId ? { ...f, quantity: f.quantity - 1 } : f,
        ),
      };
    });
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const processPayment = useCallback(async (): Promise<boolean> => {
    const { showtime, movie, paymentMethod } = state;
    if (!showtime || !movie) return false;

    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      const checkoutRes = await posApi.checkout(paymentMethod);

      if (paymentMethod === "CASH") {
        await posApi.payCash(checkoutRes.paymentId);
        await posApi.clearCart();

        const order: PosCompletedOrder = {
          bookingCode: checkoutRes.bookingCode,
          bookingId: checkoutRes.bookingId,
          movieTitle: movie.title,
          showtime: showtime.startTime,
          seats: state.seats.map((s) => `${s.seatRow}${s.seatNumber}`),
          totalAmount: checkoutRes.totalAmount,
          paymentMethod,
          paidAt: new Date().toISOString(),
        };

        setState((prev) => {
          const orders = [order, ...prev.orders];
          saveOrders(orders);
          return {
            ...prev,
            bookingCode: checkoutRes.bookingCode,
            bookingId: checkoutRes.bookingId,
            isProcessing: false,
            step: "confirmation",
            orders,
          };
        });
      } else {
        const khqrData: KhqrData = {
          qrCode: checkoutRes.qrCode || "",
          expiresAt: checkoutRes.paymentExpiresAt,
          paymentId: checkoutRes.paymentId,
          bookingCode: checkoutRes.bookingCode,
          bookingId: checkoutRes.bookingId,
          totalAmount: checkoutRes.totalAmount,
        };
        setState((prev) => ({
          ...prev,
          khqrData,
          isProcessing: false,
        }));
      }

      return true;
    } catch (err) {
      const error = err as AxiosError<Record<string, unknown>>;
      const msg = error.response?.data as { message?: string } | undefined;
      toast.error(msg?.message || "Payment failed. Please try again.");
      setState((prev) => ({ ...prev, isProcessing: false }));
      return false;
    }
  }, [state]);

  const confirmKhqrPayment = useCallback(async () => {
    const { movie, showtime, seats, khqrData } = state;
    if (!movie || !showtime || !khqrData) return;

    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      await posApi.clearCart();

      const order: PosCompletedOrder = {
        bookingCode: khqrData.bookingCode,
        bookingId: khqrData.bookingId,
        movieTitle: movie.title,
        showtime: showtime.startTime,
        seats: seats.map((s) => `${s.seatRow}${s.seatNumber}`),
        totalAmount: khqrData.totalAmount,
        paymentMethod: "KHQR",
        paidAt: new Date().toISOString(),
      };

      setState((prev) => {
        const orders = [order, ...prev.orders];
        saveOrders(orders);
        return {
          ...prev,
          bookingCode: khqrData.bookingCode,
          bookingId: khqrData.bookingId,
          khqrData: null,
          isProcessing: false,
          step: "confirmation",
          orders,
        };
      });
    } catch (err) {
      const error = err as AxiosError<Record<string, unknown>>;
      const msg = error.response?.data as { message?: string } | undefined;
      toast.error(msg?.message || "Failed to confirm payment.");
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  }, [state]);

  const cancelKhqrPayment = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      khqrData: null,
      step: "payment",
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: "movie",
      movie: null,
      showtime: null,
      seats: [],
      foods: [],
      paymentMethod: "CASH",
      bookingCode: null,
      bookingId: null,
      isProcessing: false,
      khqrData: null,
      selectedDate: "",
    }));
  }, []);

  const totalSeatPrice = state.seats.reduce(
    (sum, s) => sum + s.surcharge,
    0,
  );
  const totalBasePrice = state.showtime
    ? Number(state.showtime.basePrice) * state.seats.length
    : 0;
  const totalFoodPrice = state.foods.reduce(
    (sum, f) => sum + f.item.price * f.quantity,
    0,
  );
  const grandTotal = totalBasePrice
    ? totalBasePrice + totalSeatPrice + totalFoodPrice
    : 0;

  return {
    ...state,
    goTo,
    goBack,
    selectMovie,
    setSelectedDate,
    selectShowtime,
    selectSeats,
    addFood,
    removeFood,
    setPaymentMethod,
    processPayment,
    confirmKhqrPayment,
    cancelKhqrPayment,
    reset,
    totalBasePrice,
    totalSeatPrice,
    totalFoodPrice,
    grandTotal,
    mockFoods,
    currentStepIndex: getStepIndex(state.step),
  };
}
