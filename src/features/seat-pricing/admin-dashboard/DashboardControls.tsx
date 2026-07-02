import { Search } from "lucide-react";
import SmoothSelect from "@/components/ui/SmoothSelect";

interface ControlsProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  sortConfig: string;
  onSortConfigChange: (val: string) => void;
  statusOptions: Array<{ value: string; label: string }>;
  sortOptions: Array<{ value: string; label: string }>;
}

export function DashboardControls({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortConfig,
  onSortConfigChange,
  statusOptions,
  sortOptions,
}: ControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
      <div className="relative w-full md:max-w-xs h-10.5 shrink-0">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search layout tiers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-4 text-sm shadow-inner outline-none transition-all focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto justify-end">
        <div className="w-full sm:w-44 h-10.5 [&_label]:hidden [&_p]:hidden [&_span]:my-0 flex flex-col justify-center">
          <SmoothSelect
            label=""
            options={statusOptions}
            selectedValue={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="Filter by Deployment"
          />
        </div>
        <div className="w-full sm:w-48 h-10.5 [&_label]:hidden [&_p]:hidden [&_span]:my-0 flex flex-col justify-center">
          <SmoothSelect
            label=""
            options={sortOptions}
            selectedValue={sortConfig}
            onChange={onSortConfigChange}
            placeholder="Sort Matrix"
          />
        </div>
      </div>
    </div>
  );
}
