"use client";

import { useState, useEffect } from "react";
import { foodAndBeverageApi } from "../../foods-and-beverage.api";
import { FoodCategory } from "../../foods-and-beverage.types";
import { X, Loader2 } from "lucide-react";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: FoodCategory | null;
  onSuccess: () => void;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryFormModalProps) {
  const [animate, setAnimate] = useState(false);
  const [render, setRender] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

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
      if (category) {
        setName(category.name);
        setSortOrder(category.sortOrder);
      } else {
        setName("");
        setSortOrder(0);
      }
    });
  }, [isOpen, category]);

  if (!render) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (category) {
        await foodAndBeverageApi.updateCategory(category.id, { name, sortOrder });
      } else {
        await foodAndBeverageApi.createCategory({ name, sortOrder });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save category", err);
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
        className={`w-full max-w-md rounded-2xl bg-white dark:bg-zinc-950 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 relative z-10 ${
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

        <h2 className="mb-5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {category ? "Edit Category" : "Create Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Popcorn"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white dark:focus:bg-zinc-950"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
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

          <div className="mt-6 flex gap-3 pt-2">
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
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm flex items-center justify-center gap-2 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 disabled:text-zinc-200 dark:disabled:text-zinc-600"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {category ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
