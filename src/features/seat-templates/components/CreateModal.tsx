"use client";

import React, { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import SmoothSelect from "@/components/ui/SmoothSelect";

import {
  GenerateTemplateSeatsPayload,
  GenerationResult,
  SeatRowConfig,
  UpdateTemplateSeatsPayload,
} from "../seat-templates.types";

import { SeatType } from "@/features/screen/screen.types";
import { useSeatTemplate } from "../useSeatTemplate";

interface EditLayoutContext {
  templateId: string;
  templateName: string;
  layout?: {
    layoutId: string;
    layoutName: string;
    createdAt: string;
    seats: Array<{
      id: string;
      seatRow: string;
      seatNumber: number;
      posX: number;
      posY: number;
      seatType: SeatType;
    }>;
  };
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    payload: GenerateTemplateSeatsPayload,
  ) => Promise<GenerationResult>;
  onUpdate: (
    templateId: string,
    layoutId: string,
    payload: UpdateTemplateSeatsPayload,
  ) => Promise<{ message: string }>;
  editLayoutContext?: EditLayoutContext | null;
}

const SEAT_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Standard Seat" },
  { value: "VIP", label: "VIP Recliner" },
  { value: "COUPLE", label: "Couple Sofa" },
  { value: "WHEELCHAIR", label: "Wheelchair Space" },
];

export function CreateModal({
  isOpen,
  onClose,
  onGenerate,
  onUpdate,
  editLayoutContext,
}: CreateModalProps) {
  const { baseTemplates } = useSeatTemplate();

  const isEditMode = !!editLayoutContext?.layout;

  const layoutSeats = editLayoutContext?.layout?.seats || [];
  const uniqueRowsFromLayout = Array.from(
    new Set(layoutSeats.map((s) => s.seatRow)),
  );
  const calculatedSeatsPerRow =
    uniqueRowsFromLayout.length > 0
      ? layoutSeats.filter((s) => s.seatRow === uniqueRowsFromLayout[0]).length
      : 12;

  const stateResetKey = editLayoutContext?.layout?.layoutId || "create-mode";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode ? "Modify Layout Variant" : "Generate Bulk Seating Layout"
      }
      className="max-w-xl w-full"
    >
      <InnerLayoutForm
        key={stateResetKey}
        isEditMode={isEditMode}
        editLayoutContext={editLayoutContext}
        baseTemplates={baseTemplates}
        initialLayoutName={editLayoutContext?.layout?.layoutName || ""}
        initialMainTemplateId={editLayoutContext?.templateId || ""}
        initialRowsCount={isEditMode ? uniqueRowsFromLayout.length : 4}
        initialSeatsPerRow={isEditMode ? calculatedSeatsPerRow : 12}
        initialRowOverrides={useMemo(() => {
          const overrides: Record<string, SeatType> = {};
          layoutSeats.forEach((seat) => {
            overrides[seat.seatRow] = seat.seatType;
          });
          return overrides;
        }, [layoutSeats])}
        onGenerate={onGenerate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    </Modal>
  );
}

interface InnerLayoutFormProps {
  isEditMode: boolean;
  editLayoutContext: EditLayoutContext | null | undefined;
  baseTemplates: Array<{
    id: string;
    name: string;
    type: string;
    isActive: boolean;
  }>;
  initialLayoutName: string;
  initialMainTemplateId: string;
  initialRowsCount: number | "";
  initialSeatsPerRow: number | "";
  initialRowOverrides: Record<string, SeatType>;
  onGenerate: CreateModalProps["onGenerate"];
  onUpdate: CreateModalProps["onUpdate"];
  onClose: () => void;
}

