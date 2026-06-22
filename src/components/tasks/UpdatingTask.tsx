"use client";

/**
 * UpdatingTask — Dedicated Updating / Working Memory Task
 * Patient sees a running sequence of digits; at probe points they must
 * recall the last N digits they have seen.
 * Domain: Memory  |  Task ID: updating
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";
import { CognitiveTaskConfig } from "@/types/assessment.types";

interface UpdatingTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: CognitiveTaskConfig;
}

// ─── Level configuration ─────────────────────────────────────────────────────

interface UpdatingLevelConfig {
  level: 1 | 2 | 3;
  n: 1 | 2 | 3;
  totalItems: number;        // total digits shown
  probeCount: number;        // how many recall probes
  itemIntervalMs: number;    // time each digit is shown
  label: string;
}

const LEVEL_CONFIGS: UpdatingLevelConfig[] = [
  { level: 1, n: 1, totalItems: 10, probeCount: 4, itemIntervalMs: 1800, label: "1-Back · 10 items" },
  { level: 2, n: 2, totalItems: 15, probeCount: 5, itemIntervalMs: 1600, label: "2-Back · 15 items" },
  { level: 3, n: 3, totalItems: 24, probeCount: 6, itemIntervalMs: 1400, label: "3-Back · 24 items" },
];

const PRACTICE_CONFIG: UpdatingLevelConfig = {
  level: 1, n: 1, totalItems: 5, probeCount: 2, itemIntervalMs: 2000, label: "Practice",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

/** Generate a random sequence of digits 1-9 */
function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
}

/**
 * Distribute probe indices evenly across the sequence.
 * Rules:
 *  - No probe before index `n` (not enough history yet)
 *  - Minimum gap of (n + 1) items between consecutive probes so the
 *    patient sees at least n new digits before the next recall
 *  - Never place a probe at the very last item (index totalItems-1)
 *    so itemIndex can safely advance past it after the probe
 *  - Guaranteed exactly `probeCount` unique indices
 */
function generateProbeIndices(
  totalItems: number,
  probeCount: number,
  n: number
): Set<number> {
  const minGap = n + 1;          // minimum items between probes
  const firstValid = n;          // earliest a probe can appear
  const lastValid  = totalItems - 2; // never the very last item

  const usable = lastValid - firstValid + 1;
  const needed = probeCount;

  // Divide usable range into `probeCount` equal buckets and pick one index
  // per bucket — guarantees no collisions and even distribution.
  const bucketSize = Math.max(minGap, Math.floor(usable / needed));
  const indices = new Set<number>();

  for (let i = 0; i < needed; i++) {
    const bucketStart = firstValid + i * bucketSize;
    const bucketEnd   = Math.min(firstValid + (i + 1) * bucketSize - 1, lastValid);
    // Random pick within bucket, but clamp to valid range
    const pick = Math.min(
      Math.max(bucketStart, bucketStart + Math.floor(Math.random() * (bucketEnd - bucketStart + 1))),
      lastValid
    );
    // In the unlikely event of a collision shift by 1
    const final = indices.has(pick) ? Math.min(pick + 1, lastValid) : pick;
    indices.add(final);
  }
  return indices;
}

/**
 * Parse the player's recall input into an array of integers.
 * Accepts: space-separated ("3 7"), comma-separated ("3,7"),
 * or concatenated with no separator ("37") when exactly n digits are expected.
 * Concatenated input is split character-by-character into single digits.
 */
function parseRecallInput(raw: string, n: number): number[] {
  const trimmed = raw.trim();

  // Try splitting on whitespace or commas first
  const parts = trimmed.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);

  if (parts.length === n) {
    // Standard separated input
    const mapped = parts.map((s) => parseInt(s, 10));
    if (mapped.every((v) => !isNaN(v))) return mapped;
  }

  // Fallback: if exactly one token and its length equals n, split char by char
  if (parts.length === 1 && parts[0].length === n) {
    const chars = parts[0].split("").map((c) => parseInt(c, 10));
    if (chars.every((v) => !isNaN(v))) return chars;
  }

  // Last resort: collect all individual digits in order
  const digits = trimmed.split("").map((c) => parseInt(c, 10)).filter((v) => !isNaN(v));
  return digits;
}

// ─── Component ────────────────────────────────────────────────────────────────

type TaskPhase = "stream" | "probe" | "feedback";

