import { OLSearchResult } from "@/types/olSearchResult";

const BASE = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org";

// Required by Open Library for apps making frequent calls
const HEADERS: HeadersInit = {
  "User-Agent": "ReadLog/1.0 (contact@readlog.app)",
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

export async function searchByTitle(query: string): Promise<OLSearchResult[]> {
  const params = new URLSearchParams({
    title: query,
    fields: SEARCH_FIELDS,
    limit: "15",
  });
  const res = await fetch(`${BASE}/search.json?${params}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`Open Library search failed (${res.status})`);
  const data = await res.json();
  return (data.docs as unknown[]).map(mapDoc);
}

export async function searchByISBN(isbn: string): Promise<OLSearchResult[]> {
  const cleaned = isbn.replace(/[-\s]/g, "");
  const params = new URLSearchParams({ isbn: cleaned, fields: SEARCH_FIELDS });
  const res = await fetch(`${BASE}/search.json?${params}`, {
    headers: HEADERS,
  });
  if (!res.ok)
    throw new Error(`Open Library ISBN search failed (${res.status})`);
  const data = await res.json();
  return (data.docs as unknown[]).map(mapDoc);
}
