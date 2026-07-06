"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Loader2,
  ChevronDown,
  Check,
  AlertTriangle,
  Film,
} from "lucide-react";
import { useScreen } from "../../useScreen";
import { apiRequest } from "@/lib/config/axios";
import type {
  Screen,
  ScreenType,
  CreateScreenPayload,
  LayoutVariant,
} from "../../screen.types";
import {
  AggregatedScreenTemplateLayouts,
  SeatLayoutVariant,
} from "@/features/seat-templates/seat-templates.types";

interface FormModalContentProps {
  screenToEdit?: Screen | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface TheaterOption {
  id: string;
  name: string;
}

type APIResponse<T> = T | { data: T };

export default function ScreenFormModalContent({
  screenToEdit,
  onClose,
  onSuccess,
}: FormModalContentProps) {
  const {
    createScreen,
    updateScreen,
    loading: screenActionLoading,
  } = useScreen();

  const [templates, setTemplates] = useState<AggregatedScreenTemplateLayouts[]>(
    [],
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [theaters, setTheaters] = useState<TheaterOption[]>([]);
  const [loadingTheaters, setLoadingTheaters] = useState(false);

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTheaterDropdownOpen, setIsTheaterDropdownOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);

  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const theaterDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const layoutDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateScreenPayload>(() => ({
    name: screenToEdit ? screenToEdit.name : "",
    type: screenToEdit ? screenToEdit.type : ("" as ScreenType),
    theaterId: screenToEdit ? screenToEdit.theaterId : "",
    templateId: screenToEdit ? screenToEdit.templateId : "",
    layoutId: screenToEdit ? screenToEdit.layoutId || "" : "",
  }));

  const formDisabled =
    screenActionLoading || loadingTheaters || loadingTemplates;

  useEffect(() => {
    async function fetchSeatTemplates() {
      try {
        setLoadingTemplates(true);
        const response = await apiRequest<
          APIResponse<AggregatedScreenTemplateLayouts[]>
        >("get", "/template-seats");
        const unpacked = Array.isArray(response)
          ? response
          : response?.data || [];
        setTemplates(unpacked);
      } catch (err) {
        console.error("Failed loading rich blueprint structures", err);
      } finally {
        setLoadingTemplates(false);
      }
    }
    fetchSeatTemplates();
  }, []);

  useEffect(() => {
    async function fetchTheaters() {
      try {
        setLoadingTheaters(true);
        const response = await apiRequest<APIResponse<TheaterOption[]>>(
          "get",
          "/theaters",
        );
        const unpacked = Array.isArray(response)
          ? response
          : response?.data || [];
        setTheaters(unpacked);
      } catch (err) {
        console.error("Failed loading theater profiles", err);
      } finally {
        setLoadingTheaters(false);
      }
    }
    fetchTheaters();
  }, []);

  const screenTypeOptions = useMemo(() => {
    const uniqueTypes = new Set<string>();

    if (Array.isArray(templates)) {
      templates.forEach((item) => {
        if (!item) return;
        const targetType = item.screenType;
        if (targetType && item.isActive !== false) {
          uniqueTypes.add(targetType);
        }
      });
    }

    uniqueTypes.add("STANDARD");
    uniqueTypes.add("IMAX");
    uniqueTypes.add("VIP_LOUNGE");
    uniqueTypes.add("DOLBY_ATMOS");

    return Array.from(uniqueTypes).map((typeKey) => {
      const label = typeKey
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { value: typeKey as ScreenType, label };
    });
  }, [templates]);

  const availableLayoutVariants = useMemo<LayoutVariant[]>(() => {
    if (!formData.templateId || !templates) return [];

    const selectedItem = templates.find(
      (item) => item && item.templateId === formData.templateId,
    );

    if (!selectedItem || !Array.isArray(selectedItem.layouts)) return [];

    return selectedItem.layouts.map((layout: SeatLayoutVariant) => ({
      id: layout.layoutId,
      layoutId: layout.layoutId,
      layoutName:
        layout.layoutName ||
        `Variant Layout (${String(layout.layoutId).slice(0, 5)})`,
    }));
  }, [formData.templateId, templates]);

  const selectedTemplateDetails = useMemo(() => {
    if (!formData.templateId || !templates) return null;
    return (
      templates.find((item) => item?.templateId === formData.templateId) || null
    );
  }, [formData.templateId, templates]);

  const hasTypeMismatch = useMemo(() => {
    if (!formData.type || !selectedTemplateDetails) return false;
    const templateType = selectedTemplateDetails.screenType || "STANDARD";
    return formData.type.toUpperCase() !== templateType.toUpperCase();
  }, [formData.type, selectedTemplateDetails]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(target))
        setIsTypeDropdownOpen(false);
      if (
        theaterDropdownRef.current &&
        !theaterDropdownRef.current.contains(target)
      )
        setIsTheaterDropdownOpen(false);
      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(target)
      )
        setIsTemplateDropdownOpen(false);
      if (
        layoutDropdownRef.current &&
        !layoutDropdownRef.current.contains(target)
      )
        setIsLayoutDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.layoutId || hasTypeMismatch || formDisabled)
      return;
    try {
      if (screenToEdit) {
        await updateScreen(screenToEdit.id, formData);
      } else {
        await createScreen(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Action submit runtime error", err);
    }
  };

  const selectedTypeName = screenTypeOptions.find(
    (opt) => opt.value === formData.type,
  )?.label;
  const selectedTheaterName = theaters.find(
    (t) => t.id === formData.theaterId,
  )?.name;
  const selectedTemplateName = selectedTemplateDetails
    ? selectedTemplateDetails.templateName || "Unnamed Blueprint"
    : "";
  const selectedLayoutName =
    availableLayoutVariants.find((l) => l.id === formData.layoutId)
      ?.layoutName || "Select layout variants...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-all">
        {/* Cinema-themed Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-black dark:to-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
              <Film className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {screenToEdit
                  ? `Edit Hall: ${screenToEdit.name}`
                  : "Configure New Cinema Hall"}
              </h2>
              <p className="text-zinc-400 text-[11px]">
                Specify screen capabilities and hardware layouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Hall Name input */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Cinema Hall Name
            </label>
            <input
              type="text"
              required
              disabled={formDisabled}
              placeholder="e.g., Auditorium 1, IMAX Theatre"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 disabled:opacity-60 transition-all shadow-xs"
            />
          </div>

          {/* Type of Screen Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Type of Screen
            </label>
            <div className="relative" ref={typeDropdownRef}>
              <button
                type="button"
                disabled={formDisabled}
                onClick={() => {
                  setIsTypeDropdownOpen((prev) => !prev);
                  setIsTheaterDropdownOpen(false);
                  setIsTemplateDropdownOpen(false);
                  setIsLayoutDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all active:scale-[0.99] disabled:opacity-60 text-left shadow-xs"
              >
                <span
                  className={
                    !selectedTypeName
                      ? "text-zinc-400"
                      : "text-zinc-900 dark:text-zinc-100 font-medium"
                  }
                >
                  {selectedTypeName || "Select Screen Type..."}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isTypeDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isTypeDropdownOpen && !formDisabled && (
                <div className="absolute left-0 top-full z-50 w-full mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2 duration-200 ease-out origin-top">
                  {screenTypeOptions.map((option) => {
                    const isSelected = formData.type === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, type: option.value });
                          setIsTypeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left ${
                          isSelected
                            ? "bg-amber-500 text-white font-medium"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Theater Location selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Theater Complex
            </label>
            <div className="relative" ref={theaterDropdownRef}>
              <button
                type="button"
                disabled={formDisabled}
                onClick={() => {
                  setIsTheaterDropdownOpen((prev) => !prev);
                  setIsTypeDropdownOpen(false);
                  setIsTemplateDropdownOpen(false);
                  setIsLayoutDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all active:scale-[0.99] disabled:opacity-60 text-left shadow-xs"
              >
                <span
                  className={
                    !selectedTheaterName
                      ? "text-zinc-400"
                      : "text-zinc-900 dark:text-zinc-100 font-medium"
                  }
                >
                  {selectedTheaterName || "Select complex location..."}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isTheaterDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isTheaterDropdownOpen && !formDisabled && (
                <div className="absolute left-0 top-full z-50 w-full mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2 duration-200 ease-out origin-top">
                  {theaters.length === 0 ? (
                    <div className="p-3 text-xs text-center text-zinc-400">
                      No active operational theaters found.
                    </div>
                  ) : (
                    theaters.map((theater) => {
                      const isSelected = formData.theaterId === theater.id;
                      return (
                        <button
                          key={theater.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, theaterId: theater.id });
                            setIsTheaterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 font-medium"
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          }`}
                        >
                          <span className="truncate">{theater.name}</span>
                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seat Layout Blueprint Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Seat Layout Blueprint
            </label>
            <div className="relative" ref={templateDropdownRef}>
              <button
                type="button"
                disabled={formDisabled}
                onClick={() => {
                  setIsTemplateDropdownOpen((prev) => !prev);
                  setIsTypeDropdownOpen(false);
                  setIsTheaterDropdownOpen(false);
                  setIsLayoutDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all active:scale-[0.99] disabled:opacity-60 text-left shadow-xs"
              >
                <span
                  className={
                    !selectedTemplateName
                      ? "text-zinc-400"
                      : "text-zinc-900 dark:text-zinc-100 font-medium"
                  }
                >
                  {selectedTemplateName || "Select a layout blueprint..."}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isTemplateDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isTemplateDropdownOpen && !formDisabled && (
                <div className="absolute left-0 top-full z-50 w-full mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2 duration-200 ease-out origin-top">
                  {templates.length === 0 ? (
                    <div className="p-3 text-xs text-center text-zinc-400">
                      No layout blueprint schemes cached.
                    </div>
                  ) : (
                    templates.map((item) => {
                      if (!item) return null;
                      const templateId = item.templateId;
                      const templateName =
                        item.templateName || "Unnamed Blueprint";
                      const isSelected = formData.templateId === templateId;
                      const inherentType = item.screenType || "STANDARD";

                      return (
                        <button
                          key={templateId}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              templateId: templateId,
                              layoutId: "",
                            });
                            setIsTemplateDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 font-medium"
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          }`}
                        >
                          <div className="flex flex-col truncate">
                            <span className="truncate font-medium">
                              {templateName}
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-tight">
                              {inherentType} Architecture
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Business Logic Error Window */}
          {hasTypeMismatch && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 animate-in fade-in zoom-in-95 duration-150">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold">
                  Mismatched Architectural Capabilities
                </p>
                <p className="opacity-90">
                  The selected Screen Type must match the layout blueprint
                  configuration layout type (e.g.,{" "}
                  <b>{selectedTemplateDetails?.screenType || "IMAX"}</b>{" "}
                  blueprint maps).
                </p>
              </div>
            </div>
          )}

          {/* Specific Layout Variant Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Specific Layout Version Variant
            </label>
            <div className="relative" ref={layoutDropdownRef}>
              <button
                type="button"
                disabled={formDisabled || !formData.templateId}
                onClick={() => {
                  setIsLayoutDropdownOpen((prev) => !prev);
                  setIsTypeDropdownOpen(false);
                  setIsTheaterDropdownOpen(false);
                  setIsTemplateDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all active:scale-[0.99] disabled:opacity-50 text-left shadow-xs"
              >
                <span
                  className={
                    !formData.layoutId
                      ? "text-zinc-400"
                      : "text-zinc-900 dark:text-zinc-100 font-medium"
                  }
                >
                  {!formData.templateId
                    ? "Choose a blueprint first..."
                    : selectedLayoutName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isLayoutDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLayoutDropdownOpen && formData.templateId && (
                <div className="absolute left-0 top-full z-50 w-full mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2 duration-200 ease-out origin-top">
                  {availableLayoutVariants.length === 0 ? (
                    <div className="p-3 text-xs text-center text-zinc-400">
                      No layout options initialized for this blueprint template
                      layout.
                    </div>
                  ) : (
                    availableLayoutVariants.map((layout) => {
                      const isSelected = formData.layoutId === layout.id;
                      return (
                        <button
                          key={layout.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, layoutId: layout.id });
                            setIsLayoutDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 font-medium"
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          }`}
                        >
                          <span className="truncate text-left block w-full">
                            {layout.layoutName}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Call Controls Container */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={formDisabled}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-100/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                formDisabled ||
                !formData.type ||
                !formData.layoutId ||
                !formData.name.trim() ||
                hasTypeMismatch
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none"
            >
              {screenActionLoading && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {screenToEdit ? "Save Changes" : "Deploy Screen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
