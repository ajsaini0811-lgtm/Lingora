import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LANGUAGES } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface LangData {
  code: string;
  name: string;
  hello: string;
  goodbye: string;
  thanks: string;
  yes: string;
  no: string;
  please: string;
  goodMorning: string;
}

const LANG_DATA: LangData[] = [
  { code: "es", name: "Spanish",    hello: "Hola",        goodbye: "Adiós",            thanks: "Gracias",        yes: "Sí",      no: "No",       please: "Por favor",      goodMorning: "Buenos días" },
  { code: "fr", name: "French",     hello: "Bonjour",     goodbye: "Au revoir",        thanks: "Merci",          yes: "Oui",     no: "Non",      please: "S'il vous plaît",goodMorning: "Bonjour" },
  { code: "de", name: "German",     hello: "Hallo",       goodbye: "Auf Wiedersehen",  thanks: "Danke",          yes: "Ja",      no: "Nein",     please: "Bitte",          goodMorning: "Guten Morgen" },
  { code: "it", name: "Italian",    hello: "Ciao",        goodbye: "Arrivederci",      thanks: "Grazie",         yes: "Sì",      no: "No",       please: "Per favore",     goodMorning: "Buongiorno" },
  { code: "pt", name: "Portuguese", hello: "Olá",         goodbye: "Tchau",            thanks: "Obrigado",       yes: "Sim",     no: "Não",      please: "Por favor",      goodMorning: "Bom dia" },
  { code: "ru", name: "Russian",    hello: "Привет",      goodbye: "До свидания",      thanks: "Спасибо",        yes: "Да",      no: "Нет",      please: "Пожалуйста",     goodMorning: "Доброе утро" },
  { code: "ja", name: "Japanese",   hello: "こんにちは",   goodbye: "さようなら",       thanks: "ありがとう",       yes: "はい",    no: "いいえ",    please: "お願い",          goodMorning: "おはよう" },
  { code: "ko", name: "Korean",     hello: "안녕하세요",   goodbye: "안녕히 가세요",    thanks: "감사합니다",       yes: "네",      no: "아니요",    please: "제발",            goodMorning: "좋은 아침" },
  { code: "zh", name: "Chinese",    hello: "你好",         goodbye: "再见",             thanks: "谢谢",            yes: "是",      no: "不",       please: "请",             goodMorning: "早上好" },
  { code: "ar", name: "Arabic",     hello: "مرحبا",       goodbye: "مع السلامة",       thanks: "شكرا",           yes: "نعم",    no: "لا",       please: "من فضلك",        goodMorning: "صباح الخير" },
  { code: "hi", name: "Hindi",      hello: "नमस्ते",       goodbye: "अलविदा",           thanks: "धन्यवाद",        yes: "हाँ",    no: "नहीं",     please: "कृपया",          goodMorning: "सुप्रभात" },
  { code: "tl", name: "Tagalog",    hello: "Kumusta",     goodbye: "Paalam",           thanks: "Salamat",        yes: "Oo",      no: "Hindi",    please: "Pakiusap",       goodMorning: "Magandang umaga" },
  { code: "tr", name: "Turkish",    hello: "Merhaba",     goodbye: "Güle güle",        thanks: "Teşekkürler",    yes: "Evet",    no: "Hayır",    please: "Lütfen",         goodMorning: "Günaydın" },
  { code: "vi", name: "Vietnamese", hello: "Xin chào",    goodbye: "Tạm biệt",         thanks: "Cảm ơn",         yes: "Vâng",    no: "Không",    please: "Xin hãy",        goodMorning: "Chào buổi sáng" },
  { code: "id", name: "Indonesian", hello: "Halo",        goodbye: "Sampai jumpa",     thanks: "Terima kasih",   yes: "Ya",      no: "Tidak",    please: "Tolong",         goodMorning: "Selamat pagi" },
  { code: "nl", name: "Dutch",      hello: "Hallo",       goodbye: "Tot ziens",        thanks: "Dank je",        yes: "Ja",      no: "Nee",      please: "Alstublieft",    goodMorning: "Goedemorgen" },
  { code: "sv", name: "Swedish",    hello: "Hej",         goodbye: "Hej då",           thanks: "Tack",           yes: "Ja",      no: "Nej",      please: "Snälla",         goodMorning: "God morgon" },
  { code: "pl", name: "Polish",     hello: "Cześć",       goodbye: "Do widzenia",      thanks: "Dziękuję",       yes: "Tak",     no: "Nie",      please: "Proszę",         goodMorning: "Dzień dobry" },
  { code: "no", name: "Norwegian",  hello: "Hei",         goodbye: "Ha det",           thanks: "Takk",           yes: "Ja",      no: "Nei",      please: "Vær så snill",   goodMorning: "God morgen" },
  { code: "el", name: "Greek",      hello: "Γεια σου",    goodbye: "Αντίο",            thanks: "Ευχαριστώ",      yes: "Ναι",     no: "Όχι",      please: "Παρακαλώ",       goodMorning: "Καλημέρα" },
  { code: "he", name: "Hebrew",     hello: "שלום",        goodbye: "להתראות",          thanks: "תודה",           yes: "כן",      no: "לא",       please: "בבקשה",          goodMorning: "בוקר טוב" },
  { code: "th", name: "Thai",       hello: "สวัสดี",       goodbye: "ลาก่อน",           thanks: "ขอบคุณ",         yes: "ใช่",     no: "ไม่",      please: "กรุณา",          goodMorning: "อรุณสวัสดิ์" },
  { code: "uk", name: "Ukrainian",  hello: "Привіт",      goodbye: "До побачення",     thanks: "Дякую",          yes: "Так",     no: "Ні",       please: "Будь ласка",     goodMorning: "Добрий ранок" },
  { code: "sw", name: "Swahili",    hello: "Jambo",       goodbye: "Kwaheri",          thanks: "Asante",         yes: "Ndiyo",   no: "Hapana",   please: "Tafadhali",      goodMorning: "Habari za asubuhi" },
  { code: "ro", name: "Romanian",   hello: "Bună",        goodbye: "La revedere",      thanks: "Mulțumesc",      yes: "Da",      no: "Nu",       please: "Vă rog",         goodMorning: "Bună dimineața" },
  { code: "da", name: "Danish",     hello: "Hej",         goodbye: "Farvel",           thanks: "Tak",            yes: "Ja",      no: "Nej",      please: "Vær venlig",     goodMorning: "God morgen" },
  { code: "fi", name: "Finnish",    hello: "Hei",         goodbye: "Näkemiin",         thanks: "Kiitos",         yes: "Kyllä",   no: "Ei",       please: "Ole hyvä",       goodMorning: "Huomenta" },
  { code: "ta", name: "Tamil",      hello: "வணக்கம்",     goodbye: "போய்வருகிறேன்",   thanks: "நன்றி",          yes: "ஆம்",     no: "இல்லை",    please: "தயவுசெய்து",     goodMorning: "காலை வணக்கம்" },
  { code: "bn", name: "Bengali",    hello: "নমস্কার",      goodbye: "বিদায়",            thanks: "ধন্যবাদ",        yes: "হ্যাঁ",   no: "না",       please: "দয়া করে",       goodMorning: "শুভ সকাল" },
  { code: "ms", name: "Malay",      hello: "Helo",        goodbye: "Selamat tinggal",  thanks: "Terima kasih",   yes: "Ya",      no: "Tidak",    please: "Tolong",         goodMorning: "Selamat pagi" },
  { code: "te", name: "Telugu",     hello: "నమస్కారం",    goodbye: "వెళ్ళివస్తాను",   thanks: "ధన్యవాదాలు",     yes: "అవును",   no: "కాదు",     please: "దయచేసి",         goodMorning: "శుభోదయం" },
  { code: "kn", name: "Kannada",    hello: "ನಮಸ್ಕಾರ",    goodbye: "ಹೋಗಿ ಬರ್ತೇನೆ",   thanks: "ಧನ್ಯವಾದ",        yes: "ಹೌದು",    no: "ಇಲ್ಲ",     please: "ದಯವಿಟ್ಟು",       goodMorning: "ಶುಭೋದಯ" },
  { code: "ml", name: "Malayalam",  hello: "നമസ്കാരം",    goodbye: "പോകുന്നു",         thanks: "നന്ദി",           yes: "അതെ",     no: "ഇല്ല",     please: "ദയവായി",         goodMorning: "ശുഭ പ്രഭാതം" },
];

