"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div
        className={`relative w-full transform overflow-visible rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 z-10 animate-in fade-in-50 zoom-in-95 duration-200 ease-out ${className}`}
      >
        {/* Modal Header Panel Section */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Inner Content Slot wrapper */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
