import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { screenTemplateApi } from "./screen-template.api";
import type {
  CreateScreenTemplatePayload,
  ScreenTemplate,
  UpdateScreenTemplatePayload,
} from "./screen-template.types";

export const useScreenTemplate = (id?: string) => {
  const [templates, setTemplates] = useState<ScreenTemplate[]>([]);
  const [template, setTemplate] = useState<ScreenTemplate | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const showApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Something went wrong.";

      toast.error(Array.isArray(message) ? message.join(", ") : message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong.");
    }
  };

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await screenTemplateApi.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err);
      showApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemplate = useCallback(async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await screenTemplateApi.getTemplate(templateId);
      setTemplate(data);
    } catch (err) {
      setError(err);
      showApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);

        const data = await screenTemplateApi.getTemplates();

        if (!ignore) {
          setTemplates(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          showApiError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);

        const data = await screenTemplateApi.getTemplate(id);

        if (!ignore) {
          setTemplate(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          showApiError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [id]);

  const createTemplate = async (payload: CreateScreenTemplatePayload) => {
    try {
      const created = await screenTemplateApi.createTemplate(payload);

      toast.success("Screen template created successfully.");

      await fetchTemplates();

      return created;
    } catch (err) {
      showApiError(err);
      throw err;
    }
  };

  const updateTemplate = async (
    id: string,
    payload: UpdateScreenTemplatePayload,
  ) => {
    try {
      const updated = await screenTemplateApi.updateTemplate(id, payload);

      toast.success("Screen template updated successfully.");

      await fetchTemplates();
      await fetchTemplate(id);

      return updated;
    } catch (err) {
      showApiError(err);
      throw err;
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const updated = await screenTemplateApi.toggleActive(id);

      toast.success("Screen template status updated.");

      await fetchTemplates();
      await fetchTemplate(id);

      return updated;
    } catch (err) {
      showApiError(err);
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await screenTemplateApi.deleteTemplate(id);

      toast.success("Screen template deleted successfully.");

      await fetchTemplates();
    } catch (err) {
      showApiError(err);
      throw err;
    }
  };

  return {
    templates,
    template,
    loading,
    error,

    fetchTemplates,
    fetchTemplate,

    createTemplate,
    updateTemplate,
    toggleActive,
    deleteTemplate,
  };
};
