import { getBookById } from "@/db/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);
  if (!book) notFound();

  return (
    <div className="min-h-screen -mx-4 px-4 -mt-6 pt-6 pb-24" style={{ background: "linear-gradient(180deg, #F5E6D3 0%, #EDD9C4 100%)" }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/books" className="text-amber-800/60 text-sm hover:text-amber-900 transition-colors inline-flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Books
        </Link>
        <h1 className="text-3xl font-bold mt-3 mb-1 text-amber-950 tracking-tight">{book.title}</h1>
        <p className="text-amber-800/60 mb-8">{book.author} · {book.cards.length} ideas</p>

        <div className="space-y-3">
          {book.cards.map((card, index) => (
            <Link
              key={card.id}
              href={`/read/${card.id}`}
              className="flex items-center gap-4 rounded-2xl p-5 transition-all hover:scale-[1.01] active:scale-[0.99] group"
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(146,100,50,0.1)",
              }}
            >
              <span className="text-3xl flex-shrink-0">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-amber-800/40 text-xs font-medium mb-0.5">
                  Idea {index + 1} of {book.cards.length}
                </p>
                <h3 className="font-semibold text-amber-950 text-lg leading-tight group-hover:text-amber-800 transition-colors">
                  {card.title}
                </h3>
                <p className="text-amber-900/50 text-sm mt-1 line-clamp-1">{card.content}</p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-800/30 flex-shrink-0"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
