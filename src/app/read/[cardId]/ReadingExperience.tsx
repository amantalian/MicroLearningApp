"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  card: {
    id: string;
    emoji: string;
    title: string;
    story: string;
    keyIdea: string;
    quizQuestion: string;
    quizOptions: string[];
    quizAnswer: number;
    bookTitle: string;
    bookAuthor: string;
    bookId: string;
    currentIndex: number;
    totalCards: number;
    nextCardId: string | null;
  };
};

export function ReadingExperience({ card }: Props) {
  const router = useRouter();
  const [keyIdeaRevealed, setKeyIdeaRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const keyIdeaRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const storyParagraphs = card.story.split("\n\n").filter(Boolean);

  useEffect(() => {
    if (keyIdeaRevealed) {
      const timer = setTimeout(() => {
        setShowQuiz(true);
        setTimeout(() => {
          quizRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [keyIdeaRevealed]);

  const handleRevealKeyIdea = () => {
    setKeyIdeaRevealed(true);
    setTimeout(() => {
      keyIdeaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (card.nextCardId) {
      router.push(`/read/${card.nextCardId}`);
    } else {
      router.push(`/books/${card.bookId}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: "linear-gradient(180deg, #F5E6D3 0%, #F5E6D3ee 70%, transparent 100%)" }}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-amber-900/60 hover:text-amber-900 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: card.totalCards }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === card.currentIndex
                    ? "bg-amber-800 scale-125"
                    : i < card.currentIndex
                    ? "bg-amber-800/40"
                    : "bg-amber-800/20"
                }`}
              />
            ))}
          </div>
          <span className="text-amber-900/50 text-sm font-medium">
            {card.currentIndex + 1}/{card.totalCards}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-24">
        {/* Story Section */}
        <div className="pt-6 pb-8">
          <span className="text-5xl block mb-4">{card.emoji}</span>
          <h1 className="text-3xl font-bold text-amber-950 mb-2 leading-tight tracking-tight">
            {card.title}
          </h1>
          <p className="text-amber-800/60 text-sm mb-8">
            {card.bookTitle} · {card.bookAuthor}
          </p>

          <div className="space-y-5">
            {storyParagraphs.map((p, i) => (
              <p
                key={i}
                className="text-amber-950/85 text-lg leading-relaxed"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Key Idea Section */}
        <div className="py-8" ref={keyIdeaRef}>
          <div className="relative">
            {!keyIdeaRevealed ? (
              <button
                onClick={handleRevealKeyIdea}
                className="w-full rounded-2xl p-8 text-center transition-all active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)",
                  border: "2px dashed rgba(146,100,50,0.3)",
                }}
              >
                <div className="text-4xl mb-3">💡</div>
                <p className="text-amber-900/70 font-semibold text-lg mb-1">Key Idea</p>
                <p className="text-amber-800/50 text-sm">Tap to reveal the core takeaway</p>
              </button>
            ) : (
              <div
                className="rounded-2xl p-8 shadow-lg animate-reveal"
                style={{
                  background: "white",
                  border: "1px solid rgba(146,100,50,0.15)",
                }}
              >
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-amber-950 font-bold text-xl mb-4">Key Idea</h3>
                <p
                  className="text-amber-950/80 text-lg leading-relaxed"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {card.keyIdea}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Section */}
        {showQuiz && (
          <div className="py-8 animate-fadeUp" ref={quizRef}>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "white",
                border: "1px solid rgba(146,100,50,0.15)",
                boxShadow: "0 4px 24px rgba(146,100,50,0.08)",
              }}
            >
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-amber-950 font-bold text-xl mb-6">Quick Check</h3>
              <p
                className="text-amber-950/90 text-lg font-medium mb-6 leading-snug"
              >
                {card.quizQuestion}
              </p>

              <div className="space-y-3">
                {card.quizOptions.map((option, i) => {
                  let style = "bg-amber-50 border-amber-200/60 text-amber-950";
                  if (selectedAnswer !== null) {
                    if (i === card.quizAnswer) {
                      style = "bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/30";
                    } else if (i === selectedAnswer && i !== card.quizAnswer) {
                      style = "bg-red-50 border-red-400 text-red-900 ring-2 ring-red-400/30";
                    } else {
                      style = "bg-gray-50 border-gray-200 text-gray-400";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left rounded-xl px-5 py-4 border-2 transition-all text-base font-medium ${style} ${
                        selectedAnswer === null ? "hover:bg-amber-100/80 active:scale-[0.98]" : ""
                      }`}
                    >
                      <span className="text-amber-800/40 mr-3 font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="mt-6 animate-fadeUp">
                  <p className={`text-base font-medium mb-4 ${
                    selectedAnswer === card.quizAnswer ? "text-emerald-700" : "text-red-700"
                  }`}>
                    {selectedAnswer === card.quizAnswer
                      ? "✅ Correct! You got it."
                      : `❌ Not quite. The answer is ${String.fromCharCode(65 + card.quizAnswer)}.`}
                  </p>
                  <button
                    onClick={handleNext}
                    className="w-full rounded-xl py-4 px-6 font-semibold text-lg text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #92400e, #78350f)",
                    }}
                  >
                    {card.nextCardId ? "Next Idea →" : "Complete ✓"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes reveal {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-reveal {
          animation: reveal 0.5s ease-out forwards;
        }
        .animate-fadeUp {
          animation: fadeUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
