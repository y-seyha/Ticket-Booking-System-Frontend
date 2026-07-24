import { apiRequest } from "@/lib/config/axios";
import { SettingsGrouped, SettingResponse } from "./settings.types";

export const settingsApi = {
  getAll() {
    return apiRequest<SettingsGrouped>("get", "/settings");
  },

  updateAll(settings: Record<string, string>) {
    return apiRequest<Record<string, SettingResponse>, { settings: Record<string, string> }>("put", "/settings", { settings });
  },

  updateOne(key: string, value: string) {
    return this.updateAll({ [key]: value });
  },
};