function makeGreetingExercises(lang: LangData, lessonId: string) {
  const p = lang.code;
  return [
    { id: `ex-${p}-g1`, lessonId, type: "multiple_choice", order: 1, question: `How do you say 'Hello' in ${lang.name}?`,    answer: lang.hello,  options: JSON.stringify([lang.hello, lang.goodbye, lang.thanks, lang.please]),  audioText: lang.hello,   targetLang: lang.code },
    { id: `ex-${p}-g2`, lessonId, type: "multiple_choice", order: 2, question: `What does '${lang.goodbye}' mean?`,           answer: "Goodbye",   options: JSON.stringify(["Goodbye", "Hello", "Thank you", "Please"]),             audioText: lang.goodbye, targetLang: lang.code },
    { id: `ex-${p}-g3`, lessonId, type: "multiple_choice", order: 3, question: `How do you say 'Thank you' in ${lang.name}?`, answer: lang.thanks, options: JSON.stringify([lang.thanks, lang.hello, lang.no, lang.please]),         audioText: lang.thanks,  targetLang: lang.code },
    { id: `ex-${p}-g4`, lessonId, type: "multiple_choice", order: 4, question: `What does '${lang.yes}' mean?`,               answer: "Yes",       options: JSON.stringify(["Yes", "No", "Maybe", "Hello"]),                        audioText: lang.yes,     targetLang: lang.code },
    { id: `ex-${p}-g5`, lessonId, type: "multiple_choice", order: 5, question: `How do you say 'No' in ${lang.name}?`,        answer: lang.no,     options: JSON.stringify([lang.no, lang.yes, lang.hello, lang.thanks]),            audioText: lang.no,      targetLang: lang.code },
    { id: `ex-${p}-g6`, lessonId, type: "fill_blank",      order: 6, question: `Type the ${lang.name} word for 'Please'`,     answer: lang.please, hint: `Starts with: ${Array.from(lang.please)[0]}`,                             audioText: lang.please,  targetLang: lang.code },
  ];
}

