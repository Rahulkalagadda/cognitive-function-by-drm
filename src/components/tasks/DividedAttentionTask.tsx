"use client";

/**
 * DividedAttentionTask — Dual-task paradigm
 * Primary task:   Track a moving dot on a grid (tap/click to confirm awareness)
 * Secondary task: Press RESPOND button when the dot flashes RED
 * Domain: Attention  |  Task ID: divided-attention
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";
import { CognitiveTaskConfig } from "@/types/assessment.types";

interface DividedAttentionTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: CognitiveTaskConfig;
}

// ─── Level configuration ─────────────────────────────────────────────────────

interface DALevelConfig {
  level: 1 | 2 | 3;
  gridSize: number;       // NxN
  moveIntervalMs: number; // how often dot moves
  totalMoves: number;
  /** How many of those moves the dot flashes red (secondary task triggers) */
  redFlashCount: number;
  hasDistractors: boolean; // Level 3: other flash colors appear too
  label: string;
}

const LEVEL_CONFIGS: DALevelConfig[] = [
  { level: 1, gridSize: 4, moveIntervalMs: 1200, totalMoves: 20, redFlashCount: 4,  hasDistractors: false, label: "4×4 grid · slow" },
  { level: 2, gridSize: 5, moveIntervalMs:  900, totalMoves: 25, redFlashCount: 8,  hasDistractors: false, label: "5×5 grid · faster" },
  { level: 3, gridSize: 5, moveIntervalMs:  700, totalMoves: 30, redFlashCount: 12, hasDistractors: true,  label: "5×5 grid · fast + distractors" },
];

const PRACTICE_CONFIG: DALevelConfig = {
  level: 1, gridSize: 4, moveIntervalMs: 1400, totalMoves: 10, redFlashCount: 2, hasDistractors: false, label: "Practice",
};

type DotColor = "blue" | "red" | "yellow" | "orange"; // yellow/orange = distractors

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

function randomCell(gridSize: number, exclude?: number): number {
  let next: number;
  do {
    next = Math.floor(Math.random() * gridSize * gridSize);
  } while (next === exclude);
  return next;
}

/** Build a schedule of moves for a level.
 *  Returns array of { color } per move index.
 */
