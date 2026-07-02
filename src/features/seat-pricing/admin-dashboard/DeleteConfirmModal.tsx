"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";
import { SeatType } from "@/features/screen/screen.types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  seatType: SeatType | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  seatType,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Pricing Rule"
      className="max-w-sm w-full"
    >
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/40">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Irreversible Dashboard Action</h4>
            <p className="text-xs leading-relaxed">
              Are you sure you want to completely erase the premium surcharge
              structures assigned to the{" "}
              <span className="font-mono font-bold underline">{seatType}</span>{" "}
              class tier? Default values will revert back to base line pricing.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium cursor-pointer"
          >
            Keep Rule
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-40 transition font-medium cursor-pointer"
          >
            {deleting ? "Dropping..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
