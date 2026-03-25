"use client";

import Link from "next/link";
import { useState } from "react";

type CardWithBook = {
  id: string;
  emoji: string;
  title: string;
  content: string;
  gradient: string;
  book: { title: string };
};

export function CardGrid({ cards }: { cards: CardWithBook[] }) {
  const [selected, setSelected] = useState<CardWithBook | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelected(card)}
            className={`text-left rounded-2xl bg-gradient-to-br ${card.gradient || "from-violet-600 to-indigo-600"} p-5 hover:scale-[1.02] transition-transform active:scale-[0.98]`}
          >
            <span className="text-3xl mb-3 block">{card.emoji}</span>
            <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
            <p className="text-white/80 text-sm line-clamp-3">{card.content}</p>
            <p className="text-white/50 text-xs mt-3">{card.book.title}</p>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className={`w-full max-w-lg rounded-3xl bg-gradient-to-br ${selected.gradient || "from-violet-600 to-indigo-600"} p-8 max-h-[85vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-5xl mb-4 block">{selected.emoji}</span>
            <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-6">{selected.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-sm">{selected.book.title}</p>
              <Link
                href={`/card/${selected.id}`}
                className="text-white/70 text-sm underline hover:text-white"
              >
                Full view →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
