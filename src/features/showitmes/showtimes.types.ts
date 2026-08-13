export enum ShowtimeStatus {
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FINISHED = "FINISHED",
}

export interface Theater {
  id: string;
  name: string;
}

export interface Screen {
  id: string;
  name: string;
  type: string;
  theater?: Theater;
}

export interface MoviePoster {
  id: string;
  url: string;
}

export interface Movie {
  id: string;
  title: string;
  durationMinutes: number;
  language: string;
  poster?: MoviePoster | null;
}

export interface Showtime {
  id: string;
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: ShowtimeStatus;
  createdAt: string;
  updatedAt: string;
  movie: Movie;
  screen: Screen;
}

export interface CreateShowtimeDto {
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: ShowtimeStatus;
}

export interface CreateBulkScheduleDto {
  movieId: string;
  screenIds: string[];
  targetDates: string[];
  dailySlots: string[];
  basePrice: number;
  cleaningBufferMinutes?: number;
}

export type UpdateShowtimeDto = Partial<CreateShowtimeDto>;

export interface ShowtimeQuery {
  page?: number;
  limit?: number;
  search?: string;
  movieId?: string;
  screenId?: string;
  theaterId?: string;
  status?: ShowtimeStatus;
  date?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedShowtimes {
  data: Showtime[];
  pagination: PaginationMeta;
}
