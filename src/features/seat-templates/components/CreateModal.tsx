"use client";

import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import SmoothSelect from "@/components/ui/SmoothSelect";

import {
  GenerateTemplateSeatsPayload,
  GenerationResult,
  SeatRowConfig,
} from "../seat-templates.types";

import { SeatType } from "@/features/screen/screen.types";
import { useScreenTemplate } from "@/features/screen-template/useScreenTemplate";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    payload: GenerateTemplateSeatsPayload,
  ) => Promise<GenerationResult>;
}

const SEAT_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Standard Seat" },
  { value: "VIP", label: "VIP Recliner" },
  { value: "COUPLE", label: "Couple Sofa" },
  { value: "WHEELCHAIR", label: "Wheelchair Space" },
];

export function CreateModal({ isOpen, onClose, onGenerate }: CreateModalProps) {
  const { templates, fetchTemplates } = useScreenTemplate();

  const [mainTemplateId, setMainTemplateId] = useState("");
  const [rowsCount, setRowsCount] = useState<number | "">(4);
  const [seatsPerRow, setSeatsPerRow] = useState<number | "">(12);
  const [submitting, setSubmitting] = useState(false);

  const [defaultSeatType, setDefaultSeatType] = useState<SeatType>("STANDARD");
  const [rowTypeOverrides, setRowTypeOverrides] = useState<
    Record<string, SeatType>
  >({});

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen, fetchTemplates]);

  // Filters to display only screens explicitly marked active
  const screenTemplateOptions = useMemo(() => {
    return templates
      .filter((t) => t.isActive)
      .map((t) => ({
        value: t.id,
        label: `${t.name} (${t.type})`,
      }));
  }, [templates]);

  // Handle baseline selection switches smoothly
  const handleMainTemplateChange = (val: string) => {
    setMainTemplateId(val);
    setRowTypeOverrides({});

    const matched = templates.find((t) => t.id === val);
    if (matched?.type === "VIP") {
      setDefaultSeatType("VIP");
    } else {
      setDefaultSeatType("STANDARD");
    }
  };

  // Safely handles 0 or empty transient layouts while modifying numbers
  const rowConfigs: SeatRowConfig[] = useMemo(() => {
    const currentRows = rowsCount === "" ? 0 : rowsCount;
    const safeLength = Math.min(Math.max(currentRows, 0), 26);

    return Array.from({ length: safeLength }).map((_, i) => {
      const rowLetter = String.fromCharCode(65 + i);
      const assignedSeatType = rowTypeOverrides[rowLetter] || defaultSeatType;
      return {
        row: rowLetter,
        seatType: assignedSeatType,
      };
    });
  }, [rowsCount, rowTypeOverrides, defaultSeatType]);

  const handleRowTypeChange = (rowLetter: string, selectedType: string) => {
    setRowTypeOverrides((prev) => ({
      ...prev,
      [rowLetter]: selectedType as SeatType,
    }));
  };

  // Disable submission cleanly if required items aren't input yet
  const isFormInvalid =
    !mainTemplateId ||
    rowsCount === "" ||
    seatsPerRow === "" ||
    rowsCount < 1 ||
    seatsPerRow < 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTemplate = templates.find((t) => t.id === mainTemplateId);
    if (!selectedTemplate || !selectedTemplate.isActive || isFormInvalid)
      return;

    setSubmitting(true);
    try {
      await onGenerate({
        templateId: mainTemplateId,
        rows: Number(rowsCount),
        seatsPerRow: Number(seatsPerRow),
        seatMap: rowConfigs,
      });
      setRowTypeOverrides({});
      onClose();
    } catch (_err) {
      // Global hook instances context catches tracking
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Bulk Seating Layout"
      className="max-w-xl w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {/* TARGET LAYOUT SELECTOR */}
        <div className="space-y-1.5">
          <SmoothSelect
            label="Target Screen Layout Template"
            options={screenTemplateOptions}
            selectedValue={mainTemplateId}
            onChange={handleMainTemplateChange}
            placeholder={
              screenTemplateOptions.length === 0
                ? "No active screen layouts available..."
                : "Select baseline template layout..."
            }
          />
        </div>

        {/* DIMENSIONS (GRID CONFIG) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">
              Number of Rows
            </label>
            <input
              type="number"
              min={1}
              max={26}
              value={rowsCount}
              onChange={(e) => {
                const val = e.target.value;
                setRowsCount(val === "" ? "" : Number(val));
              }}
              className="w-full h-10.5 px-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">
              Seats Per Row
            </label>
            <input
              type="number"
              min={1}
              value={seatsPerRow}
              onChange={(e) => {
                const val = e.target.value;
                setSeatsPerRow(val === "" ? "" : Number(val));
              }}
              className="w-full h-10.5 px-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition text-sm"
            />
          </div>
        </div>

        {/* DEFAULT LAYOUT CONFIG DROP DOWN */}
        <div className="space-y-1.5">
          <SmoothSelect
            label="Default Row Seat Type"
            options={SEAT_TYPE_OPTIONS}
            selectedValue={defaultSeatType}
            onChange={(val) => setDefaultSeatType(val as SeatType)}
            placeholder="Select default row seat class..."
          />
        </div>

        {/* DETAILED ROW PROPERTY OVERRIDES LIST */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-400 uppercase block">
            Customize Individual Row Seat Properties
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-2 bg-zinc-50/30 dark:bg-zinc-900/10">
            {rowConfigs.map((config) => (
              <div
                key={config.row}
                className="flex items-center justify-between gap-4 p-2 bg-white border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl shadow-sm dark:bg-zinc-900"
              >
                <div className="flex flex-col pl-2">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Row {config.row}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Payload Val: {config.seatType}
                  </span>
                </div>
                <div className="w-64 [&_label]:hidden [&_p]:hidden">
                  <SmoothSelect
                    label=""
                    options={SEAT_TYPE_OPTIONS}
                    selectedValue={config.seatType}
                    onChange={(val) => handleRowTypeChange(config.row, val)}
                    placeholder="Select seat classification..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL CONTROL INTERACTIONS ACTIONS */}
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || isFormInvalid}
            className="cursor-pointer px-5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-40 transition font-medium"
          >
            {submitting ? "Generating Layout..." : "Generate Seats"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
