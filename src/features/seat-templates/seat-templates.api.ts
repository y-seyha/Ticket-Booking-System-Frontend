import { apiRequest } from "@/lib/config/axios";
import { ScreenTemplate } from "../screen-template/screen-template.types";
import {
  GenerateTemplateSeatsPayload,
  AggregatedScreenTemplateLayouts,
  GenerationResult,
  StrippedTemplateSeat,
  UpdateTemplateSeatsPayload,
} from "./seat-templates.types";

export const seatTemplateApi = {
  generateBulk: (payload: GenerateTemplateSeatsPayload) =>
    apiRequest<GenerationResult, GenerateTemplateSeatsPayload>(
      "post",
      "/template-seats/generate",
      payload,
    ),

  findAll: () =>
    apiRequest<AggregatedScreenTemplateLayouts[]>("get", "/template-seats"),

  findByTemplate: (templateId: string) =>
    apiRequest<StrippedTemplateSeat[]>(
      "get",
      `/template-seats/template/${templateId}`,
    ),

  fetchBaseTemplates: () =>
    apiRequest<ScreenTemplate[]>("get", "/screen-templates"),

  deleteTemplateLayout: (templateId: string, layoutId: string) =>
    apiRequest<{ message: string }>(
      "delete",
      `/template-seats/template/${templateId}/layout/${layoutId}`,
    ),

  updateTemplateLayout: (
    templateId: string,
    layoutId: string,
    payload: UpdateTemplateSeatsPayload,
  ) =>
    apiRequest<{ message: string }, UpdateTemplateSeatsPayload>(
      "patch",
      `/template-seats/template/${templateId}/layout/${layoutId}`,
      payload,
    ),
};
