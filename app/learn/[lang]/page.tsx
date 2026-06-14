"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getCompletedLessons } from "@/lib/storage";

interface Lesson { id: string; title: string; type: string; order: number; xpReward: number; }
interface Unit { id: string; title: string; description: string; order: number; lessons: Lesson[]; }

const typeIcon = (type: string) => {
  if (type === "script") return "✍️";
  if (type === "grammar") return "📖";
  if (type === "conversation") return "💬";
  return "📝";
};

export default function LearnLanguagePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [units, setUnits] = useState<Unit[]>([]);
  const [language, setLanguage] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/languages").then(r => r.json()).then((langs: any[]) => {
      setLanguage(langs.find((l: any) => l.code === lang) ?? null);
    });
    fetch(`/api/languages/${lang}/units`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setUnits(data);
      setLoading(false);
    });
    setCompleted(getCompletedLessons());
  }, [lang]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        {language && (
          <div className="mb-8 flex items-center gap-3">
            <span className="text-5xl">{language.flag}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{language.name}</h1>
              <p className="text-gray-500">{language.nativeName}</p>
            </div>
          </div>
        )}

        {units.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold text-gray-800">Content coming soon!</h2>
            <p className="text-gray-500 mt-2">We&apos;re building lessons for this language.</p>
            <Link href="/dashboard" className="mt-6 inline-block text-indigo-600 hover:underline text-sm font-medium">
              ← Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="bg-indigo-50 px-6 py-4 border-b">
                  <h2 className="font-bold text-indigo-900">Unit {unit.order}: {unit.title}</h2>
                  <p className="text-indigo-700 text-sm mt-0.5">{unit.description}</p>
                </div>
                <div className="p-4 space-y-3">
                  {unit.lessons.map((lesson) => {
                    const done = completed.includes(lesson.id);
                    return (
                      <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{done ? "✅" : typeIcon(lesson.type)}</span>
                            <div>
                              <div className="font-medium text-gray-900 group-hover:text-indigo-700">{lesson.title}</div>
                              <div className="text-xs text-gray-500 capitalize">{lesson.type}</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                            {done ? "Done" : `+${lesson.xpReward} XP`}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
