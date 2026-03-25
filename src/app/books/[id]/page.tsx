import { getBookById } from "@/db/queries";
import { CardGrid } from "@/components/CardGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);
  if (!book) notFound();

  const cardsWithBook = book.cards.map((c) => ({ ...c, book }));

  return (
    <div className="py-6">
      <Link href="/books" className="text-slate-400 text-sm hover:text-white transition-colors">
        ← Books
      </Link>
      <h1 className="text-3xl font-bold mt-3 mb-1">{book.title}</h1>
      <p className="text-slate-400 mb-6">{book.author} · {book.cards.length} ideas</p>
      <CardGrid cards={cardsWithBook} />
    </div>
  );
}
