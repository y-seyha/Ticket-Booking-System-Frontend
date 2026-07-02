"use client";

import Modal from "@/components/ui/Modal";
import { Layers, DollarSign, Activity, Calendar } from "lucide-react";
import { SeatPricingRule } from "../seat-pricing.types";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: SeatPricingRule | null;
}

export function DetailsModal({ isOpen, onClose, rule }: DetailsModalProps) {
  if (!rule) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${rule.seatType} Configuration Matrix`}
      className="max-w-md w-full"
    >
      <div className="space-y-4 text-sm pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-xs text-zinc-400 font-medium block mb-1">
              Class Tier
            </span>
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
              <Layers className="h-4 w-4 text-zinc-400" />
              {rule.seatType}
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-xs text-zinc-400 font-medium block mb-1">
              Surcharge Cost
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
              {rule.seatSurcharge.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Deployment State
            </span>
            <span
              className={`font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded-md ${
                rule.isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-zinc-500/10 text-zinc-500 dark:bg-zinc-500/20 dark:text-zinc-400"
              }`}
            >
              {rule.isActive ? "Live Active" : "Suspended"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Billing Cycle Scope
            </span>
            <span className="text-zinc-600 dark:text-zinc-300 font-medium">
              Immediate Stream Application
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition font-medium cursor-pointer text-center text-xs"
          >
            Close Metadata View
          </button>
        </div>
      </div>
    </Modal>
  );
}
