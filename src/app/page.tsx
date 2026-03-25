import { getAllCards } from "@/data";
import { CardGrid } from "@/components/CardGrid";

export default function Home() {
  const cards = getAllCards();

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-1">Discover</h1>
      <p className="text-slate-400 mb-6">Bite-sized ideas from great books</p>
      <CardGrid cards={cards} />
    </div>
  );
}
