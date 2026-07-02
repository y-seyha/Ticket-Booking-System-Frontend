import Modal from "@/components/ui/Modal";
import { ScreenTemplate } from "../../screen-template.types";
import { Film, DollarSign, Layers, Calendar, FileText } from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ScreenTemplate | null;
}

export function DetailModal({ isOpen, onClose, template }: DetailModalProps) {
  if (!template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Template Architectural Profile"
    >
      <div className="space-y-4 text-sm animate-in fade-in-50 duration-200">
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400 font-medium">
              Template Identity
            </div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-50">
              {template.name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <Layers className="h-3.5 w-3.5" /> Structure Type
            </div>
            <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {template.type}
            </span>
          </div>

          <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <DollarSign className="h-3.5 w-3.5" /> Surcharge Fee
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              ${Number(template.screenSurcharge).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <FileText className="h-3.5 w-3.5" /> Layout Description
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {template.description ||
              "No supplemental descriptions attached to this template schema configuration."}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Core Identifier:
          </div>
          <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 scale-95">
            {template.id}
          </span>
        </div>
      </div>
    </Modal>
  );
}
