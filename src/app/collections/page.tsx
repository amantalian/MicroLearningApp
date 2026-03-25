import { getAllCollections } from "@/db/queries";
import Link from "next/link";

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-1">Collections</h1>
      <p className="text-slate-400 mb-6">Ideas grouped by topic</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.id}`}
            className="bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition-colors"
          >
            <span className="text-3xl mb-3 block">{col.emoji}</span>
            <h2 className="text-lg font-semibold">{col.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{col.description}</p>
            <span className="text-xs text-slate-500 mt-2 block">{col._count.cards} cards</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
