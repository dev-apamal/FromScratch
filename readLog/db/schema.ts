import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
  id: text("id").primaryKey(),
  olKey: text("ol_key").notNull(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  pageCount: integer("page_count").notNull().default(0),
  currentPage: integer("current_page").notNull().default(0),
  category: text("category").notNull().default(""),
  status: text("status")
    .$type<"reading" | "finished">()
    .notNull()
    .default("reading"),
  coverUrl: text("cover_url"),
  isbn: text("isbn"),
  addedAt: integer("added_at").notNull(),
  finishedAt: integer("finished_at"),
});

export type DbBook = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;
