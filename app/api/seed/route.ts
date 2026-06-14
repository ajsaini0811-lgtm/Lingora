import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LANGUAGES } from "@/lib/languages";

export async function POST() {
  // Seed languages
  for (const lang of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: lang.code },
      create: lang,
      update: lang,
    });
  }

  // Seed Spanish lessons
  const spanish = await prisma.language.findUnique({ where: { code: "es" } });
  if (spanish) {
    const unit1 = await prisma.unit.upsert({
      where: { id: "unit-es-1" },
      create: { id: "unit-es-1", languageId: spanish.id, title: "The Basics", description: "Learn your first Spanish words", order: 1 },
      update: {},
    });
    const lesson1 = await prisma.lesson.upsert({
      where: { id: "lesson-es-1" },
      create: { id: "lesson-es-1", unitId: unit1.id, title: "Greetings", type: "vocabulary", order: 1, xpReward: 10 },
      update: {},
    });
    const exercises = [
      { id: "ex-es-1", lessonId: lesson1.id, type: "multiple_choice", order: 1, question: "How do you say 'Hello' in Spanish?", answer: "Hola", options: JSON.stringify(["Hola", "Adiós", "Gracias", "Por favor"]), audioText: "Hola", targetLang: "es" },
      { id: "ex-es-2", lessonId: lesson1.id, type: "multiple_choice", order: 2, question: "What does 'Buenos días' mean?", answer: "Good morning", options: JSON.stringify(["Good morning", "Good night", "Good afternoon", "Goodbye"]), audioText: "Buenos días", targetLang: "es" },
      { id: "ex-es-3", lessonId: lesson1.id, type: "multiple_choice", order: 3, question: "How do you say 'Thank you' in Spanish?", answer: "Gracias", options: JSON.stringify(["Gracias", "Por favor", "Lo siento", "De nada"]), audioText: "Gracias", targetLang: "es" },
      { id: "ex-es-4", lessonId: lesson1.id, type: "fill_blank", order: 4, question: "Complete: '_____ tardes' means 'Good afternoon'", answer: "Buenas", hint: "It starts with B", audioText: "Buenas tardes", targetLang: "es" },
      { id: "ex-es-5", lessonId: lesson1.id, type: "multiple_choice", order: 5, question: "How do you say 'Please' in Spanish?", answer: "Por favor", options: JSON.stringify(["Por favor", "De nada", "Perdón", "Hola"]), audioText: "Por favor", targetLang: "es" },
    ];
    for (const ex of exercises) {
      await prisma.exercise.upsert({ where: { id: ex.id }, create: ex, update: {} });
    }

    const lesson2 = await prisma.lesson.upsert({
      where: { id: "lesson-es-2" },
      create: { id: "lesson-es-2", unitId: unit1.id, title: "Numbers 1-10", type: "vocabulary", order: 2, xpReward: 10 },
      update: {},
    });
    const numExercises = [
      { id: "ex-es-6", lessonId: lesson2.id, type: "multiple_choice", order: 1, question: "What is 'uno' in English?", answer: "One", options: JSON.stringify(["One", "Two", "Three", "Four"]), audioText: "uno", targetLang: "es" },
      { id: "ex-es-7", lessonId: lesson2.id, type: "multiple_choice", order: 2, question: "How do you say 'five' in Spanish?", answer: "cinco", options: JSON.stringify(["tres", "cuatro", "cinco", "seis"]), audioText: "cinco", targetLang: "es" },
      { id: "ex-es-8", lessonId: lesson2.id, type: "fill_blank", order: 3, question: "Type the Spanish word for 'ten'", answer: "diez", hint: "Starts with D", audioText: "diez", targetLang: "es" },
    ];
    for (const ex of numExercises) {
      await prisma.exercise.upsert({ where: { id: ex.id }, create: ex, update: {} });
    }
  }

  // Seed Japanese lessons
  const japanese = await prisma.language.findUnique({ where: { code: "ja" } });
  if (japanese) {
    const unit1 = await prisma.unit.upsert({
      where: { id: "unit-ja-1" },
      create: { id: "unit-ja-1", languageId: japanese.id, title: "Hiragana Basics", description: "Learn the Japanese alphabet", order: 1 },
      update: {},
    });
    const lesson1 = await prisma.lesson.upsert({
      where: { id: "lesson-ja-1" },
      create: { id: "lesson-ja-1", unitId: unit1.id, title: "Vowels", type: "script", order: 1, xpReward: 15 },
      update: {},
    });
    const jaExercises = [
      { id: "ex-ja-1", lessonId: lesson1.id, type: "multiple_choice", order: 1, question: "What is the romaji for 'あ'?", answer: "a", options: JSON.stringify(["a", "i", "u", "e"]), audioText: "あ", targetLang: "ja" },
      { id: "ex-ja-2", lessonId: lesson1.id, type: "multiple_choice", order: 2, question: "What is the romaji for 'い'?", answer: "i", options: JSON.stringify(["a", "i", "u", "e"]), audioText: "い", targetLang: "ja" },
      { id: "ex-ja-3", lessonId: lesson1.id, type: "multiple_choice", order: 3, question: "Which character makes the 'u' sound?", answer: "う", options: JSON.stringify(["あ", "い", "う", "え"]), audioText: "う", targetLang: "ja" },
      { id: "ex-ja-4", lessonId: lesson1.id, type: "multiple_choice", order: 4, question: "What is the romaji for 'お'?", answer: "o", options: JSON.stringify(["a", "e", "o", "u"]), audioText: "お", targetLang: "ja" },
      { id: "ex-ja-5", lessonId: lesson1.id, type: "fill_blank", order: 5, question: "Type the romaji for: え", answer: "e", hint: "It's a vowel", audioText: "え", targetLang: "ja" },
    ];
    for (const ex of jaExercises) {
      await prisma.exercise.upsert({ where: { id: ex.id }, create: ex, update: {} });
    }
  }

  return NextResponse.json({ success: true, message: "Database seeded successfully" });
}
