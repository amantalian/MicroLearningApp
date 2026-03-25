import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    include: { _count: { select: { cards: true } } },
  });

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-1">Books</h1>
      <p className="text-slate-400 mb-6">Browse by source</p>
      <div className="grid gap-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-slate-400 text-sm">{book.author}</p>
              </div>
              <div className="text-right">
                <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                  {book._count.cards} ideas
                </span>
                {book.category && (
                  <p className="text-xs text-slate-500 mt-1">{book.category}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
