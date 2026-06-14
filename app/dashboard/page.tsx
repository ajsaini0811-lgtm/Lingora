"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Language {
  id: string; code: string; name: string; nativeName: string; flag: string;
  hasScript: boolean; scriptName: string | null; color: string;
}

export default function DashboardPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/languages")
      .then(r => r.json())
      .then(data => { setLanguages(data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">What do you want to learn? 🌍</h1>
          <p className="text-gray-600 mt-1">Pick a language and start right away — no account needed.</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">Choose a language</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <Link key={lang.code} href={`/learn/${lang.code}`}>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="text-4xl mb-3">{lang.flag}</div>
                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {lang.name}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">{lang.nativeName}</div>
                {lang.hasScript && (
                  <div className="mt-2 inline-block text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                    ✍️ {lang.scriptName}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
