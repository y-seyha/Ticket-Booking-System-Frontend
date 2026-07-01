import { apiRequest } from "@/lib/config/axios";
import { MovieStatus, Movie } from "./movie.type";

export interface MovieQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: MovieStatus;
}

export interface PaginatedMoviesResponse {
  data: Movie[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMoviePayload {
  title: string;
  description?: string;
  durationMinutes: number;
  language: string;
  releaseDate: string;  
  trailerYoutubeId?: string;
  file?: File | null; 
}

export const moviesApi = {
  findAll(filters: MovieQueryFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);

    const queryString = params.toString();
    return apiRequest<PaginatedMoviesResponse>(
      "get",
      `/movies${queryString ? `?${queryString}` : ""}`,
    );
  },

  findOne(id: string) {
    return apiRequest<Movie>("get", `/movies/${id}`);
  },


  create(payload: CreateMoviePayload) {
    const formData = new FormData();

    if (payload.file instanceof File) {
      formData.append("poster", payload.file);
    }

    formData.append("title", payload.title);
    formData.append("durationMinutes", payload.durationMinutes.toString());
    formData.append("language", payload.language);
    formData.append("releaseDate", payload.releaseDate);

    if (payload.description)
      formData.append("description", payload.description);
    if (payload.trailerYoutubeId)
      formData.append("trailerYoutubeId", payload.trailerYoutubeId);

    return apiRequest<Movie>("post", "/movies", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id: string, payload: CreateMoviePayload) {
    const formData = new FormData();

    if (payload.file instanceof File) {
      formData.append("poster", payload.file);
    }

    formData.append("title", payload.title);
    formData.append("durationMinutes", payload.durationMinutes.toString());
    formData.append("language", payload.language);
    formData.append("releaseDate", payload.releaseDate);

    if (payload.description)
      formData.append("description", payload.description);
    if (payload.trailerYoutubeId)
      formData.append("trailerYoutubeId", payload.trailerYoutubeId);

    return apiRequest<Movie>("patch", `/movies/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateStatus(id: string, status: MovieStatus) {
    return apiRequest<Movie>("patch", `/movies/${id}/status`, { status });
  },

  remove(id: string) {
    return apiRequest<{ success: boolean; message: string }>(
      "delete",
      `/movies/${id}`,
    );
  },
};
