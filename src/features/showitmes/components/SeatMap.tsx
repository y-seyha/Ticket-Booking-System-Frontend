"use client";

import { useState } from "react";

type SeatType = "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";

interface TheaterSeatIconProps {
  isSelected: boolean;
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  seatType: SeatType;
}

function TheaterSeatIcon({
  isSelected,
  status,
  seatType,
}: TheaterSeatIconProps) {
  let fillClass = "";

  if (status === "BOOKED" || status === "LOCKED") {
    fillClass = "fill-zinc-900/90 stroke-zinc-800 border border-zinc-800/80";
  } else if (isSelected) {
    fillClass =
      "fill-white stroke-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]";
  } else {
    switch (seatType) {
      case "VIP":
        fillClass = "fill-red-950/40 stroke-red-500";
        break;
      case "COUPLE":
        fillClass = "fill-red-900/30 stroke-red-600";
        break;
      case "WHEELCHAIR":
        fillClass = "fill-zinc-800 stroke-zinc-400";
        break;
      default:
        fillClass = "fill-zinc-800 stroke-zinc-400";
        break;
    }
  }

  if (seatType === "WHEELCHAIR") {
    return (
      <svg
        className={`w-full h-full transition-all duration-200 ${fillClass} ${status !== "AVAILABLE" ? "text-zinc-700" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="6" r="2" strokeWidth="1.8" />
        <path
          d="M9 10h4.5l1.5 4.5M10 11v4l-2 3"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M14.5 14a3.5 3.5 0 1 1-3.5-3.5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (seatType === "COUPLE") {
    return (
      <svg
        className={`w-full h-full transition-all duration-200 ${fillClass}`}
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4C4 2.89543 4.89543 2 6 2H42C43.1046 2 44 2.89543 44 4V15C44 15.5523 43.5523 16 43 16H5C4.44772 16 4 15.5523 4 15V4Z"
          strokeWidth="1.8"
        />
        <path
          d="M3 14C3 12.8954 3.89543 12 5 12H43C44.1046 12 45 12.8954 45 14V17C45 18.6569 43.6569 20 42 20H6C4.34315 20 3 18.6569 3 17V14Z"
          strokeWidth="1.8"
        />
        <line
          x1="24"
          y1="3"
          x2="24"
          y2="19"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <path
          d="M1 11C1 9.89543 1.89543 9 3 9V16C1.89543 16 1 15.1046 1 14V11Z"
          strokeWidth="1.8"
        />
        <path
          d="M45 9C46.1046 9 47 9.89543 47 11V14C47 15.1046 46.1046 16 45 16V9Z"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`w-full h-full transition-all duration-200 ${fillClass}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V15C19 15.5523 18.5523 16 18 16H6C5.44772 16 5 15.5523 5 15V4Z"
        strokeWidth="1.8"
      />
      <path
        d="M4 14C4 12.8954 4.89543 12 6 12H18C19.1046 12 20 12.8954 20 14V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V14Z"
        strokeWidth="1.8"
      />
      <path
        d="M2 11C2 9.89543 2.89543 9 4 9V16C2.89543 16 2 15.1046 2 14V11Z"
        strokeWidth="1.8"
      />
      <path
        d="M20 9C21.1046 9 22 9.89543 22 11V14C22 15.1046 21.1046 16 20 16V9Z"
        strokeWidth="1.8"
      />
    </svg>
  );
}

interface SeatMapProps {
  seats: Array<{
    id: string;
    seatRow: string;
    seatNumber: number;
    posX: number;
    posY: number;
    seatType: SeatType;
    status: "AVAILABLE" | "LOCKED" | "BOOKED";
    surcharge: number;
  }>;
  selectedIds: string[];
  onToggleSeat: (seatId: string) => void;
}

export default function SeatMap({
  seats,
  selectedIds,
  onToggleSeat,
}: SeatMapProps) {
  const [zoom, setZoom] = useState<number>(1);

  const rowsMap: { [key: string]: typeof seats } = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.seatRow]) rowsMap[seat.seatRow] = [];
    rowsMap[seat.seatRow].push(seat);
  });

  const sortedRows = Object.keys(rowsMap).sort();
  const maxSeatNum = Math.max(...seats.map((s) => s.seatNumber), 1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.75));

  return (
    <div className="w-full relative rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md shadow-2xl p-4 sm:p-8 overflow-hidden">
      {/* Zoom Controls Bar at top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center bg-zinc-900/95 border border-zinc-800 p-1 rounded-xl shadow-xl backdrop-blur-sm">
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          title="Zoom Out"
        >
          －
        </button>
        <span className="text-[10px] text-zinc-500 font-mono px-1 select-none w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          title="Zoom In"
        >
          ＋
        </button>
      </div>

      {/* Screen Guide Line */}
      <div className="relative w-full max-w-xs mx-auto mb-16 pt-6 sm:pt-2">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <p className="text-center text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mt-3">
          SCREEN
        </p>
      </div>

      {/* Responsive Viewport Scrollbox wrapper */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-2">
        <div
          className="flex flex-col gap-3.5 min-w-max items-center justify-center py-6 px-4 bg-zinc-950/15 rounded-xl border border-zinc-900/30 transition-transform origin-center duration-150"
          style={{ transform: `scale(${zoom})` }}
        >
          {sortedRows.map((rowName) => {
            const rowSeats = rowsMap[rowName];

            return (
              <div key={rowName} className="flex items-center gap-4">
                <div className="w-5 text-[11px] font-black text-zinc-600 text-center select-none">
                  {rowName}
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: maxSeatNum }).map((_, index) => {
                    const currentSeatNumber = index + 1;
                    const matchingSeat = rowSeats.find(
                      (s) => s.seatNumber === currentSeatNumber,
                    );

                    const isThirdBlockGap =
                      currentSeatNumber > 1 &&
                      (currentSeatNumber - 1) % 3 === 0 &&
                      currentSeatNumber <= maxSeatNum;

                    const isSelected = matchingSeat
                      ? selectedIds.includes(matchingSeat.id)
                      : false;
                    const isClickable =
                      matchingSeat &&
                      (matchingSeat.status === "AVAILABLE" || isSelected);

                    return (
                      <div key={index} className="flex items-center">
                        {isThirdBlockGap && (
                          <div className="w-5 pointer-events-none" />
                        )}

                        {matchingSeat ? (
                          <button
                            onClick={() => {
                              if (isClickable) {
                                onToggleSeat(matchingSeat.id);
                              }
                            }}
                            disabled={!isClickable}
                            className={`relative group transition-transform duration-100 ${
                              matchingSeat.seatType === "COUPLE"
                                ? "w-14 h-7"
                                : "w-7 h-7"
                            } ${
                              !isClickable
                                ? "cursor-not-allowed"
                                : "cursor-pointer hover:scale-105 active:scale-95"
                            }`}
                            title={`${matchingSeat.seatRow}-${matchingSeat.seatNumber} (${matchingSeat.seatType})`}
                          >
                            <TheaterSeatIcon
                              isSelected={isSelected}
                              status={matchingSeat.status}
                              seatType={matchingSeat.seatType}
                            />

                            {/* Only render '✕' if locked by another user, hide if selected by this user */}
                            {matchingSeat.status !== "AVAILABLE" &&
                              !isSelected && (
                                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-red-600/70 pointer-events-none select-none">
                                  ✕
                                </span>
                              )}
                          </button>
                        ) : (
                          <div className="w-7 h-7 opacity-0 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="w-5 text-[11px] font-black text-zinc-600 text-center select-none">
                  {rowName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] w-full bg-zinc-900 my-8" />

      {/* Legend Grid */}
      <div className="flex flex-col gap-5 max-w-xl mx-auto text-xs text-zinc-400 font-semibold">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-800 border border-zinc-400 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-white rounded shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
            <span className="text-white">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[9px] text-red-600/60 font-black">
              ✕
            </div>
            <span className="text-zinc-600">Unavailable</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2.5 text-[11px]">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">
            <div className="w-3 h-3 bg-zinc-800 border border-zinc-400 rounded-sm" />
            <span>Standard</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">
            <div className="w-3 h-3 bg-red-950/40 border border-red-500 rounded-sm" />
            <span className="text-red-400">VIP</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">
            <div className="w-5 h-3 bg-red-900/30 border border-red-600 rounded-sm" />
            <span className="text-red-500">Couple Couch</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">
            <div className="w-3 h-3 bg-zinc-800 border border-zinc-400 rounded-sm flex items-center justify-center text-[8px]">
              ♿
            </div>
            <span>Accessible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
