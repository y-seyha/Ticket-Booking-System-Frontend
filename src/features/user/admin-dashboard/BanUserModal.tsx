"use client";

import { X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface BanUserModalProps {
  isOpen: boolean;
  userEmail: string | null;
  isSuspended: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BanUserModal({
  isOpen,
  userEmail,
  isSuspended,
  onClose,
  onConfirm,
}: BanUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 flex justify-between items-start">
          <div
            className={`p-2 rounded-xl ${
              isSuspended
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isSuspended ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <ShieldAlert className="h-5 w-5" />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-5 pb-5 space-y-2">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {isSuspended
              ? "Lift Account Suspension?"
              : "Restrict Account Access?"}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {isSuspended
              ? "This will restore full system access and privileges for:"
              : "This will temporarily revoke system access and block sessions for:"}
          </p>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate">
            {userEmail}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isSuspended
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isSuspended ? "Confirm Unban" : "Confirm Ban"}
          </button>
        </div>
      </div>
    </div>
  );
}
