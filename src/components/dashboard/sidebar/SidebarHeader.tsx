"react";
import Link from "next/link";
import { Ticket, X } from "lucide-react";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-500">
          <Ticket className="h-5 w-5" />
        </div>
        <span className="tracking-tight">
          CineBook{" "}
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
            Admin
          </span>
        </span>
      </Link>

      {onClose && (
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          aria-label="Close Sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
