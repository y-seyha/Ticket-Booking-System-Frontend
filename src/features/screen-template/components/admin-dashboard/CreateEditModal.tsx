import Modal from "@/components/ui/Modal";
import SmoothSelect from "@/components/ui/SmoothSelect";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import type {
  ScreenTemplate,
  CreateScreenTemplatePayload,
  UpdateScreenTemplatePayload,
  ScreenType,
} from "../../screen-template.types";

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    payload: CreateScreenTemplatePayload | UpdateScreenTemplatePayload,
  ) => Promise<void>;
  editingTemplate: ScreenTemplate | null;
}

export function CreateEditModal({
  isOpen,
  onClose,
  onSave,
  editingTemplate,
}: CreateEditModalProps) {
  const [name, setName] = useState(editingTemplate?.name || "");
  const [type, setType] = useState<ScreenType>(
    editingTemplate?.type || "STANDARD",
  );
  const [surcharge, setSurcharge] = useState<string>(
    editingTemplate ? String(editingTemplate.screenSurcharge) : "0",
  );
  const [description, setDescription] = useState(
    editingTemplate?.description || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name,
        type,
        screenSurcharge: Math.max(0, Number(surcharge || 0)),
        description: description || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingTemplate
          ? "Modify Template Layout Blueprint"
          : "Create Screen Template Blueprint"
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Screen Template Name
          </label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            value={name}
            placeholder="e.g. IMAX Hall Premium East"
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 transition-all disabled:opacity-50"
          />
        </div>

        <SmoothSelect
          label="Screen Base Type Layout Tier"
          options={[
            { value: "STANDARD", label: "Standard Layout Grid" },
            { value: "IMAX", label: "IMAX Specialized Layout" },
            { value: "VIP", label: "VIP Premium Lounge Suites" },
            { value: "FOUR_DX", label: "4DX Dynamic Kinetic Setup" },
          ]}
          selectedValue={type}
          onChange={(val) => setType(val as ScreenType)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Screen Surcharge ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            disabled={isSubmitting}
            value={surcharge}
            onFocus={() => surcharge === "0" && setSurcharge("")}
            onBlur={() => surcharge.trim() === "" && setSurcharge("0")}
            onChange={(e) => {
              const val = e.target.value;
              if (Number(val) >= 0 || val === "") setSurcharge(val);
            }}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 transition-all disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Description Blueprint Notes
          </label>
          <textarea
            disabled={isSubmitting}
            value={description}
            placeholder="Provide optional contextual descriptors regarding grid arrangement metrics, column spacings, structural boundaries etc..."
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 h-24 resize-none transition-all disabled:opacity-50 placeholder:text-zinc-400/80"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl cursor-pointer border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl cursor-pointer flex items-center justify-center gap-2 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors min-w-[110px]"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingTemplate ? (
              "Apply Changes"
            ) : (
              "Save Blueprint"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
