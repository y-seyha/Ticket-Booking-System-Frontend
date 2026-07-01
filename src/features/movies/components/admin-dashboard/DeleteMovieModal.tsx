"use client";

import Modal from "@/components/ui/Modal";

interface DeleteMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  movieTitle: string;
}

export default function DeleteMovieModal({
  isOpen,
  onClose,
  onConfirm,
  movieTitle,
}: DeleteMovieModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Movie Record">
      <div className="space-y-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Are you absolutely sure you want to permanently delete{" "}
          <strong className="text-zinc-900 dark:text-zinc-50">
            {`"${movieTitle}"`}
          </strong>
          ? This structural data removal cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Delete Listing
          </button>
        </div>
      </div>
    </Modal>
  );
}
