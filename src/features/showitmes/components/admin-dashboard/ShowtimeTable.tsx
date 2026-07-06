"use client";

import {
  Film,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";
import { Showtime, ShowtimeStatus } from "../../showtimes.types";

interface TableProps {
  loading: boolean;
  showtimes: Showtime[];
  onOpenDetails: (showtime: Showtime) => void;
  onOpenEdit: (showtime: Showtime) => void;
  onOpenDelete: (showtime: Showtime) => void;
  onOpenStatusToggle: (showtime: Showtime) => void;
}

export function ShowtimeTable({
  loading,
  showtimes,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
}: TableProps) {
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Status Badge Blueprint Mapper
  const renderStatusBadge = (status: ShowtimeStatus) => {
    const configurations = {
      [ShowtimeStatus.SCHEDULED]: {
        bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40",
        text: "text-amber-700 dark:text-amber-400",
        icon: <Clock className="h-3 w-3" />,
        label: "Scheduled",
      },
      [ShowtimeStatus.ACTIVE]: {
        bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40",
        text: "text-emerald-700 dark:text-emerald-400",
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: "Active",
      },
      [ShowtimeStatus.CANCELLED]: {
        bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/40",
        text: "text-rose-700 dark:text-rose-400",
        icon: <AlertTriangle className="h-3 w-3" />,
        label: "Cancelled",
      },
      [ShowtimeStatus.COMPLETED]: {
        bg: "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700",
        text: "text-zinc-600 dark:text-zinc-400",
        icon: <CheckSquare className="h-3 w-3" />,
        label: "Completed",
      },
    };

    const config =
      configurations[status] || configurations[ShowtimeStatus.SCHEDULED];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${config.bg} ${config.text}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/20 text-xs font-bold uppercase text-zinc-400 tracking-wider">
            <th className="py-3.5 px-6 w-16 text-center">No.</th>
            <th className="py-3.5 px-6">
              <span className="flex items-center gap-2">
                <Film className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />{" "}
                Movie Title
              </span>
            </th>
            <th className="py-3.5 px-6">Screen Venue</th>
            <th className="py-3.5 px-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />{" "}
                Time Window
              </span>
            </th>
            <th className="py-3.5 px-6 w-32">Price</th>
            <th className="py-3.5 px-6 w-40">Status</th>
            <th className="py-3.5 px-6 text-right w-40">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={7} className="p-5">
                  <div className="h-6 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl w-full" />
                </td>
              </tr>
            ))
          ) : showtimes.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-16 text-center text-zinc-400 dark:text-zinc-500 font-medium text-xs"
              >
                No operational showtimes found matching your criteria.
              </td>
            </tr>
          ) : (
            showtimes.map((st, index) => (
              <tr
                key={st.id}
                className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors"
              >
                <td className="py-4 px-6 text-center font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="py-4 px-6 font-bold text-zinc-900 dark:text-zinc-50 tracking-wide">
                  <div className="flex flex-col">
                    <span className="text-sm">{st.movie?.title}</span>
                    <span className="text-[11px] font-mono text-zinc-400 font-normal mt-0.5">
                      {st.movie?.language} • {st.movie?.durationMinutes} mins
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">
                      {st.screen?.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-0.5">
                      {st.screen?.theater?.name || "Main Theater Complex"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 font-mono font-medium text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                      {formatDateTime(st.startTime)}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      → {formatDateTime(st.endTime)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-mono font-bold text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/60 px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400">
                    ${Number(st.basePrice).toFixed(2)}
                  </span>
                </td>

                {/* Display Clean Status Badge Instead of Switch Component */}
                <td className="py-4 px-6 vertical-align-middle">
                  {renderStatusBadge(st.status)}
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="inline-flex gap-1.5">
                    <button
                      onClick={() => onOpenDetails(st)}
                      className="cursor-pointer inline-flex items-center justify-center h-8 w-8 text-zinc-400 border border-zinc-200/80 bg-white hover:bg-zinc-950 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 rounded-lg transition"
                      title="View Details & Seats Blueprint"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenEdit(st)}
                      className="cursor-pointer inline-flex items-center justify-center h-8 w-8 text-zinc-400 border border-zinc-200/80 bg-white hover:bg-zinc-950 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 rounded-lg transition"
                      title="Edit Configurations & Status"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDelete(st)}
                      className="cursor-pointer inline-flex items-center justify-center h-8 w-8 text-rose-400 border border-zinc-200/80 bg-white hover:bg-rose-600 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-rose-600 rounded-lg transition"
                      title="Delete Showtime"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
