import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  AggregatedScreenTemplateLayouts,
  GenerateTemplateSeatsPayload,
  UpdateTemplateSeatsPayload,
} from "./seat-templates.types";
import { seatTemplateApi } from "./seat-templates.api";
import { ScreenTemplate } from "../screen-template/screen-template.types";

interface SeatTemplateState {
  templatesWithLayouts: AggregatedScreenTemplateLayouts[];
  baseTemplates: ScreenTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: SeatTemplateState = {
  templatesWithLayouts: [],
  baseTemplates: [],
  loading: true,
  error: null,
};

export function useSeatTemplate() {
  const [state, setState] = useState<SeatTemplateState>(initialState);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [normalizedTemplates, baseTemplates] = await Promise.all([
        seatTemplateApi.findAll(),
        seatTemplateApi.fetchBaseTemplates().catch(() => []),
      ]);

      setState({
        templatesWithLayouts: normalizedTemplates,
        baseTemplates: baseTemplates,
        loading: false,
        error: null,
      });
    } catch {
      const errorMessage =
        "Failed to synchronize layout configuration environment.";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const generateBulkLayout = useCallback(
    async (payload: GenerateTemplateSeatsPayload) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const result = await seatTemplateApi.generateBulk(payload);
        toast.success("Seating layout generated successfully!");
        await fetchData();
        return result;
      } catch (err) {
        toast.error("Failed to generate bulk seating layout.");
        throw err;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [fetchData],
  );

  // ADDED: Handles modifying existing layouts securely
  const updateLayoutVariant = useCallback(
    async (
      templateId: string,
      layoutId: string,
      payload: UpdateTemplateSeatsPayload,
    ) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const result = await seatTemplateApi.updateTemplateLayout(
          templateId,
          layoutId,
          payload,
        );
        toast.success("Layout variant updated successfully!");
        await fetchData();
        return result;
      } catch (err) {
        toast.error("Failed to update layout configurations.");
        throw err;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [fetchData],
  );

  const deleteLayoutVariant = useCallback(
    async (templateId: string, layoutId: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const result = await seatTemplateApi.deleteTemplateLayout(
          templateId,
          layoutId,
        );
        toast.success("Layout variant deleted successfully!");
        await fetchData();
        return result;
      } catch (err) {
        toast.error("Failed to delete layout configuration variant.");
        throw err;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [fetchData],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  return {
    templatesWithLayouts: state.templatesWithLayouts,
    baseTemplates: state.baseTemplates,
    loading: state.loading,
    error: state.error,
    refresh: fetchData,
    generateBulkLayout,
    updateLayoutVariant,
    deleteLayoutVariant,
  };
}
