import { prisma } from "@/lib/prisma";
import { CardGrid } from "@/components/CardGrid";

export default async function Home() {
  const cards = await prisma.card.findMany({
    include: { book: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-1">Discover</h1>
      <p className="text-slate-400 mb-6">Bite-sized ideas from great books</p>
      <CardGrid cards={cards} />
    </div>
  );
}
