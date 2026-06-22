"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";

interface CPTTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: {
    clickIntervalMs?: number;
  };
}

// ─── Level configuration ────────────────────────────────────────────────────

interface LevelConfig {
  level: 1 | 2 | 3;
  intervalMs: number;
  trials: number;
  /** Letters shown in order (cycled). X entries = targets. */
  sequence: string[];
  label: string;
}

// Level 3 uses visually similar letters; only X is the real target.
const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    intervalMs: 1500,
    trials: 20,
    sequence: ["A", "B", "C", "D", "X", "F", "G", "X", "H", "J",
               "K", "X", "L", "X", "M", "N", "X", "P", "R", "X"],
    label: "Standard",
  },
  {
    level: 2,
    intervalMs: 1000,
    trials: 25,
    sequence: ["A", "X", "C", "X", "E", "F", "X", "H", "I", "X",
               "K", "L", "X", "N", "X", "P", "Q", "X", "S", "X",
               "U", "X", "W", "X", "Z"],
    label: "Randomised distractors",
  },
  {
    level: 3,
    intervalMs: 700,
    trials: 30,
    // Similar-looking letters: only X is target; K, V, Y are distractors
    sequence: ["X", "K", "V", "X", "Y", "K", "X", "V", "Y", "X",
               "K", "X", "Y", "V", "X", "K", "V", "X", "Y", "X",
               "V", "K", "X", "Y", "X", "K", "X", "V", "Y", "X"],
    label: "Similar letters",
  },
];

const PRACTICE_CONFIG: LevelConfig = {
  level: 1,
  intervalMs: 1500,
  trials: 6,
  sequence: ["A", "X", "B", "X", "C", "X"],
  label: "Practice",
};

// ─── Weighted aggregate helper ───────────────────────────────────────────────

