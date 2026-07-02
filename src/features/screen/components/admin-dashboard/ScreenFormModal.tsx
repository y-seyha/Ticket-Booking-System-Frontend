"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, ChevronDown, Check } from "lucide-react";
import { useScreen } from "../../useScreen";
import { apiRequest } from "@/lib/config/axios";
import type {
  Screen,
  ScreenType,
  CreateScreenPayload,
} from "../../screen.types";

interface FormModalProps {
  isOpen: boolean;
  screenToEdit?: Screen | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface TheaterOption {
  id: string;
  name: string;
}

export default function ScreenFormModal({
  isOpen,
  screenToEdit,
  onClose,
  onSuccess,
}: FormModalProps) {
  const {
    createScreen,
    updateScreen,
    loading: screenActionLoading,
  } = useScreen();

  const [theaters, setTheaters] = useState<TheaterOption[]>([]);
  const [loadingTheaters, setLoadingTheaters] = useState(false);
  const [isTheaterDropdownOpen, setIsTheaterDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateScreenPayload>({
    name: "",
    type: "STANDARD",
    theaterId: "",
    templateId: "",
  });

  const [prevSyncId, setPrevSyncId] = useState<string | null | undefined>(
    undefined,
  );
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const isEditMode = !!screenToEdit;
  const formDisabled = screenActionLoading || loadingTheaters;

  const currentTargetId = screenToEdit ? screenToEdit.id : null;
  if (currentTargetId !== prevSyncId || isOpen !== prevIsOpen) {
    setPrevSyncId(currentTargetId);
    setPrevIsOpen(isOpen);
    setFormData({
      name: screenToEdit ? screenToEdit.name : "",
      type: screenToEdit ? screenToEdit.type : "STANDARD",
      theaterId: screenToEdit ? screenToEdit.theaterId : "",
      templateId: screenToEdit ? screenToEdit.templateId : "",
    });
    setIsTheaterDropdownOpen(false);
  }

  useEffect(() => {
    async function fetchTheaters() {
      if (!isOpen) return;
      try {
        setLoadingTheaters(true);
        const response = await apiRequest<
          TheaterOption[] | { data: TheaterOption[] }
        >("get", "/theaters", undefined, {});
        const unpacked = Array.isArray(response)
          ? response
          : response?.data || [];
        setTheaters(unpacked);
      } catch (err) {
        console.error("Failed loading local theater entities", err);
      } finally {
        setLoadingTheaters(false);
      }
    }

    fetchTheaters();
  }, [isOpen]);

  // 2. Handle closing the custom dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTheaterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && screenToEdit) {
        await updateScreen(screenToEdit.id, formData);
      } else {
        await createScreen(formData);
      }
      onSuccess();
      onClose();
    } catch {
      // Managed internally inside hook pipeline structures
    }
  };

  const selectedTheaterName = theaters.find(
    (t) => t.id === formData.theaterId,
  )?.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {isEditMode
              ? `Modify ${screenToEdit.name}`
              : "New Screen Configuration"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration Inputs form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
              Screen Name
            </label>
            <input
              type="text"
              required
              disabled={formDisabled}
              placeholder="e.g., Screen 1, IMAX Hall"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-60 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
              Screen Type
            </label>
            <select
              value={formData.type}
              disabled={formDisabled}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as ScreenType })
              }
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-60 transition-all"
            >
              <option value="STANDARD">Standard Digital</option>
              <option value="IMAX">IMAX Cinema</option>
              <option value="VIP">VIP Premium Lounge</option>
              <option value="DOLBY_ATMOS">Dolby Atmos Surround</option>
            </select>
          </div>

          {/* Fully Animated Custom Dropdown Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
              Theater Location
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                disabled={formDisabled}
                onClick={() => setIsTheaterDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all active:scale-[0.99] disabled:opacity-60 text-left"
              >
                <span
                  className={
                    !selectedTheaterName
                      ? "text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100 font-medium"
                  }
                >
                  {loadingTheaters
                    ? "Loading locations..."
                    : selectedTheaterName || "Select a theater location..."}
                </span>
                {loadingTheaters ? (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                ) : (
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                      isTheaterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {isTheaterDropdownOpen && !formDisabled && (
                <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2 duration-200 ease-out origin-top">
                  {theaters.length === 0 ? (
                    <div className="p-3 text-xs text-center text-zinc-400">
                      No available theater locations.
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
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left group ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 font-medium"
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 active:bg-zinc-200/50 dark:active:bg-zinc-800/50"
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
            <input
              type="hidden"
              required
              value={formData.theaterId}
              name="theaterId"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
              Seat Layout Template
            </label>
            <input
              type="text"
              required
              disabled={formDisabled}
              placeholder="Enter seat template blueprint ID"
              value={formData.templateId}
              onChange={(e) =>
                setFormData({ ...formData, templateId: e.target.value })
              }
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-60 transition-all"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={formDisabled}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formDisabled}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {screenActionLoading && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {isEditMode ? "Save Changes" : "Deploy Screen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
