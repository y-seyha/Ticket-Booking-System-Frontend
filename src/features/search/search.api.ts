import { apiRequest } from "@/lib/config/axios";
import type { SearchResult, AutocompleteResult } from "./search.types";

export const searchApi = {
  search: (q: string, limit = 10) =>
    apiRequest<SearchResult>("get", "/search", undefined, {
      params: { q, limit },
    }),

  autocomplete: (q: string) =>
    apiRequest<AutocompleteResult>("get", "/search/autocomplete", undefined, {
      params: { q },
    }),
};
