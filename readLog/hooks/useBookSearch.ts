import { useAnalytics } from "@/services/analytics";
import { searchByISBN, searchByTitle } from "@/services/openLibrary";
import { useQuery } from "@tanstack/react-query";

export type SearchMode = "title" | "isbn";

export function useBookSearch(query: string, mode: SearchMode) {
  const { track } = useAnalytics();

  return useQuery({
    queryKey: ["ol-search", mode, query],
    queryFn: () =>
      mode === "isbn"
        ? searchByISBN(query, track)
        : searchByTitle(query, track),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
