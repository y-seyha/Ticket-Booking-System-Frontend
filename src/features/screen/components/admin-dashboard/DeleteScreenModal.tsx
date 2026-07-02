
"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useScreen } from "../../useScreen";

interface DeleteModalProps {
  target: { id: string; name: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteScreenModal({
  target,
  onClose,
  onSuccess,
}: DeleteModalProps) {
  const { deleteScreen, loading } = useScreen();

  if (!target) return null;

  const handleConfirmDelete = async () => {
    try {
      await deleteScreen(target.id);
      onSuccess();
      onClose();
    } catch {
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Delete Screen?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {'"'}
                {target.name}
                {'"'}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Dynamic Full-Width Control Triggers */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
