"use client";

import { Edit3, Trash2, Utensils, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { FoodCategory } from "../../foods-and-beverage.types";

interface FoodCategoryTableProps {
  categories: FoodCategory[];
  onEditClick: (category: FoodCategory) => void;
  onDeleteClick: (category: FoodCategory) => void;
  onManageItems?: (category: FoodCategory) => void;
  onToggleStatus?: (category: FoodCategory) => void;
  isLoading?: boolean;
}

function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden transition-all duration-200">
      <div className="w-full overflow-x-auto relative min-h-[200px]">
        {children}
      </div>
    </div>
  );
}

export default function FoodCategoryTable({
  categories,
  onEditClick,
  onDeleteClick,
  onManageItems,
  onToggleStatus,
  isLoading,
}: FoodCategoryTableProps) {
  if (isLoading) {
    return (
      <TableContainer>
        <div className="space-y-3 p-6 animate-pulse">
          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl w-full" />
          ))}
        </div>
      </TableContainer>
    );
  }

  if (categories.length === 0) {
    return (
      <TableContainer>
        <div className="flex flex-col items-center justify-center p-16 text-zinc-400 dark:text-zinc-600">
          <Utensils className="h-10 w-10 mb-3 stroke-[1.5] text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-medium">No categories found</p>
          <p className="text-xs text-zinc-400 mt-1">Add a category to get started.</p>
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <div className="grid grid-cols-12 gap-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 min-w-[600px]">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Name</div>
        <div className="col-span-2">Sort Order</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-5 text-right">Actions</div>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="grid grid-cols-12 gap-4 items-center px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors min-w-[600px]"
          >
            <div className="col-span-1 font-mono text-xs text-zinc-400 dark:text-zinc-600">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="col-span-3 font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {cat.name}
            </div>
            <div className="col-span-2 text-xs text-zinc-500 dark:text-zinc-400">
              {cat.sortOrder}
            </div>
            <div className="col-span-1 flex justify-center">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
                  cat.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/40 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/20"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400"
                }`}
              >
                {cat.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="col-span-5 flex items-center justify-end gap-1">
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(cat)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                  title={cat.isActive ? "Deactivate" : "Activate"}
                >
                  {cat.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
              )}
              {onManageItems && (
                <button
                  onClick={() => onManageItems(cat)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                  title="Manage Items"
                >
                  <Package className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onEditClick(cat)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                title="Edit Category"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteClick(cat)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                title="Delete Category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </TableContainer>
  );
}
