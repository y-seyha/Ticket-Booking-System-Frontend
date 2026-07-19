"use client";

import { Edit3, Trash2, ShoppingCart, ToggleLeft, ToggleRight } from "lucide-react";
import { FoodItem } from "../../foods-and-beverage.types";

interface FoodItemTableProps {
  items: FoodItem[];
  categoryName: string;
  onEditClick: (item: FoodItem) => void;
  onDeleteClick: (item: FoodItem) => void;
  onToggleStatus: (item: FoodItem) => void;
  isLoading?: boolean;
}

function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden transition-all duration-200">
      <div className="w-full overflow-x-auto relative min-h-[150px]">
        {children}
      </div>
    </div>
  );
}

export default function FoodItemTable({
  items,
  categoryName,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
  isLoading,
}: FoodItemTableProps) {
  if (isLoading) {
    return (
      <TableContainer>
        <div className="space-y-3 p-6 animate-pulse">
          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl w-full" />
          ))}
        </div>
      </TableContainer>
    );
  }

  if (items.length === 0) {
    return (
      <TableContainer>
        <div className="flex flex-col items-center justify-center p-12 text-zinc-400 dark:text-zinc-600">
          <ShoppingCart className="h-10 w-10 mb-3 stroke-[1.5] text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-medium">No items in this category</p>
          <p className="text-xs text-zinc-400 mt-1">Add an item to {categoryName}.</p>
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <div className="grid grid-cols-12 gap-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 min-w-[700px]">
        <div className="col-span-1">#</div>
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1 text-center">Sort</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 items-center px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors min-w-[700px]"
          >
            <div className="col-span-1 font-mono text-xs text-zinc-400 dark:text-zinc-600">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="col-span-4 font-semibold text-zinc-900 dark:text-zinc-50 truncate flex items-center gap-2">
              {item.image && (
                <span className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                  img
                </span>
              )}
              {item.name}
            </div>
            <div className="col-span-2 font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ${Number(item.price).toFixed(2)}
            </div>
            <div className="col-span-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {item.sortOrder}
            </div>
            <div className="col-span-1 flex justify-center">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
                  item.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/40 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/20"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="col-span-3 flex items-center justify-end gap-1">
              <button
                onClick={() => onToggleStatus(item)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                title={item.isActive ? "Deactivate" : "Activate"}
              >
                {item.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onEditClick(item)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                title="Edit Item"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteClick(item)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                title="Delete Item"
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
