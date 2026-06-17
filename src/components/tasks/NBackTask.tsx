"use client";

import React, { useEffect, useState, useRef } from "react";
import { TaskResponse } from "@/types/task.types";

interface NBackTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
}

export default function NBackTask({ isPractice, onComplete }: NBackTaskProps) {
  const intervalMs = 1800; // slightly longer for working memory calculations
  const maxTrials = isPractice ? 8 : 22;

  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [trialCount, setTrialCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const hasRespondedRef = useRef(false);

  // Keep track of letters shown to compute matches
  const history = useRef<string[]>([]);
  const correctCount = useRef(0);
  const commissions = useRef(0); 
  const omissions = useRef(0);   
  const reactionTimes = useRef<number[]>([]);
  const lastFlashTime = useRef<number>(0);

  // Generate sequence containing ~30% matches
  const lettersSequence = [
    "M", "K", "M", "L", "M", "L", "R", "L", "P", "T", 
    "P", "S", "P", "Q", "S", "Q", "B", "Q", "B", "Z", 
    "K", "Z"
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runTrial = () => {
      if (trialCount >= maxTrials) {
        // End task
        const avgRT = reactionTimes.current.length > 0
          ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
          : 0;

        // Count how many matches existed in the sequence
        let totalMatches = 0;
        for (let i = 2; i < maxTrials; i++) {
          if (lettersSequence[i] === lettersSequence[i - 2]) {
            totalMatches++;
          }
        }

        onComplete({
          accuracy: totalMatches > 0 ? (correctCount.current / totalMatches) * 100 : 100,
          reactionTime: Math.round(avgRT),
          missedResponses: omissions.current,
          correctResponses: correctCount.current,
          commissionErrors: commissions.current,
          completionTime: (maxTrials * intervalMs) / 1000,
        });
        return;
      }

      const letter = lettersSequence[trialCount % lettersSequence.length];
      history.current.push(letter);
      setCurrentLetter(letter);
      setHasResponded(false);
      hasRespondedRef.current = false;
      setFeedback(null);
      lastFlashTime.current = Date.now();

      // Check omission if it was a match and user did not respond
      timer = setTimeout(() => {
        const isMatch = trialCount >= 2 && letter === history.current[trialCount - 2];
        if (isMatch && !hasRespondedRef.current) {
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
    const isMatch = trialCount >= 2 && currentLetter === history.current[trialCount - 2];

    if (isMatch) {
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
  }, [currentLetter, hasResponded, trialCount]);

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          {isPractice ? "Practice Trial Attempt" : "Active Assessment Phase"}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">
          Press Spacebar (or tap MATCH) if the current letter matches the one shown <strong className="text-brand-primary">2 steps ago</strong>.
        </p>
      </div>

      {/* Stimulus screen */}
      <div
        onClick={handleResponse}
        className="w-44 h-44 rounded-2xl border-2 border-border-default bg-surface-page flex items-center justify-center cursor-pointer hover:bg-surface-muted/30 transition-colors shadow-sm select-none relative overflow-hidden"
      >
        <span className="text-7xl font-black text-on-surface select-none">
          {currentLetter}
        </span>

        {/* Practice Mode Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center text-white text-sm font-extrabold select-none opacity-90 ${
            feedback === "correct" ? "bg-score-good" : "bg-score-attention"
          }`}>
            {feedback === "correct" ? "✓ Correct Match!" : "✗ No Match!"}
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
          MATCH (SPACE)
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Progress: {trialCount}/{maxTrials}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Correct Matches: {correctCount.current}</span>
              <span>Errors: {commissions.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
