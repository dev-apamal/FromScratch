import { Tracker } from "@/services/analytics";
import { OLSearchResult } from "@/types/olSearchResult";

const BASE = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org";

const HEADERS: HeadersInit = {
  "User-Agent": `The Reading Nook/1.0 (support@theworkbench.studio)`,
};

const SEARCH_FIELDS =
  "key,title,author_name,number_of_pages_median,cover_i,isbn,subject";

function buildCoverUrl(coverId?: number, isbn?: string): string | null {
  if (coverId) return `${COVERS}/b/id/${coverId}-M.jpg`;
  if (isbn) return `${COVERS}/b/isbn/${isbn}-M.jpg`;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDoc(doc: any): OLSearchResult {
  const isbn = (doc.isbn as string[] | undefined)?.[0];
  const coverId = doc.cover_i as number | undefined;
  const subjects = doc.subject as string[] | undefined;
  return {
    olKey: doc.key as string,
    title: (doc.title as string) ?? "Unknown Title",
    author: (doc.author_name as string[] | undefined)?.[0] ?? "Unknown Author",
    pageCount: (doc.number_of_pages_median as number | undefined) ?? 0,
    category: subjects?.[0] ?? "General",
    coverUrl: buildCoverUrl(coverId, isbn),
    isbn: isbn ?? null,
  };
}

export async function searchByTitle(
  query: string,
  track: Tracker,
): Promise<OLSearchResult[]> {
  const sanitizedQuery = query.trim().toLowerCase();
  track("ol_search", { mode: "title", query: sanitizedQuery });

  let res: Response;
  try {
    const params = new URLSearchParams({
      title: query,
      fields: SEARCH_FIELDS,
      limit: "15",
    });
    res = await fetch(`${BASE}/search.json?${params}`, { headers: HEADERS });
  } catch (networkError) {
    track("ol_search_error", {
      mode: "title",
      query: sanitizedQuery,
      status: 0,
      reason: "network_failure",
    });
    throw networkError;
  }

  if (!res.ok) {
    track("ol_search_error", {
      mode: "title",
      query: sanitizedQuery,
      status: res.status,
      reason: "http_error",
    });
    throw new Error(`Open Library search failed (${res.status})`);
  }

  const data = await res.json();
  // const results = (data.docs as unknown[]).map(mapDoc);
  const results = (data.docs as unknown[])
    .map(mapDoc)
    .filter((r) => r.pageCount > 0);
  track("ol_search_success", {
    mode: "title",
    query: sanitizedQuery,
    resultCount: results.length,
  });
  return results;
}

export async function searchByISBN(
  isbn: string,
  track: Tracker,
): Promise<OLSearchResult[]> {
  const sanitizedQuery = isbn.trim().toLowerCase();
  track("ol_search", { mode: "isbn", query: sanitizedQuery });

  let res: Response;
  try {
    const cleaned = isbn.replace(/[-\s]/g, "");
    const params = new URLSearchParams({
      isbn: cleaned,
      fields: SEARCH_FIELDS,
    });
    res = await fetch(`${BASE}/search.json?${params}`, { headers: HEADERS });
  } catch (networkError) {
    track("ol_search_error", {
      mode: "isbn",
      query: sanitizedQuery,
      status: 0,
      reason: "network_failure",
    });
    throw networkError;
  }

  if (!res.ok) {
    track("ol_search_error", {
      mode: "isbn",
      query: sanitizedQuery,
      status: res.status,
      reason: "http_error",
    });
    throw new Error(`Open Library ISBN search failed (${res.status})`);
  }

  const data = await res.json();
  // const results = (data.docs as unknown[]).map(mapDoc);
  const results = (data.docs as unknown[])
    .map(mapDoc)
    .filter((r) => r.pageCount > 0);
  track("ol_search_success", {
    mode: "isbn",
    query: sanitizedQuery,
    resultCount: results.length,
  });
  return results;
}
