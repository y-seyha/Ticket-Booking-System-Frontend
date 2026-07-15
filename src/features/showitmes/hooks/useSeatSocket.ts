"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const WS_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/api\/v1\/?$/, "");

interface SeatEvent {
  seatId: string;
  seatIds: string[];
  showtimeId: string;
}

export interface SeatSocketEvents {
  onSeatLocked?: (data: { seatId: string; showtimeId: string }) => void;
  onSeatUnlocked?: (data: { seatId: string; showtimeId: string }) => void;
  onSeatsBooked?: (data: { seatIds: string[]; showtimeId: string }) => void;
  onSeatsExpired?: (data: { seatIds: string[]; showtimeId: string }) => void;
}

export function useSeatSocket(
  showtimeId: string,
  events: SeatSocketEvents,
): { connected: boolean } {
  const socketRef = useRef<Socket | null>(null);
  const eventsRef = useRef(events);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    const socket = io(`${WS_BASE_URL}/seats`, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinShowtime", showtimeId);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("seat:locked", (data: SeatEvent) => {
      eventsRef.current.onSeatLocked?.(data);
    });

    socket.on("seat:unlocked", (data: SeatEvent) => {
      eventsRef.current.onSeatUnlocked?.(data);
    });

    socket.on("seat:booked", (data: SeatEvent) => {
      eventsRef.current.onSeatsBooked?.(data);
    });

    socket.on("seat:expired", (data: SeatEvent) => {
      eventsRef.current.onSeatsExpired?.(data);
    });

    return () => {
      socket.emit("leaveShowtime", showtimeId);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [showtimeId]);

  return { connected };
}
