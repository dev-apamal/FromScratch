import { searchByISBN, searchByTitle } from "@/services/openLibrary";
import { useQuery } from "@tanstack/react-query";

export type SearchMode = "title" | "isbn";

export function useBookSearch(query: string, mode: SearchMode) {
  return useQuery({
    queryKey: ["ol-search", mode, query],
    queryFn: () =>
      mode === "isbn" ? searchByISBN(query) : searchByTitle(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes — OL data rarely changes
    retry: 1,
  });
}
