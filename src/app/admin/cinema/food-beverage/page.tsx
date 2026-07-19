"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, ArrowLeft, Search, Layers } from "lucide-react";
import { toast } from "sonner";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import type {
  FoodCategory,
  FoodItem,
} from "@/features/foods-and-beverage/foods-and-beverage.types";
import FoodCategoryTable from "@/features/foods-and-beverage/components/admin-dashboard/FoodCategoryTable";
import FoodItemTable from "@/features/foods-and-beverage/components/admin-dashboard/FoodItemTable";
import CategoryFormModal from "@/features/foods-and-beverage/components/admin-dashboard/CategoryFormModal";
import ItemFormModal from "@/features/foods-and-beverage/components/admin-dashboard/ItemFormModal";
import DeleteConfirmModal from "@/features/foods-and-beverage/components/admin-dashboard/DeleteConfirmModal";
import ToggleConfirmationModal from "@/features/foods-and-beverage/components/admin-dashboard/ToggleConfirmationModal";
import BulkCreateItemModal from "@/features/foods-and-beverage/components/admin-dashboard/BulkCreateItemModal";
import SmoothSelect from "@/components/ui/SmoothSelect";

type ViewMode = "categories" | "items";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function FoodBeverageDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const searchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "category" | "item";
    id: string;
    name: string;
  } | null>(null);
  const [toggleTarget, setToggleTarget] = useState<{
    type: "category" | "item";
    id: string;
    name: string;
    isActive: boolean;
  } | null>(null);
  const [editingCategory, setEditingCategory] = useState<FoodCategory | null>(
    null,
  );
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

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

  const filteredItems = items.filter((item) => {
    if (
      debouncedSearch &&
      !item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
      return false;
    if (statusFilter !== "all") {
      if (statusFilter === "active" && !item.isActive) return false;
      if (statusFilter === "inactive" && item.isActive) return false;
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

  const fetchItems = useCallback(async (categoryId: string) => {
    setIsItemsLoading(true);
    try {
      const data = await foodAndBeverageApi.getAllItems();
      setItems(data.filter((item) => item.categoryId === categoryId));
    } catch {
      try {
        const cats = await foodAndBeverageApi.getAllCategories();
        const cat = cats.find((c) => c.id === categoryId);
        setItems(cat?.items || []);
      } catch {
        toast.error("Failed to load items");
      }
    } finally {
      setIsItemsLoading(false);
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

  const handleManageItems = (cat: FoodCategory) => {
    setSelectedCategory(cat);
    setViewMode("items");
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    fetchItems(cat.id);
  };

  const handleBackToCategories = () => {
    setViewMode("categories");
    setSelectedCategory(null);
    setItems([]);
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsItemFormOpen(true);
  };

  const handleOpenEditItem = (item: FoodItem) => {
    setEditingItem(item);
    setIsItemFormOpen(true);
  };

  const handleOpenDelete = (
    type: "category" | "item",
    id: string,
    name: string,
  ) => {
    setDeleteTarget({ type, id, name });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "category") {
        await foodAndBeverageApi.deleteCategory(deleteTarget.id);
        toast.success("Category deleted");
        fetchCategories();
      } else {
        await foodAndBeverageApi.deleteItem(deleteTarget.id);
        toast.success("Item deleted");
        if (selectedCategory) fetchItems(selectedCategory.id);
      }
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleCategory = (cat: FoodCategory) => {
    setToggleTarget({
      type: "category",
      id: cat.id,
      name: cat.name,
      isActive: cat.isActive,
    });
    setIsToggleOpen(true);
  };

  const handleToggleItem = (item: FoodItem) => {
    setToggleTarget({
      type: "item",
      id: item.id,
      name: item.name,
      isActive: item.isActive,
    });
    setIsToggleOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const target = toggleTarget;
    const wasActive = target.isActive;

    setIsToggleOpen(false);
    setToggleTarget(null);

    if (target.type === "item") {
      setItems((prev) =>
        prev.map((item) =>
          item.id === target.id ? { ...item, isActive: !wasActive } : item,
        ),
      );
    }

    if (target.type === "category") {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === target.id ? { ...cat, isActive: !wasActive } : cat,
        ),
      );
    }

    try {
      if (target.type === "category") {
        await foodAndBeverageApi.toggleCategoryStatus(target.id);
        toast.success(`Category ${wasActive ? "deactivated" : "activated"}`);
      } else {
        await foodAndBeverageApi.toggleItemStatus(target.id);
        toast.success(`Item ${wasActive ? "deactivated" : "activated"}`);
      }
    } catch {
      toast.error("Failed to toggle status");
      if (target.type === "category") {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === target.id ? { ...cat, isActive: wasActive } : cat,
          ),
        );
      } else {
        setItems((prev) =>
          prev.map((item) =>
            item.id === target.id ? { ...item, isActive: wasActive } : item,
          ),
        );
      }
    }
  };

  const filterBar = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
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
  );

  if (viewMode === "items" && selectedCategory) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 box-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div className="space-y-1 min-w-0">
            <button
              onClick={handleBackToCategories}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Categories
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
              {selectedCategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage food items in this category
            </p>
          </div>
          <button
            onClick={handleOpenAddItem}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shrink-0 w-full cursor-pointer sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>

        {filterBar}

        <FoodItemTable
          items={filteredItems}
          categoryName={selectedCategory.name}
          onEditClick={(item) => handleOpenEditItem(item)}
          onDeleteClick={(item) => handleOpenDelete("item", item.id, item.name)}
          onToggleStatus={(item) => handleToggleItem(item)}
          isLoading={isItemsLoading}
        />

        <ItemFormModal
          isOpen={isItemFormOpen}
          onClose={() => setIsItemFormOpen(false)}
          item={editingItem}
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onSuccess={() => fetchItems(selectedCategory.id)}
        />

        <DeleteConfirmModal
          isOpen={isDeleteOpen && deleteTarget?.type === "item"}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteTarget(null);
          }}
          title="Delete Item"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? This action is permanent and cannot be undone.`}
          onConfirm={handleConfirmDelete}
        />

        <ToggleConfirmationModal
          isOpen={isToggleOpen && toggleTarget?.type === "item"}
          onClose={() => {
            setIsToggleOpen(false);
            setToggleTarget(null);
          }}
          name={toggleTarget?.name || ""}
          type="item"
          currentlyActive={toggleTarget?.isActive ?? false}
          onConfirm={handleConfirmToggle}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 box-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
            Food & Beverage Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Manage food categories and items.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shrink-0 w-full cursor-pointer sm:w-auto"
          >
            <Layers className="h-4 w-4" /> Bulk Add
          </button>
          <button
            onClick={handleOpenAddCategory}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shrink-0 w-full cursor-pointer sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      {filterBar}

      <FoodCategoryTable
        categories={filteredCategories}
        onEditClick={handleOpenEditCategory}
        onDeleteClick={(cat) => handleOpenDelete("category", cat.id, cat.name)}
        onManageItems={handleManageItems}
        onToggleStatus={(cat) => handleToggleCategory(cat)}
        isLoading={isLoading}
      />

      <CategoryFormModal
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        category={editingCategory}
        onSuccess={fetchCategories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen && deleteTarget?.type === "category"}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All items in this category will also be removed.`}
        onConfirm={handleConfirmDelete}
      />

      <BulkCreateItemModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        categories={categories}
        onSuccess={fetchCategories}
      />

      <ToggleConfirmationModal
        isOpen={isToggleOpen && toggleTarget?.type === "category"}
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
