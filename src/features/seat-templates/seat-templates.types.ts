import { ScreenType, SeatType } from "../screen/screen.types";

export interface SeatRowConfig {
  row: string;
  seatType: SeatType;
}

export interface GenerateTemplateSeatsPayload {
  templateId: string;
  rows: number;
  seatsPerRow: number;
  seatMap: SeatRowConfig[];
}

export interface UpdateTemplateSeatsPayload {
  name?: string;
  rows?: number;
  seatsPerRow?: number;
  seatMap?: SeatRowConfig[];
}

export interface StrippedTemplateSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: SeatType;
}

export interface SeatLayoutVariant {
  layoutId: string;
  layoutName: string;
  createdAt: string;
  seats: StrippedTemplateSeat[];
}

export interface AggregatedScreenTemplateLayouts {
  templateId: string;
  templateName: string;
  screenType: ScreenType;
  screenSurcharge: string;
  isActive: boolean;
  layouts: SeatLayoutVariant[];
}

export interface GenerationResult {
  message: string;
  screenTemplateId: string;
  seatLayout: {
    id: string;
    name: string;
    totalSeatsGenerated: number;
  };
}
