"use client";

import { useState, useEffect } from "react";
import { foodAndBeverageApi } from "../../foods-and-beverage.api";
import type { FoodCategory } from "../../foods-and-beverage.types";
import { X, Loader2, Layers, Search } from "lucide-react";

interface BulkCreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FoodCategory[];
  onSuccess: () => void;
}

export default function BulkCreateItemModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: BulkCreateItemModalProps) {
  const [animate, setAnimate] = useState(false);
  const [render, setRender] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    requestAnimationFrame(() => {
      if (isOpen) {
        setRender(true);
        timer = setTimeout(() => setAnimate(true), 10);
      } else {
        setAnimate(false);
        timer = setTimeout(() => setRender(false), 200);
      }
    });
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      setName("");
      setDescription("");
      setPrice("");
      setSortOrder(0);
      setSelectedIds([]);
      setCategorySearch("");
    });
  }, [isOpen]);

  if (!render) return null;

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await foodAndBeverageApi.createBulkItems({
        name,
        description: description || undefined,
        price: parseFloat(price),
        sortOrder,
        categoryIds: selectedIds,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to bulk create items", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        animate ? "bg-black/40 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
      }`}
    >
      <div onClick={onClose} className="absolute inset-0" />
      <div
        className={`w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 relative z-10 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Layers className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bulk Add Item
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Large Popcorn"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white dark:focus:bg-zinc-950"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Description <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Butter-salted large popcorn"
              rows={2}
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 5.99"
                className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
                Sort Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Target Categories ({selectedIds.length} selected)
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-zinc-200 dark:border-zinc-800 p-1.5">
              {filteredCategories.length === 0 && (
                <p className="text-xs text-zinc-400 text-center py-4">
                  No categories match
                </p>
              )}
              {filteredCategories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-zinc-200 dark:border-zinc-800 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedIds.length === 0}
              className="flex-1 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm flex items-center justify-center gap-2 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 disabled:text-zinc-200 dark:disabled:text-zinc-600"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create in {selectedIds.length} categor{selectedIds.length === 1 ? "y" : "ies"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
