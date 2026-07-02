export type ScreenType = "STANDARD" | "IMAX" | "VIP" | "FOUR_DX";

export interface TemplateSeat {
  id: string;
  row: string;
  number: number;
  type: string;
  screenTemplateId: string;
}

export interface ScreenTemplate {
  id: string;
  name: string;
  type: ScreenType;
  description?: string;
  screenSurcharge: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  templateSeats?: TemplateSeat[];
}

export interface CreateScreenTemplatePayload {
  name: string;
  type: ScreenType;
  description?: string;
  screenSurcharge: number;
}

export type UpdateScreenTemplatePayload = Partial<CreateScreenTemplatePayload>;
