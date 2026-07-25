"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Check,
  Loader2,
  Lock,
  Bell,
  Ticket,
  Building2,
} from "lucide-react";
import { settingsApi } from "@/features/settings/settings.api";
import { SettingResponse } from "@/features/settings/settings.types";

const categoryMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  general: { label: "General", icon: <Building2 className="w-4 h-4" /> },
  booking: { label: "Booking", icon: <Ticket className="w-4 h-4" /> },
  notification: { label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  security: { label: "Security", icon: <Lock className="w-4 h-4" /> },
};

function SettingRow({
  setting,
  value,
  onSave,
  savingKey,
}: {
  setting: SettingResponse;
  value: string;
  onSave: (key: string, value: string) => void;
  savingKey: string | null;
}) {
  const [dirty, setDirty] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
    setDirty(false);
  }, [value]);

  const label = setting.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const isSaving = savingKey === setting.key;

  const handleChange = (v: string) => {
    setLocalValue(v);
    setDirty(v !== value);
  };

  const handleSave = () => {
    onSave(setting.key, localValue);
    setDirty(false);
  };

  if (setting.type === "boolean") {
    return (
      <div className="flex items-center justify-between py-3">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
          {setting.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{setting.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
          ) : (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localValue === "true"}
                onChange={(e) => {
                  const v = e.target.checked ? "true" : "false";
                  setLocalValue(v);
                  onSave(setting.key, v);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-50" />
            </label>
          )}
        </div>
      </div>
    );
  }

  if (setting.type === "number") {
    return (
      <div className="py-3">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
        {setting.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-2">{setting.description}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full max-w-xs h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
          />
          {dirty && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center w-10.5 h-10.5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
      {setting.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-2">{setting.description}</p>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full max-w-md h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
        />
        {dirty && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center w-10.5 h-10.5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [grouped, setGrouped] = useState<Record<string, SettingResponse[]>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsApi.getAll();
      setGrouped(data);
      const flat: Record<string, string> = {};
      for (const arr of Object.values(data)) {
        for (const s of arr) {
          flat[s.key] = s.value;
        }
      }
      setValues(flat);
      setExpanded(Object.fromEntries(Object.keys(data).map((k) => [k, true])));
    } catch {
      /* empty state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (key: string, newValue: string) => {
    setSavingKey(key);
    setValues((prev) => ({ ...prev, [key]: newValue }));
    try {
      await settingsApi.updateOne(key, newValue);
    } catch {
      setValues((prev) => ({ ...prev, [key]: values[key] }));
    } finally {
      setSavingKey(null);
    }
  };

  const categories = Object.entries(grouped);

  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            System Settings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure application-wide settings. Changes are saved individually.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <p className="text-zinc-400 text-sm">No settings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(([category, categorySettings]) => (
            <div
              key={category}
              className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))
                }
                className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <span className="text-zinc-400">
                    {categoryMeta[category]?.icon || null}
                  </span>
                  {categoryMeta[category]?.label || category}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-medium">
                    {categorySettings.length} setting{categorySettings.length !== 1 ? "s" : ""}
                  </span>
                  {expanded[category] ? (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </button>
              {expanded[category] && (
                <div className="px-6 pb-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {categorySettings.map((setting) => (
                    <SettingRow
                      key={setting.key}
                      setting={setting}
                      value={values[setting.key] ?? setting.value}
                      onSave={handleSave}
                      savingKey={savingKey}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
