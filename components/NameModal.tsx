"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUser } from "@/lib/storage";

interface Props { onComplete: (user: { id: string; name: string }) => void; }

export default function NameModal({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const user = await res.json();
    setUser(user);
    onComplete(user);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🌐</div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Lingora!</h2>
          <p className="text-gray-600 mt-2">Enter your name to track your progress</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name..."
            className="h-12 text-lg text-center"
            autoFocus
            required
          />
          <Button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base"
          >
            {loading ? "Starting..." : "Start Learning →"}
          </Button>
        </form>
        <p className="text-center text-gray-400 text-xs mt-4">No email or password needed</p>
      </div>
    </div>
  );
}
