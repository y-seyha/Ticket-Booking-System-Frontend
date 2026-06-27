import { apiRequest } from "@/lib/config/axios";
import type {
  DeleteCinemaResponse,
  GetCinemaResponse,
  GetCinemasQuery,
  GetCinemasResponse,
} from "./cinemas.types";

export const cinemasApi = {
  getCinemas(params?: GetCinemasQuery) {
    return apiRequest<GetCinemasResponse>("get", "/theaters", undefined, {
      params,
    });
  },

  getCinema(id: string) {
    return apiRequest<GetCinemaResponse>("get", `/theaters/${id}`);
  },

  createCinema(data: FormData) {
    return apiRequest<GetCinemaResponse, FormData>("post", "/theaters", data);
  },

  updateCinema(id: string, data: FormData) {
    return apiRequest<GetCinemaResponse, FormData>(
      "patch",
      `/theaters/${id}`,
      data,
    );
  },

  deleteCinema(id: string) {
    return apiRequest<DeleteCinemaResponse>("delete", `/theaters/${id}`);
  },
};
