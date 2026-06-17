"use client";

import React, { useEffect, useState, useRef } from "react";
import { TaskResponse } from "@/types/task.types";

interface GoNoGoTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: {
    clickIntervalMs?: number;
  };
}

export default function GoNoGoTask({ isPractice, onComplete, config }: GoNoGoTaskProps) {
  const intervalMs = config?.clickIntervalMs || 1200;
  const maxTrials = isPractice ? 6 : 20;

  const [currentColor, setCurrentColor] = useState<"green" | "red" | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const hasRespondedRef = useRef(false);

  // Metrics
  const correctCount = useRef(0);
  const commissions = useRef(0); // Pressed on red
  const omissions = useRef(0);   // Did not press on green
  const reactionTimes = useRef<number[]>([]);
  const lastFlashTime = useRef<number>(0);

  // 70% Go (green), 30% No-Go (red)
  const colorsList: ("green" | "red")[] = [
    "green", "green", "red", "green", "green", "red", "green", "green", "green", "red",
    "green", "green", "red", "green", "green", "red", "green", "green", "green", "red"
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runTrial = () => {
      if (trialCount >= maxTrials) {
        // End task
        const avgRT = reactionTimes.current.length > 0
          ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
          : 0;

        const totalGo = colorsList.slice(0, maxTrials).filter(c => c === "green").length;
        
        onComplete({
          accuracy: totalGo > 0 ? (correctCount.current / totalGo) * 100 : 100,
          reactionTime: Math.round(avgRT),
          missedResponses: omissions.current,
          correctResponses: correctCount.current,
          commissionErrors: commissions.current,
          completionTime: (maxTrials * intervalMs) / 1000,
        });
        return;
      }

      const color = colorsList[trialCount % colorsList.length];
      setCurrentColor(color);
      setHasResponded(false);
      hasRespondedRef.current = false;
      setFeedback(null);
      lastFlashTime.current = Date.now();

      // Check omission on end of green slot
      timer = setTimeout(() => {
        if (color === "green" && !hasRespondedRef.current) {
          omissions.current += 1;
          if (isPractice) {
            setFeedback("incorrect");
          }
        }
        setTrialCount((prev) => prev + 1);
      }, intervalMs);
    };

    runTrial();

    return () => clearTimeout(timer);
  }, [trialCount]);

  const handleResponse = () => {
    if (hasRespondedRef.current) return;
    hasRespondedRef.current = true;
    setHasResponded(true);

    const timeDiff = Date.now() - lastFlashTime.current;

    if (currentColor === "green") {
      correctCount.current += 1;
      reactionTimes.current.push(timeDiff);
      if (isPractice) {
        setFeedback("correct");
      }
    } else {
      commissions.current += 1;
      if (isPractice) {
        setFeedback("incorrect");
      }
    }
  };

  // Keyboard binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleResponse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentColor, hasResponded]);

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          {isPractice ? "Practice Trial Attempt" : "Active Assessment Phase"}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">
          Press Spacebar (or tap circle) only when you see a <strong className="text-[#10B981]">GREEN</strong> circle. Inhibit on <strong className="text-status-error">RED</strong>.
        </p>
      </div>

      {/* Circle target area */}
      <div className="w-44 h-44 flex items-center justify-center relative select-none">
        {currentColor && (
          <div
            onClick={handleResponse}
            className={`w-36 h-36 rounded-full cursor-pointer transition-transform duration-100 shadow-lg active:scale-95 ${
              currentColor === "green" ? "bg-[#10B981]" : "bg-[#EF4444]"
            }`}
          />
        )}

        {/* Practice Mode Overlay Feedback */}
        {feedback && (
          <div className={`absolute inset-0 rounded-2xl flex items-center justify-center text-white text-sm font-extrabold select-none opacity-90 ${
            feedback === "correct" ? "bg-score-good" : "bg-score-attention"
          }`}>
            {feedback === "correct" ? "✓ Correct!" : "✗ Stop!"}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-4">
        {/* Mobile touch trigger button */}
        <button
          onClick={handleResponse}
          disabled={hasResponded}
          className="w-full h-12 bg-brand-primary text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none"
        >
          RESPOND (SPACE)
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Progress: {trialCount}/{maxTrials}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Hits: {correctCount.current}</span>
              <span>Errors: {commissions.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
