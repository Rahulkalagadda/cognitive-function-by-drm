"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";

interface NBackTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
}

interface NBackLevelConfig {
  level: 1 | 2 | 3;
  n: 1 | 2 | 3;
  intervalMs: number;
  trials: number;
  label: string;
}

const LEVEL_CONFIGS: NBackLevelConfig[] = [
  { level: 1, n: 1, intervalMs: 2000, trials: 15, label: "1-Back" },
  { level: 2, n: 2, intervalMs: 1800, trials: 20, label: "2-Back" },
  { level: 3, n: 3, intervalMs: 1500, trials: 25, label: "3-Back" },
];

const PRACTICE_CONFIG: NBackLevelConfig = {
  level: 1,
  n: 1,
  intervalMs: 2000,
  trials: 8,
  label: "Practice (1-Back)",
};

// Sequences with ~30% matches (designed per N value)
const SEQUENCES: Record<1 | 2 | 3, string[]> = {
  1: ["M","M","K","K","L","L","P","P","T","T","S","S","Q","Q","B","B","Z","Z","R","R","V","V","W","W","X"],
  2: ["M","K","M","L","M","L","R","L","P","T","P","S","P","Q","S","Q","B","Q","B","Z","K","Z","K","R","M"],
  3: ["A","B","C","A","B","C","D","E","F","D","E","F","G","H","I","G","H","I","J","K","L","J","K","L","M"],
};

// ─── Weighted aggregate helper ─────────────────────────────────────────────────
function buildAggregates(levels: LevelResult[]) {
  const totalWeight = levels.reduce((s, r) => s + r.level, 0);
  if (totalWeight === 0) {
    return {
      accuracy: 0,
      reactionTime: 0,
      correctResponses: 0,
      missedResponses: 0,
      commissionErrors: 0,
      completionTime: 0,
    };
  }
  return {
    accuracy:         Math.round(levels.reduce((s, r) => s + r.accuracy * r.level, 0) / totalWeight),
    reactionTime:     Math.round(levels.reduce((s, r) => s + r.reactionTime * r.level, 0) / totalWeight),
    correctResponses: levels.reduce((s, r) => s + r.correctResponses, 0),
    missedResponses:  levels.reduce((s, r) => s + r.missedResponses, 0),
    commissionErrors: levels.reduce((s, r) => s + r.commissionErrors, 0),
    completionTime:   levels.reduce((s, r) => s + r.completionTime, 0),
  };
}

// ─── Level Runner Component ───────────────────────────────────────────────────
interface NBackLevelRunnerProps {
  config: NBackLevelConfig;
  isPractice: boolean;
  onLevelComplete: (result: LevelResult) => void;
}

