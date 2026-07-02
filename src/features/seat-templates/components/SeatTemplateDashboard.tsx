"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Eye,
  Grid,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

import { DetailModal } from "./DetailModal";
import { CreateModal } from "./CreateModal";
import { useSeatTemplate } from "../useSeatTemplate";
import SmoothSelect from "@/components/ui/SmoothSelect";

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
  const { seats, baseTemplates, loading, generateBulkLayout } =
    useSeatTemplate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("ALL");
  const [templateFilterId, setTemplateFilterId] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTemplateCtx, setSelectedTemplateCtx] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Debounce logic for template search field
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

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
      .map((t) => ({
        value: t.id,
        label: t.name,
      }));
    return [...defaultOpt, ...mappedOpts];
  }, [baseTemplates]);

  const aggregatedTemplatesList = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; type: string; totalSeats: number }
    >();

    seats.forEach((seat) => {
      if (!seat.templateId) return;
      const existing = map.get(seat.templateId);
      if (existing) {
        existing.totalSeats += 1;
      } else {
        map.set(seat.templateId, {
          id: seat.templateId,
          name: seat.template?.name || "Unassigned Template",
          type: seat.template?.type || "STANDARD",
          totalSeats: 1,
        });
      }
    });

    return Array.from(map.values());
  }, [seats]);

  const processedTemplatesList = useMemo(() => {
    let result = aggregatedTemplatesList.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

    if (typeFilter !== "ALL") {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (templateFilterId !== "ALL") {
      result = result.filter((item) => item.id === templateFilterId);
    }

    return result.sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "capacity_asc":
          return a.totalSeats - b.totalSeats;
        case "capacity_desc":
          return b.totalSeats - a.totalSeats;
        default:
          return 0;
      }
    });
  }, [
    aggregatedTemplatesList,
    debouncedSearch,
    sortOption,
    typeFilter,
    templateFilterId,
  ]);

  const activeFocusedSeatsCollection = useMemo(() => {
    if (!selectedTemplateCtx) return [];
    return seats.filter((s) => s.templateId === selectedTemplateCtx.id);
  }, [seats, selectedTemplateCtx]);

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

  const filterOptions = [
    { value: "ALL", label: "All Layouts" },
    { value: "STANDARD", label: "Standard" },
    { value: "IMAX", label: "IMAX" },
    { value: "VIP", label: "VIP" },
    { value: "FOUR_DX", label: "4DX" },
  ];

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
              Configure seating arrangements, bulk grid dimensions, and row
              designations.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Bulk Generate Seats
          </button>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 w-full bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          {/* Left Section: Search Input Field */}
          <div className="relative w-full lg:max-w-xs xl:max-w-sm h-10.5 shrink-0">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search layout templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-4 text-sm shadow-inner outline-none transition-all focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700"
            />
          </div>

          {/* Right Section: Interactive Responsive Action Group Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center lg:justify-end gap-3 w-full lg:w-auto">
            {/* Filter: Specific Active Templates */}
            <div className="w-full lg:w-52 h-10.5 min-w-[140px] [&_label]:hidden [&_p]:hidden [&_span]:my-0 flex flex-col justify-center">
              <SmoothSelect
                label=""
                options={specificTemplateOptions}
                selectedValue={templateFilterId}
                onChange={(val) => setTemplateFilterId(val)}
                placeholder="Filter by Active Layout"
              />
            </div>

            {/* Filter: Screen/Architecture Class Types */}
            <div className="w-full lg:w-44 h-10.5 min-w-[130px] [&_label]:hidden [&_p]:hidden [&_span]:my-0 flex flex-col justify-center">
              <SmoothSelect
                label=""
                options={filterOptions}
                selectedValue={typeFilter}
                onChange={(val) => setTypeFilter(val as FilterType)}
                placeholder="Filter by Screen Type"
              />
            </div>

            {/* Dropdown Action: Metrics Sorting Controller */}
            <div
              ref={dropdownRef}
              className="relative w-full lg:w-48 h-10.5 min-w-[140px]"
            >
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="cursor-pointer w-full h-full flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm font-medium shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/60"
              >
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 truncate">
                  <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
                  {getSortLabel()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 shrink-0 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Floating Menu Popover Menu */}
              <div
                className={`absolute right-0 lg:right-0 mt-2 w-full sm:w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 transform origin-top-right transition-all duration-200 ease-out ${
                  isSortOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-1 invisible pointer-events-none"
                }`}
              >
                {[
                  { value: "name_asc", label: "Name: A to Z" },
                  { value: "name_desc", label: "Name: Z to A" },
                  { value: "capacity_asc", label: "Capacity: Low to High" },
                  { value: "capacity_desc", label: "Capacity: High to Low" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortOption(opt.value as SortOption);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      sortOption === opt.value
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters Global Button Actions */}
            {(search || typeFilter !== "ALL" || templateFilterId !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                  setTemplateFilterId("ALL");
                }}
                className="cursor-pointer h-10.5 w-full lg:w-auto px-4 rounded-xl text-xs font-bold tracking-wide uppercase text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-transparent transition-all duration-150 animate-in fade-in zoom-in-95 col-span-1 sm:col-span-2 lg:col-span-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE LAYER */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-zinc-200/60 text-xs font-bold uppercase text-zinc-400 tracking-wider dark:bg-zinc-900/40 dark:border-zinc-800">
                  <th className="px-6 py-4 text-center w-16">No.</th>
                  <th className="px-6 py-4">Template Name</th>
                  <th className="px-6 py-4">Screen Type</th>
                  <th className="px-6 py-4">Total Seats</th>
                  <th className="px-6 py-4 text-center w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {loading && seats.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-5">
                        <div className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : processedTemplatesList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-16 text-center text-zinc-400 font-medium"
                    >
                      No layout templates match your current active filter
                      selections.
                    </td>
                  </tr>
                ) : (
                  processedTemplatesList.map((template, idx) => (
                    <tr
                      key={template.id}
                      className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-center text-zinc-400 dark:text-zinc-500">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                        {template.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-1 text-xs font-mono font-bold border tracking-wide uppercase ${
                            SCREEN_TYPE_COLORS[
                              template.type as Exclude<FilterType, "ALL">
                            ] || "bg-zinc-100 text-zinc-700 border-zinc-200"
                          }`}
                        >
                          {template.type === "FOUR_DX" ? "4DX" : template.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-zinc-600 dark:text-zinc-400">
                        {template.totalSeats} seats configured
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedTemplateCtx({
                              id: template.id,
                              name: template.name,
                            });
                            setIsDetailsOpen(true);
                          }}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-white shadow-sm hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
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
            onClose={() => setIsCreateOpen(false)}
            onGenerate={generateBulkLayout}
          />
        )}
        {isDetailsOpen && selectedTemplateCtx && (
          <DetailModal
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            templateName={selectedTemplateCtx.name}
            seats={activeFocusedSeatsCollection}
          />
        )}
      </div>
    </div>
  );
}
