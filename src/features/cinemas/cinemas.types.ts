export type TheaterStatus = "ACTIVE" | "INACTIVE";

export type ScreenType = "STANDARD" | "VIP" | "IMAX" | "THREE_D";

export interface CinemaImage {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId: string;
  description: string | null;
  uploaderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Screen {
  id: string;
  theaterId: string;
  templateId: string;
  name: string;
  type: ScreenType;
  createdAt: string;
  updatedAt: string;
}

export interface Cinema {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  location: string;
  city: string;
  status: TheaterStatus;
  imageId: string | null;
  image?: CinemaImage;
  createdAt: string;
  updatedAt: string;
  screens: Screen[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCinemasResponse {
  data: Cinema[];
  pagination: Pagination;
}

export interface GetCinemaResponse {
  data: Cinema;
}

export interface GetCinemasQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TheaterStatus;
}

export interface CreateCinemaRequest {
  name: string;
  phone?: string;
  email?: string;
  location: string;
  city: string;
  status: TheaterStatus;
  image?: File;
}

export type UpdateCinemaRequest = Partial<CreateCinemaRequest>;

export interface DeleteCinemaResponse {
  success: boolean;
  message: string;
}
