export interface HeroMovie {
  id: string;
  title: string;
  banner: string;
  poster?: string;
  description?: string;
  trailerYoutubeId?: string;
}

export interface CarouselItem {
  id: number;
  image: string;

  title?: string;
  description?: string;

  primaryButton?: {
    label: string;
    onClick: () => void;
  };

  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
}

export enum MovieStatus {
  COMING_SOON = "COMING_SOON",
  NOW_SHOWING = "NOW_SHOWING",
  ARCHIVED = "ARCHIVED",
}

export interface Movie {
  id: string;
  title: string;
  description?: string;

  durationMinutes: number;
  language: string;
  releaseDate: string;

  poster: string | null;

  trailerYoutubeId?: string;

  status: MovieStatus;

  showtimes?: ShowTime[]; 

  createdAt: string;
  updatedAt: string;
}

export interface MoviePoster {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface MovieCard {
  id: string;
  title: string;
  posterUrl: string;
  durationMinutes: number;
  language: string;
  status: MovieStatus;
}

export interface MovieItem {
  id: string;
  title: string;
  poster: string | null;
  releaseDate: string;
  isAdvanceTicket?: boolean;
  tags?: string[];
}

export function mapMovieToItem(movie: Movie): MovieItem {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster ?? null,
    releaseDate: movie.releaseDate,
    isAdvanceTicket: movie.status === "COMING_SOON",
    tags: [],
  };
}

export interface ShowTime {
  id: string;
  startTime: string;
  endTime: string;
  basePrice: string;
  screenName: string;
  screenType: string;
  theaterName: string;
}
