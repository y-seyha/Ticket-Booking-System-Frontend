import { DollarSign, Plus } from "lucide-react";

interface HeaderProps {
  onAddClick: () => void;
}

export function DashboardHeader({ onAddClick }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-900 pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-zinc-500" /> Tier Surcharge
          Architecture
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Set up premium dynamic seating configurations, base overhead scales,
          and seat type metrics.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all shadow-sm self-start sm:self-auto"
      >
        <Plus className="h-4 w-4 stroke-3" /> Add Pricing Matrix
      </button>
    </div>
  );
}
