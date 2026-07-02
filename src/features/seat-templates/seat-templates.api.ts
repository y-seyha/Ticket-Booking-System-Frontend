import { apiRequest } from "@/lib/config/axios";
import { ScreenTemplate } from "../screen-template/screen-template.types";
import {
  GenerateTemplateSeatsPayload,
  ScreenTemplateSeat,
  GenerationResult,
} from "./seat-templates.types";

export const seatTemplateApi = {
  generateBulk: (payload: GenerateTemplateSeatsPayload) =>
    apiRequest<GenerationResult, GenerateTemplateSeatsPayload>(
      "post",
      "/template-seats/generate",
      payload,
    ),

  findAll: () => apiRequest<ScreenTemplateSeat[]>("get", "/template-seats"),

  findByTemplate: (templateId: string) =>
    apiRequest<ScreenTemplateSeat[]>(
      "get",
      `/template-seats/template/${templateId}`,
    ),

  fetchBaseTemplates: () =>
    apiRequest<ScreenTemplate[]>("get", "/screen-templates"),
};
