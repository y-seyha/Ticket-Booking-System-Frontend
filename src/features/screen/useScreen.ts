import { useState, useCallback } from "react";
import { toast } from "sonner";

import { screensApi } from "./screen.api";
import type {
  Screen,
  CreateScreenPayload,
  UpdateScreenPayload,
} from "./screen.types";

export function useScreen() {
  const [loading, setLoading] = useState(false);

  const getScreens = useCallback(async (): Promise<Screen[]> => {
    try {
      setLoading(true);
      return await screensApi.findAll();
    } catch (error) {
      toast.error("Failed to fetch screens.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getScreen = useCallback(async (id: string): Promise<Screen> => {
    try {
      setLoading(true);
      return await screensApi.findOne(id);
    } catch (error) {
      toast.error("Failed to fetch screen.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createScreen = useCallback(async (payload: CreateScreenPayload) => {
    try {
      setLoading(true);
      const screen = await screensApi.create(payload);

      toast.success("Screen created successfully.");
      return screen;
    } catch (error) {
      toast.error("Failed to create screen.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScreen = useCallback(
    async (id: string, payload: UpdateScreenPayload) => {
      try {
        setLoading(true);
        const screen = await screensApi.update(id, payload);

        toast.success("Screen updated successfully.");
        return screen;
      } catch (error) {
        toast.error("Failed to update screen.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteScreen = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await screensApi.remove(id);

      toast.success("Screen deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete screen.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getScreens,
    getScreen,
    createScreen,
    updateScreen,
    deleteScreen,
  };
}
