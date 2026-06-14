import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="flex items-center justify-between px-8 py-5 border-b bg-white/70 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <span className="text-xl font-bold text-indigo-600">Lingora</span>
        </div>
        <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Start learning</Button>
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>✨</span> No sign-up. No lives. No pressure.
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Learn any language,<br />
          <span className="text-indigo-600">right now</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Lingora combines structured lessons, smart flashcards, and pronunciation practice —
          no account needed. Just open and start learning.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-10 py-6">
            Start learning for free →
          </Button>
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🎯", title: "Structured Lessons", desc: "Carefully designed lessons that build on each other, from basics to fluency." },
            { icon: "🔊", title: "Pronunciation Practice", desc: "Hear every word spoken clearly. Tap any word or sentence to hear it aloud." },
            { icon: "🃏", title: "Smart Flashcards", desc: "Spaced repetition shows you hard words more often, easy words less. Science-backed." },
            { icon: "✍️", title: "Script Learning", desc: "Learn Japanese Hiragana, Korean Hangul, Hindi Devanagari with clear explanations." },
            { icon: "😌", title: "No Stress", desc: "No hearts, no lives, no failure. Every mistake is a learning opportunity." },
            { icon: "🌍", title: "10+ Languages", desc: "Spanish, French, Japanese, Korean, Hindi, German, Chinese, Arabic, and more." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm border-t">
        © 2025 Lingora · Learn without limits
      </footer>
    </main>
  );
}
