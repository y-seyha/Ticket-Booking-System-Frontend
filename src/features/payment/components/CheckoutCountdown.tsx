"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface CheckoutCountdownProps {
  expiresAt: string;
  onExpire: () => void;
}

export default function CheckoutCountdown({
  expiresAt,
  onExpire,
}: CheckoutCountdownProps) {
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const calculateTime = useCallback(() => {
    const difference = new Date(expiresAt).getTime() - Date.now();
    return difference <= 0 ? 0 : Math.floor(difference / 1000);
  }, [expiresAt]);

  const [timeLeft, setTimeLeft] = useState<number>(() => calculateTime());

  useEffect(() => {
    const tick = () => {
      const remaining = calculateTime();

      if (remaining <= 0) {
        setTimeLeft(0);
        onExpireRef.current();
        return true;
      }

      setTimeLeft(remaining);
      return false;
    };

    if (tick()) return;

    const id = setInterval(() => {
      if (tick()) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [calculateTime]);

  useEffect(() => {
    const initialTime = calculateTime();
    if (initialTime <= 0) {
      onExpireRef.current();
      return;
    }

    const intervalId = setInterval(() => {
      const remaining = calculateTime();

      if (remaining <= 0) {
        clearInterval(intervalId);
        setTimeLeft(0);
        onExpireRef.current();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 120;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-300 ${
        isUrgent
          ? "bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
          : "bg-zinc-900/40 border-zinc-800/80"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isUrgent ? "bg-red-500" : "bg-amber-500"
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isUrgent ? "bg-red-500" : "bg-amber-500"
            }`}
          ></span>
        </span>

        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-black tracking-wider = uppercase">
            Holding Your Seats
          </span>
          <span className="text-[10px] text-zinc-800 font-medium">
            Complete checkout before expiration
          </span>
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 font-mono text-sm font-bold px-2.5 py-1 rounded-lg ${
          isUrgent
            ? "text-red-400 bg-red-500/10"
            : "text-amber-400 bg-amber-500/10"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
