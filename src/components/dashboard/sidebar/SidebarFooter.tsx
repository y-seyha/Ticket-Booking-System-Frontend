import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export default function SidebarFooter() {
  return (
    <div className="space-y-1.5">
      <Link
        href="/"
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-x-0.5 dark:text-zinc-500" />
        <span>Back to Website</span>
      </Link>

      <button
        onClick={() => console.log("Logging out...")}
        className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/20 dark:hover:text-red-400"
      >
        <LogOut className="h-4 w-4 text-zinc-400 group-hover:text-red-500 dark:text-zinc-500 dark:group-hover:text-red-400" />
        <span>Logout</span>
      </button>
    </div>
  );
}
