import { getCardWithContext } from "@/db/queries";
import { notFound } from "next/navigation";
import { ReadingExperience } from "./ReadingExperience";

export default async function ReadPage({ params }: { params: { cardId: string } }) {
  const card = await getCardWithContext(params.cardId);
  if (!card) notFound();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "linear-gradient(180deg, #F5E6D3 0%, #EDD9C4 100%)" }}>
      <ReadingExperience
        card={{
          id: card.id,
          emoji: card.emoji,
          title: card.title,
          story: card.story,
          keyIdea: card.keyIdea,
          quizQuestion: card.quizQuestion,
          quizOptions: JSON.parse(card.quizOptions),
          quizAnswer: card.quizAnswer,
          bookTitle: card.book.title,
          bookAuthor: card.book.author,
          bookId: card.bookId,
          currentIndex: card.currentIndex,
          totalCards: card.totalCards,
          prevCardId: card.prevCardId,
          nextCardId: card.nextCardId,
        }}
      />
    </div>
  );
}
