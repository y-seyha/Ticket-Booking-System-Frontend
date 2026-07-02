import { useState, useEffect, useCallback } from "react";
import {
  ScreenTemplateSeat,
  GenerateTemplateSeatsPayload,
} from "./seat-templates.types";
import { seatTemplateApi } from "./seat-templates.api";
import { ScreenTemplate } from "../screen-template/screen-template.types";

interface SeatTemplateState {
  seats: ScreenTemplateSeat[];
  baseTemplates: ScreenTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: SeatTemplateState = {
  seats: [],
  baseTemplates: [],
  loading: true,
  error: null,
};

export function useSeatTemplate() {
  const [state, setState] = useState<SeatTemplateState>(initialState);

  const fetchData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const [seats, templates] = await Promise.all([
        seatTemplateApi.findAll(),
        seatTemplateApi.fetchBaseTemplates().catch(() => []),
      ]);

      setState({
        seats,
        baseTemplates: templates,
        loading: false,
        error: null,
      });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          "Failed to synchronize layout configuration environment workspace.",
      }));
    }
  }, []);

  const generateBulkLayout = useCallback(
    async (payload: GenerateTemplateSeatsPayload) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await seatTemplateApi.generateBulk(payload);
        await fetchData();
        return result;
      } finally {
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    },
    [fetchData],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  return {
    seats: state.seats,
    baseTemplates: state.baseTemplates,
    loading: state.loading,
    error: state.error,
    refresh: fetchData,
    generateBulkLayout,
  };
}
