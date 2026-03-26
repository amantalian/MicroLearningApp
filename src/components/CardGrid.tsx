"use client";

import Link from "next/link";

type CardWithBook = {
  id: string;
  emoji: string;
  title: string;
  content: string;
  gradient: string;
  book: { title: string };
};

export function CardGrid({ cards }: { cards: CardWithBook[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/read/${card.id}`}
          className={`text-left rounded-2xl bg-gradient-to-br ${card.gradient || "from-violet-600 to-indigo-600"} p-5 hover:scale-[1.02] transition-transform active:scale-[0.98] block`}
        >
          <span className="text-3xl mb-3 block">{card.emoji}</span>
          <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
          <p className="text-white/80 text-sm line-clamp-3">{card.content}</p>
          <p className="text-white/50 text-xs mt-3">{card.book.title}</p>
        </Link>
      ))}
    </div>
  );
}
