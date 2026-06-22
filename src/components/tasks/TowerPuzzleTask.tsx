"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";

interface TowerPuzzleTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
}

type BallColor = "red" | "green" | "blue" | "orange";
type PegsState = Record<number, BallColor[]>;

// ─── Level configuration ─────────────────────────────────────────────────────

interface PuzzleConfig {
  level: 1 | 2 | 3;
  label: string;
  optimalMoves: number;
  startState: PegsState;
  targetState: PegsState;
  pegCapacities: Record<number, number>;
}

const PUZZLE_CONFIGS: PuzzleConfig[] = [
  {
    level: 1,
    label: "3 moves",
    optimalMoves: 3,
    startState:  { 1: ["green", "red"], 2: [], 3: [] },
    targetState: { 1: [], 2: ["green"], 3: ["red"] },
    pegCapacities: { 1: 3, 2: 2, 3: 1 },
  },
  {
    level: 2,
    label: "5 moves",
    optimalMoves: 5,
    startState:  { 1: ["blue", "green", "red"], 2: [], 3: [] },
    targetState: { 1: ["blue"], 2: ["green"], 3: ["red"] },
    pegCapacities: { 1: 3, 2: 2, 3: 1 },
  },
  {
    level: 3,
    label: "7 moves",
    optimalMoves: 7,
    startState:  { 1: ["red", "blue", "green"], 2: [], 3: [] },
    targetState: { 1: ["blue"], 2: ["red"], 3: ["green"] },
    pegCapacities: { 1: 3, 2: 3, 3: 3 },
  },
];

// ─── Weighted aggregate helper ────────────────────────────────────────────────

