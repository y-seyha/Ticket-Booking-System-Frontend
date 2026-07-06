"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Grid,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

import { CreateModal } from "./CreateModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useSeatTemplate } from "../useSeatTemplate";
import SmoothSelect from "@/components/ui/SmoothSelect";
import { SeatLayoutVariant } from "../seat-templates.types";
import { DetailModal } from "./DetailModal";

type SortOption = "name_asc" | "name_desc" | "capacity_asc" | "capacity_desc";
type FilterType = "ALL" | "STANDARD" | "IMAX" | "VIP" | "FOUR_DX";

export const SCREEN_TYPE_COLORS: Record<Exclude<FilterType, "ALL">, string> = {
  STANDARD:
    "bg-blue-500/10 text-blue-600 border-blue-200/60 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800/60",
  IMAX: "bg-cyan-500/10 text-cyan-600 border-cyan-200/60 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-800/60",
  VIP: "bg-amber-500/10 text-amber-600 border-amber-200/60 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800/60",
  FOUR_DX:
    "bg-purple-500/10 text-purple-600 border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800/60",
};

export default function SeatTemplateDashboard() {
  const {
    templatesWithLayouts,
    baseTemplates,
    loading,
    generateBulkLayout,
    updateLayoutVariant,
    deleteLayoutVariant,
  } = useSeatTemplate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("ALL");
  const [templateFilterId, setTemplateFilterId] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedLayoutCtx, setSelectedLayoutCtx] = useState<{
    templateId: string;
    templateName: string;
    layout?: SeatLayoutVariant;
    layouts?: SeatLayoutVariant[];
    initialLayoutIdx?: number;
  } | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const specificTemplateOptions = useMemo(() => {
    const defaultOpt = [{ value: "ALL", label: "All Templates" }];
    const mappedOpts = (baseTemplates || [])
      .filter((t) => t.isActive)
      .map((t) => ({ value: t.id, label: t.name }));
    return [...defaultOpt, ...mappedOpts];
  }, [baseTemplates]);

  const processedTemplatesList = useMemo(() => {
    let result = templatesWithLayouts.map((t) => {
      const totalSeatsAcrossLayouts = t.layouts.reduce(
        (sum, l) => sum + l.seats.length,
        0,
      );
      return {
        id: t.templateId,
        name: t.templateName,
        type: t.screenType,
        totalSeats: totalSeatsAcrossLayouts,
        layouts: t.layouts,
      };
    });

    result = result.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

    if (typeFilter !== "ALL")
      result = result.filter((item) => item.type === typeFilter);
    if (templateFilterId !== "ALL")
      result = result.filter((item) => item.id === templateFilterId);

    return result.sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(b.name);
        case "capacity_asc":
          return a.totalSeats - b.totalSeats;
        case "capacity_desc":
          return b.totalSeats - a.totalSeats;
        default:
          return 0;
      }
    });
  }, [
    templatesWithLayouts,
    debouncedSearch,
    sortOption,
    typeFilter,
    templateFilterId,
  ]);

  const getSortLabel = () => {
    switch (sortOption) {
      case "name_asc":
        return "Name: A to Z";
      case "name_desc":
        return "Name: Z to A";
      case "capacity_asc":
        return "Capacity: Low to High";
      case "capacity_desc":
        return "Capacity: High to Low";
    }
  };

  const handleDeleteLayout = async () => {
    if (!selectedLayoutCtx || !selectedLayoutCtx.layout) return;
    setDeleting(true);
    try {
      await deleteLayoutVariant(
        selectedLayoutCtx.templateId,
        selectedLayoutCtx.layout.layoutId,
      );
      setIsDeleteOpen(false);
      setSelectedLayoutCtx(null);
    } catch (err) {
      console.error("Failed to delete variant workspace:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 p-4 md:p-8 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 antialiased">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Grid className="h-6 w-6 text-zinc-500" /> Screen Layout Framework
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Configure seating arrangements, bulk grid dimensions, and variant
              configurations.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedLayoutCtx(null);
              setIsCreateOpen(true);
            }}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Bulk Generate Seats
          </button>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="relative w-full lg:max-w-sm h-10.5">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search layout templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
            <div className="w-full lg:w-52 h-10.5">
              <SmoothSelect
                label=""
                options={specificTemplateOptions}
                selectedValue={templateFilterId}
                onChange={setTemplateFilterId}
                placeholder="Filter by Layout"
              />
            </div>
            <div className="w-full lg:w-44 h-10.5">
              <SmoothSelect
                label=""
                options={[
                  { value: "ALL", label: "All Layouts" },
                  { value: "STANDARD", label: "Standard" },
                  { value: "IMAX", label: "IMAX" },
                  { value: "VIP", label: "VIP" },
                  { value: "FOUR_DX", label: "4DX" },
                ]}
                selectedValue={typeFilter}
                onChange={(val) => setTypeFilter(val as FilterType)}
                placeholder="Filter by Screen"
              />
            </div>

            <div ref={dropdownRef} className="relative w-full lg:w-48 h-10.5">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full h-full flex items-center justify-between border border-zinc-200 bg-white px-3.5 text-sm rounded-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 truncate">
                  <ArrowUpDown className="h-4 w-4 text-zinc-400" />
                  {getSortLabel()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute right-0 mt-2 w-full rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 transition-all duration-200 ${isSortOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                {[
                  { value: "name_asc", label: "Name: A to Z" },
                  { value: "name_desc", label: "Name: Z to A" },
                  { value: "capacity_asc", label: "Capacity: Low to High" },
                  { value: "capacity_desc", label: "Capacity: High to Low" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortOption(opt.value as SortOption);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs font-semibold ${sortOption === opt.value ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900" : "text-zinc-600"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {(search || typeFilter !== "ALL" || templateFilterId !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                  setTemplateFilterId("ALL");
                }}
                className="cursor-pointer h-10.5 w-full lg:w-auto px-4 rounded-xl text-xs font-bold tracking-wide uppercase text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-transparent transition-all duration-150 col-span-1 sm:col-span-2 lg:col-span-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-zinc-200/60 text-xs font-bold uppercase text-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800">
                  <th className="px-6 py-4 text-center w-16">No.</th>
                  <th className="px-6 py-4">Template Name</th>
                  <th className="px-6 py-4">Screen Type</th>
                  <th className="px-6 py-4">Layout Variants</th>
                  <th className="px-6 py-4 text-center w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {loading && processedTemplatesList.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-5">
                        <div className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : processedTemplatesList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-zinc-400">
                      No layouts match criteria.
                    </td>
                  </tr>
                ) : (
                  processedTemplatesList.map((template, idx) => (
                    <tr
                      key={template.id}
                      className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-center text-zinc-400">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                        {template.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-1 text-xs font-mono font-bold border tracking-wide uppercase ${SCREEN_TYPE_COLORS[template.type as Exclude<FilterType, "ALL">] || ""}`}
                        >
                          {template.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-zinc-600 dark:text-zinc-400">
                        {template.layouts.length} Variants Available
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {template.layouts.map((layout, layoutIdx) => (
                            <div
                              key={layout.layoutId}
                              className="flex items-center justify-between gap-4 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 px-2"
                            >
                              <span className="text-xs font-medium truncate max-w-[120px]">
                                {layout.layoutName}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedLayoutCtx({
                                      templateId: template.id,
                                      templateName: template.name,
                                      layouts: template.layouts,
                                      initialLayoutIdx: layoutIdx,
                                    });
                                    setIsDetailsOpen(true);
                                  }}
                                  className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
                                  title="View Layout Chart"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedLayoutCtx({
                                      templateId: template.id,
                                      templateName: template.name,
                                      layout: layout,
                                    });
                                    setIsCreateOpen(true);
                                  }}
                                  className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
                                  title="Edit Variant"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedLayoutCtx({
                                      templateId: template.id,
                                      templateName: `${template.name} (${layout.layoutName})`,
                                      layout: layout,
                                    });
                                    setIsDeleteOpen(true);
                                  }}
                                  className="p-1 text-red-500 hover:text-red-700 transition"
                                  title="Delete Variant"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODALS */}
        {isCreateOpen && (
          <CreateModal
            isOpen={isCreateOpen}
            onClose={() => {
              setIsCreateOpen(false);
              setSelectedLayoutCtx(null);
            }}
            onGenerate={generateBulkLayout}
            onUpdate={updateLayoutVariant}
            editLayoutContext={selectedLayoutCtx}
          />
        )}

        {isDetailsOpen && selectedLayoutCtx && (
          <DetailModal
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedLayoutCtx(null);
            }}
            templateName={selectedLayoutCtx.templateName}
            layouts={selectedLayoutCtx.layouts || []}
            initialLayoutIdx={selectedLayoutCtx.initialLayoutIdx || 0}
          />
        )}
        {isDeleteOpen && selectedLayoutCtx && (
          <DeleteConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedLayoutCtx(null);
            }}
            onConfirm={handleDeleteLayout}
            isSubmitting={deleting}
            title={`Delete ${selectedLayoutCtx.templateName}?`}
            description="This will permanently delete the entire seating arrangement configuration matrix and all corresponding structural layout sub-variants under this workspace."
          />
        )}
      </div>
    </div>
  );
}