function makeCommonExercises(lang: LangData, lessonId: string) {
  const p = lang.code;
  return [
    { id: `ex-${p}-c1`, lessonId, type: "multiple_choice", order: 1, question: `What does '${lang.goodMorning}' mean?`,  answer: "Good morning", options: JSON.stringify(["Good morning", "Good night", "Good afternoon", "Goodbye"]), audioText: lang.goodMorning, targetLang: lang.code },
    { id: `ex-${p}-c2`, lessonId, type: "multiple_choice", order: 2, question: `How do you say 'Yes' in ${lang.name}?`, answer: lang.yes,        options: JSON.stringify([lang.yes, lang.no, lang.hello, lang.thanks]),                   audioText: lang.yes,         targetLang: lang.code },
    { id: `ex-${p}-c3`, lessonId, type: "multiple_choice", order: 3, question: `What does '${lang.please}' mean?`,      answer: "Please",        options: JSON.stringify(["Please", "Thank you", "Sorry", "Excuse me"]),                  audioText: lang.please,      targetLang: lang.code },
    { id: `ex-${p}-c4`, lessonId, type: "fill_blank",      order: 4, question: `Type the ${lang.name} word for 'Hello'`,answer: lang.hello,      hint: `Starts with: ${Array.from(lang.hello)[0]}`,                                      audioText: lang.hello,       targetLang: lang.code },
  ];
}

