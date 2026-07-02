import { apiRequest } from "@/lib/config/axios";
import { SeatType } from "@/features/screen/screen.types";
import {
  SeatPricingRule,
  CreateSeatPricingDto,
  UpdateSeatPricingDto,
} from "./seat-pricing.types";

type SeatPricingRuleRaw = Omit<SeatPricingRule, "seatSurcharge"> & {
  seatSurcharge: string | number;
};

const normalizeRule = (rule: SeatPricingRuleRaw): SeatPricingRule => ({
  ...rule,
  seatSurcharge: Number(rule.seatSurcharge),
});

const normalizeRules = (rules: SeatPricingRuleRaw[]): SeatPricingRule[] =>
  rules.map(normalizeRule);

export const seatPricingApi = {
  create: async (dto: CreateSeatPricingDto): Promise<SeatPricingRule> => {
    const res = await apiRequest<SeatPricingRuleRaw, CreateSeatPricingDto>(
      "post",
      "/seat-pricing",
      dto,
    );

    return normalizeRule(res);
  },

  findAll: async (): Promise<SeatPricingRule[]> => {
    const res = await apiRequest<SeatPricingRuleRaw[]>("get", "/seat-pricing");

    return normalizeRules(res);
  },

  findOne: async (seatType: SeatType): Promise<SeatPricingRule> => {
    const res = await apiRequest<SeatPricingRuleRaw>(
      "get",
      `/seat-pricing/${seatType}`,
    );

    return normalizeRule(res);
  },

  update: async (
    seatType: SeatType,
    dto: UpdateSeatPricingDto,
  ): Promise<SeatPricingRule> => {
    const res = await apiRequest<SeatPricingRuleRaw, UpdateSeatPricingDto>(
      "patch",
      `/seat-pricing/${seatType}`,
      dto,
    );

    return normalizeRule(res);
  },

  toggleActive: async (seatType: SeatType): Promise<SeatPricingRule> => {
    const res = await apiRequest<SeatPricingRuleRaw>(
      "patch",
      `/seat-pricing/${seatType}/toggle-active`,
    );

    return normalizeRule(res);
  },

  remove: (seatType: SeatType) =>
    apiRequest<SeatPricingRule>("delete", `/seat-pricing/${seatType}`),
};
