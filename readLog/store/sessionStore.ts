import { db } from "@/db";
import { sessions } from "@/db/schema";
import { BookSessionData, SessionItem } from "@/types/sessionItem";
import { eq } from "drizzle-orm";

/**
 * Returns all sessions for a book plus computed aggregates.
 * totalPagesRead reflects the highest endPage recorded across all sessions,
 * matching the semantics of the old AsyncStorage value.
 */
export async function getBookSessionData(
  bookId: string,
): Promise<BookSessionData> {
  try {
    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.bookId, bookId));

    const sessionItems: SessionItem[] = rows.map((r) => ({
      id: r.id,
      bookId: r.bookId,
      startTime: r.startTime,
      endTime: r.endTime,
      durationSeconds: r.durationSeconds,
      pagesReadInSession: r.pagesReadInSession,
      startPage: r.startPage,
      endPage: r.endPage,
    }));

    const totalTimeSeconds = sessionItems.reduce(
      (acc, s) => acc + s.durationSeconds,
      0,
    );
    const totalPagesRead =
      sessionItems.length > 0
        ? Math.max(...sessionItems.map((s) => s.endPage))
        : 0;

    return { bookId, sessions: sessionItems, totalTimeSeconds, totalPagesRead };
  } catch {
    return { bookId, sessions: [], totalTimeSeconds: 0, totalPagesRead: 0 };
  }
}

/**
 * Persists a single session to SQLite.
 * The newCurrentPage parameter is kept for API compatibility but the canonical
 * current page is now the books.current_page column in SQLite — not stored here.
 */
export async function saveSession(
  bookId: string,
  session: SessionItem,
  _newCurrentPage: number,
): Promise<BookSessionData> {
  await db.insert(sessions).values({
    id: session.id,
    bookId: session.bookId,
    startTime: session.startTime,
    endTime: session.endTime,
    durationSeconds: session.durationSeconds,
    pagesReadInSession: session.pagesReadInSession,
    startPage: session.startPage,
    endPage: session.endPage,
  });

  return getBookSessionData(bookId);
}

/**
 * Deletes all sessions for a book.
 * Called explicitly from useRemoveBook as a belt-and-suspenders measure
 * alongside the ON DELETE CASCADE foreign key in the sessions table.
 */
export async function deleteBookSessions(bookId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.bookId, bookId));
}
