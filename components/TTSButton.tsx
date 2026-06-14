"use client";
import { Button } from "@/components/ui/button";

interface TTSButtonProps {
  text: string;
  lang?: string;
  size?: "sm" | "default" | "lg";
}

export default function TTSButton({ text, lang = "en", size = "default" }: TTSButtonProps) {
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={speak}
      className="rounded-full hover:bg-indigo-50 hover:border-indigo-300"
      title={`Hear pronunciation: ${text}`}
    >
      🔊
    </Button>
  );
}
