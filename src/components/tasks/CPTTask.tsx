"use client";

import React, { useEffect, useState, useRef } from "react";
import { TaskResponse } from "@/types/task.types";

interface CPTTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: {
    clickIntervalMs?: number;
  };
}

export default function CPTTask({ isPractice, onComplete, config }: CPTTaskProps) {
  const intervalMs = config?.clickIntervalMs || 1000;
  const maxTrials = isPractice ? 6 : 20;

  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [trialCount, setTrialCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const hasRespondedRef = useRef(false);

  // Metrics
  const correctCount = useRef(0);
  const commissions = useRef(0); // Pressed when target was NOT X
  const omissions = useRef(0);   // Did not press when target WAS X
  const reactionTimes = useRef<number[]>([]);
  const lastFlashTime = useRef<number>(0);

  const lettersList = ["A", "B", "C", "D", "X", "F", "G", "X", "H", "J", "K", "X", "L", "X", "M", "N", "X", "P", "R", "X"];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const runTrial = () => {
      if (trialCount >= maxTrials) {
        // End task
        const avgRT = reactionTimes.current.length > 0 
          ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length 
          : 0;

        const totalTargets = lettersList.slice(0, maxTrials).filter(l => l === "X").length;
        const totalNonTargets = maxTrials - totalTargets;
        
        onComplete({
          accuracy: totalTargets > 0 ? (correctCount.current / totalTargets) * 100 : 100,
          reactionTime: Math.round(avgRT),
          missedResponses: omissions.current,
          correctResponses: correctCount.current,
          commissionErrors: commissions.current,
          completionTime: (maxTrials * intervalMs) / 1000,
        });
        return;
      }

      const letter = lettersList[trialCount % lettersList.length];
      setCurrentLetter(letter);
      setHasResponded(false);
      hasRespondedRef.current = false;
      setFeedback(null);
      lastFlashTime.current = Date.now();

      // Setup automatic check for omissions at end of letter slot
      timer = setTimeout(() => {
        if (letter === "X" && !hasRespondedRef.current) {
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
    
    if (currentLetter === "X") {
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
  }, [currentLetter, hasResponded]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          {isPractice ? "Practice Trial Attempt" : "Active Assessment Phase"}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">
          Press Spacebar (or tap the letter) only when you see <strong className="text-brand-primary">X</strong>
        </p>
      </div>

      {/* Main Flash Screen */}
      <div 
        onClick={handleResponse}
        className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl border-2 border-border-default bg-surface-page flex items-center justify-center cursor-pointer hover:bg-surface-muted/30 transition-colors shadow-sm select-none relative overflow-hidden"
      >
        <span className="text-6xl sm:text-7xl font-black text-on-surface select-none">
          {currentLetter}
        </span>

        {/* Practice Mode Overlay Feedback */}
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center text-white text-sm font-extrabold select-none opacity-90 ${
            feedback === "correct" ? "bg-score-good" : "bg-score-attention"
          }`}>
            {feedback === "correct" ? "✓ Correct!" : "✗ Incorrect!"}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-4 shrink-0">
        {/* Mobile touch trigger button */}
        <button
          onClick={handleResponse}
          disabled={hasResponded}
          className="w-full h-12 bg-brand-primary text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none"
        >
          RESPOND
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Progress: {trialCount}/{maxTrials}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Correct: {correctCount.current}</span>
              <span>Errors: {commissions.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