export async function POST() {
  // Upsert all languages
  for (const lang of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: lang.code },
      create: lang,
      update: lang,
    });
  }

  // Seed all languages with greetings + common words
  for (const lang of LANG_DATA) {
    const langRecord = await prisma.language.findUnique({ where: { code: lang.code } });
    if (!langRecord) continue;

    // Unit 1: The Basics
    const unit1 = await prisma.unit.upsert({
      where: { id: `unit-${lang.code}-basics` },
      create: {
        id: `unit-${lang.code}-basics`,
        languageId: langRecord.id,
        title: "The Basics",
        description: `Learn essential ${lang.name} words and phrases`,
        order: 1,
      },
      update: {},
    });

    // Lesson 1: Greetings
    const greetLesson = await prisma.lesson.upsert({
      where: { id: `lesson-${lang.code}-greet` },
      create: {
        id: `lesson-${lang.code}-greet`,
        unitId: unit1.id,
        title: "Greetings",
        type: "vocabulary",
        order: 1,
        xpReward: 10,
      },
      update: {},
    });

    for (const ex of makeGreetingExercises(lang, greetLesson.id)) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        create: ex,
        update: {
          question: ex.question,
          answer: ex.answer,
          options: ex.options,
          audioText: ex.audioText,
          targetLang: ex.targetLang,
          hint: ex.hint,
        },
      });
    }

    // Lesson 2: Common Words
    const commonLesson = await prisma.lesson.upsert({
      where: { id: `lesson-${lang.code}-common` },
      create: {
        id: `lesson-${lang.code}-common`,
        unitId: unit1.id,
        title: "Common Words",
        type: "vocabulary",
        order: 2,
        xpReward: 10,
      },
      update: {},
    });

    for (const ex of makeCommonExercises(lang, commonLesson.id)) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        create: ex,
        update: {
          question: ex.question,
          answer: ex.answer,
          options: ex.options,
          audioText: ex.audioText,
          targetLang: ex.targetLang,
          hint: ex.hint,
        },
      });
    }
  }

  // Japanese: extra unit for Hiragana script
  const japanese = await prisma.language.findUnique({ where: { code: "ja" } });
  if (japanese) {
    const jaScriptUnit = await prisma.unit.upsert({
      where: { id: "unit-ja-script" },
      create: { id: "unit-ja-script", languageId: japanese.id, title: "Hiragana", description: "Learn the Japanese syllabary", order: 2 },
      update: {},
    });
    const jaHiragana = await prisma.lesson.upsert({
      where: { id: "lesson-ja-hiragana" },
      create: { id: "lesson-ja-hiragana", unitId: jaScriptUnit.id, title: "Vowels あいうえお", type: "script", order: 1, xpReward: 15 },
      update: {},
    });
    const jaExercises = [
      { id: "ex-ja-h1", lessonId: jaHiragana.id, type: "multiple_choice", order: 1, question: "What is the romaji for 'あ'?",         answer: "a",  options: JSON.stringify(["a", "i", "u", "e"]),     audioText: "あ", targetLang: "ja" },
      { id: "ex-ja-h2", lessonId: jaHiragana.id, type: "multiple_choice", order: 2, question: "What is the romaji for 'い'?",         answer: "i",  options: JSON.stringify(["a", "i", "u", "e"]),     audioText: "い", targetLang: "ja" },
      { id: "ex-ja-h3", lessonId: jaHiragana.id, type: "multiple_choice", order: 3, question: "Which character makes the 'u' sound?", answer: "う", options: JSON.stringify(["あ", "い", "う", "え"]), audioText: "う", targetLang: "ja" },
      { id: "ex-ja-h4", lessonId: jaHiragana.id, type: "multiple_choice", order: 4, question: "What is the romaji for 'え'?",         answer: "e",  options: JSON.stringify(["a", "e", "o", "u"]),     audioText: "え", targetLang: "ja" },
      { id: "ex-ja-h5", lessonId: jaHiragana.id, type: "fill_blank",      order: 5, question: "Type the romaji for: お",              answer: "o",                                                     audioText: "お", targetLang: "ja", hint: "It's the 5th vowel" },
    ];
    for (const ex of jaExercises) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        create: ex,
        update: { question: ex.question, answer: ex.answer, options: ex.options, audioText: ex.audioText, targetLang: ex.targetLang, hint: ex.hint },
      });
    }
  }

  // Korean: extra unit for Hangul
  const korean = await prisma.language.findUnique({ where: { code: "ko" } });
  if (korean) {
    const koScriptUnit = await prisma.unit.upsert({
      where: { id: "unit-ko-script" },
      create: { id: "unit-ko-script", languageId: korean.id, title: "Hangul", description: "Learn the Korean alphabet", order: 2 },
      update: {},
    });
    const koLesson = await prisma.lesson.upsert({
      where: { id: "lesson-ko-hangul" },
      create: { id: "lesson-ko-hangul", unitId: koScriptUnit.id, title: "Vowels", type: "script", order: 1, xpReward: 15 },
      update: {},
    });
    const koExercises = [
      { id: "ex-ko-h1", lessonId: koLesson.id, type: "multiple_choice", order: 1, question: "What sound does 'ㅏ' make?",       answer: "a",  options: JSON.stringify(["a", "i", "u", "e"]),     audioText: "아", targetLang: "ko" },
      { id: "ex-ko-h2", lessonId: koLesson.id, type: "multiple_choice", order: 2, question: "What sound does 'ㅣ' make?",       answer: "i",  options: JSON.stringify(["a", "i", "o", "u"]),     audioText: "이", targetLang: "ko" },
      { id: "ex-ko-h3", lessonId: koLesson.id, type: "multiple_choice", order: 3, question: "Which vowel makes the 'o' sound?", answer: "ㅗ", options: JSON.stringify(["ㅏ", "ㅣ", "ㅗ", "ㅜ"]), audioText: "오", targetLang: "ko" },
      { id: "ex-ko-h4", lessonId: koLesson.id, type: "fill_blank",      order: 4, question: "Type the romanization of: 우",      answer: "u",                                                     audioText: "우", targetLang: "ko", hint: "Short vowel sound" },
    ];
    for (const ex of koExercises) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        create: ex,
        update: { question: ex.question, answer: ex.answer, options: ex.options, audioText: ex.audioText, targetLang: ex.targetLang, hint: ex.hint },
      });
    }
  }

  // Spanish: extra numbers unit
  const spanish = await prisma.language.findUnique({ where: { code: "es" } });
  if (spanish) {
    const esNumUnit = await prisma.unit.upsert({
      where: { id: "unit-es-numbers" },
      create: { id: "unit-es-numbers", languageId: spanish.id, title: "Numbers", description: "Count from 1 to 10 in Spanish", order: 2 },
      update: {},
    });
    const esNumLesson = await prisma.lesson.upsert({
      where: { id: "lesson-es-numbers" },
      create: { id: "lesson-es-numbers", unitId: esNumUnit.id, title: "Numbers 1–10", type: "vocabulary", order: 1, xpReward: 10 },
      update: {},
    });
    const numExercises = [
      { id: "ex-es-n1", lessonId: esNumLesson.id, type: "multiple_choice", order: 1, question: "What is 'uno' in English?",        answer: "One",   options: JSON.stringify(["One", "Two", "Three", "Four"]),     audioText: "uno",   targetLang: "es" },
      { id: "ex-es-n2", lessonId: esNumLesson.id, type: "multiple_choice", order: 2, question: "How do you say 'five' in Spanish?", answer: "cinco", options: JSON.stringify(["tres", "cuatro", "cinco", "seis"]), audioText: "cinco", targetLang: "es" },
      { id: "ex-es-n3", lessonId: esNumLesson.id, type: "multiple_choice", order: 3, question: "What is 'diez' in English?",        answer: "Ten",   options: JSON.stringify(["Eight", "Nine", "Ten", "Eleven"]),  audioText: "diez",  targetLang: "es" },
      { id: "ex-es-n4", lessonId: esNumLesson.id, type: "fill_blank",      order: 4, question: "Type the Spanish word for 'seven'", answer: "siete",                                                             audioText: "siete", targetLang: "es", hint: "Starts with S" },
    ];
    for (const ex of numExercises) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        create: ex,
        update: { question: ex.question, answer: ex.answer, options: ex.options, audioText: ex.audioText, targetLang: ex.targetLang, hint: ex.hint },
      });
    }
  }

  return NextResponse.json({ success: true, message: "Database seeded successfully for all 33 languages" });
}
