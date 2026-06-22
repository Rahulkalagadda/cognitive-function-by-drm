"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";

interface GoNoGoTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: {
    clickIntervalMs?: number;
  };
}

// ─── Level configuration ─────────────────────────────────────────────────────

interface GoNoGoLevelConfig {
  level: 1 | 2 | 3;
  intervalMs: number;
  trials: number;
  /** Pre-built sequence: true = Go (green), false = No-Go (red). */
  sequence: boolean[];
  label: string;
  /** Level 3: alternate between two colors for No-Go signal */
  alternatingNoGo?: boolean;
}

// 80% Go / 20% No-Go
const L1_SEQ: boolean[] = [
  true, true, true, true, false, true, true, true, true, false,
  true, true, true, true, false, true, true, true, false, true,
];
// 70% Go / 30% No-Go
const L2_SEQ: boolean[] = [
  true, true, false, true, true, false, true, true, false, true,
  false, true, true, false, true, true, false, true, true, false,
  true, false, true, true, false,
];
// 60% Go / 40% No-Go
const L3_SEQ: boolean[] = [
  true, false, true, false, true, true, false, true, false, true,
  false, true, true, false, true, false, true, true, false, true,
  false, true, false, true, true, false, true, false, true, false,
];

const LEVEL_CONFIGS: GoNoGoLevelConfig[] = [
  { level: 1, intervalMs: 1400, trials: 20, sequence: L1_SEQ, label: "80% Go / 20% No-Go" },
  { level: 2, intervalMs: 1100, trials: 25, sequence: L2_SEQ, label: "70% Go / 30% No-Go" },
  { level: 3, intervalMs: 800,  trials: 30, sequence: L3_SEQ, label: "60% Go / 40% No-Go", alternatingNoGo: true },
];

const PRACTICE_CONFIG: GoNoGoLevelConfig = {
  level: 1, intervalMs: 1400, trials: 6,
  sequence: [true, false, true, true, false, true],
  label: "Practice",
};

// ─── Weighted aggregate helper ────────────────────────────────────────────────

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

