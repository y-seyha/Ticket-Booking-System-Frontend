import { SeatType } from "@/features/screen/screen.types";

export interface SeatPricingRule {
  seatType: SeatType;
  seatSurcharge: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSeatPricingDto {
  seatType: SeatType;
  seatSurcharge: number;
  isActive?: boolean;
}

export interface UpdateSeatPricingDto {
  seatSurcharge?: number;
  isActive?: boolean;
}

export type SortField = "seatType" | "seatSurcharge";
export type SortOrder = "asc" | "desc";
