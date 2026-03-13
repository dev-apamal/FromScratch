import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const sqlite = openDatabaseSync("readlog.db");
export const db = drizzle(sqlite, { schema });

export async function initDB(): Promise<void> {
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
}