function buildAggregates(levels: LevelResult[]) {
  const totalWeight = levels.reduce((s, r) => s + r.level, 0);
  const wAcc = levels.reduce((s, r) => s + r.accuracy * r.level, 0) / totalWeight;
  const wRT  = levels.reduce((s, r) => s + r.reactionTime * r.level, 0) / totalWeight;
  return {
    accuracy: Math.round(wAcc),
    reactionTime: Math.round(wRT),
    correctResponses: levels.reduce((s, r) => s + r.correctResponses, 0),
    missedResponses:  levels.reduce((s, r) => s + r.missedResponses, 0),
    commissionErrors: levels.reduce((s, r) => s + r.commissionErrors, 0),
    completionTime:   levels.reduce((s, r) => s + r.completionTime, 0),
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CPTTask({ isPractice, onComplete, config: _config }: CPTTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;

  const [levelIndex, setLevelIndex] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [currentLetter, setCurrentLetter] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [levelBanner, setLevelBanner] = useState<string | null>(null);

  // Persisted refs for current level
  const hasRespondedRef    = useRef(false);
  const correctRef         = useRef(0);
  const commissionsRef     = useRef(0);
  const omissionsRef       = useRef(0);
  const reactionTimesRef   = useRef<number[]>([]);
  const currentLetterRef   = useRef(""); // mirrors currentLetter state — stale-closure-safe
  const lastFlashTime   = useRef(0);
  // For vigilanceDrop: track per-trial accuracy flags in Level 3
  const trialAccuracyFlags = useRef<boolean[]>([]); // true = correct hit or correct withhold

  // Accumulated cross-level results
  const levelResults = useRef<LevelResult[]>([]);
  const levelStartTime = useRef(Date.now());

  const currentConfig = configs[levelIndex];

  // ── Reset per-level refs on level change ──────────────────────────────────
  useEffect(() => {
    correctRef.current      = 0;
    commissionsRef.current  = 0;
    omissionsRef.current    = 0;
    reactionTimesRef.current = [];
    trialAccuracyFlags.current = [];
    levelStartTime.current  = Date.now();
    setTrialCount(0);
    setCurrentLetter("");
    setFeedback(null);
    setHasResponded(false);
    hasRespondedRef.current = false;
  }, [levelIndex]);

  // ── Trial runner ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    let timer: NodeJS.Timeout;

    if (trialCount >= cfg.trials) {
      // Level complete — build LevelResult
      const avgRT =
        reactionTimesRef.current.length > 0
          ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
          : 0;

      const totalResponses =
        correctRef.current + omissionsRef.current + commissionsRef.current;
      const levelAcc =
        totalResponses > 0 ? (correctRef.current / totalResponses) * 100 : 100;

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
        // Show brief banner, then advance
        setLevelBanner(`Level ${cfg.level} complete — next: Level ${cfg.level + 1}`);
        setTimeout(() => {
          setLevelBanner(null);
          setLevelIndex(nextIndex);
        }, 1500);
      } else {
        // All levels done — compute aggregates + clinical metrics
        const agg = buildAggregates(levelResults.current);

        // vigilanceDrop: computed on Level 3 trial flags
        let vigilanceDrop: number | undefined;
        const flags = trialAccuracyFlags.current;
        if (flags.length >= 4) {
          const q = Math.floor(flags.length / 4);
          const first25 = flags.slice(0, q).filter(Boolean).length / q * 100;
          const last25  = flags.slice(-q).filter(Boolean).length / q * 100;
          vigilanceDrop = Math.round(last25 - first25);
        }

        const rawMetrics: RawMetrics = {
          difficultyLevel: 3,
          levels: levelResults.current,
          ...(vigilanceDrop !== undefined && { vigilanceDrop }),
        };

        onComplete({ ...agg, rawMetrics });
      }
      return;
    }

    const cfg2 = configs[levelIndex];
    const letter = cfg2.sequence[trialCount % cfg2.sequence.length];
    setCurrentLetter(letter);
    currentLetterRef.current = letter;    // keep ref in sync
    setHasResponded(false);
    hasRespondedRef.current = false;
    setFeedback(null);
    lastFlashTime.current = Date.now();

    timer = setTimeout(() => {
      if (letter === "X" && !hasRespondedRef.current) {
        omissionsRef.current += 1;
        // Track as incorrect for vigilanceDrop
        if (configs[levelIndex]?.level === 3) {
          trialAccuracyFlags.current.push(false);
        }
        if (isPractice) setFeedback("incorrect");
      } else if (letter !== "X" && !hasRespondedRef.current) {
        // Correct withhold
        if (configs[levelIndex]?.level === 3) {
          trialAccuracyFlags.current.push(true);
        }
      }
      setTrialCount((prev) => prev + 1);
    }, cfg.intervalMs);

    return () => clearTimeout(timer);
  }, [trialCount, levelIndex]);

  const handleResponse = useCallback(() => {
    if (hasRespondedRef.current) return;
    // Guard: ignore presses that fire before the first letter is shown
    if (!currentLetterRef.current) return;
    hasRespondedRef.current = true;
    setHasResponded(true);

    const timeDiff = Date.now() - lastFlashTime.current;
    // Read from ref — always the current letter regardless of React render cycle
    const isTarget = currentLetterRef.current === "X";

    if (isTarget) {
      correctRef.current += 1;
      reactionTimesRef.current.push(timeDiff);
      if (configs[levelIndex]?.level === 3) trialAccuracyFlags.current.push(true);
      if (isPractice) setFeedback("correct");
    } else {
      commissionsRef.current += 1;
      if (configs[levelIndex]?.level === 3) trialAccuracyFlags.current.push(false);
      if (isPractice) setFeedback("incorrect");
    }
  }, [isPractice, levelIndex]);

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

  const cfg = configs[levelIndex];
  const totalTrials = isPractice ? cfg.trials : LEVEL_CONFIGS.reduce((s, c) => s + c.trials, 0);
  const completedTrials = isPractice
    ? trialCount
    : levelResults.current.reduce((s, r) => s + (LEVEL_CONFIGS.find(l => l.level === r.level)?.trials ?? 0), 0) + trialCount;

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
            {isPractice ? "Practice Trial" : `Level ${cfg.level} of 3 — ${cfg.label}`}
          </p>
          {!isPractice && (
            <div className="flex gap-1">
              {LEVEL_CONFIGS.map((l) => (
                <div
                  key={l.level}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    l.level < cfg.level
                      ? "bg-score-good"
                      : l.level === cfg.level
                      ? "bg-brand-primary"
                      : "bg-border-default"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-on-surface-variant font-medium">
          Press Spacebar (or tap the letter) only when you see{" "}
          <strong className="text-brand-primary">X</strong>
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

        {feedback && (
          <div
            className={`absolute inset-0 flex items-center justify-center text-white text-sm font-extrabold select-none opacity-90 ${
              feedback === "correct" ? "bg-score-good" : "bg-score-attention"
            }`}
          >
            {feedback === "correct" ? "✓ Correct!" : "✗ Incorrect!"}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-4 shrink-0">
        <button
          onClick={handleResponse}
          disabled={hasResponded}
          className="w-full h-12 bg-brand-primary text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none disabled:opacity-60"
        >
          RESPOND
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Trial: {trialCount}/{cfg.trials}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Overall: {completedTrials}/{totalTrials}</span>
              <span>Correct: {correctRef.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
