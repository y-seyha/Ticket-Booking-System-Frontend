"use client";

import { Eye, Trash2, Film, Settings2 } from "lucide-react";
import type { Screen } from "../../screen.types";

interface TableProps {
  screens: Screen[];
  totalCount: number;
  currentPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
  onViewDetail: (screen: Screen) => void;
  onEditClick: (screen: Screen) => void;
  onDeleteClick: (id: string, name: string) => void;
  loading?: boolean;
}

export default function ScreenTable({
  screens,
  currentPage,
  maxPage,
  onPageChange,
  onViewDetail,
  onEditClick,
  onDeleteClick,
  loading = false,
}: TableProps) {
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "IMAX":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900";
      case "VIP":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900";
      case "DOLBY_ATMOS":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="p-4">Screen info</th>
              <th className="p-4">Location</th>
              <th className="p-4">Layout Tech Spec</th>
              <th className="p-4">Capacity</th>
              <th className="p-4 text-right">Management Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg h-8 w-8" />
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-28" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-16" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-20" />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-7 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
                      <div className="h-7 w-7 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : screens.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-zinc-500 dark:text-zinc-400"
                >
                  No layout blueprints match your active search terms.
                </td>
              </tr>
            ) : (
              screens.map((screen) => (
                <tr
                  key={screen.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                >
                  <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                        <Film className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <div className="font-semibold">{screen.name}</div>
                        <div className="text-xs text-zinc-400">
                          Template ID:{" "}
                          {screen.templateId?.substring(0, 8) || "N/A"}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-300">
                    {screen.theater?.name || (
                      <span className="italic text-zinc-400">
                        Unlinked Structure
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold border rounded-lg ${getTypeBadgeStyles(screen.type)}`}
                    >
                      {screen.type}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-300 font-mono text-xs">
                    {screen.seats?.length || 0} Total Seats
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetail(screen)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400 transition-all"
                        title="View Detailed Blueprint Specs"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditClick(screen)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400 transition-all"
                        title="Edit Configuration Settings"
                      >
                        <Settings2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(screen.id, screen.name)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-zinc-400 hover:text-red-600 transition-all"
                        title="Decommission Screen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination control footer bar */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Displaying Page {currentPage} of {maxPage}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-50 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, maxPage))}
            disabled={currentPage === maxPage || loading}
            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-50 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
