export interface SettingResponse {
  key: string;
  value: string;
  type: string;
  description: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type SettingsGrouped = Record<string, SettingResponse[]>;