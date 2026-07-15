"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import SeatMap from "@/features/showitmes/components/SeatMap";
import { posApi, type SeatMapSeat } from "../pos.api";
import { showtimesApi } from "@/features/showitmes/showtimes.api";
import type { PosSeat } from "../pos.types";
import type { Showtime } from "@/features/showitmes/showtimes.types";
import { Loader2, ArrowLeft, Clock } from "lucide-react";

interface StepSeatSelectionProps {
  showtime: Showtime;
  initialSelectedIds?: string[];
  onBack: () => void;
  onConfirm: (seats: PosSeat[]) => void;
}

export default function StepSeatSelection({
  showtime,
  initialSelectedIds,
  onBack,
  onConfirm,
}: StepSeatSelectionProps) {
  const [seats, setSeats] = useState<SeatMapSeat[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds ?? []);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedIdsRef = useRef(selectedIds);

  selectedIdsRef.current = selectedIds;

  const refreshSeatLayout = useCallback(async () => {
    try {
      const data = await posApi.getSeatMap(showtime.id);
      setSeats(data);
    } catch {}
  }, [showtime.id]);

  const unlockAll = useCallback(async () => {
    const ids = selectedIdsRef.current;
    if (ids.length === 0) return;
    setLocking(true);
    try {
      await Promise.all(ids.map((id) => posApi.unlockSeat(id, showtime.id)));
      setSelectedIds([]);
      await refreshSeatLayout();
    } catch {}
    setLocking(false);
  }, [showtime.id, refreshSeatLayout]);

  const fetchCartAndSetTimer = useCallback(async (seatsData?: SeatMapSeat[]) => {
    try {
      const cart = await showtimesApi.getCart();
      if (cart.items.length > 0) {
        const cartSeatIds = cart.items.map((item) => item.seat.id);
        if (seatsData) {
          const activeIds = seatsData
            .filter((s) => cartSeatIds.includes(s.id))
            .map((s) => s.id);
          setSelectedIds(activeIds);
        }
        const earliestExpiry = Math.min(
          ...cart.items.map((item) => new Date(item.expiresAt).getTime()),
        );
        const secondsLeft = Math.max(
          0,
          Math.floor((earliestExpiry - Date.now()) / 1000),
        );
        setTimeLeft(secondsLeft > 0 ? secondsLeft : null);
      } else {
        setSelectedIds([]);
        setTimeLeft(null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await posApi.getSeatMap(showtime.id);
        if (!cancelled) {
          setSeats(data);
          await fetchCartAndSetTimer(data);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [showtime.id, fetchCartAndSetTimer]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      unlockAll();
      setTimeLeft(null);
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, unlockAll]);

  const handleToggle = async (seatId: string) => {
    if (locking) return;
    setLocking(true);

    try {
      if (selectedIds.includes(seatId)) {
        await posApi.unlockSeat(seatId, showtime.id);
        setSelectedIds((prev) => prev.filter((id) => id !== seatId));
      } else {
        const seat = seats.find((s) => s.id === seatId);
        if (!seat || seat.status !== "AVAILABLE") return;
        await posApi.lockSeat(seatId, showtime.id);
        setSelectedIds((prev) => [...prev, seatId]);
      }
      const refreshed = await posApi.getSeatMap(showtime.id);
      setSeats(refreshed);
      await fetchCartAndSetTimer(refreshed);
    } catch {
      // silently fail
    } finally {
      setLocking(false);
    }
  };

  const handleConfirm = () => {
    const selectedSeats: PosSeat[] = selectedIds
      .map((id) => {
        const s = seats.find((seat) => seat.id === id);
        if (!s) return null;
        return {
          id: s.id,
          seatRow: s.seatRow,
          seatNumber: s.seatNumber,
          posX: s.posX,
          posY: s.posY,
          seatType: s.seatType,
          status: "AVAILABLE" as const,
          surcharge: s.surcharge,
        };
      })
      .filter(Boolean) as PosSeat[];

    onConfirm(selectedSeats);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-lg font-black text-white uppercase tracking-wide mt-2">
            Select Seats
          </h2>
          <p className="text-sm text-zinc-500">
            {showtime.movie.title} —{" "}
            {new Date(showtime.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
          )}
          <div className="text-right">
            <p className="text-xs text-zinc-600">Selected</p>
            <p className="text-2xl font-black text-white">{selectedIds.length}</p>
          </div>
        </div>
      </div>

      <SeatMap
        seats={seats}
        selectedIds={selectedIds}
        onToggleSeat={handleToggle}
      />

      <div className="flex justify-end">
        <button
          onClick={handleConfirm}
          disabled={selectedIds.length === 0}
          className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
        >
          Confirm {selectedIds.length > 0 ? `${selectedIds.length} Seat${selectedIds.length > 1 ? "s" : ""}` : "Seats"}
        </button>
      </div>
    </div>
  );
}
