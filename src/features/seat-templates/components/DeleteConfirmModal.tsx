"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  isSubmitting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isSubmitting = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      className="max-w-md w-full"
    >
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 p-3.5 rounded-xl border border-red-200/40 dark:border-red-900/40">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-50">
              {title}
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="cursor-pointer px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all font-medium disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? "Deleting..." : "Delete Layout"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
