import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-xl">🌐</span>
        <span className="font-bold text-indigo-600 text-lg">Lingora</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Learn</Link>
        <Link href="/flashcards" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Flashcards</Link>
        <Link href="/progress" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Progress</Link>
      </div>
    </nav>
  );
}
