export type ScreenType = "STANDARD" | "IMAX" | "VIP" | "DOLBY_ATMOS";

export type SeatType = "STANDARD" | "VIP" | "COUPLE" | "WHEELCHAIR";

export type SeatStatus = "ACTIVE" | "INACTIVE";

export interface Theater {
  id: string;
  name: string;
}

export interface ScreenTemplate {
  id: string;
  name: string;
  type: ScreenType;
}

export interface Seat {
  id: string;
  screenId: string;
  seatRow: string;
  seatNumber: number;
  posX: number;
  posY: number;
  seatType: SeatType;
  status: SeatStatus;

  createdAt: string;
  updatedAt: string;
}

export interface Screen {
  id: string;
  theaterId: string;
  templateId: string;
  name: string;
  type: ScreenType;
  createdAt: string;
  updatedAt: string;
  theater: Theater;
  template: ScreenTemplate;
  seats: Seat[];
}

export interface CreateScreenPayload {
  theaterId: string;
  templateId: string;
  name: string;
  type: ScreenType;
}

export type UpdateScreenPayload = Partial<CreateScreenPayload>;
