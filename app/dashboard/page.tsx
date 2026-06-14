"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NameModal from "@/components/NameModal";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getUser } from "@/lib/storage";

interface Language {
  id: string; code: string; name: string; nativeName: string; flag: string;
  hasScript: boolean; scriptName: string | null; color: string;
}

export default function DashboardPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) setShowModal(true);
    else setUser(u);

    fetch("/api/languages")
      .then(r => r.json())
      .then(data => { setLanguages(data); setLoading(false); });
  }, []);

  const handleNameSet = (u: { id: string; name: string }) => {
    setUser(u);
    setShowModal(false);
  };

  const filtered = languages.filter(l =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showModal && <NameModal onComplete={handleNameSet} />}
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user ? `Welcome, ${user.name}! 👋` : "What do you want to learn? 🌍"}
          </h1>
          <p className="text-gray-600 mt-1">Pick a language and start learning.</p>
        </div>

        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <Input
            placeholder="Search languages..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 h-11 text-base bg-white"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No languages found for &quot;{query}&quot;</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} language{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((lang) => (
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
          </>
        )}
      </main>
    </div>
  );
}
