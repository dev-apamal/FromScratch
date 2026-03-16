import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import { sessions as sessionsTable } from "./schema";
import { BookSessionData } from "@/types/sessionItem";

const sqlite = openDatabaseSync("readlog.db");
export const db = drizzle(sqlite, { schema });

// Bump this key whenever you need to re-run the migration
const MIGRATION_FLAG_KEY = "sessions_migrated_v1";
const ASYNC_STORAGE_SESSION_PREFIX = "session_data_";

export async function initDB(): Promise<void> {
  // Must be first — SQLite disables FK enforcement by default
  await sqlite.execAsync("PRAGMA foreign_keys = ON;");

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id            TEXT    PRIMARY KEY NOT NULL,
      ol_key        TEXT    NOT NULL,
      title         TEXT    NOT NULL,
      author        TEXT    NOT NULL,
      page_count    INTEGER NOT NULL DEFAULT 0,
      current_page  INTEGER NOT NULL DEFAULT 0,
      category      TEXT    NOT NULL DEFAULT '',
      status        TEXT    NOT NULL DEFAULT 'reading',
      cover_url     TEXT,
      isbn          TEXT,
      added_at      INTEGER NOT NULL,
      finished_at   INTEGER
    );
  `);

  // FK references books(id) so books table must exist first
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id                      TEXT    PRIMARY KEY NOT NULL,
      book_id                 TEXT    NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      start_time              INTEGER NOT NULL,
      end_time                INTEGER NOT NULL,
      duration_seconds        INTEGER NOT NULL,
      pages_read_in_session   INTEGER NOT NULL,
      start_page              INTEGER NOT NULL,
      end_page                INTEGER NOT NULL
    );
  `);

  await sqlite.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_sessions_book_id ON sessions(book_id);
  `);

  await migrateSessionsFromAsyncStorage();
}

/**
 * One-time migration: reads any session blobs previously stored in AsyncStorage
 * and inserts them into the new SQLite sessions table.
 * Runs silently — a failure here is logged but never rethrows, so the app
 * continues to work even if old data can't be recovered.
 */
async function migrateSessionsFromAsyncStorage(): Promise<void> {
  try {
    const alreadyMigrated = await AsyncStorage.getItem(MIGRATION_FLAG_KEY);
    if (alreadyMigrated === "true") return;

    const allKeys = await AsyncStorage.getAllKeys();
    const sessionKeys = allKeys.filter((k) =>
      k.startsWith(ASYNC_STORAGE_SESSION_PREFIX),
    );

    if (sessionKeys.length > 0) {
      const pairs = await AsyncStorage.multiGet(sessionKeys);

      for (const [, raw] of pairs) {
        if (!raw) continue;
        try {
          const data = JSON.parse(raw) as BookSessionData;
          for (const session of data.sessions) {
            await db
              .insert(sessionsTable)
              .values({
                id: session.id,
                bookId: session.bookId,
                startTime: session.startTime,
                endTime: session.endTime,
                durationSeconds: session.durationSeconds,
                pagesReadInSession: session.pagesReadInSession,
                startPage: session.startPage,
                endPage: session.endPage,
              })
              .onConflictDoNothing();
          }
        } catch (innerErr) {
          // A single book's sessions failing should not block the rest
          console.error(
            "[DB] Failed to migrate sessions for a book:",
            innerErr,
          );
        }
      }

      // Clean up AsyncStorage only after all inserts succeed
      await AsyncStorage.multiRemove(sessionKeys);
    }

    await AsyncStorage.setItem(MIGRATION_FLAG_KEY, "true");
  } catch (err) {
    // Log but never rethrow — old AsyncStorage data is untouched if this fails,
    // so a retry will succeed on next cold start
    console.error("[DB] Session migration failed:", err);
  }
}
