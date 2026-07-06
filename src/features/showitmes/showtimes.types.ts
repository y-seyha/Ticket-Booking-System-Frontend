export enum ShowtimeStatus {
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
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

export type UpdateShowtimeDto = Partial<CreateShowtimeDto>;