function InnerLayoutForm({
  isEditMode,
  editLayoutContext,
  baseTemplates,
  initialLayoutName,
  initialMainTemplateId,
  initialRowsCount,
  initialSeatsPerRow,
  initialRowOverrides,
  onGenerate,
  onUpdate,
  onClose,
}: InnerLayoutFormProps) {
  const [layoutName, setLayoutName] = useState(initialLayoutName);
  const [mainTemplateId, setMainTemplateId] = useState(initialMainTemplateId);
  const [rowsCount, setRowsCount] = useState<number | "">(initialRowsCount);
  const [seatsPerRow, setSeatsPerRow] = useState<number | "">(
    initialSeatsPerRow,
  );
  const [submitting, setSubmitting] = useState(false);

  const matchedTemplate = baseTemplates.find((t) => t.id === mainTemplateId);
  const [defaultSeatType, setDefaultSeatType] = useState<SeatType>(
    matchedTemplate?.type === "VIP" ? "VIP" : "STANDARD",
  );
  const [rowTypeOverrides, setRowTypeOverrides] =
    useState<Record<string, SeatType>>(initialRowOverrides);

  const screenTemplateOptions = useMemo(() => {
    return baseTemplates
      .filter((t) => t.isActive)
      .map((t) => ({
        value: t.id,
        label: `${t.name} (${t.type})`,
      }));
  }, [baseTemplates]);

  const handleMainTemplateChange = (val: string) => {
    setMainTemplateId(val);
    setRowTypeOverrides({});
    const matched = baseTemplates.find((t) => t.id === val);
    setDefaultSeatType(matched?.type === "VIP" ? "VIP" : "STANDARD");
  };

  const rowConfigs: SeatRowConfig[] = useMemo(() => {
    const currentRows = rowsCount === "" ? 0 : rowsCount;
    const safeLength = Math.min(Math.max(currentRows, 0), 26);

    return Array.from({ length: safeLength }).map((_, i) => {
      const rowLetter = String.fromCharCode(65 + i);
      return {
        row: rowLetter,
        seatType: rowTypeOverrides[rowLetter] || defaultSeatType,
      };
    });
  }, [rowsCount, rowTypeOverrides, defaultSeatType]);

  const handleRowTypeChange = (rowLetter: string, selectedType: string) => {
    setRowTypeOverrides((prev) => ({
      ...prev,
      [rowLetter]: selectedType as SeatType,
    }));
  };

  const isFormInvalid =
    (!isEditMode && !mainTemplateId) ||
    rowsCount === "" ||
    seatsPerRow === "" ||
    rowsCount < 1 ||
    seatsPerRow < 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setSubmitting(true);
    try {
      if (isEditMode && editLayoutContext?.layout) {
        await onUpdate(
          editLayoutContext.templateId,
          editLayoutContext.layout.layoutId,
          {
            name: layoutName,
            rows: Number(rowsCount),
            seatsPerRow: Number(seatsPerRow),
            seatMap: rowConfigs,
          },
        );
      } else {
        await onGenerate({
          templateId: mainTemplateId,
          rows: Number(rowsCount),
          seatsPerRow: Number(seatsPerRow),
          seatMap: rowConfigs,
        });
      }
      onClose();
    } catch (err) {
      console.error("Action execution failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {/* CONDITIONAL RENDERING BASED ON MODE */}
      {isEditMode ? (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
          <div>
            <span className="text-xs text-zinc-400 font-bold uppercase block">
              Editing Layout For
            </span>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {editLayoutContext?.templateName}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">
              Layout Variant Name
            </label>
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              className="w-full h-10.5 px-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition text-sm"
              placeholder="e.g., VIP Weekend Layout"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <SmoothSelect
            label="Target Screen Layout Template"
            options={screenTemplateOptions}
            selectedValue={mainTemplateId}
            onChange={handleMainTemplateChange}
            placeholder="Select baseline template layout..."
          />
        </div>
      )}

      {/* DIMENSIONS */}
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
            onChange={(e) =>
              setRowsCount(e.target.value === "" ? "" : Number(e.target.value))
            }
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
            onChange={(e) =>
              setSeatsPerRow(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full h-10.5 px-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition text-sm"
          />
        </div>
      </div>

      {/* DEFAULT ROW SEAT TYPE */}
      <div className="space-y-1.5">
        <SmoothSelect
          label="Default Row Seat Type"
          options={SEAT_TYPE_OPTIONS}
          selectedValue={defaultSeatType}
          onChange={(val) => setDefaultSeatType(val as SeatType)}
          placeholder="Select default row seat class..."
        />
      </div>

      {/* INDIVIDUAL ROW CUSTOMIZATION */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase block">
          Customize Individual Row Properties
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
                  Type: {config.seatType}
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

      {/* ACTION BUTTONS */}
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
          {submitting
            ? "Processing..."
            : isEditMode
              ? "Update Variant Layout"
              : "Generate Seats"}
        </button>
      </div>
    </form>
  );
}
