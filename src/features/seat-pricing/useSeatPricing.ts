"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { seatPricingApi } from "./seat-pricing.api";
import {
  SeatPricingRule,
  CreateSeatPricingDto,
  UpdateSeatPricingDto,
} from "./seat-pricing.types";
import { SeatType } from "@/features/screen/screen.types";

export function useSeatPricing() {
  const [rules, setRules] = useState<SeatPricingRule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await seatPricingApi.findAll();

      setRules(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch pricing rules.";

      if (isMounted.current) {
        setError(message);
      }

      toast.error(message);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRules();
  }, [fetchRules]);

  const createRule = async (dto: CreateSeatPricingDto) => {
    setError(null);

    try {
      const newRule = await seatPricingApi.create(dto);
      setRules((prev) => [...prev, newRule]);

      toast.success("Pricing rule created successfully");
      return newRule;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create pricing rule.";

      setError(message);
      toast.error(message);
      throw err;
    }
  };

  const updateRule = async (seatType: SeatType, dto: UpdateSeatPricingDto) => {
    setError(null);

    try {
      const updated = await seatPricingApi.update(seatType, dto);

      setRules((prev) =>
        prev.map((r) => (r.seatType === seatType ? updated : r)),
      );

      toast.success("Pricing rule updated successfully");
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update pricing rule.";

      setError(message);
      toast.error(message);
      throw err;
    }
  };

  const toggleRuleActive = async (seatType: SeatType) => {
    try {
      const updated = await seatPricingApi.toggleActive(seatType);

      setRules((prev) =>
        prev.map((r) => (r.seatType === seatType ? updated : r)),
      );

      toast.success("Rule status updated");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to toggle status.";

      setError(message);
      toast.error(message);
    }
  };

  const deleteRule = async (seatType: SeatType) => {
    setError(null);

    try {
      await seatPricingApi.remove(seatType);

      setRules((prev) => prev.filter((r) => r.seatType !== seatType));

      toast.success("Pricing rule deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete pricing rule.";

      setError(message);
      toast.error(message);
      throw err;
    }
  };

  return {
    rules,
    loading,
    error,
    refresh: fetchRules,
    createRule,
    updateRule,
    toggleRuleActive,
    deleteRule,
  };
}
