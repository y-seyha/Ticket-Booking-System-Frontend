"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import SmoothSelect from "@/components/ui/SmoothSelect";
import {
  SeatPricingRule,
  CreateSeatPricingDto,
  UpdateSeatPricingDto,
} from "../seat-pricing.types";
import { SeatType } from "@/features/screen/screen.types";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    dto: CreateSeatPricingDto | UpdateSeatPricingDto,
  ) => Promise<unknown>;
  editingRule: SeatPricingRule | null;
  existingTypes: SeatType[];
}

const SEAT_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Standard Seat" },
  { value: "VIP", label: "VIP Recliner" },
  { value: "COUPLE", label: "Couple Sofa" },
  { value: "WHEELCHAIR", label: "Wheelchair Space" },
];

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  editingRule,
  existingTypes,
}: FormModalProps) {
  const defaultSeatType =
    (SEAT_TYPE_OPTIONS.find(
      (opt) => !existingTypes.includes(opt.value as SeatType),
    )?.value as SeatType) ?? "STANDARD";

  const [seatType, setSeatType] = useState<SeatType>(
    editingRule?.seatType ?? defaultSeatType,
  );
  const [surcharge, setSurcharge] = useState(
    editingRule ? editingRule.seatSurcharge.toString() : "0",
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isFormInvalid = !editingRule && existingTypes.includes(seatType);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid || submitting) return;

    setSubmitting(true);
    try {
      if (editingRule) {
        await onSubmit({ seatSurcharge: Number(surcharge) });
      } else {
        await onSubmit({
          seatType,
          seatSurcharge: Number(surcharge),
          isActive: true,
        });
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingRule
          ? `Modify Seating Rules: ${editingRule.seatType}`
          : "Create New Pricing Rule"
      }
      className="max-w-md w-full"
    >
      <form onSubmit={handleFormSubmit} className="space-y-5 text-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Seat Classification
          </label>
          {editingRule ? (
            <div className="w-full h-10.5 px-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center font-semibold text-zinc-700 dark:text-zinc-300">
              {editingRule.seatType}
            </div>
          ) : (
            <div className="[&_label]:hidden [&_p]:hidden">
              <SmoothSelect
                label=""
                options={SEAT_TYPE_OPTIONS}
                selectedValue={seatType}
                onChange={(val) => setSeatType(val as SeatType)}
                placeholder="Choose structural classification..."
              />
            </div>
          )}
          {isFormInvalid && (
            <p className="text-xs font-semibold text-rose-500 mt-1">
              A surcharge rule configuration already exists for this tier.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Premium Tier Surcharge ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={surcharge}
            onChange={(e) => setSurcharge(e.target.value)}
            className="w-full h-10.5 px-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition font-mono text-sm"
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || isFormInvalid}
            className="px-5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-40 transition font-medium cursor-pointer"
          >
            {submitting ? "Saving Config..." : "Apply Rule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
