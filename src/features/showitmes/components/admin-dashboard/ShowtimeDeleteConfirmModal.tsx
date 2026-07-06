"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

interface DeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  movieTitle: string;
  timeContext: string;
}

export function ShowtimeDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  movieTitle,
  timeContext,
}: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExecuteDestruction = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isDeleting && onClose()}
      title="Revoke Allocated Sequence Block"
      className="max-w-md w-full"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-200/40 dark:border-rose-950/40">
          <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-600 dark:text-rose-400">
              Warning: Destructive Event Triggered
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              You are about to purge the session trace of{" "}
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {movieTitle}
              </span>{" "}
              mapped at{" "}
              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">
                {timeContext}
              </span>
              . This operational logic path cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium text-xs cursor-pointer"
          >
            Preserve Sequence
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleExecuteDestruction}
            className="px-4 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-500 transition font-medium text-xs cursor-pointer min-w-[100px] flex items-center justify-center"
          >
            {isDeleting ? "Wiping Records..." : "Purge Stream"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
