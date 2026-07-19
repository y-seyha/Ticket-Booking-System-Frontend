"use client";

import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface ToggleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  type: "category" | "item";
  currentlyActive: boolean;
  onConfirm: () => Promise<void>;
}

export default function ToggleConfirmationModal({
  isOpen,
  onClose,
  name,
  type,
  currentlyActive,
  onConfirm,
}: ToggleConfirmationModalProps) {
  const [animate, setAnimate] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  const action = currentlyActive ? "Deactivate" : "Activate";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${animate ? "bg-black/40 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"}`}
    >
      <div onClick={onClose} className="absolute inset-0" />
      <div
        className={`w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-950 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 relative z-10 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 mb-4">
          {currentlyActive ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
        </div>
        <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-zinc-50">
          {action} {type}
        </h3>
        <p className="mt-2 text-sm text-center text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Are you sure you want to <strong>{action.toLowerCase()}</strong> &ldquo;{name}&rdquo;?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 active:bg-amber-800 shadow-sm transition-colors"
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
