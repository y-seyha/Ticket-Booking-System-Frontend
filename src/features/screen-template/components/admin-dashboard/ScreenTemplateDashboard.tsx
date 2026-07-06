"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  ShieldAlert,
  Loader2,
  RefreshCw,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import {
  CreateScreenTemplatePayload,
  ScreenTemplate,
  UpdateScreenTemplatePayload,
} from "../../screen-template.types";

import Modal from "@/components/ui/Modal";
import { useScreenTemplate } from "../../useScreenTemplate";
import { CreateEditModal } from "./CreateEditModal";
import { DetailModal, ExtendedScreenTemplate } from "./DetailModal";

const FILTER_TYPES = ["ALL", "STANDARD", "IMAX", "VIP", "FOUR_DX"];

type SortOption = "name_asc" | "name_desc" | "surcharge_asc" | "surcharge_desc";

export default function ScreenTemplateDashboard() {
  const {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleActive,
  } = useScreenTemplate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<
    ExtendedScreenTemplate | ScreenTemplate | null
  >(null);
  const [statusToggleLoading, setStatusToggleLoading] = useState(false);

  const filterContainerRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
      setCurrentPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!filterContainerRef.current) return;

    const activeIndex = FILTER_TYPES.indexOf(filterType);
    const buttons = filterContainerRef.current.querySelectorAll("button");
    const targetButton = buttons[activeIndex];

    if (targetButton) {
      setPillStyle({
        left: `${targetButton.offsetLeft}px`,
        width: `${targetButton.offsetWidth}px`,
        opacity: 1,
      });
    }
  }, [filterType, templates]);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (t.description?.toLowerCase() || "").includes(
        debouncedSearch.toLowerCase(),
      );
    const matchesType = filterType === "ALL" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "surcharge_asc":
        return Number(a.screenSurcharge) - Number(b.screenSurcharge);
      case "surcharge_desc":
        return Number(b.screenSurcharge) - Number(a.screenSurcharge);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedTemplates.length / itemsPerPage);
  const displayedTemplates = sortedTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSave = async (
    payload: CreateScreenTemplatePayload | UpdateScreenTemplatePayload,
  ) => {
    if (selectedTemplate) {
      await updateTemplate(
        selectedTemplate.id,
        payload as UpdateScreenTemplatePayload,
      );
    } else {
      await createTemplate(payload as CreateScreenTemplatePayload);
    }
  };

  const handleConfirmedStatusToggle = async () => {
    if (!selectedTemplate) return;
    setStatusToggleLoading(true);
    try {
      await toggleActive(selectedTemplate.id);
      setIsStatusConfirmOpen(false);
    } finally {
      setStatusToggleLoading(false);
    }
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case "name_asc":
        return "Name: A to Z";
      case "name_desc":
        return "Name: Z to A";
      case "surcharge_asc":
        return "Surcharge: Low to High";
      case "surcharge_desc":
        return "Surcharge: High to Low";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 p-4 md:p-8 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 antialiased">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Screen & Seat Layout Templates
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Configure theater physical grid archetypes, default capacities,
              and base fees.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedTemplate(null);
              setIsEditOpen(true);
            }}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4.5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm shadow-zinc-950/10"
          >
            <Plus className="h-4 w-4 stroke-3" /> Create Template
          </button>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
            {/* Search Input Container */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter blueprints..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsSearching(true);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-10 py-2.5 text-sm shadow-sm outline-none transition-all focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-900"
              />
              {isSearching && (
                <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
              )}
            </div>

            {/* Smooth Dropdown Sort Selection Node Container Wrapper */}
            <div ref={sortDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="cursor-pointer w-full sm:w-52 flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850/60"
              >
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 truncate">
                  <ArrowUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
                  {getSortLabel()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Animated Floating Overlay Menu Panel Container */}
              <div
                className={`absolute left-0 mt-2 w-56 rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 transform origin-top-left transition-all duration-200 ease-out ${
                  isSortDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-1 invisible pointer-events-none"
                }`}
              >
                {[
                  { value: "name_asc", label: "Name: A to Z" },
                  { value: "name_desc", label: "Name: Z to A" },
                  { value: "surcharge_asc", label: "Surcharge: Low to High" },
                  { value: "surcharge_desc", label: "Surcharge: High to Low" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortOption(option.value as SortOption);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`cursor-pointer w-full text-left rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      sortOption === option.value
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ANIMATED SLIDING TABS WRAPPER */}
          <div
            ref={filterContainerRef}
            className="relative overflow-x-auto flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 self-start md:self-auto"
          >
            <div
              style={pillStyle}
              className="absolute top-1 bottom-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm transition-all duration-300 ease-out pointer-events-none"
            />

            {FILTER_TYPES.map((type) => {
              const isActive = filterType === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setCurrentPage(1);
                  }}
                  className={`relative z-10 cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTAINER/GRID DATA LAYOUT */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-zinc-200/60 text-xs font-bold uppercase text-zinc-400 tracking-wider dark:bg-zinc-900/40 dark:border-zinc-800">
                  <th className="px-6 py-4 text-center w-16">N.o</th>
                  <th className="px-6 py-4">Name Blueprint</th>
                  <th className="px-6 py-4">Architecture Class</th>
                  <th className="px-6 py-4">Surcharge</th>
                  <th className="px-6 py-4">Operational Status</th>
                  <th className="px-6 py-4 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-5">
                        <div className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : displayedTemplates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-zinc-400 font-medium"
                    >
                      No matching layout blueprints discovered.
                    </td>
                  </tr>
                ) : (
                  displayedTemplates.map((t, index) => {
                    // Calculate sequential global raw index offset positions accurately across pages
                    const numericalSequenceIndex =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold text-center text-zinc-400 dark:text-zinc-500">
                          {numericalSequenceIndex}
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                          {t.name}
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const typeStyles: Record<string, string> = {
                              STANDARD:
                                "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
                              IMAX: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50",
                              VIP: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
                              FOUR_DX:
                                "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
                            };

                            const currentStyle =
                              typeStyles[t.type] ||
                              "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";

                            return (
                              <span
                                className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-mono font-bold border ${currentStyle}`}
                              >
                                {t.type.replace("_", " ")}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-600 dark:text-zinc-400">
                          ${Number(t.screenSurcharge).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedTemplate(t);
                              setIsStatusConfirmOpen(true);
                            }}
                            className={`cursor-pointer relative inline-flex h-5.5 w-10.5 items-center rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                              t.isActive
                                ? "bg-zinc-900 dark:bg-zinc-100"
                                : "bg-zinc-200 dark:bg-zinc-800"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ease-out bg-white dark:bg-zinc-950 ${
                                t.isActive ? "translate-x-5" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 p-1 border border-zinc-200/40 dark:border-zinc-800 rounded-xl">
                            <button
                              onClick={() => {
                                setSelectedTemplate(t);
                                setIsDetailsOpen(true);
                              }}
                              className="cursor-pointer p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-900 rounded-lg transition-all"
                              title="View Specifications"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTemplate(t);
                                setIsEditOpen(true);
                              }}
                              className="cursor-pointer p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-900 rounded-lg transition-all"
                              title="Edit Properties"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTemplate(t);
                                setIsDeleteOpen(true);
                              }}
                              className="cursor-pointer p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                              title="Delete Structure"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/10">
              <span className="text-xs font-medium text-zinc-500">
                Showing page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 transition-opacity"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 transition-opacity"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        {isEditOpen && (
          <CreateEditModal
            key={selectedTemplate?.id || "new-blueprint"}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSave}
            editingTemplate={selectedTemplate}
          />
        )}

        <DetailModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          template={selectedTemplate as ExtendedScreenTemplate | null}
        />

        {/* STATUS ALTERATION CONFIRM DIALOG */}
        <Modal
          isOpen={isStatusConfirmOpen}
          onClose={() => setIsStatusConfirmOpen(false)}
          title="Alter Template Scope State"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 rounded-xl">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Confirm updating operational bounds for{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {'"'}
                  {selectedTemplate?.name}
                  {'"'}
                </span>
                . Deactivation isolates selection assignments from dynamic
                booking engines.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                disabled={statusToggleLoading}
                onClick={() => setIsStatusConfirmOpen(false)}
                className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium dark:border-zinc-800 transition-colors disabled:opacity-50"
              >
                Abort
              </button>
              <button
                disabled={statusToggleLoading}
                onClick={handleConfirmedStatusToggle}
                className="cursor-pointer rounded-xl flex items-center justify-center gap-2 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 min-w-25"
              >
                {statusToggleLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Confirm Lifecycle"
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* DELETION CONFIRM DIALOG */}
        <Modal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Destructive Context Warning"
        >
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to permanently remove &quot;
              {selectedTemplate?.name}&quot;? Complete dependencies, historical
              grids, and structural mappings will break completely. This
              operation is irreversible.
            </p>
            <div className="flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium dark:border-zinc-800 transition-colors"
              >
                Cancel Operations
              </button>
              <button
                onClick={async () => {
                  if (selectedTemplate) {
                    await deleteTemplate(selectedTemplate.id);
                    setIsDeleteOpen(false);
                  }
                }}
                className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                Confirm Destruction
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
