"use client";

import { SettingResponse } from "../settings.types";

interface SettingsFieldProps {
  setting: SettingResponse;
  value: string;
  onChange: (value: string) => void;
}

export function SettingsField({ setting, value, onChange }: SettingsFieldProps) {
  const label = setting.key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (setting.type === "boolean") {
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <label className="text-sm font-medium">{label}</label>
          {setting.description && <p className="text-xs text-zinc-400 mt-0.5">{setting.description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={value === "true"} onChange={(e) => onChange(e.target.checked ? "true" : "false")} className="sr-only peer" />
          <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>
    );
  }

  if (setting.type === "number") {
    return (
      <div className="py-2">
        <label className="text-sm font-medium">{label}</label>
        {setting.description && <p className="text-xs text-zinc-400 mt-0.5 mb-2">{setting.description}</p>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-xs px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm"
        />
      </div>
    );
  }

  return (
    <div className="py-2">
      <label className="text-sm font-medium">{label}</label>
      {setting.description && <p className="text-xs text-zinc-400 mt-0.5 mb-2">{setting.description}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-md px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm"
      />
    </div>
  );
}