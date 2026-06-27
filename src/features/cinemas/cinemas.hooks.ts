import { cinemasApi } from "./cinemas.api";
import { GetCinemasQuery } from "./cinemas.types";

export const cinemaKeys = {
  all: "cinemas",
  list: "cinemas-list",
  detail: (id: string) => `cinemas-${id}`,
};

export async function getCinemas(query?: GetCinemasQuery) {
  return cinemasApi.getCinemas(query);
}

export async function getCinema(id: string) {
  if (!id) throw new Error("Cinema id is required");
  return cinemasApi.getCinema(id);
}
