"use client";

import Modal from "@/components/ui/Modal";
import {
  Film,
  DollarSign,
  Layers,
  Calendar,
  FileText,
  Clock,
  Armchair,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ScreenType, TemplateSeat } from "../../screen-template.types";

interface LayoutVariant {
  id: string;
  layoutId: string;
  name: string;
  layoutName: string;
  seatsCount: number;
}

export interface ExtendedScreenTemplate {
  id: string;
  name: string;
  type: ScreenType;
  description: string | null | undefined;
  isActive: boolean;
  screenSurcharge: string | number;
  createdAt: string;
  updatedAt: string;
  templateSeats: TemplateSeat[];
  layouts?: LayoutVariant[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ExtendedScreenTemplate | null;
}

export function DetailModal({ isOpen, onClose, template }: DetailModalProps) {
  if (!template) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Template Architectural Profile"
      className="max-w-2xl w-full"
    >
      <div className="space-y-5 text-sm animate-in fade-in-50 duration-200 max-h-[80vh] overflow-y-auto px-1 custom-scrollbar">
        {/* Header Title Section */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-sm">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Template Identity
              </div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {template.name}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              template.isActive
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
            }`}
          >
            {template.isActive ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" /> Active
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" /> Inactive
              </>
            )}
          </div>
        </div>

        {/* Technical Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3.5 border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-zinc-500" /> Structure Type
            </div>
            <span className="inline-block mt-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono font-bold dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
              {template.type}
            </span>
          </div>

          <div className="p-3.5 border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <DollarSign className="h-3.5 w-3.5 text-zinc-500" /> Surcharge Fee
            </div>
            <span className="text-base font-black text-zinc-900 dark:text-zinc-50 block mt-0.5">
              ${Number(template.screenSurcharge).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Schema Description Panel */}
        <div className="space-y-1.5 p-3.5 border border-zinc-100 dark:border-zinc-800/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5 text-zinc-500" /> Layout
            Description
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium pt-0.5">
            {template.description ||
              "No supplemental descriptions attached to this template schema configuration."}
          </p>
        </div>

        {/* Layout Variants Render Mapping List Block */}
        <div className="space-y-2.5">
          <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-zinc-500" /> Layout Variants (
            {template.layouts?.length || 0})
          </div>

          {!template.layouts || template.layouts.length === 0 ? (
            <div className="text-xs text-zinc-400 italic p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
              No structural sub-layouts registered to this template blueprint.
            </div>
          ) : (
            <div className="space-y-2">
              {template.layouts.map((layout) => (
                <div
                  key={layout.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {layout.layoutName || layout.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      ID: {layout.layoutId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-200/40 dark:border-zinc-800/60">
                    <Armchair className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      {layout.seatsCount} Seats
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creation/Update Modification Timestamp Log Panel Footer */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>Created: {formatDate(template.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>Updated: {formatDate(template.updatedAt)}</span>
          </div>
        </div>

        {/* Identity Token Descriptor */}
        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/30 p-2 rounded-lg text-[10px] font-mono text-zinc-400 border border-zinc-100 dark:border-zinc-800/40 mt-2">
          <span>CORE SPECIFICATION ID:</span>
          <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">
            {template.id}
          </span>
        </div>
      </div>
    </Modal>
  );
}
