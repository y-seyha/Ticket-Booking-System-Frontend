import { apiRequest } from "@/lib/config/axios";
import type {
  CreateScreenTemplatePayload,
  UpdateScreenTemplatePayload,
  ScreenTemplate,
} from "./screen-template.types"; 

export const screenTemplateApi = {
  getTemplates() {
    return apiRequest<ScreenTemplate[]>("get", "/screen-templates");
  },

  getTemplate(id: string) {
    return apiRequest<ScreenTemplate>("get", `/screen-templates/${id}`);
  },

  createTemplate(payload: CreateScreenTemplatePayload) {
    return apiRequest<ScreenTemplate, CreateScreenTemplatePayload>(
      "post",
      "/screen-templates",
      payload,
    );
  },

  updateTemplate(id: string, payload: UpdateScreenTemplatePayload) {
    return apiRequest<ScreenTemplate, UpdateScreenTemplatePayload>(
      "patch",
      `/screen-templates/${id}`,
      payload,
    );
  },

  toggleActive(id: string) {
    return apiRequest<ScreenTemplate>(
      "patch",
      `/screen-templates/${id}/active`,
    );
  },

  deleteTemplate(id: string) {
    return apiRequest<ScreenTemplate>("delete", `/screen-templates/${id}`);
  },
};
