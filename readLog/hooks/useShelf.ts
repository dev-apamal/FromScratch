// import { useAnalytics } from "@/services/analytics";
// import { db } from "@/db";
// import { books } from "@/db/schema";
// import { deleteBookSessions, getBookSessionData } from "@/store/sessionStore";
// import { BookItem } from "@/types/bookItem";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { eq } from "drizzle-orm";

// function rowToBook(row: typeof books.$inferSelect): BookItem {
//   return {
//     id: row.id,
//     olKey: row.olKey,
//     title: row.title,
//     author: row.author,
//     pageCount: row.pageCount,
//     currentPage: row.currentPage,
//     category: row.category,
//     status: row.status,
//     coverUrl: row.coverUrl ?? null,
//     isbn: row.isbn ?? null,
//     addedAt: row.addedAt,
//     finishedAt: row.finishedAt ?? null,
//   };
// }

// export function useReadingBooks() {
//   return useQuery({
//     queryKey: ["books", "reading"],
//     queryFn: async () => {
//       const rows = await db
//         .select()
//         .from(books)
//         .where(eq(books.status, "reading"));
//       return rows.map(rowToBook);
//     },
//     staleTime: Infinity,
//   });
// }

// export function useFinishedBooks() {
//   return useQuery({
//     queryKey: ["books", "finished"],
//     queryFn: async () => {
//       const rows = await db
//         .select()
//         .from(books)
//         .where(eq(books.status, "finished"));
//       return rows.map(rowToBook);
//     },
//     staleTime: Infinity,
//   });
// }

// export function useShelfIds() {
//   return useQuery({
//     queryKey: ["books", "ids"],
//     queryFn: async () => {
//       const rows = await db.select({ id: books.id }).from(books);
//       return new Set(rows.map((r) => r.id));
//     },
//     staleTime: Infinity,
//   });
// }

// export function useAddBook() {
//   const qc = useQueryClient();
//   const { track } = useAnalytics();

//   return useMutation({
//     mutationFn: async (book: BookItem) => {
//       await db.insert(books).values({
//         id: book.id,
//         olKey: book.olKey,
//         title: book.title,
//         author: book.author,
//         pageCount: book.pageCount,
//         currentPage: book.currentPage,
//         category: book.category,
//         status: book.status,
//         coverUrl: book.coverUrl,
//         isbn: book.isbn,
//         addedAt: book.addedAt,
//         finishedAt: book.finishedAt,
//       });
//       track("book_added", {
//         olKey: book.olKey,
//         title: book.title,
//         hasCover: !!book.coverUrl,
//       });
//     },
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
//   });
// }

// export function useRemoveBook() {
//   const qc = useQueryClient();
//   const { track } = useAnalytics();

//   return useMutation({
//     mutationFn: async (book: BookItem) => {
//       // Explicitly delete sessions first. The sessions table also has
//       // ON DELETE CASCADE so this is belt-and-suspenders, but being explicit
//       // guarantees cleanup even if FK enforcement is somehow not active.
//       await deleteBookSessions(book.id);
//       await db.delete(books).where(eq(books.id, book.id));
//       track("book_removed", { olKey: book.olKey, title: book.title });
//     },
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
//   });
// }

// export function useUpdateBookProgress() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       id,
//       currentPage,
//     }: {
//       id: string;
//       currentPage: number;
//     }) => {
//       await db.update(books).set({ currentPage }).where(eq(books.id, id));
//     },
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
//   });
// }

// export function useFinishBook() {
//   const qc = useQueryClient();
//   const { track } = useAnalytics();

//   return useMutation({
//     mutationFn: async (book: BookItem) => {
//       // Fetch real session data before updating status so analytics
//       // reflect actual reading history rather than hardcoded zeros
//       const sessionData = await getBookSessionData(book.id);

//       await db
//         .update(books)
//         .set({ status: "finished", finishedAt: Date.now() })
//         .where(eq(books.id, book.id));

//       track("book_finished", {
//         olKey: book.olKey,
//         title: book.title,
//         totalSessions: sessionData.sessions.length,
//         totalTimeSeconds: sessionData.totalTimeSeconds,
//       });
//     },
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
//   });
// }

import { useAnalytics } from "@/services/analytics";
import { db } from "@/db";
import { books } from "@/db/schema";
import { deleteBookSessions, getBookSessionData } from "@/store/sessionStore";
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

export function useBookById(id: string) {
  return useQuery({
    queryKey: ["books", "id", id],
    queryFn: async () => {
      const rows = await db.select().from(books).where(eq(books.id, id));
      return rows[0] ? rowToBook(rows[0]) : null;
    },
    staleTime: Infinity,
    enabled: !!id,
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
      // Explicitly delete sessions first. The sessions table also has
      // ON DELETE CASCADE so this is belt-and-suspenders, but being explicit
      // guarantees cleanup even if FK enforcement is somehow not active.
      await deleteBookSessions(book.id);
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
      // Fetch real session data before updating status so analytics
      // reflect actual reading history rather than hardcoded zeros
      const sessionData = await getBookSessionData(book.id);

      await db
        .update(books)
        .set({ status: "finished", finishedAt: Date.now() })
        .where(eq(books.id, book.id));

      track("book_finished", {
        olKey: book.olKey,
        title: book.title,
        totalSessions: sessionData.sessions.length,
        totalTimeSeconds: sessionData.totalTimeSeconds,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}
