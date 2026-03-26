import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
});

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  bookId: text("book_id").notNull().references(() => books.id),
  emoji: text("emoji").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  gradient: text("gradient").notNull(),
  story: text("story").notNull().default(""),
  keyIdea: text("key_idea").notNull().default(""),
  quizQuestion: text("quiz_question").notNull().default(""),
  quizOptions: text("quiz_options").notNull().default("[]"),
  quizAnswer: integer("quiz_answer").notNull().default(0),
});

export const collections = sqliteTable("collections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description").notNull(),
});

export const cardCollections = sqliteTable("card_collections", {
  cardId: text("card_id").notNull().references(() => cards.id),
  collectionId: text("collection_id").notNull().references(() => collections.id),
});
