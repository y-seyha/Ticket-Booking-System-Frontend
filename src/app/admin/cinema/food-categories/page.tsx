"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, Utensils } from "lucide-react";
import { toast } from "sonner";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import type { FoodCategory } from "@/features/foods-and-beverage/foods-and-beverage.types";
import FoodCategoryTable from "@/features/foods-and-beverage/components/admin-dashboard/FoodCategoryTable";
import CategoryFormModal from "@/features/foods-and-beverage/components/admin-dashboard/CategoryFormModal";
import DeleteConfirmModal from "@/features/foods-and-beverage/components/admin-dashboard/DeleteConfirmModal";
import ToggleConfirmationModal from "@/features/foods-and-beverage/components/admin-dashboard/ToggleConfirmationModal";
import SmoothSelect from "@/components/ui/SmoothSelect";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function FoodCategoriesPage() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const searchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FoodCategory | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [toggleTarget, setToggleTarget] = useState<{
    id: string;
    name: string;
    isActive: boolean;
  } | null>(null);

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [searchQuery]);

  const filteredCategories = categories.filter((cat) => {
    if (
      debouncedSearch &&
      !cat.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
      return false;
    if (statusFilter !== "all") {
      if (statusFilter === "active" && !cat.isActive) return false;
      if (statusFilter === "inactive" && cat.isActive) return false;
    }
    return true;
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await foodAndBeverageApi.getAllCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchCategories();
    });
  }, [fetchCategories]);

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleOpenEditCategory = (cat: FoodCategory) => {
    setEditingCategory(cat);
    setIsCategoryFormOpen(true);
  };

  const handleOpenDelete = (cat: FoodCategory) => {
    setDeleteTarget({ id: cat.id, name: cat.name });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await foodAndBeverageApi.deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      fetchCategories();
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleCategory = (cat: FoodCategory) => {
    setToggleTarget({ id: cat.id, name: cat.name, isActive: cat.isActive });
    setIsToggleOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const target = toggleTarget;
    const wasActive = target.isActive;

    setIsToggleOpen(false);
    setToggleTarget(null);

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === target.id ? { ...cat, isActive: !wasActive } : cat,
      ),
    );

    try {
      await foodAndBeverageApi.toggleCategoryStatus(target.id);
      toast.success(`Category ${wasActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to toggle category status");
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === target.id ? { ...cat, isActive: wasActive } : cat,
        ),
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 box-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate flex items-center gap-2.5">
            <Utensils className="h-6 w-6 text-zinc-500" />
            Food Categories
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Create and manage food & beverage categories.
          </p>
        </div>
        <button
          onClick={handleOpenAddCategory}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shrink-0 w-full cursor-pointer sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-9 pr-3 py-2 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300"
          />
        </div>

        <div className="w-40">
          <SmoothSelect
            options={STATUS_OPTIONS}
            selectedValue={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            placeholder="All Status"
          />
        </div>
      </div>

      <FoodCategoryTable
        categories={filteredCategories}
        onEditClick={handleOpenEditCategory}
        onDeleteClick={handleOpenDelete}
        onToggleStatus={handleToggleCategory}
        isLoading={isLoading}
      />

      <CategoryFormModal
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        category={editingCategory}
        onSuccess={fetchCategories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All items in this category will also be removed.`}
        onConfirm={handleConfirmDelete}
      />

      <ToggleConfirmationModal
        isOpen={isToggleOpen}
        onClose={() => {
          setIsToggleOpen(false);
          setToggleTarget(null);
        }}
        name={toggleTarget?.name || ""}
        type="category"
        currentlyActive={toggleTarget?.isActive ?? false}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
}