function buildMoveSchedule(cfg: DALevelConfig): DotColor[] {
  const schedule: DotColor[] = new Array(cfg.totalMoves).fill("blue");
  // Spread red flashes evenly
  const redIndices = new Set<number>();
  while (redIndices.size < cfg.redFlashCount) {
    const idx = Math.floor(Math.random() * cfg.totalMoves);
    redIndices.add(idx);
  }
  Array.from(redIndices).forEach((idx) => { schedule[idx] = "red"; });

  if (cfg.hasDistractors) {
    const distractorColors: DotColor[] = ["yellow", "orange"];
    let added = 0;
    for (let i = 0; i < cfg.totalMoves && added < 6; i++) {
      if (schedule[i] === "blue") {
        schedule[i] = distractorColors[added % 2];
        added++;
      }
    }
  }
  return schedule;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DividedAttentionTask({ isPractice, onComplete }: DividedAttentionTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;

  const [levelIndex,     setLevelIndex]     = useState(0);
  const [dotPosition,    setDotPosition]    = useState(0);
  const [dotColor,       setDotColor]       = useState<DotColor>("blue");
  const [moveIndex,      setMoveIndex]      = useState(0);
  const [levelBanner,    setLevelBanner]    = useState<string | null>(null);
  const [flashFeedback,  setFlashFeedback]  = useState<"hit" | "miss" | null>(null);
  const [isRunning,      setIsRunning]      = useState(false);

  // Per-level metrics refs
  const scheduleRef             = useRef<DotColor[]>([]);
  const primaryClicksRef        = useRef<Set<number>>(new Set()); // move indices user confirmed tracking
  const redHitsRef              = useRef(0);   // correct RED presses
  const redMissesRef            = useRef(0);   // missed RED flashes
  const falseAlarmsRef          = useRef(0);   // pressed on non-RED
  const reactionTimesRef        = useRef<number[]>([]);
  const lastMoveTimeRef         = useRef(0);
  const hasRespondedThisMoveRef = useRef(false);
  const levelResults            = useRef<LevelResult[]>([]);
  const levelStartTimeRef       = useRef(0);
  const dotColorRef             = useRef<DotColor>("blue"); // stale-closure-safe mirror of dotColor
  // Cross-level clinical accumulators
  const totalPrimaryAcc   = useRef<number[]>([]);
  const totalSecondaryAcc = useRef<number[]>([]);

  const currentConfig = configs[levelIndex];

  // ── Reset and start on level change ──────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;
    const schedule = buildMoveSchedule(cfg);
    scheduleRef.current = schedule;
    primaryClicksRef.current = new Set();
    redHitsRef.current = 0;
    redMissesRef.current = 0;
    falseAlarmsRef.current = 0;
    reactionTimesRef.current = [];
    hasRespondedThisMoveRef.current = false;
    setDotPosition(Math.floor((cfg.gridSize * cfg.gridSize) / 2));
    setDotColor("blue");
    setMoveIndex(0);
    setFlashFeedback(null);
    levelStartTimeRef.current = Date.now();

    // Short start delay
    const t = setTimeout(() => setIsRunning(true), 800);
    return () => clearTimeout(t);
  }, [levelIndex]);

  // ── Move runner ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const cfg = configs[levelIndex];
    if (!cfg) return;

    if (moveIndex >= cfg.totalMoves) {
      setIsRunning(false);
      // Compute level metrics
      const redCount = scheduleRef.current.filter(c => c === "red").length;
      const primaryCorrect = primaryClicksRef.current.size;
      const primaryAcc = cfg.totalMoves > 0 ? (primaryCorrect / cfg.totalMoves) * 100 : 0;
      const secondaryAcc = redCount > 0 ? (redHitsRef.current / redCount) * 100 : 100;
      totalPrimaryAcc.current.push(primaryAcc);
      totalSecondaryAcc.current.push(secondaryAcc);

      const avgRT = reactionTimesRef.current.length > 0
        ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
        : 0;
      const dualAcc = (primaryAcc + secondaryAcc) / 2;

      const result: LevelResult = {
        level: cfg.level,
        accuracy: Math.round(dualAcc),
        reactionTime: Math.round(avgRT),
        correctResponses: redHitsRef.current + primaryCorrect,
        missedResponses: redMissesRef.current,
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
        const avgPrimary   = totalPrimaryAcc.current.reduce((a, b) => a + b, 0) / totalPrimaryAcc.current.length;
        const avgSecondary = totalSecondaryAcc.current.reduce((a, b) => a + b, 0) / totalSecondaryAcc.current.length;
        // interferenceScore: how much primary suffered (approx single-task - dual = estimated)
        const interferenceScore = Math.max(0, Math.round(100 - avgPrimary));

        const rawMetrics: RawMetrics = {
          difficultyLevel: 3,
          levels: levelResults.current,
          primaryAccuracy:   Math.round(avgPrimary),
          secondaryAccuracy: Math.round(avgSecondary),
          interferenceScore,
        };
        onComplete({ ...agg, rawMetrics });
      }
      return;
    }

    const color = scheduleRef.current[moveIndex] ?? "blue";
    const newPos = randomCell(cfg.gridSize, dotPosition);

    setDotColor(color);
    dotColorRef.current = color;          // keep ref in sync
    setDotPosition(newPos);
    hasRespondedThisMoveRef.current = false;
    lastMoveTimeRef.current = performance.now();
    setFlashFeedback(null);

    const timer = setTimeout(() => {
      // Penalise missed red flash
      if (color === "red" && !hasRespondedThisMoveRef.current) {
        redMissesRef.current += 1;
        setFlashFeedback("miss");
        setTimeout(() => setFlashFeedback(null), 400);
      }
      setMoveIndex((prev) => prev + 1);
    }, cfg.moveIntervalMs);

    return () => clearTimeout(timer);
  }, [moveIndex, isRunning, levelIndex]);

  // ── Primary task: tap any cell to confirm tracking ────────────────────────
  const handleCellClick = useCallback((cellIdx: number) => {
    if (cellIdx !== dotPosition) return; // must click the actual dot cell
    primaryClicksRef.current.add(moveIndex);
  }, [dotPosition, moveIndex]);

  // ── Secondary task: press RESPOND on red ─────────────────────────────────
  const handleRespond = useCallback(() => {
    if (hasRespondedThisMoveRef.current) return;
    // Guard: ignore presses during the startup delay before first move
    if (!isRunning) return;
    hasRespondedThisMoveRef.current = true;

    const rt = performance.now() - lastMoveTimeRef.current;
    // Read from ref — always the latest color regardless of React render cycle
    if (dotColorRef.current === "red") {
      redHitsRef.current += 1;
      reactionTimesRef.current.push(rt);
      setFlashFeedback("hit");
      setTimeout(() => setFlashFeedback(null), 300);
    } else {
      falseAlarmsRef.current += 1;
    }
  }, [isRunning]);

  // Keyboard: Space = secondary respond
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); handleRespond(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRespond]);

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
  const gridSize = cfg?.gridSize ?? 4;
  const cells = gridSize * gridSize;

  const getDotBgClass = (color: DotColor) => {
    if (color === "red")    return "bg-[#EF4444] ring-2 ring-[#EF4444]/50";
    if (color === "yellow") return "bg-[#EAB308] ring-2 ring-[#EAB308]/50";
    if (color === "orange") return "bg-[#F97316] ring-2 ring-[#F97316]/50";
    return "bg-brand-primary ring-2 ring-brand-primary/40";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-4 gap-4">
      <div className="text-center space-y-1">
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
          Track the dot (tap it). Press{" "}
          <strong className="text-[#EF4444]">RESPOND</strong> only when it flashes{" "}
          <strong className="text-[#EF4444]">RED</strong>.
        </p>
      </div>

      {/* Grid */}
      {!isRunning && moveIndex === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center mx-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-brand-primary" />
            </div>
            <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Starting…</p>
          </div>
        </div>
      ) : (
        <div
          className="grid gap-1 shrink-0"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, width: `${gridSize * 48}px` }}
        >
          {Array.from({ length: cells }, (_, i) => (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              type="button"
              className={`h-10 w-full rounded-lg border transition-all ${
                i === dotPosition
                  ? `${getDotBgClass(dotColor)} shadow-md scale-105`
                  : "bg-surface-page border-border-default hover:bg-surface-muted/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Secondary task button */}
      <div className="w-full max-w-xs space-y-3 shrink-0">
        <button
          onClick={handleRespond}
          type="button"
          className={`w-full h-12 font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none ${
            flashFeedback === "hit"
              ? "bg-score-good text-white"
              : flashFeedback === "miss"
              ? "bg-score-attention text-white"
              : "bg-[#EF4444] hover:bg-[#EF4444]/90 text-white"
          }`}
        >
          {flashFeedback === "hit" ? "✓ HIT!" : flashFeedback === "miss" ? "✗ MISSED!" : "RESPOND ON RED (SPACE)"}
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Move: {Math.min(moveIndex, cfg?.totalMoves ?? 0)}/{cfg?.totalMoves}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Red hits: {redHitsRef.current}</span>
              <span>Missed: {redMissesRef.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
