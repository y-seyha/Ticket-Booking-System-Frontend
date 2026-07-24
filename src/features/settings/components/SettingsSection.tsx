"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SettingResponse } from "../settings.types";
import { SettingsField } from "./SettingsField";

interface SettingsSectionProps {
  category: string;
  settings: SettingResponse[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const categoryLabels: Record<string, string> = {
  general: "General",
  booking: "Booking",
  notification: "Notifications",
  security: "Security",
  appearance: "Appearance",
};

export function SettingsSection({ category, settings, values, onChange }: SettingsSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <h3 className="text-base font-semibold">{categoryLabels[category] || category}</h3>
        {expanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
      </button>
      {expanded && (
        <div className="px-6 pb-4 space-y-4">
          {settings.map((setting) => (
            <SettingsField
              key={setting.key}
              setting={setting}
              value={values[setting.key] ?? setting.value}
              onChange={(v) => onChange(setting.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}