export default function UpdatingTask({ isPractice, onComplete }: UpdatingTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;

  const [levelIndex,    setLevelIndex]    = useState(0);
  const [phase,         setPhase]         = useState<TaskPhase>("stream");
  const [currentDigit,  setCurrentDigit]  = useState<number | null>(null);
  const [itemIndex,     setItemIndex]     = useState(0);
  const [recallInput,   setRecallInput]   = useState("");
  const [levelBanner,   setLevelBanner]   = useState<string | null>(null);
  const [feedbackMsg,   setFeedbackMsg]   = useState<"correct" | "incorrect" | null>(null);
  const [isRunning,     setIsRunning]     = useState(false);

  // Per-level refs
  const sequenceRef       = useRef<number[]>([]);
  const probeIndicesRef   = useRef<Set<number>>(new Set());
  const historyRef        = useRef<number[]>([]);
  const correctProbesRef  = useRef(0);
  const totalProbesRef    = useRef(0);
  const falseAlarmsRef    = useRef(0);
  const reactionTimesRef  = useRef<number[]>([]);
  const probeStartTimeRef = useRef(0);
  const levelStartTimeRef = useRef(0);
  const levelResults      = useRef<LevelResult[]>([]);

  /**
   * ── KEY FIX: store probeTarget in a REF, not just state ──────────────────
   * This guarantees handleProbeSubmit always reads the latest target value,
   * even if React hasn't flushed the setProbeTarget state update yet.
   */
  const probeTargetRef    = useRef<number[]>([]);
  const [probeTargetDisplay, setProbeTargetDisplay] = useState<number[]>([]);

  /**
   * ── LEVEL 3 FIX: track whether we're waiting for a probe response ────────
   * The stream runner must NOT advance itemIndex or call finishLevel while
   * a probe response is pending, regardless of itemIndex value.
   */
  const awaitingProbeRef  = useRef(false);

  const currentConfig = configs[levelIndex];

  // ── Reset on level change ─────────────────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;
    const seq = generateSequence(cfg.totalItems);
    sequenceRef.current      = seq;
    probeIndicesRef.current  = generateProbeIndices(cfg.totalItems, cfg.probeCount, cfg.n);
    historyRef.current       = [];
    correctProbesRef.current = 0;
    totalProbesRef.current   = 0;
    falseAlarmsRef.current   = 0;
    reactionTimesRef.current = [];
    probeTargetRef.current   = [];
    awaitingProbeRef.current = false;
    setProbeTargetDisplay([]);
    setPhase("stream");
    setItemIndex(0);
    setCurrentDigit(null);
    setRecallInput("");
    setFeedbackMsg(null);
    levelStartTimeRef.current = Date.now();

    const t = setTimeout(() => setIsRunning(true), 600);
    return () => clearTimeout(t);
  }, [levelIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishLevel = useCallback(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;

    const totalProbes = totalProbesRef.current;
    const correct     = correctProbesRef.current;
    const missed      = totalProbes - correct;
    const acc         = totalProbes > 0 ? (correct / totalProbes) * 100 : 0;
    const avgRT       = reactionTimesRef.current.length > 0
      ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
      : 0;

    const result: LevelResult = {
      level: cfg.level,
      accuracy: Math.round(acc),
      reactionTime: Math.round(avgRT),
      correctResponses: correct,
      missedResponses: missed,
      commissionErrors: falseAlarmsRef.current,
      completionTime: Math.round((Date.now() - levelStartTimeRef.current) / 1000),
    };
    levelResults.current.push(result);

    const nextIndex = levelIndex + 1;
    if (nextIndex < configs.length) {
      setLevelBanner(`Level ${cfg.level} complete — next: Level ${cfg.level + 1}`);
      setTimeout(() => {
        setLevelBanner(null);
        setIsRunning(false);
        setLevelIndex(nextIndex);
      }, 1500);
    } else {
      const agg = buildAggregates(levelResults.current);
      const totalC  = levelResults.current.reduce((s, r) => s + r.correctResponses, 0);
      const totalFA = levelResults.current.reduce((s, r) => s + r.commissionErrors, 0);
      const totalM  = levelResults.current.reduce((s, r) => s + r.missedResponses, 0);
      const updatingEfficiency = (totalC + totalFA + totalM) > 0
        ? totalC / (totalC + totalFA + totalM) : 0;

      const rawMetrics: RawMetrics = {
        difficultyLevel: 3,
        levels: levelResults.current,
        nBackLevel: 3,
        updatingEfficiency: Math.round(updatingEfficiency * 100) / 100,
      };
      onComplete({ ...agg, rawMetrics });
    }
  }, [levelIndex, configs, onComplete]);

  // ── Stream runner ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Do NOT run if not in stream phase, not running, or waiting for probe answer
    if (!isRunning || phase !== "stream") return;
    const cfg = configs[levelIndex];
    if (!cfg) return;

    // ── LEVEL 3 FIX: block finishLevel while a probe response is still pending
    if (awaitingProbeRef.current) return;

    if (itemIndex >= cfg.totalItems) {
      setIsRunning(false);
      finishLevel();
      return;
    }

    const digit = sequenceRef.current[itemIndex];

    // Push to history BEFORE rendering the digit so slice(-n) is always correct
    historyRef.current.push(digit);
    setCurrentDigit(digit);

    // Is this a probe point?
    if (probeIndicesRef.current.has(itemIndex)) {
      awaitingProbeRef.current = true;   // block the runner until answer is submitted

      const timer = setTimeout(() => {
        setCurrentDigit(null);
        // Capture the last-N slice SYNCHRONOUSLY, store in ref AND state
        const lastN = [...historyRef.current.slice(-cfg.n)];
        probeTargetRef.current = lastN;
        setProbeTargetDisplay(lastN);
        setPhase("probe");
        probeStartTimeRef.current = performance.now();
      }, 600);
      return () => clearTimeout(timer);
    }

    // Normal digit: show for itemIntervalMs, then brief blank, then advance
    const timer = setTimeout(() => {
      setCurrentDigit(null);
      setTimeout(() => setItemIndex((prev) => prev + 1), 150);
    }, cfg.itemIntervalMs);
    return () => clearTimeout(timer);
  }, [itemIndex, isRunning, phase, levelIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProbeSubmit = useCallback(() => {
    if (phase !== "probe") return;
    const cfg = configs[levelIndex];
    if (!cfg) return;

    const rt = performance.now() - probeStartTimeRef.current;
    reactionTimesRef.current.push(rt);
    totalProbesRef.current += 1;

    // Use the REF for probeTarget — guaranteed to be the latest value
    const target = probeTargetRef.current;

    // Parse input using flexible parser
    const inputDigits = parseRecallInput(recallInput, cfg.n);

    // Correct if: same length AND every digit matches in order
    const isCorrect =
      inputDigits.length === target.length &&
      inputDigits.every((d, idx) => d === target[idx]);

    if (isCorrect) {
      correctProbesRef.current += 1;
      setFeedbackMsg("correct");
    } else {
      falseAlarmsRef.current += 1;
      setFeedbackMsg("incorrect");
    }

    setPhase("feedback");
    setTimeout(() => {
      setFeedbackMsg(null);
      setRecallInput("");
      probeTargetRef.current = [];   // clear stale target
      setProbeTargetDisplay([]);
      awaitingProbeRef.current = false;  // unblock the stream runner
      setPhase("stream");
      setItemIndex((prev) => prev + 1); // advance past the probe item
    }, 1000);
  }, [phase, recallInput, levelIndex, configs]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProbeSubmit();
    }
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

  const cfg = currentConfig;

  const placeholderHint =
    cfg?.n === 1 ? "e.g.  7" :
    cfg?.n === 2 ? "e.g.  7  3  (in order)" :
                   "e.g.  7  3  5  (in order)";

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-6 gap-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            {isPractice ? "Practice Trial" : `Level ${cfg?.level} of 3 — ${cfg?.label}`}
          </p>
          {!isPractice && (
            <div className="flex gap-1">
              {LEVEL_CONFIGS.map((l) => (
                <div key={l.level} className={`w-2 h-2 rounded-full transition-colors ${
                  l.level < (cfg?.level ?? 1) ? "bg-score-good" : l.level === cfg?.level ? "bg-brand-primary" : "bg-border-default"
                }`} />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-on-surface-variant font-medium">
          {phase === "probe"
            ? `Type the last ${cfg?.n} digit${cfg?.n !== 1 ? "s" : ""} you saw, in order.`
            : `Watch the digits. Remember the last ${cfg?.n} you see.`}
        </p>
      </div>

      {/* Digit display / Probe input */}
      <div className="flex-1 flex items-center justify-center">
        {phase === "stream" || phase === "feedback" ? (
          <div
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-2 flex items-center justify-center shadow-sm transition-all ${
              feedbackMsg === "correct"
                ? "bg-score-good/10 border-score-good"
                : feedbackMsg === "incorrect"
                ? "bg-score-attention/10 border-score-attention"
                : "border-border-default bg-surface-page"
            }`}
          >
            {currentDigit !== null ? (
              <span className="text-7xl font-black text-on-surface select-none">{currentDigit}</span>
            ) : feedbackMsg ? (
              <span className={`text-sm font-extrabold ${feedbackMsg === "correct" ? "text-score-good" : "text-score-attention"}`}>
                {feedbackMsg === "correct" ? "✓ Correct!" : "✗ Incorrect"}
              </span>
            ) : (
              <span className="text-3xl text-on-surface-variant/30 select-none">·</span>
            )}
          </div>
        ) : (
          // Probe phase
          <div className="w-full max-w-xs space-y-4">
            <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                Recall Probe — Last {cfg?.n} digit{cfg?.n !== 1 ? "s" : ""}
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium">
                {cfg?.n === 1
                  ? "Type the digit you just saw."
                  : `Type the ${cfg?.n} digits in the order they appeared, separated by spaces.`}
              </p>
              {/* Show digit slots as hint boxes */}
              <div className="flex justify-center gap-2 pt-1">
                {Array.from({ length: cfg?.n ?? 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border-2 border-brand-primary/30 bg-brand-primary/5 flex items-center justify-center text-sm font-extrabold text-brand-primary"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={recallInput}
                onChange={(e) => setRecallInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderHint}
                className="flex-1 px-4 py-2.5 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm text-center font-bold tracking-widest"
                autoFocus
              />
              <button
                type="button"
                onClick={handleProbeSubmit}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1 shrink-0">
        <span>Item: {Math.min(itemIndex, cfg?.totalItems ?? 0)}/{cfg?.totalItems}</span>
        {!isPractice && (
          <div className="flex gap-3">
            <span>Probes correct: {correctProbesRef.current}</span>
            <span>Total probes: {totalProbesRef.current}</span>
          </div>
        )}
      </div>
    </div>
  );
}
