
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

export interface ScreenTemplateMini {
  id: string;
  name: string;
  type: ScreenType;
}

export interface ScreenTemplateSeat {
  id: string;
  templateId: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: SeatType;
  template?: ScreenTemplateMini;
}

export interface GenerationResult {
  message: string;
  total: number;
}