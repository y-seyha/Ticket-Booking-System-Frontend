import { apiRequest } from "@/lib/config/axios";
import type {
  DeleteCinemaResponse,
  GetCinemaResponse,
  GetCinemasQuery,
  GetCinemasResponse,
  GetTheaterMoviesResponse,
} from "./cinemas.types";

export interface CreateTheaterPayload {
  name: string;
  location: string;
  city: string;
  status: "ACTIVE" | "INACTIVE";
  phone?: string;
  email?: string;
  file?: File | null;
}

export const cinemasApi = {
  getCinemas(params?: GetCinemasQuery) {
    return apiRequest<GetCinemasResponse>("get", "/theaters", undefined, {
      params,
    });
  },

  getCinema(id: string) {
    return apiRequest<GetCinemaResponse>("get", `/theaters/${id}`);
  },

  createCinema(payload: CreateTheaterPayload) {
    const formData = new FormData();

    if (payload.file instanceof File) {
      formData.append("theaters", payload.file);
    }

    formData.append("name", payload.name);
    formData.append("location", payload.location);
    formData.append("city", payload.city);
    formData.append("status", payload.status);

    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.email) formData.append("email", payload.email);

    return apiRequest<GetCinemaResponse, FormData>(
      "post",
      "/theaters",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  updateCinema(id: string, payload: CreateTheaterPayload) {
    const formData = new FormData();

    if (payload.file instanceof File) {
      formData.append("theaters", payload.file);
    }

    formData.append("name", payload.name);
    formData.append("location", payload.location);
    formData.append("city", payload.city);
    formData.append("status", payload.status);

    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.email) formData.append("email", payload.email);

    return apiRequest<GetCinemaResponse, FormData>(
      "patch",
      `/theaters/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  deleteCinema(id: string) {
    return apiRequest<DeleteCinemaResponse>("delete", `/theaters/${id}`);
  },

  getTheaterMovies(id: string, date?: string) {
    return apiRequest<GetTheaterMoviesResponse>(
      "get",
      `/theaters/${id}/movies`,
      undefined,
      {
        params: date ? { date } : {},
      },
    );
  },
};
