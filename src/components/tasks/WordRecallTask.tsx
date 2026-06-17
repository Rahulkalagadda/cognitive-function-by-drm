"use client";

import React, { useState, useEffect, useRef } from "react";
import { TaskResponse } from "@/types/task.types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface WordRecallTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: {
    words?: string[];
  };
}

export default function WordRecallTask({ isPractice, onComplete, config }: WordRecallTaskProps) {
  const practiceWords = ["Apple", "River", "Cabinet"];
  const actualWords = config?.words || ["Apple", "River", "Cabinet", "Shadow", "Anchor", "Breeze", "Lantern", "Saddle"];
  const targetWords = isPractice ? practiceWords : actualWords;

  const [phase, setPhase] = useState<"study" | "recall">("study");
  const [studyTimer, setStudyTimer] = useState(15);
  const [typedWord, setTypedWord] = useState("");
  const [recalledWords, setRecalledWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Record<string, "correct" | "incorrect">>({});

  const startTime = useRef<number>(0);
  const firstWordTime = useRef<number>(0);

  useEffect(() => {
    if (phase === "study") {
      const interval = setInterval(() => {
        setStudyTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPhase("recall");
            startTime.current = Date.now();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleAddWord = () => {
    const word = typedWord.trim();
    if (!word) return;

    // Record planning time for the first word typed
    if (recalledWords.length === 0) {
      firstWordTime.current = Date.now() - startTime.current;
    }

    if (!recalledWords.some((w) => w.toLowerCase() === word.toLowerCase())) {
      const updated = [...recalledWords, word];
      setRecalledWords(updated);

      if (isPractice) {
        // Instant check in practice mode
        const isCorrect = targetWords.some((w) => w.toLowerCase() === word.toLowerCase());
        setFeedback((prev) => ({
          ...prev,
          [word]: isCorrect ? "correct" : "incorrect"
        }));
      }
    }
    setTypedWord("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWord();
    }
  };

  const handleComplete = () => {
    const matched = recalledWords.filter((w) =>
      targetWords.some((target) => target.toLowerCase() === w.toLowerCase())
    );

    const omissions = targetWords.length - matched.length;
    const commissions = recalledWords.length - matched.length;

    onComplete({
      accuracy: (matched.length / targetWords.length) * 100,
      reactionTime: Math.round(firstWordTime.current || 4000), // planning time in ms
      missedResponses: omissions,
      correctResponses: matched.length,
      commissionErrors: commissions,
      completionTime: Math.round((Date.now() - startTime.current) / 1000),
    });
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-4 space-y-4">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          {isPractice ? "Practice Trial Attempt" : "Active Assessment Phase"}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">
          {phase === "study"
            ? "Memorize the list of words shown below. You have 15 seconds."
            : "Type any of the words you remember and press Enter."}
        </p>
      </div>

      {phase === "study" ? (
        /* Study/Memorization Phase */
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 w-full">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {targetWords.map((word) => (
              <div
                key={word}
                className="py-3 border border-border-default bg-white rounded-xl text-center text-xs font-extrabold text-[#1E293B] shadow-sm select-none"
              >
                {word}
              </div>
            ))}
          </div>

          {/* Study Progress Bar */}
          <div className="w-full max-w-xs space-y-1">
            <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                style={{ width: `${(studyTimer / 15) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant font-semibold text-center uppercase tracking-wider">
              Recall phase begins in {studyTimer}s
            </p>
          </div>
        </div>
      ) : (
        /* Recall Input Phase */
        <div className="flex-1 flex flex-col justify-between w-full max-w-xs">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={typedWord}
                onChange={(e) => setTypedWord(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type word here..."
                className="flex-1 px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddWord}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Recalled word tags */}
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-surface-page border border-border-default rounded-xl min-h-[64px]">
              {recalledWords.length === 0 ? (
                <span className="text-[10px] text-on-surface-variant/50 font-bold p-1 select-none">
                  No words entered yet.
                </span>
              ) : (
                recalledWords.map((word) => {
                  const state = feedback[word];
                  return (
                    <Badge
                      key={word}
                      variant="outline"
                      className={`text-[10px] font-bold px-2.5 py-1 border rounded-lg ${
                        state === "correct"
                          ? "bg-score-good/10 text-score-good border-score-good/20"
                          : state === "incorrect"
                          ? "bg-score-attention/10 text-score-attention border-score-attention/20"
                          : "bg-white border-border-default text-on-surface"
                      }`}
                    >
                      {word}
                    </Badge>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={handleComplete}
            type="button"
            className="w-full h-12 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none"
          >
            Complete Recall Task
          </button>
        </div>
      )}

      <div className="w-full max-w-xs flex justify-between text-[9px] text-on-surface-variant/70 font-semibold px-1">
        <span>Phase: {phase === "study" ? "Memorize" : "Recall"}</span>
        <span>Target Count: {targetWords.length} words</span>
      </div>
    </div>
  );
}