function buildAggregates(levels: LevelResult[]) {
  const totalWeight = levels.reduce((s, r) => s + r.level, 0);
  return {
    accuracy:         Math.round(levels.reduce((s, r) => s + r.accuracy * r.level, 0) / totalWeight),
    reactionTime:     Math.round(levels.reduce((s, r) => s + r.reactionTime * r.level, 0) / totalWeight),
    correctResponses: levels.reduce((s, r) => s + r.correctResponses, 0),
    missedResponses:  0,
    commissionErrors: levels.reduce((s, r) => s + r.commissionErrors, 0),
    completionTime:   levels.reduce((s, r) => s + r.completionTime, 0),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TowerPuzzleTask({ isPractice, onComplete }: TowerPuzzleTaskProps) {
  const configs = isPractice ? [PUZZLE_CONFIGS[0]] : PUZZLE_CONFIGS;

  const [levelIndex,   setLevelIndex]   = useState(0);
  const [pegs,         setPegs]         = useState<PegsState>({});
  const [selectedPeg,  setSelectedPeg]  = useState<number | null>(null);
  const [moveCount,    setMoveCount]     = useState(0);
  const [isDone,       setIsDone]        = useState(false);
  const [levelBanner,  setLevelBanner]   = useState<string | null>(null);

  const startTime       = useRef(0);
  const firstMoveTime   = useRef(0);
  const levelResults    = useRef<LevelResult[]>([]);
  const totalPlanningMs = useRef(0); // sum of planning times per level

  const currentConfig = configs[levelIndex];

  // ── Init pegs on level change ─────────────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;
    // Deep copy
    const initial: PegsState = {};
    for (const k of Object.keys(cfg.startState)) {
      initial[+k] = [...cfg.startState[+k]];
    }
    setPegs(initial);
    setSelectedPeg(null);
    setMoveCount(0);
    setIsDone(false);
    firstMoveTime.current = 0;
    startTime.current = Date.now();
  }, [levelIndex]);

  // ── Check win condition ───────────────────────────────────────────────────
  const checkWin = useCallback(
    (nextPegs: PegsState, moves: number, cfg: PuzzleConfig) => {
      const target = cfg.targetState;
      const isMatch = Object.keys(target).every(
        (k) => JSON.stringify(nextPegs[+k]) === JSON.stringify(target[+k])
      );
      if (!isMatch) return;

      setIsDone(true);
      const totalDuration = (Date.now() - startTime.current) / 1000;
      const planningMs = firstMoveTime.current;
      totalPlanningMs.current += planningMs;

      const extraMoves = Math.max(0, moves - cfg.optimalMoves);
      const acc = Math.max(0, 100 - extraMoves * 15);

      const result: LevelResult = {
        level: cfg.level,
        accuracy: acc,
        reactionTime: Math.round(planningMs),
        correctResponses: moves,
        missedResponses: 0,
        commissionErrors: extraMoves,
        completionTime: Math.round(totalDuration),
      };

      setTimeout(() => {
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
          const totalActual = levelResults.current.reduce((s, r) => s + r.correctResponses, 0);
          const totalOptimal = configs.reduce((s, c) => s + c.optimalMoves, 0);
          const efficiencyScore = Math.min(1, totalOptimal / Math.max(1, totalActual));

          const rawMetrics: RawMetrics = {
            difficultyLevel: 3,
            levels: levelResults.current,
            efficiencyScore: Math.round(efficiencyScore * 100) / 100,
            planningTimeMs: Math.round(totalPlanningMs.current / levelResults.current.length),
            optimalMoves: totalOptimal,
          };
          onComplete({ ...agg, rawMetrics });
        }
      }, isPractice ? 0 : 800);
    },
    [levelIndex, configs, isPractice, onComplete]
  );

  const handlePegClick = (pegId: number) => {
    if (isDone || !currentConfig) return;

    const pegCaps = currentConfig.pegCapacities;

    if (selectedPeg === null) {
      if (pegs[pegId]?.length > 0) setSelectedPeg(pegId);
    } else {
      if (selectedPeg === pegId) {
        setSelectedPeg(null);
        return;
      }

      const src = [...(pegs[selectedPeg] ?? [])];
      const tgt = [...(pegs[pegId] ?? [])];

      if (tgt.length >= pegCaps[pegId]) {
        setSelectedPeg(null);
        return;
      }

      if (moveCount === 0) {
        firstMoveTime.current = Date.now() - startTime.current;
      }

      const movedBall = src.pop()!;
      tgt.push(movedBall);

      const nextPegs: PegsState = { ...pegs, [selectedPeg]: src, [pegId]: tgt };
      setPegs(nextPegs);
      const nextMoves = moveCount + 1;
      setMoveCount(nextMoves);
      setSelectedPeg(null);

      checkWin(nextPegs, nextMoves, currentConfig);
    }
  };

  const getBallBg = (color: BallColor) => {
    const map: Record<BallColor, string> = {
      red:    "bg-[#EF4444]",
      green:  "bg-[#10B981]",
      blue:   "bg-[#2563EB]",
      orange: "bg-[#F59E0B]",
    };
    return map[color] ?? "bg-on-surface-variant";
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
  const pegCaps = cfg?.pegCapacities ?? { 1: 3, 2: 2, 3: 1 };

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-4">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            {isPractice ? "Practice Trial" : `Level ${cfg?.level} of 3 — ${cfg?.label}`}
          </p>
          {!isPractice && (
            <div className="flex gap-1">
              {PUZZLE_CONFIGS.map((l) => (
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
          Match the target arrangement. Click a peg to pick the top ball, click again to place.
        </p>
      </div>

      {/* Target state */}
      <div className="border border-border-default bg-surface-muted/30 p-2.5 rounded-xl space-y-1.5 w-full max-w-[280px] shrink-0">
        <p className="text-[9px] font-black uppercase text-on-surface-variant text-center tracking-wider">
          Target (Goal)
        </p>
        <div className="flex justify-around items-end h-16 relative">
          {[1, 2, 3].map((pegId) => (
            <div key={pegId} className="flex flex-col items-center relative w-12">
              <div
                className="w-1 bg-border-strong rounded-full"
                style={{ height: `${pegCaps[pegId] * 20 + 8}px` }}
              />
              <div className="absolute bottom-0 flex flex-col-reverse gap-0.5">
                {(cfg?.targetState[pegId] ?? []).map((color, i) => (
                  <div key={i} className={`w-6 h-5 rounded-full ${getBallBg(color)} opacity-70`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Play Area */}
      <div className="flex justify-around items-end h-36 sm:h-40 w-full max-w-[320px] bg-white border border-border-default rounded-2xl p-4 shadow-sm relative shrink-0">
        {[1, 2, 3].map((pegId) => {
          const isSelectedSource = selectedPeg === pegId;
          const balls = pegs[pegId] ?? [];
          const capacity = pegCaps[pegId];

          return (
            <div
              key={pegId}
              onClick={() => handlePegClick(pegId)}
              className={`flex flex-col items-center relative w-16 cursor-pointer p-1 rounded-xl transition-all ${
                isSelectedSource ? "bg-brand-primary/5 ring-2 ring-brand-primary/20" : "hover:bg-surface-page/50"
              }`}
            >
              <span className="absolute -top-6 text-[8px] font-bold text-on-surface-variant/50">
                Max {capacity}
              </span>
              <div
                className={`w-1.5 rounded-full transition-colors ${
                  isSelectedSource ? "bg-brand-primary" : "bg-border-strong"
                }`}
                style={{ height: `${capacity * 26 + 10}px` }}
              />
              <div className="absolute bottom-1 flex flex-col-reverse gap-1">
                {balls.map((color, i) => {
                  const isTopBall = i === balls.length - 1;
                  const isSelectedBall = isSelectedSource && isTopBall;
                  return (
                    <div
                      key={i}
                      className={`w-9 h-7 rounded-full transition-all shadow-sm ${getBallBg(color)} ${
                        isSelectedBall ? "ring-4 ring-offset-2 ring-brand-primary animate-pulse scale-105" : ""
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-xs flex justify-between items-center text-[10px] text-on-surface-variant/80 font-bold px-2 pt-2">
        <span>Moves: {moveCount}</span>
        {isDone && <span className="text-score-good">✓ Solved!</span>}
        <span>Optimal: {cfg?.optimalMoves}</span>
      </div>
    </div>
  );
}
