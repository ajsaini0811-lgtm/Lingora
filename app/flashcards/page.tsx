"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import TTSButton from "@/components/TTSButton";
import { Button } from "@/components/ui/button";
import {
  getDueFlashcards,
  reviewFlashcard,
  addFlashcardsIfNew,
  type LocalFlashcard,
} from "@/lib/storage";

const STARTER_VOCAB: Omit<LocalFlashcard, "interval" | "repetitions" | "easeFactor" | "nextReview">[] = [
  { id: "es-hola", word: "Hola", translation: "Hello", audioText: "Hola", languageCode: "es" },
  { id: "es-adios", word: "Adiós", translation: "Goodbye", audioText: "Adiós", languageCode: "es" },
  { id: "es-gracias", word: "Gracias", translation: "Thank you", audioText: "Gracias", languageCode: "es" },
  { id: "es-porfavor", word: "Por favor", translation: "Please", audioText: "Por favor", languageCode: "es" },
  { id: "es-buenosdias", word: "Buenos días", translation: "Good morning", audioText: "Buenos días", languageCode: "es" },
  { id: "es-uno", word: "uno", translation: "one", audioText: "uno", languageCode: "es" },
  { id: "es-dos", word: "dos", translation: "two", audioText: "dos", languageCode: "es" },
  { id: "es-tres", word: "tres", translation: "three", audioText: "tres", languageCode: "es" },
  { id: "es-cinco", word: "cinco", translation: "five", audioText: "cinco", languageCode: "es" },
  { id: "es-diez", word: "diez", translation: "ten", audioText: "diez", languageCode: "es" },
  { id: "ja-a", word: "あ", translation: "a", romanized: "a", audioText: "あ", languageCode: "ja" },
  { id: "ja-i", word: "い", translation: "i", romanized: "i", audioText: "い", languageCode: "ja" },
  { id: "ja-u", word: "う", translation: "u", romanized: "u", audioText: "う", languageCode: "ja" },
  { id: "ja-e", word: "え", translation: "e", romanized: "e", audioText: "え", languageCode: "ja" },
  { id: "ja-o", word: "お", translation: "o", romanized: "o", audioText: "お", languageCode: "ja" },
  { id: "ja-konnichiwa", word: "こんにちは", translation: "Hello", romanized: "Konnichiwa", audioText: "こんにちは", languageCode: "ja" },
  { id: "ja-arigatou", word: "ありがとう", translation: "Thank you", romanized: "Arigatou", audioText: "ありがとう", languageCode: "ja" },
  { id: "fr-bonjour", word: "Bonjour", translation: "Hello / Good day", audioText: "Bonjour", languageCode: "fr" },
  { id: "fr-merci", word: "Merci", translation: "Thank you", audioText: "Merci", languageCode: "fr" },
  { id: "fr-aurevoir", word: "Au revoir", translation: "Goodbye", audioText: "Au revoir", languageCode: "fr" },
  { id: "ko-annyeong", word: "안녕하세요", translation: "Hello", romanized: "Annyeonghaseyo", audioText: "안녕하세요", languageCode: "ko" },
  { id: "ko-gamsahamnida", word: "감사합니다", translation: "Thank you", romanized: "Gamsahamnida", audioText: "감사합니다", languageCode: "ko" },
  { id: "hi-namaste", word: "नमस्ते", translation: "Hello", romanized: "Namaste", audioText: "नमस्ते", languageCode: "hi" },
  { id: "hi-dhanyavaad", word: "धन्यवाद", translation: "Thank you", romanized: "Dhanyavaad", audioText: "धन्यवाद", languageCode: "hi" },
];

export default function FlashcardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<LocalFlashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    addFlashcardsIfNew(STARTER_VOCAB);
    const due = getDueFlashcards();
    setCards(due);
    setLoaded(true);
  }, []);

  const current = cards[currentIdx];

  const rate = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    reviewFlashcard(current.id, quality);
    if (currentIdx + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
    }
  };

  if (!loaded) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h1>
        <p className="text-gray-600 mb-8">Review words due for practice using spaced repetition</p>

        {done || cards.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
            <div className="text-5xl mb-4">🎊</div>
            <h2 className="text-xl font-semibold text-gray-800">
              {cards.length === 0 ? "No cards due!" : "All done for now!"}
            </h2>
            <p className="text-gray-500 mt-2">
              {cards.length === 0
                ? "Come back tomorrow to review your cards."
                : "You've reviewed all due cards. Great work!"}
            </p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/dashboard")}>
              Back to learning
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-sm text-gray-500 mb-4 text-right">{currentIdx + 1} / {cards.length}</div>
            <div
              className="bg-white rounded-2xl border shadow-sm p-10 text-center cursor-pointer min-h-52 flex flex-col items-center justify-center hover:shadow-md transition-shadow"
              onClick={() => setFlipped(f => !f)}
            >
              {!flipped ? (
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{current.word}</div>
                  {current.romanized && <div className="text-gray-400 text-lg mt-1">{current.romanized}</div>}
                  {current.audioText && (
                    <div className="mt-4" onClick={e => e.stopPropagation()}>
                      <TTSButton text={current.audioText} size="lg" />
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mt-6">Tap to reveal translation</p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-semibold text-indigo-600 mb-2">{current.translation}</div>
                  <div className="text-gray-400 text-lg mt-1">{current.word}</div>
                  <p className="text-gray-400 text-sm mt-6">How well did you know this?</p>
                </div>
              )}
            </div>

            {flipped && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 h-12" onClick={() => rate(1)}>
                  Hard
                </Button>
                <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 h-12" onClick={() => rate(3)}>
                  Good
                </Button>
                <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 h-12" onClick={() => rate(5)}>
                  Easy
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
