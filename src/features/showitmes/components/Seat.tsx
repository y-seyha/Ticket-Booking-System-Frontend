"use client";

type SeatType = "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";

interface SeatProps {
  id: string;
  row: string;
  number: number;
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  seatType: SeatType;
  isSelected: boolean;
  onClick: () => void;
}

export default function Seat({
  row,
  number,
  status,
  seatType,
  isSelected,
  onClick,
}: SeatProps) {
  const isAvailable = status === "AVAILABLE";

  // Dynamic Border/Accent style matching Legend Cinema brand configurations
  const getTierStyles = () => {
    switch (seatType) {
      case "VIP":
        return "border-amber-500/40 hover:border-amber-400 text-amber-400 bg-amber-950/20";
      case "COUPLE":
        return "border-purple-500/40 hover:border-purple-400 text-purple-400 bg-purple-950/20 col-span-2 w-full max-w-[72px]";
      case "WHEELCHAIR":
        return "border-blue-500/40 hover:border-blue-400 text-blue-400 bg-blue-950/20";
      default: // STANDARD
        return "border-zinc-700 hover:border-zinc-500 text-zinc-300 bg-zinc-900/40";
    }
  };

  // State-driven style overlays
  const getStatusStyles = () => {
    if (isSelected) {
      return "bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.4)] transform scale-105 z-10";
    }

    switch (status) {
      case "BOOKED":
      case "LOCKED":
        return "bg-zinc-900/10 border-zinc-900 text-zinc-700 cursor-not-allowed line-through opacity-30";
      default: // AVAILABLE
        return getTierStyles();
    }
  };

  return (
    <button
      disabled={!isAvailable}
      onClick={onClick}
      className={`
        h-8 w-8 
        rounded-t-lg border
        flex items-center justify-center 
        text-[10px] font-black tracking-tighter
        transition-all duration-150 ease-out
        active:scale-95
        disabled:transform-none
        ${getStatusStyles()}
      `}
      title={`${row}${number} [${seatType}] - ${status}`}
    >
      {seatType === "WHEELCHAIR" && !isSelected ? (
        <span className="text-[12px]">♿</span>
      ) : seatType === "COUPLE" && !isSelected ? (
        <span>
          {row}
          {number}
        </span>
      ) : (
        <span>{number}</span>
      )}
    </button>
  );
}
