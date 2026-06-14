"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import TTSButton from "@/components/TTSButton";
import Link from "next/link";
import { markLessonCompleted, getUser } from "@/lib/storage";

interface Exercise {
  id: string; type: string; order: number;
  question: string; answer: string; options?: string[];
  audioText?: string; targetLang?: string; hint?: string;
}
interface Lesson {
  id: string; title: string; type: string; xpReward: number;
  exercises: Exercise[];
  unit: { language: { code: string; name: string; flag: string } };
}

type AnswerState = "idle" | "correct" | "incorrect";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`).then(r => r.json()).then(data => {
      if (data.exercises) {
        data.exercises = data.exercises.map((ex: any) => ({
          ...ex,
          options: ex.options
            ? (typeof ex.options === "string" ? JSON.parse(ex.options) : ex.options)
            : null,
        }));
      }
      setLesson(data);
      setLoading(false);
    });
  }, [lessonId]);

  const current = lesson?.exercises[currentIdx];
  const progress = lesson ? (currentIdx / lesson.exercises.length) * 100 : 0;

  const checkAnswer = useCallback(() => {
    if (!current || answerState !== "idle") return;
    const userAnswer = current.type === "fill_blank" ? inputVal.trim() : selected;
    const isCorrect = userAnswer?.toLowerCase() === current.answer.toLowerCase();
    setAnswerState(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore(s => s + 1);
  }, [current, answerState, selected, inputVal]);

  const nextExercise = useCallback(async () => {
    if (!lesson) return;
    if (currentIdx + 1 >= lesson.exercises.length) {
      const finalScore = score + (answerState === "correct" ? 1 : 0);
      markLessonCompleted(lessonId);
      const u = getUser();
      if (u) {
        try {
          await fetch(`/api/lessons/${lessonId}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: u.id, score: finalScore }),
          });
        } catch {
          // localStorage fallback already done
        }
      }
      setCompleted(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setInputVal("");
      setAnswerState("idle");
    }
  }, [lesson, currentIdx, lessonId, score, answerState]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (answerState === "idle") checkAnswer();
        else nextExercise();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answerState, checkAnswer, nextExercise]);

  if (loading || !lesson) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 text-lg">Loading lesson...</div>
    </div>
  );

  if (completed) {
    const pct = Math.round((score / lesson.exercises.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md w-full shadow-sm border">
          <div className="text-6xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson complete!</h2>
          <p className="text-gray-500 mb-6">{lesson.title}</p>
          <div className="bg-indigo-50 rounded-xl p-4 mb-4">
            <div className="text-3xl font-bold text-indigo-600">{pct}%</div>
            <div className="text-gray-500 text-sm mt-1">{score} of {lesson.exercises.length} correct</div>
          </div>
          <div className="text-green-600 font-semibold mb-6">+{lesson.xpReward} XP earned!</div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => {
              setCurrentIdx(0); setScore(0); setCompleted(false);
              setSelected(null); setInputVal(""); setAnswerState("idle");
            }}>
              Try again
            </Button>
            <Link href={`/learn/${lesson.unit.language.code}`} className="flex-1">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
        <Link href={`/learn/${lesson.unit.language.code}`}>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xl font-light">
            ✕
          </button>
        </Link>
        <Progress value={progress} className="flex-1 h-3" />
        <div className="text-sm text-gray-400 font-medium min-w-[40px] text-right">
          {currentIdx + 1}/{lesson.exercises.length}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-8 pb-36">
        {current && (
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">
              {current.type === "fill_blank" ? "Type the missing word" : "Select the correct answer"}
            </p>

            {/* Word/phrase card */}
            {current.audioText && (
              <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6 flex items-center justify-center gap-4">
                <TTSButton text={current.audioText} lang={current.targetLang || "en"} size="lg" />
                <span className="text-3xl font-bold text-gray-800">{current.audioText}</span>
              </div>
            )}

            {/* Question */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{current.question}</h2>

            {/* Multiple choice — 2×2 grid */}
            {current.type === "multiple_choice" && current.options && (
              <div className="grid grid-cols-2 gap-3">
                {current.options.map((opt: string, idx: number) => {
                  const isAnswer = opt === current.answer;
                  const isSelected = opt === selected;

                  let cardClass = "border-2 bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50";
                  let badgeClass = "bg-gray-100 text-gray-500";

                  if (answerState !== "idle") {
                    if (isAnswer) {
                      cardClass = "border-2 border-green-500 bg-green-50";
                      badgeClass = "bg-green-500 text-white";
                    } else if (isSelected && !isAnswer) {
                      cardClass = "border-2 border-red-400 bg-red-50";
                      badgeClass = "bg-red-400 text-white";
                    } else {
                      cardClass = "border-2 border-gray-200 bg-white opacity-60";
                    }
                  } else if (isSelected) {
                    cardClass = "border-2 border-indigo-500 bg-indigo-50";
                    badgeClass = "bg-indigo-500 text-white";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => answerState === "idle" && setSelected(opt)}
                      className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${cardClass}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${badgeClass}`}>
                        {OPTION_LABELS[idx]}
                      </span>
                      <span className="font-medium text-gray-800 text-sm leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill in the blank */}
            {current.type === "fill_blank" && (
              <div className="space-y-3">
                {current.hint && (
                  <p className="text-gray-400 text-sm">💡 Hint: {current.hint}</p>
                )}
                <Input
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  disabled={answerState !== "idle"}
                  placeholder="Type your answer..."
                  className={`text-lg h-14 ${
                    answerState === "correct" ? "border-green-500 bg-green-50" :
                    answerState === "incorrect" ? "border-red-400 bg-red-50" : ""
                  }`}
                  autoFocus
                />
                {answerState === "incorrect" && (
                  <p className="text-green-700 text-sm font-medium">
                    Correct answer: <strong>{current.answer}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky footer */}
      <div className={`fixed bottom-0 left-0 right-0 border-t transition-colors ${
        answerState === "correct"   ? "bg-green-50 border-green-200" :
        answerState === "incorrect" ? "bg-red-50 border-red-200"     : "bg-white border-gray-200"
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            {answerState === "correct" && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="text-green-700 font-bold text-lg">Correct!</p>
              </div>
            )}
            {answerState === "incorrect" && (
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-2xl">❌</span>
                  <p className="text-red-600 font-bold text-lg">Not quite</p>
                </div>
                <p className="text-gray-500 text-sm pl-9">
                  Answer: <strong className="text-gray-700">{current?.answer}</strong>
                </p>
              </div>
            )}
          </div>

          {answerState === "idle" ? (
            <Button
              onClick={checkAnswer}
              disabled={!selected && !inputVal.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-8 h-12 text-base font-bold rounded-xl"
            >
              CHECK
            </Button>
          ) : (
            <Button
              onClick={nextExercise}
              className={`px-8 h-12 text-base font-bold rounded-xl ${
                answerState === "correct"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {currentIdx + 1 >= (lesson?.exercises.length ?? 0) ? "FINISH" : "CONTINUE"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
