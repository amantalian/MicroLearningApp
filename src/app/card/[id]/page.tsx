import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CardPage({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({
    where: { id: params.id },
    include: { book: true },
  });

  if (!card) notFound();

  return (
    <div className="py-6">
      <Link href="/" className="text-slate-400 text-sm hover:text-white transition-colors">
        ← Back
      </Link>
      <div className={`mt-4 rounded-3xl bg-gradient-to-br ${card.gradient || "from-violet-600 to-indigo-600"} p-8`}>
        <span className="text-5xl mb-4 block">{card.emoji}</span>
        <h1 className="text-2xl font-bold mb-4">{card.title}</h1>
        <p className="text-white/90 text-lg leading-relaxed">{card.content}</p>
      </div>
      <Link
        href={`/books/${card.bookId}`}
        className="mt-4 flex items-center gap-3 bg-slate-900 rounded-2xl p-4 hover:bg-slate-800 transition-colors"
      >
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">From</p>
          <p className="font-medium">{card.book.title}</p>
          <p className="text-sm text-slate-400">{card.book.author}</p>
        </div>
      </Link>
    </div>
  );
}
