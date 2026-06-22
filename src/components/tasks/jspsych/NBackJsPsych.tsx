"use client";

/**
 * NBackJsPsych — 3-Level Working Memory Task (1-Back → 2-Back → 3-Back)
 * Kept in jspsych/ folder for import compatibility.
 * Practice mode runs Level 1 (1-Back) only.
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";

interface NBackJsPsychProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
}

// ─── Level configuration ─────────────────────────────────────────────────────

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
  level: 1, n: 1, intervalMs: 2000, trials: 8, label: "Practice (1-Back)",
};

const CONFIGS_PRACTICE = [PRACTICE_CONFIG];

// Sequences with ~30% matches (designed per N value)
const SEQUENCES: Record<1 | 2 | 3, string[]> = {
  1: ["M","M","K","K","L","L","P","P","T","T","S","S","Q","Q","B","B","Z","Z","R","R","V","V","W","W","X"],
  2: ["M","K","M","L","M","L","R","L","P","T","P","S","P","Q","S","Q","B","Q","B","Z","K","Z","K","R","M"],
  3: ["A","B","C","A","B","C","D","E","F","D","E","F","G","H","I","G","H","I","J","K","L","J","K","L","M"],
};

// ─── Weighted aggregate helper ─────────────────────────────────────────────────

function buildAggregates(levels: LevelResult[]) {
  const totalWeight = levels.reduce((s, r) => s + r.level, 0);
  return {
    accuracy:         Math.round(levels.reduce((s, r) => s + r.accuracy * r.level, 0) / totalWeight),
    reactionTime:     Math.round(levels.reduce((s, r) => s + r.reactionTime * r.level, 0) / totalWeight),
    correctResponses: levels.reduce((s, r) => s + r.correctResponses, 0),
    missedResponses:  levels.reduce((s, r) => s + r.missedResponses, 0),
    commissionErrors: levels.reduce((s, r) => s + r.commissionErrors, 0),
    completionTime:   levels.reduce((s, r) => s + r.completionTime, 0),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NBackJsPsych({ isPractice, onComplete }: NBackJsPsychProps) {
  const configs = isPractice ? CONFIGS_PRACTICE : LEVEL_CONFIGS;

  const [levelIndex,   setLevelIndex]   = useState(0);
  const [trialCount,   setTrialCount]   = useState(0);
  const [currentLetter, setCurrentLetter] = useState("");
  const [isVisible,    setIsVisible]    = useState(true);
  const [feedback,     setFeedback]     = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [levelBanner,  setLevelBanner]  = useState<string | null>(null);

  const hasRespondedRef  = useRef(false);
  const historyRef       = useRef<string[]>([]);
  const correctRef       = useRef(0);
  const commissionsRef   = useRef(0);
  const omissionsRef     = useRef(0);
  const reactionTimesRef = useRef<number[]>([]);
  const lastFlashTime    = useRef(0);
  const onCompleteRef    = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const levelResults = useRef<LevelResult[]>([]);

  // ── Reset per-level refs ──────────────────────────────────────────────────
  useEffect(() => {
    correctRef.current       = 0;
    commissionsRef.current   = 0;
    omissionsRef.current     = 0;
    reactionTimesRef.current = [];
    historyRef.current       = [];
    setTrialCount(0);
    setCurrentLetter("");
    setFeedback(null);
    setHasResponded(false);
    hasRespondedRef.current = false;
    setIsVisible(true);
  }, [levelIndex]);

  const finishLevel = useCallback(() => {
    const cfg = configs[levelIndex];
    const avgRT =
      reactionTimesRef.current.length > 0
        ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
        : 0;

    const totalResponses = correctRef.current + omissionsRef.current + commissionsRef.current;
    const levelAcc = totalResponses > 0 ? (correctRef.current / totalResponses) * 100 : 100;

    const result: LevelResult = {
      level: cfg.level,
      accuracy: Math.round(levelAcc),
      reactionTime: Math.round(avgRT),
      correctResponses: correctRef.current,
      missedResponses: omissionsRef.current,
      commissionErrors: commissionsRef.current,
      completionTime: (cfg.trials * cfg.intervalMs) / 1000,
    };
    levelResults.current.push(result);

    const nextIndex = levelIndex + 1;
    if (nextIndex < configs.length) {
      setLevelBanner(`Level ${cfg.level} complete — next: Level ${cfg.level + 1}`);
      setTimeout(() => {
        setLevelBanner(null);
        setLevelIndex(nextIndex);
      }, 1500);
    } else {
      const agg = buildAggregates(levelResults.current);
      const rawMetrics: RawMetrics = {
        difficultyLevel: 3,
        levels: levelResults.current,
        nBackLevel: 3,
      };
      onCompleteRef.current({ ...agg, rawMetrics });
    }
  }, [levelIndex, configs]);

  // ── Trial runner ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;

    if (trialCount >= cfg.trials) {
      finishLevel();
      return;
    }

    const seq = SEQUENCES[cfg.n];
    const letter = seq[trialCount % seq.length];
    historyRef.current.push(letter);
    setCurrentLetter(letter);
    setIsVisible(true);
    setHasResponded(false);
    hasRespondedRef.current = false;
    setFeedback(null);
    lastFlashTime.current = performance.now();

    const hideTimer = setTimeout(() => setIsVisible(false), 500);

    const endTimer = setTimeout(() => {
      const isMatch =
        trialCount >= cfg.n &&
        letter === historyRef.current[trialCount - cfg.n];
      if (isMatch && !hasRespondedRef.current) {
        omissionsRef.current += 1;
        if (isPractice) setFeedback("incorrect");
      }
      setTrialCount((prev) => prev + 1);
    }, cfg.intervalMs);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(endTimer);
    };
  }, [trialCount, levelIndex, finishLevel]);

  const handleResponse = useCallback(() => {
    if (hasRespondedRef.current) return;
    hasRespondedRef.current = true;
    setHasResponded(true);

    const rt = performance.now() - lastFlashTime.current;
    const cfg = configs[levelIndex];
    const isMatch =
      trialCount >= cfg.n &&
      currentLetter === historyRef.current[trialCount - cfg.n];

    if (isMatch) {
      correctRef.current += 1;
      reactionTimesRef.current.push(rt);
      if (isPractice) setFeedback("correct");
    } else {
      commissionsRef.current += 1;
      if (isPractice) setFeedback("incorrect");
    }
  }, [trialCount, currentLetter, isPractice, levelIndex, configs]);

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

  const cfg = configs[levelIndex];
  const trialsDone = Math.min(trialCount, cfg?.trials ?? 0);

  // ── Render ────────────────────────────────────────────────────────────────
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

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            {isPractice ? "Practice Trial (1-Back)" : `Level ${cfg?.level} of 3 — ${cfg?.label}`}
          </p>
          {!isPractice && (
            <div className="flex gap-1">
              {LEVEL_CONFIGS.map((l) => (
                <div
                  key={l.level}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    l.level < (cfg?.level ?? 1) ? "bg-score-good" : l.level === cfg?.level ? "bg-brand-primary" : "bg-border-default"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-on-surface-variant font-medium">
          Press Spacebar (or tap{" "}
          <strong className="text-brand-primary">MATCH</strong>) if this letter matches the one{" "}
          shown <strong className="text-brand-primary">{cfg?.n ?? 2} step{cfg?.n !== 1 ? "s" : ""} ago</strong>.
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
          <span>Trial: {trialsDone}/{cfg?.trials}</span>
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
