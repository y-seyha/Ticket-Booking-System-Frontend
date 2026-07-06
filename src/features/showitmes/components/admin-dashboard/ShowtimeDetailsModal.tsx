"use client";

import React, { useMemo, useState } from "react";
import { Showtime } from "../../showtimes.types";
import {
  X,
  Calendar,
  Film,
  Monitor,
  ShieldCheck,
  DollarSign,
  Clock,
  Languages,
  ZoomIn,
  ZoomOut,
  Armchair,
} from "lucide-react";

interface ComputedSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  surcharge: number;
}

interface ComputedShowtimePayload {
  id: string;
  movieId: string;
  screenId: string;
  startTime: string | Date;
  endTime: string | Date;
  basePrice: string | number;
  status: string;
  movie: {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    language: string;
    poster?: {
      url: string;
    };
  };
  screen: {
    id: string;
    name: string;
    type: "STANDARD" | "VIP" | "IMAX" | "THREE_D";
    theater: {
      id: string;
      name: string;
      phone: string;
      email: string;
      location: string;
      city: string;
    };
    seats: ComputedSeat[];
  };
}

interface ShowtimeDetailsModalProps {
  isOpen: boolean;
  showtime: Showtime | null | undefined;
  onClose: () => void;
}

function OriginalOrParsedPrice(val: string | number): string {
  const num = Number(val);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

export function ShowtimeDetailsModal({
  isOpen,
  showtime,
  onClose,
}: ShowtimeDetailsModalProps) {
  const [zoomScale, setZoomScale] = useState<number>(1);

  const ctx = (showtime ?? {}) as unknown as ComputedShowtimePayload;
  const screenSeats = ctx.screen?.seats;

  const rowsMap = useMemo(() => {
    const map: Record<string, ComputedSeat[]> = {};
    if (!screenSeats) return map;

    screenSeats.forEach((seat) => {
      if (!map[seat.seatRow]) {
        map[seat.seatRow] = [];
      }
      map[seat.seatRow].push(seat);
    });

    Object.keys(map).forEach((rowKey) => {
      map[rowKey].sort((a, b) => a.seatNumber - b.seatNumber);
    });

    return map;
  }, [screenSeats]);

  const sortedRowKeys = useMemo(() => {
    return Object.keys(rowsMap).sort((a, b) => a.localeCompare(b));
  }, [rowsMap]);

  if (!isOpen || !showtime) return null;

  const getSeatStatusClasses = (
    status: "AVAILABLE" | "LOCKED" | "BOOKED",
    type: "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR",
  ) => {
    switch (status) {
      case "BOOKED":
        return "bg-zinc-100 text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700 border-zinc-200 dark:border-zinc-800 cursor-not-allowed opacity-40";
      case "LOCKED":
        return "bg-amber-500 text-white border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse cursor-not-allowed";
      case "AVAILABLE":
      default:
        switch (type) {
          case "VIP":
            return "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-800/60 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:scale-105";
          case "COUPLE":
            return "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all transform hover:scale-105";
          case "WHEELCHAIR":
            return "bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/40 dark:border-sky-800/60 dark:text-sky-400 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all transform hover:scale-105";
          case "STANDARD":
          default:
            return "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all transform hover:scale-105";
        }
    }
  };

  const formattedDate = new Date(ctx.startTime).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = `${new Date(ctx.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${new Date(ctx.endTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const movieTitle = ctx.movie?.title ?? "Unknown Movie";
  const theaterName = ctx.screen?.theater?.name ?? "Unknown Venue";
  const screenName = ctx.screen?.name ?? "Unknown Screen";
  const screenType = ctx.screen?.type ?? "STANDARD";
  const seatingCollection = ctx.screen?.seats ?? [];
  const totalSeatsCount = seatingCollection.length;
  const availableSeatsCount = seatingCollection.filter(
    (s) => s.status === "AVAILABLE",
  ).length;

  const posterSourceUrl = ctx.movie?.poster?.url;

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () =>
    setZoomScale((prev) => Math.max(prev - 0.15, 0.75));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* App Bar Block */}
        <div className="p-4 px-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-zinc-400 tracking-wider uppercase font-mono">
              Asset Auditor Matrix /
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {screenName} Live Status
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all border border-transparent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Multi-Pane Content Wrapper */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left Panel: Movie Details Profile Panel */}
          <div className="w-full lg:w-80 bg-zinc-50/60 dark:bg-zinc-900/20 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800 p-6 flex flex-col space-y-5 overflow-y-auto shrink-0">
            <div className="relative group rounded-2xl overflow-hidden shadow-md bg-zinc-200 dark:bg-zinc-800 aspect-2/3 w-44 lg:w-full mx-auto">
              {posterSourceUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={posterSourceUrl}
                  alt={movieTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
                  <Film className="h-10 w-10 stroke-1 mb-2 opacity-60" />
                  <span className="text-xs font-semibold">
                    No Artwork Available
                  </span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wide uppercase">
                {screenType}
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                {movieTitle}
              </h3>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />{" "}
                  {ctx.movie?.durationMinutes ?? "N/A"}m
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 uppercase tracking-wider text-[10px] bg-zinc-200/60 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded-sm font-bold">
                  <Languages className="h-2.5 w-2.5" />{" "}
                  {ctx.movie?.language ?? "EN"}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4 text-center lg:text-left border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
              {ctx.movie?.description ??
                "No summary details registered inside metadata repositories."}
            </p>

            <div className="mt-auto space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Operational Venue
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {theaterName}
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">
                {ctx.screen?.theater?.location}, {ctx.screen?.theater?.city}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Seating Blueprint Engine */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col justify-between bg-white dark:bg-zinc-950">
            {/* Live Analytics Banner Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 shrink-0">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Date Track
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block truncate">
                    {formattedDate}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block truncate">
                    {formattedTime}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                <Monitor className="h-4 w-4 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Hall Target
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block truncate">
                    {screenName}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-500 block truncate uppercase tracking-widest">
                    {ctx.status}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Base Rate
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                    ${OriginalOrParsedPrice(ctx.basePrice)}
                  </span>
                  <span className="text-[9px] text-zinc-400 block truncate">
                    Before category offsets
                  </span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Availability
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    {availableSeatsCount} Open
                  </span>
                  <span className="text-[10px] text-zinc-400 block">
                    Of {totalSeatsCount} allocations
                  </span>
                </div>
              </div>
            </div>

            {/* Main Interactive Cinema Arena View */}
            <div className="border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/10 rounded-2xl p-6 relative flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Scale Modifier Controls */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 0.75}
                  className="p-1 hover:bg-zinc-100 disabled:opacity-30 rounded-md text-zinc-500"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-600 w-8 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 1.4}
                  className="p-1 hover:bg-zinc-100 disabled:opacity-30 rounded-md text-zinc-500"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <div className="w-full max-w-xl mx-auto mb-14 text-center shrink-0 pt-4">
                <div className="h-1.5 w-full bg-zinc-300 dark:bg-zinc-700 rounded-full mb-2" />
                <span className="text-[9px] font-black text-zinc-400 tracking-[0.4em] uppercase">
                  SCREEN STAGE
                </span>
              </div>

              {/* Native Scrollable & Adaptive Layout Container */}
              <div className="flex-1 overflow-auto flex justify-start items-start p-4">
                <div
                  className="flex flex-col mx-auto transition-all duration-200"
                  style={{ gap: `${12 * zoomScale}px` }}
                >
                  {sortedRowKeys.map((rowName) => (
                    <div
                      key={rowName}
                      className="flex items-center justify-center"
                      style={{ gap: `${16 * zoomScale}px` }}
                    >
                      {/* Left Row Identifier badge */}
                      <div
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 flex items-center justify-center gap-1 font-black text-zinc-400 shrink-0 select-none"
                        style={{
                          height: `${36 * zoomScale}px`,
                          paddingLeft: `${8 * zoomScale}px`,
                          paddingRight: `${8 * zoomScale}px`,
                          fontSize: `${10 * zoomScale}px`,
                          minWidth: `${64 * zoomScale}px`,
                        }}
                      >
                        <span>
                          {rowsMap[rowName][0]?.seatType.substring(0, 3)}
                        </span>
                        <span>{rowName}</span>
                      </div>

                      {/* Active Seats Matrix */}
                      <div
                        className="flex items-center shrink-0"
                        style={{ gap: `${6 * zoomScale}px` }}
                      >
                        {rowsMap[rowName].map((seat) => {
                          const isCouple = seat.seatType === "COUPLE";
                          const w = isCouple ? 64 * zoomScale : 36 * zoomScale;
                          const h = 36 * zoomScale;

                          return (
                            <div
                              key={seat.id}
                              className={`flex items-center justify-center rounded-lg border cursor-pointer transition-all ${getSeatStatusClasses(
                                seat.status,
                                seat.seatType,
                              )}`}
                              style={{ width: `${w}px`, height: `${h}px` }}
                            >
                              <div className="relative w-full h-full flex items-center justify-center">
                                <Armchair
                                  style={{
                                    width: `${20 * zoomScale}px`,
                                    height: `${20 * zoomScale}px`,
                                  }}
                                />
                                <span
                                  className="absolute font-extrabold bg-white/80 dark:bg-zinc-900/80 px-0.5 rounded-xs bottom-0.5 text-zinc-800 dark:text-zinc-200 shadow-xs select-none"
                                  style={{
                                    fontSize: `${Math.max(7, 8 * zoomScale)}px`,
                                    lineHeight: 1,
                                  }}
                                >
                                  {seat.seatNumber}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Row Identifier badge */}
                      <div
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 flex items-center justify-center gap-1 font-black text-zinc-400 shrink-0 select-none"
                        style={{
                          height: `${36 * zoomScale}px`,
                          paddingLeft: `${8 * zoomScale}px`,
                          paddingRight: `${8 * zoomScale}px`,
                          fontSize: `${10 * zoomScale}px`,
                          minWidth: `${64 * zoomScale}px`,
                        }}
                      >
                        <span>{rowName}</span>
                        <span>
                          {rowsMap[rowName][0]?.seatType.substring(0, 3)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Map Key Indicator Legend */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 font-semibold bg-zinc-50/50 dark:bg-zinc-900/10 p-3 rounded-xl border dark:border-zinc-800 mt-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md bg-emerald-50 border border-emerald-300 flex items-center justify-center">
                  <Armchair className="h-2 w-2 text-emerald-600" />
                </span>
                <span>Regular</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md bg-indigo-50 border border-indigo-300 flex items-center justify-center">
                  <Armchair className="h-2 w-2 text-indigo-600" />
                </span>
                <span>VIP Premium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-7 rounded-md bg-rose-50 border border-rose-300 flex items-center justify-center gap-0.5">
                  <Armchair className="h-2 w-2 text-rose-600" />
                  <Armchair className="h-2 w-2 text-rose-600" />
                </span>
                <span>Couple Suite</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md bg-sky-50 border border-sky-300 flex items-center justify-center">
                  <Armchair className="h-2 w-2 text-sky-600" />
                </span>
                <span>Accessible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md bg-amber-500 border border-amber-400 animate-pulse flex items-center justify-center">
                  <Armchair className="h-2 w-2 text-white" />
                </span>
                <span>Locked/Held</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-40 flex items-center justify-center">
                  <Armchair className="h-2 w-2 text-zinc-400" />
                </span>
                <span className="opacity-70">Booked Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