function NBackLevelRunner({ config, isPractice, onLevelComplete }: NBackLevelRunnerProps) {
  const [trialCount, setTrialCount] = useState(0);
  const [currentLetter, setCurrentLetter] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);

  const correctRef = useRef(0);
  const commissionsRef = useRef(0);
  const omissionsRef = useRef(0);
  const reactionTimesRef = useRef<number[]>([]);
  const lastFlashTime = useRef(0);
  const hasRespondedRef = useRef(false);
  const hasFinishedRef = useRef(false);

  const onLevelCompleteRef = useRef(onLevelComplete);
  useEffect(() => {
    onLevelCompleteRef.current = onLevelComplete;
  }, [onLevelComplete]);

  const handleResponse = useCallback(() => {
    if (hasRespondedRef.current) return;
    hasRespondedRef.current = true;
    setHasResponded(true);

    const rt = performance.now() - lastFlashTime.current;
    const seq = SEQUENCES[config.n];
    const isMatch =
      trialCount >= config.n &&
      currentLetter === seq[(trialCount - config.n) % seq.length];

    if (isMatch) {
      correctRef.current += 1;
      reactionTimesRef.current.push(rt);
      if (isPractice) setFeedback("correct");
    } else {
      commissionsRef.current += 1;
      if (isPractice) setFeedback("incorrect");
    }
  }, [trialCount, currentLetter, isPractice, config.n]);

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
  }, [handleResponse]);

  // Trial runner effect
  useEffect(() => {
    if (trialCount >= config.trials) {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      const avgRT =
        reactionTimesRef.current.length > 0
          ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
          : 0;

      const totalResponses = correctRef.current + omissionsRef.current + commissionsRef.current;
      const levelAcc = totalResponses > 0 ? (correctRef.current / totalResponses) * 100 : 100;

      onLevelCompleteRef.current({
        level: config.level,
        accuracy: Math.round(levelAcc),
        reactionTime: Math.round(avgRT),
        correctResponses: correctRef.current,
        missedResponses: omissionsRef.current,
        commissionErrors: commissionsRef.current,
        completionTime: (config.trials * config.intervalMs) / 1000,
      });
      return;
    }

    const seq = SEQUENCES[config.n];
    const letter = seq[trialCount % seq.length];
    setCurrentLetter(letter);
    setIsVisible(true);
    setHasResponded(false);
    hasRespondedRef.current = false;
    setFeedback(null);
    lastFlashTime.current = performance.now();

    const hideTimer = setTimeout(() => setIsVisible(false), 500);

    const endTimer = setTimeout(() => {
      const isMatch =
        trialCount >= config.n &&
        letter === seq[(trialCount - config.n) % seq.length];

      if (isMatch && !hasRespondedRef.current) {
        omissionsRef.current += 1;
        if (isPractice) setFeedback("incorrect");
      }
      setTrialCount((prev) => prev + 1);
    }, config.intervalMs);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(endTimer);
    };
  }, [trialCount, config, isPractice]);

  const trialsDone = Math.min(trialCount, config.trials);

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            {isPractice ? "Practice Trial (1-Back)" : `Level ${config.level} of 3 — ${config.label}`}
          </p>
          {!isPractice && (
            <div className="flex gap-1">
              {LEVEL_CONFIGS.map((l) => (
                <div
                  key={l.level}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    l.level < config.level
                      ? "bg-score-good"
                      : l.level === config.level
                      ? "bg-brand-primary"
                      : "bg-border-default"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-on-surface-variant font-medium">
          Press Spacebar (or tap{" "}
          <strong className="text-brand-primary">MATCH</strong>) if this letter matches the one{" "}
          shown <strong className="text-brand-primary">{config.n} step{config.n !== 1 ? "s" : ""} ago</strong>.
        </p>
      </div>

      {/* Stimulus */}
      <div
        onClick={handleResponse}
        className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl border-2 border-border-default bg-surface-page flex items-center justify-center cursor-pointer hover:bg-surface-muted/30 transition-colors shadow-sm select-none relative overflow-hidden"
      >
        <span
          className={`text-6xl sm:text-7xl font-black text-on-surface select-none transition-opacity duration-150 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentLetter}
        </span>

        {feedback && (
          <div
            className={`absolute inset-0 flex items-center justify-center text-white text-sm font-extrabold select-none opacity-90 ${
              feedback === "correct" ? "bg-score-good" : "bg-score-attention"
            }`}
          >
            {feedback === "correct" ? "✓ Correct Match!" : "✗ No Match!"}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-4 shrink-0">
        <button
          onClick={handleResponse}
          disabled={hasResponded}
          type="button"
          className="w-full h-12 bg-brand-primary text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none disabled:opacity-60"
        >
          MATCH (SPACE)
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Trial: {trialsDone}/{config.trials}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Correct: {correctRef.current}</span>
              <span>Errors: {commissionsRef.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function NBackTask({ isPractice, onComplete }: NBackTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;

  const [levelIndex, setLevelIndex] = useState(0);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);
  const [levelBanner, setLevelBanner] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleLevelComplete = useCallback((result: LevelResult) => {
    const nextIndex = levelIndex + 1;
    setLevelResults((prevResults) => {
      const nextResults = [...prevResults, result];
      if (nextIndex >= configs.length) {
        const agg = buildAggregates(nextResults);
        const rawMetrics: RawMetrics = {
          difficultyLevel: 3,
          levels: nextResults,
          nBackLevel: 3,
        };
        setTimeout(() => {
          onCompleteRef.current({ ...agg, rawMetrics });
        }, 0);
      }
      return nextResults;
    });

    if (nextIndex < configs.length) {
      const currentCfg = configs[levelIndex];
      setLevelBanner(`Level ${currentCfg.level} complete — next: Level ${currentCfg.level + 1}`);
      setTimeout(() => {
        setLevelBanner(null);
        setLevelIndex(nextIndex);
      }, 1500);
    }
  }, [levelIndex, configs]);

  if (levelBanner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full py-6 gap-4">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-xs font-black text-brand-primary uppercase tracking-widest">{levelBanner}</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Get ready…</p>
        </div>
      </div>
    );
  }

  const currentConfig = configs[levelIndex];

  return (
    <NBackLevelRunner
      key={levelIndex}
      config={currentConfig}
      isPractice={isPractice}
      onLevelComplete={handleLevelComplete}
    />
  );
}
