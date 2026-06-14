"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import TTSButton from "@/components/TTSButton";
import Link from "next/link";
import { markLessonCompleted } from "@/lib/storage";

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
    const userAnswer = current.type === "fill_blank" ? inputVal.trim().toLowerCase() : selected;
    const isCorrect = userAnswer?.toLowerCase() === current.answer.toLowerCase();
    setAnswerState(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore(s => s + 1);
  }, [current, answerState, selected, inputVal]);

  const nextExercise = useCallback(() => {
    if (!lesson) return;
    if (currentIdx + 1 >= lesson.exercises.length) {
      markLessonCompleted(lessonId);
      setCompleted(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setInputVal("");
      setAnswerState("idle");
    }
  }, [lesson, currentIdx, lessonId]);

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
      <div className="text-gray-500">Loading lesson...</div>
    </div>
  );

  if (completed) {
    const pct = Math.round((score / lesson.exercises.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md w-full shadow-sm border">
          <div className="text-6xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson complete!</h2>
          <p className="text-gray-600 mb-6">{lesson.title}</p>
          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-indigo-600">{pct}%</div>
            <div className="text-gray-600 text-sm mt-1">{score} of {lesson.exercises.length} correct</div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href={`/learn/${lesson.unit.language.code}`}>
          <Button variant="ghost" size="sm">✕</Button>
        </Link>
        <Progress value={progress} className="flex-1 h-3" />
        <div className="text-sm text-gray-500 font-medium">{currentIdx + 1}/{lesson.exercises.length}</div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {current && (
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                {current.audioText && (
                  <TTSButton text={current.audioText} lang={current.targetLang || "en"} size="lg" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">{current.question}</h2>
              </div>

              {current.type === "multiple_choice" && current.options && (
                <div className="grid grid-cols-1 gap-3">
                  {current.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => answerState === "idle" && setSelected(opt)}
                      className={`p-4 rounded-xl border-2 text-left font-medium transition-all exercise-option ${
                        answerState !== "idle" && opt === current.answer
                          ? "border-green-500 bg-green-50 text-green-800"
                          : answerState !== "idle" && opt === selected && opt !== current.answer
                          ? "border-red-400 bg-red-50 text-red-800"
                          : selected === opt
                          ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                          : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {answerState !== "idle" && opt === current.answer && (
                          <TTSButton text={opt} lang={current.targetLang || "en"} size="sm" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {current.type === "fill_blank" && (
                <div className="space-y-3">
                  {current.hint && <p className="text-gray-500 text-sm">Hint: {current.hint}</p>}
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

            <div className={`fixed bottom-0 left-0 right-0 p-6 border-t ${
              answerState === "correct" ? "bg-green-50 border-green-200" :
              answerState === "incorrect" ? "bg-red-50 border-red-200" : "bg-white"
            }`}>
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div>
                  {answerState === "correct" && <p className="text-green-700 font-semibold text-lg">✓ Correct!</p>}
                  {answerState === "incorrect" && (
                    <div>
                      <p className="text-red-600 font-semibold text-lg">✗ Not quite</p>
                      <p className="text-gray-600 text-sm">Answer: <strong>{current.answer}</strong></p>
                    </div>
                  )}
                </div>
                {answerState === "idle" ? (
                  <Button
                    onClick={checkAnswer}
                    disabled={!selected && !inputVal}
                    className="bg-indigo-600 hover:bg-indigo-700 px-10 h-12"
                  >
                    Check
                  </Button>
                ) : (
                  <Button
                    onClick={nextExercise}
                    className={`px-10 h-12 ${answerState === "correct" ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {currentIdx + 1 >= (lesson?.exercises.length ?? 0) ? "Finish" : "Continue"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
