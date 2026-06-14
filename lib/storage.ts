"use client";

import { sm2 } from "./sm2";

export interface LocalFlashcard {
  id: string;
  word: string;
  translation: string;
  romanized?: string;
  audioText?: string;
  languageCode: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: string;
}

const FC_KEY = "lingora_flashcards";
const DONE_KEY = "lingora_completed";

export function getFlashcards(): LocalFlashcard[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FC_KEY) ?? "[]"); }
  catch { return []; }
}

export function getDueFlashcards(langCode?: string): LocalFlashcard[] {
  const now = new Date();
  return getFlashcards().filter(c => {
    const due = new Date(c.nextReview) <= now;
    return langCode ? due && c.languageCode === langCode : due;
  });
}

export function reviewFlashcard(id: string, quality: 0 | 1 | 2 | 3 | 4 | 5): void {
  const cards = getFlashcards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return;
  const card = cards[idx];
  const updated = sm2(
    { interval: card.interval, repetitions: card.repetitions, easeFactor: card.easeFactor, nextReview: new Date(card.nextReview) },
    quality
  );
  cards[idx] = { ...card, ...updated, nextReview: updated.nextReview.toISOString() };
  localStorage.setItem(FC_KEY, JSON.stringify(cards));
}

export function addFlashcardsIfNew(
  newCards: Omit<LocalFlashcard, "interval" | "repetitions" | "easeFactor" | "nextReview">[]
): void {
  const existing = getFlashcards();
  const ids = new Set(existing.map(c => c.id));
  const toAdd = newCards
    .filter(c => !ids.has(c.id))
    .map(c => ({ ...c, interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString() }));
  if (toAdd.length > 0) {
    localStorage.setItem(FC_KEY, JSON.stringify([...existing, ...toAdd]));
  }
}

export function getCompletedLessons(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(DONE_KEY) ?? "[]"); }
  catch { return []; }
}

export function markLessonCompleted(lessonId: string): void {
  const done = getCompletedLessons();
  if (!done.includes(lessonId)) {
    localStorage.setItem(DONE_KEY, JSON.stringify([...done, lessonId]));
  }
}

export interface LocalUser { id: string; name: string; }
const USER_KEY = "lingora_user";
export function getUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? "null"); }
  catch { return null; }
}
export function setUser(user: LocalUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}
