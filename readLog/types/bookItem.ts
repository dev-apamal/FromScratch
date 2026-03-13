export type BookItem = {
  id: string; // olKey stripped of "/works/" e.g. "OL27258W"
  olKey: string; // full "/works/OL27258W"
  title: string;
  author: string;
  pageCount: number;
  currentPage: number;
  category: string;
  status: "reading" | "finished";
  coverUrl: string | null;
  isbn: string | null;
  addedAt: number; // unix ms timestamp
  finishedAt: number | null;
};
