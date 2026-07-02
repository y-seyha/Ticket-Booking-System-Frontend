"use client";

import { Layers, Edit2, Trash2, Eye } from "lucide-react";
import { SeatPricingRule } from "../seat-pricing.types";

interface TableProps {
  loading: boolean;
  rules: SeatPricingRule[];
  onOpenDetails: (rule: SeatPricingRule) => void;
  onOpenEdit: (rule: SeatPricingRule) => void;
  onOpenDelete: (rule: SeatPricingRule) => void;
  onOpenStatusToggle: (rule: SeatPricingRule) => void;
}

export function PricingTable({
  loading,
  rules,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onOpenStatusToggle,
}: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm">
      <table className="w-full min-w-[600px] text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/20 text-xs font-bold uppercase text-zinc-400 tracking-wider">
            <th className="py-3.5 px-6 w-16 text-center">N.o</th>
            <th className="py-3.5 px-6">
              <span className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" /> Seat Class Tier
              </span>
            </th>
            <th className="py-3.5 px-6">Surcharge Matrix</th>
            <th className="py-3.5 px-6">Live Status</th>
            <th className="py-3.5 px-6 text-right w-48">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-sm">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={5} className="p-6">
                  <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full" />
                </td>
              </tr>
            ))
          ) : rules.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-16 text-center text-zinc-400 font-medium"
              >
                No configuration models match your query criteria.
              </td>
            </tr>
          ) : (
            rules.map((rule, index) => (
              <tr
                key={rule.seatType}
                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
              >
                <td className="py-4 px-6 text-center font-mono font-medium text-zinc-400 dark:text-zinc-500">
                  {index + 1}
                </td>
                <td className="py-4 px-6 font-extrabold text-zinc-900 dark:text-zinc-50 tracking-wide">
                  {rule.seatType}
                </td>
                <td className="py-4 px-6">
                  <span className="font-mono font-bold text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400">
                    +${rule.seatSurcharge.toFixed(2)}
                  </span>
                </td>

                {/* Updated Interactive Toggle Track Column */}
                <td className="py-4 px-6">
                  <button
                    type="button"
                    onClick={() => onOpenStatusToggle(rule)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.isActive
                        ? "bg-emerald-500"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                    aria-label={`Toggle live status for ${rule.seatType}`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.isActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onOpenDetails(rule)}
                      className="cursor-pointer inline-flex items-center justify-center h-8 w-8 text-zinc-500 border border-zinc-200 bg-white hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenEdit(rule)}
                      className="cursor-pointer inline-flex items-center justify-center h-8 w-8 text-zinc-500 border border-zinc-200 bg-white hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 rounded-lg transition"
                      title="Update Rule Configuration"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDelete(rule)}
                      className="cursor-pointer inline-flex items-center justify-center h-8 w-8 text-rose-500 border border-zinc-200 bg-white hover:bg-rose-600 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-rose-600 rounded-lg transition"
                      title="Erase Rule Parameters"
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
