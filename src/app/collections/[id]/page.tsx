import { getCollectionById } from "@/db/queries";
import { CardGrid } from "@/components/CardGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const collection = await getCollectionById(params.id);
  if (!collection) notFound();

  return (
    <div className="py-6">
      <Link href="/collections" className="text-slate-400 text-sm hover:text-white transition-colors">
        ← Collections
      </Link>
      <div className="mt-3 mb-6">
        <span className="text-4xl">{collection.emoji}</span>
        <h1 className="text-3xl font-bold mt-2 mb-1">{collection.name}</h1>
        <p className="text-slate-400">{collection.description}</p>
      </div>
      <CardGrid cards={collection.cards} />
    </div>
  );
}