export default function GoNoGoTask({ isPractice, onComplete }: GoNoGoTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;

  const [levelIndex,   setLevelIndex]   = useState(0);
  const [trialCount,   setTrialCount]   = useState(0);
  const [currentGo,    setCurrentGo]    = useState<boolean | null>(null);
  const [noGoAlt,      setNoGoAlt]      = useState(false); // alternating No-Go color flag
  const [feedback,     setFeedback]     = useState<"correct" | "incorrect" | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [levelBanner,  setLevelBanner]  = useState<string | null>(null);

  const hasRespondedRef  = useRef(false);
  const correctRef       = useRef(0);
  const commissionsRef   = useRef(0); // pressed on No-Go
  const omissionsRef     = useRef(0); // missed Go
  const correctNoGoRef   = useRef(0); // correctly withheld on No-Go (current level)
  const totalCorrectNoGoRef = useRef(0); // accumulated across all levels
  const reactionTimesRef = useRef<number[]>([]);
  const lastFlashTime    = useRef(0);
  const noGoAltRef       = useRef(false);
  const currentGoRef     = useRef<boolean | null>(null); // stale-closure-safe mirror of currentGo

  const levelResults = useRef<LevelResult[]>([]);

  // ── Reset per-level refs ──────────────────────────────────────────────────
  useEffect(() => {
    correctRef.current      = 0;
    commissionsRef.current  = 0;
    omissionsRef.current    = 0;
    correctNoGoRef.current  = 0;
    // NOTE: totalCorrectNoGoRef is NOT reset here — it accumulates
    reactionTimesRef.current = [];
    noGoAltRef.current      = false;
    setNoGoAlt(false);
    setTrialCount(0);
    setCurrentGo(null);
    setFeedback(null);
    setHasResponded(false);
    hasRespondedRef.current = false;
  }, [levelIndex]);

  // ── Trial runner ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;
    let timer: NodeJS.Timeout;

    if (trialCount >= cfg.trials) {
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
      // Always accumulate correctNoGo before resetting the level
      totalCorrectNoGoRef.current += correctNoGoRef.current;
      if (nextIndex < configs.length) {
        setLevelBanner(`Level ${cfg.level} complete — next: Level ${cfg.level + 1}`);
        setTimeout(() => {
          setLevelBanner(null);
          setLevelIndex(nextIndex);
        }, 1500);
      } else {
        const agg = buildAggregates(levelResults.current);

        const totalCorrectNoGo = totalCorrectNoGoRef.current;
        const totalCommissions  = agg.commissionErrors;
        const inhibitoryControlIndex =
          totalCorrectNoGo + totalCommissions > 0
            ? totalCorrectNoGo / (totalCorrectNoGo + totalCommissions)
            : 1;

        const rawMetrics: RawMetrics = {
          difficultyLevel: 3,
          levels: levelResults.current,
          inhibitoryControlIndex: Math.round(inhibitoryControlIndex * 100) / 100,
        };

        onComplete({ ...agg, rawMetrics });
      }
      return;
    }

    const cfg2 = configs[levelIndex];
    const isGo = cfg2.sequence[trialCount % cfg2.sequence.length];

    // Alternate No-Go color on Level 3
    let thisNoGoAlt = false;
    if (cfg2.alternatingNoGo && !isGo) {
      thisNoGoAlt = !noGoAltRef.current;
      noGoAltRef.current = thisNoGoAlt;
      setNoGoAlt(thisNoGoAlt);
    }

    setCurrentGo(isGo);
    currentGoRef.current = isGo;        // keep ref in sync
    setHasResponded(false);
    hasRespondedRef.current = false;
    setFeedback(null);
    lastFlashTime.current = Date.now();

    timer = setTimeout(() => {
      if (isGo && !hasRespondedRef.current) {
        omissionsRef.current += 1;
        if (isPractice) setFeedback("incorrect");
      } else if (!isGo && !hasRespondedRef.current) {
        // Correct withhold
        correctNoGoRef.current += 1;
      }
      setTrialCount((prev) => prev + 1);
    }, cfg2.intervalMs);

    return () => clearTimeout(timer);
  }, [trialCount, levelIndex]);

  const handleResponse = useCallback(() => {
    if (hasRespondedRef.current) return;
    // Guard: ignore presses during the blank gap between trials
    if (currentGoRef.current === null) return;
    hasRespondedRef.current = true;
    setHasResponded(true);

    const timeDiff = Date.now() - lastFlashTime.current;
    // Read from ref — always the current trial value regardless of React render cycle
    if (currentGoRef.current) {
      correctRef.current += 1;
      reactionTimesRef.current.push(timeDiff);
      if (isPractice) setFeedback("correct");
    } else {
      commissionsRef.current += 1;
      if (isPractice) setFeedback("incorrect");
    }
  }, [isPractice]);

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

  // ── Circle color ─────────────────────────────────────────────────────────
  const getCircleClass = () => {
    if (currentGo) return "bg-[#10B981]"; // green = Go
    if (cfg?.alternatingNoGo && noGoAlt) return "bg-[#F59E0B]"; // amber variant No-Go
    return "bg-[#EF4444]"; // red = No-Go
  };

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
            {isPractice ? "Practice Trial" : `Level ${cfg?.level} of 3 — ${cfg?.label}`}
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
          Press Spacebar when <strong className="text-[#10B981]">GREEN</strong>. Inhibit on{" "}
          <strong className="text-status-error">RED</strong>
          {cfg?.alternatingNoGo && <> or <strong className="text-[#F59E0B]">AMBER</strong></>}.
        </p>
      </div>

      {/* Circle target */}
      <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center relative select-none">
        {currentGo !== null && (
          <div
            onClick={handleResponse}
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full cursor-pointer transition-transform duration-100 shadow-lg active:scale-95 ${getCircleClass()}`}
          />
        )}

        {feedback && (
          <div
            className={`absolute inset-0 rounded-2xl flex items-center justify-center text-white text-sm font-extrabold select-none opacity-90 ${
              feedback === "correct" ? "bg-score-good" : "bg-score-attention"
            }`}
          >
            {feedback === "correct" ? "✓ Correct!" : "✗ Stop!"}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-4 shrink-0">
        <button
          onClick={handleResponse}
          disabled={hasResponded}
          className="w-full h-12 bg-brand-primary text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none disabled:opacity-60"
        >
          RESPOND (SPACE)
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Trial: {trialCount}/{cfg?.trials}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Hits: {correctRef.current}</span>
              <span>Errors: {commissionsRef.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
