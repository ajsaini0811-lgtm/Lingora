"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getCompletedLessons, getFlashcards } from "@/lib/storage";

export default function ProgressPage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [flashcardCount, setFlashcardCount] = useState(0);

  useEffect(() => {
    setCompletedCount(getCompletedLessons().length);
    setFlashcardCount(getFlashcards().length);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600 mb-8">Stored locally in your browser</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border shadow-sm text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-1">{completedCount}</div>
            <div className="text-gray-600 text-sm">Lessons completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border shadow-sm text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">{flashcardCount}</div>
            <div className="text-gray-600 text-sm">Flashcards saved</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border shadow-sm text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-800">Detailed stats coming soon</h2>
          <p className="text-gray-500 mt-2">Per-language breakdowns, streaks, and more are on the way!</p>
        </div>
      </main>
    </div>
  );
}
