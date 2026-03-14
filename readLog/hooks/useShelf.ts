import { useAnalytics } from "@/services/analytics";
import { db } from "@/db";
import { books } from "@/db/schema";
import { BookItem } from "@/types/bookItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

function rowToBook(row: typeof books.$inferSelect): BookItem {
  return {
    id: row.id,
    olKey: row.olKey,
    title: row.title,
    author: row.author,
    pageCount: row.pageCount,
    currentPage: row.currentPage,
    category: row.category,
    status: row.status,
    coverUrl: row.coverUrl ?? null,
    isbn: row.isbn ?? null,
    addedAt: row.addedAt,
    finishedAt: row.finishedAt ?? null,
  };
}

export function useReadingBooks() {
  return useQuery({
    queryKey: ["books", "reading"],
    queryFn: async () => {
      const rows = await db
        .select()
        .from(books)
        .where(eq(books.status, "reading"));
      return rows.map(rowToBook);
    },
    staleTime: Infinity,
  });
}

export function useFinishedBooks() {
  return useQuery({
    queryKey: ["books", "finished"],
    queryFn: async () => {
      const rows = await db
        .select()
        .from(books)
        .where(eq(books.status, "finished"));
      return rows.map(rowToBook);
    },
    staleTime: Infinity,
  });
}

export function useShelfIds() {
  return useQuery({
    queryKey: ["books", "ids"],
    queryFn: async () => {
      const rows = await db.select({ id: books.id }).from(books);
      return new Set(rows.map((r) => r.id));
    },
    staleTime: Infinity,
  });
}

export function useAddBook() {
  const qc = useQueryClient();
  const { track } = useAnalytics();

  return useMutation({
    mutationFn: async (book: BookItem) => {
      await db.insert(books).values({
        id: book.id,
        olKey: book.olKey,
        title: book.title,
        author: book.author,
        pageCount: book.pageCount,
        currentPage: book.currentPage,
        category: book.category,
        status: book.status,
        coverUrl: book.coverUrl,
        isbn: book.isbn,
        addedAt: book.addedAt,
        finishedAt: book.finishedAt,
      });
      track("book_added", {
        olKey: book.olKey,
        title: book.title,
        hasCover: !!book.coverUrl,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useRemoveBook() {
  const qc = useQueryClient();
  const { track } = useAnalytics();

  return useMutation({
    mutationFn: async (book: BookItem) => {
      await db.delete(books).where(eq(books.id, book.id));
      track("book_removed", { olKey: book.olKey, title: book.title });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useUpdateBookProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      currentPage,
    }: {
      id: string;
      currentPage: number;
    }) => {
      await db.update(books).set({ currentPage }).where(eq(books.id, id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useFinishBook() {
  const qc = useQueryClient();
  const { track } = useAnalytics();

  return useMutation({
    mutationFn: async (book: BookItem) => {
      await db
        .update(books)
        .set({ status: "finished", finishedAt: Date.now() })
        .where(eq(books.id, book.id));
      track("book_finished", {
        olKey: book.olKey,
        title: book.title,
        totalSessions: 0, // you can pass real session count here if you want
        totalTimeSeconds: 0,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}
