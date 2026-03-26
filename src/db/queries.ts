import { db } from "./index";
import { books, cards, collections, cardCollections } from "./schema";
import { eq, asc } from "drizzle-orm";

export async function getAllCards() {
  const allCards = await db.select().from(cards);
  const allBooks = await db.select().from(books);
  return allCards.map((c) => ({
    ...c,
    bookId: c.bookId,
    book: allBooks.find((b) => b.id === c.bookId)!,
  }));
}

export async function getAllBooks() {
  const allBooks = await db.select().from(books);
  const allCards = await db.select().from(cards);
  return allBooks.map((b) => ({
    ...b,
    _count: { cards: allCards.filter((c) => c.bookId === b.id).length },
  }));
}

export async function getBookById(id: string) {
  const [book] = await db.select().from(books).where(eq(books.id, id));
  if (!book) return null;
  const bookCards = await db.select().from(cards).where(eq(cards.bookId, id)).orderBy(asc(cards.order));
  return { ...book, cards: bookCards };
}

export async function getCardById(id: string) {
  const [card] = await db.select().from(cards).where(eq(cards.id, id));
  if (!card) return null;
  const [book] = await db.select().from(books).where(eq(books.id, card.bookId));
  return { ...card, book };
}

export async function getCardWithContext(id: string) {
  const [card] = await db.select().from(cards).where(eq(cards.id, id));
  if (!card) return null;
  const [book] = await db.select().from(books).where(eq(books.id, card.bookId));
  const bookCards = await db.select().from(cards).where(eq(cards.bookId, card.bookId)).orderBy(asc(cards.order));
  const currentIndex = bookCards.findIndex((c) => c.id === card.id);
  const prevCard = currentIndex > 0 ? bookCards[currentIndex - 1] : null;
  const nextCard = currentIndex < bookCards.length - 1 ? bookCards[currentIndex + 1] : null;
  return { ...card, book, totalCards: bookCards.length, currentIndex, prevCardId: prevCard?.id ?? null, nextCardId: nextCard?.id ?? null };
}

export async function getAllCollections() {
  const allCols = await db.select().from(collections);
  const allCC = await db.select().from(cardCollections);
  return allCols.map((col) => ({
    ...col,
    _count: { cards: allCC.filter((cc) => cc.collectionId === col.id).length },
  }));
}

export async function getCollectionById(id: string) {
  const [col] = await db.select().from(collections).where(eq(collections.id, id));
  if (!col) return null;
  const colCCs = await db.select().from(cardCollections).where(eq(cardCollections.collectionId, id));
  const allCards = await db.select().from(cards);
  const allBooks = await db.select().from(books);
  const colCards = colCCs.map((cc) => {
    const card = allCards.find((c) => c.id === cc.cardId)!;
    return { ...card, book: allBooks.find((b) => b.id === card.bookId)! };
  });
  return { ...col, cards: colCards };
}
