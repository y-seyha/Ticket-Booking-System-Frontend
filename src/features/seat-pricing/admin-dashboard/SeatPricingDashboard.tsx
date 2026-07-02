"use client";

import React, { useState, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import { useSeatPricing } from "@/features/seat-pricing/useSeatPricing";
import {
  SeatPricingRule,
  CreateSeatPricingDto,
  UpdateSeatPricingDto,
} from "@/features/seat-pricing/seat-pricing.types";
import { FormModal } from "@/features/seat-pricing/admin-dashboard/FormModal";
import { DeleteConfirmModal } from "@/features/seat-pricing/admin-dashboard/DeleteConfirmModal";
import { DetailsModal } from "@/features/seat-pricing/admin-dashboard/DetailsModal";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardControls } from "./DashboardControls";
import { PricingTable } from "./PricingTable";

const FILTER_STATUS_OPTIONS = [
  { value: "ALL", label: "All Rules Status" },
  { value: "ACTIVE", label: "Active Rules" },
  { value: "INACTIVE", label: "Disabled Rules" },
];

const SORT_OPTIONS = [
  { value: "seatType_asc", label: "Class Tier: A to Z" },
  { value: "seatType_desc", label: "Class Tier: Z to A" },
  { value: "surcharge_asc", label: "Surcharge: Low to High" },
  { value: "surcharge_desc", label: "Surcharge: High to Low" },
];

export default function SeatPricingDashboard() {
  const {
    rules,
    loading,
    createRule,
    updateRule,
    toggleRuleActive,
    deleteRule,
  } = useSeatPricing();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState("seatType_asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeRuleCtx, setActiveRuleCtx] = useState<SeatPricingRule | null>(
    null,
  );

  // Isolated mutation lock state to manage loading indications within local portals
  const [isMutating, setIsMutating] = useState(false);

  const filteredAndSortedRules = useMemo(() => {
    let dataset = rules.filter((item) =>
      item.seatType.toLowerCase().includes(search.toLowerCase()),
    );

    if (statusFilter === "ACTIVE") dataset = dataset.filter((r) => r.isActive);
    if (statusFilter === "INACTIVE")
      dataset = dataset.filter((r) => !r.isActive);

    const [field, order] = sortConfig.split("_");
    return [...dataset].sort((a, b) => {
      if (field === "seatType") {
        return order === "asc"
          ? a.seatType.localeCompare(b.seatType)
          : b.seatType.localeCompare(a.seatType);
      } else {
        return order === "asc"
          ? a.seatSurcharge - b.seatSurcharge
          : b.seatSurcharge - a.seatSurcharge;
      }
    });
  }, [rules, search, statusFilter, sortConfig]);

  const configuredSeatTypes = useMemo(
    () => rules.map((r) => r.seatType),
    [rules],
  );

  const handleOpenCreate = () => {
    setActiveRuleCtx(null);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (rule: SeatPricingRule) => {
    setActiveRuleCtx(rule);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (rule: SeatPricingRule) => {
    setActiveRuleCtx(rule);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (rule: SeatPricingRule) => {
    setActiveRuleCtx(rule);
    setIsDeleteOpen(true);
  };

  const handleOpenStatusToggle = (rule: SeatPricingRule) => {
    setActiveRuleCtx(rule);
    setIsStatusOpen(true);
  };

  const handleUpsertSubmit = async (
    payload: CreateSeatPricingDto | UpdateSeatPricingDto,
  ) => {
    try {
      setIsMutating(true);
      if (activeRuleCtx) {
        await updateRule(activeRuleCtx.seatType, {
          seatSurcharge: payload.seatSurcharge,
        });
      } else {
        await createRule(payload as CreateSeatPricingDto);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed handling upseration pipeline request:", err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!activeRuleCtx) return;
    try {
      setIsMutating(true);
      await deleteRule(activeRuleCtx.seatType);
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("Failed executing delete parameters request:", err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleStatusToggleSubmit = async () => {
    if (!activeRuleCtx) return;
    try {
      setIsMutating(true);
      await toggleRuleActive(activeRuleCtx.seatType);
      setIsStatusOpen(false);
    } catch (error) {
      console.error(
        "Failed to execute live configuration deployment mutation:",
        error,
      );
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 p-4 md:p-8 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 antialiased">
      <div className="mx-auto max-w-5xl space-y-6">
        <DashboardHeader onAddClick={handleOpenCreate} />

        <DashboardControls
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortConfig={sortConfig}
          onSortConfigChange={setSortConfig}
          statusOptions={FILTER_STATUS_OPTIONS}
          sortOptions={SORT_OPTIONS}
        />

        <PricingTable
          loading={loading}
          rules={filteredAndSortedRules}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          onOpenDelete={handleOpenDelete}
          onOpenStatusToggle={handleOpenStatusToggle}
        />

        {isDetailsOpen && (
          <DetailsModal
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            rule={activeRuleCtx}
          />
        )}

        {isFormOpen && (
          <FormModal
            key={activeRuleCtx?.seatType ?? "create"}
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleUpsertSubmit}
            editingRule={activeRuleCtx}
            existingTypes={configuredSeatTypes}
          />
        )}

        {isDeleteOpen && activeRuleCtx && (
          <DeleteConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDeleteSubmit}
            seatType={activeRuleCtx.seatType}
          />
        )}

        {isStatusOpen && activeRuleCtx && (
          <Modal
            isOpen={isStatusOpen}
            onClose={() => !isMutating && setIsStatusOpen(false)}
            title="Modify Live Checkout Deployment"
            className="max-w-md w-full"
          >
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                {activeRuleCtx.isActive ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {activeRuleCtx.isActive
                      ? "Suspend pricing rule?"
                      : "Deploy surcharge live?"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    You are changing the state of{" "}
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      {activeRuleCtx.seatType}
                    </span>
                    .
                    {activeRuleCtx.isActive
                      ? " This will stop applying the surcharge premium to checkouts immediately."
                      : " This will begin applying the dynamic premium fee across all active reservation streams."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => setIsStatusOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keep Existing
                </button>
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={handleStatusToggleSubmit}
                  className={`px-4 py-2 rounded-xl text-white transition font-medium text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] ${
                    activeRuleCtx.isActive
                      ? "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                      : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                >
                  {isMutating ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-3 w-3 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
                    </span>
                  ) : activeRuleCtx.isActive ? (
                    "Deactivate Rule"
                  ) : (
                    "Activate Configuration"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
