"use client";

/**
 * DividedAttentionTask — Dual-task paradigm
 * Primary task:   Track a moving dot on a grid (tap/click to confirm awareness) [Visual]
 * Secondary task: Press RESPOND button when target audio is heard [Auditory]
 * Domain: Attention  |  Task ID: divided-attention
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";
import { CognitiveTaskConfig } from "@/types/assessment.types";
import { useVoice } from "@/hooks/useVoice";
import { useAssessmentStore } from "@/stores/assessment.store";

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
  auditoryIntervalMs: number; // how often audio speaks
  label: string;
  targetDescription: string;
}

const LEVEL_CONFIGS: DALevelConfig[] = [
  { level: 1, gridSize: 4, moveIntervalMs: 1400, totalMoves: 100, auditoryIntervalMs: 2800, label: "Level 1 of 3", targetDescription: "Press RESPOND when you hear the number 7." },
  { level: 2, gridSize: 5, moveIntervalMs: 1000, totalMoves: 140, auditoryIntervalMs: 2000, label: "Level 2 of 3", targetDescription: "Press RESPOND when you hear the letter X." },
  { level: 3, gridSize: 5, moveIntervalMs: 700,  totalMoves: 200, auditoryIntervalMs: 2000, label: "Level 3 of 3", targetDescription: "1-Back: Press RESPOND when you hear the same number twice in a row." },
];

const PRACTICE_CONFIG: DALevelConfig = {
  level: 1, gridSize: 4, moveIntervalMs: 1400, totalMoves: 10, auditoryIntervalMs: 2800, label: "Practice Trial", targetDescription: "Press RESPOND when you hear the number 7."
};

interface SpokenCue {
  symbol: string;
  isTarget: boolean;
}

interface AudioStimulus {
  index: number;
  symbol: string;
  isTarget: boolean;
  timestamp: number;
  hasResponded: boolean;
}

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

/** Build a schedule of auditory cues for a level.
 *  Returns array of { symbol, isTarget } per cue index.
 */
function buildAuditorySchedule(cfg: DALevelConfig): SpokenCue[] {
  const count = Math.ceil((cfg.totalMoves * cfg.moveIntervalMs) / cfg.auditoryIntervalMs);
  const schedule: SpokenCue[] = [];

  if (cfg.level === 1) {
    // Target: "7". Distractors: 1, 2, 3, 4, 5, 6, 8, 9.
    const targetFreq = cfg.totalMoves === 10 ? 2 : 25; // 2 targets for practice, 25 for L1 (25% frequency)
    const targets = new Set<number>();
    while (targets.size < targetFreq) {
      targets.add(Math.floor(Math.random() * count));
    }
    for (let i = 0; i < count; i++) {
      if (targets.has(i)) {
        schedule.push({ symbol: "7", isTarget: true });
      } else {
        const dists = ["1", "2", "3", "4", "5", "6", "8", "9"];
        const randDist = dists[Math.floor(Math.random() * dists.length)];
        schedule.push({ symbol: randDist, isTarget: false });
      }
    }
  } else if (cfg.level === 2) {
    // Target: "X". Distractors: A, B, C, D, E, F, Y, Z.
    const targetFreq = 18; // ~25% target frequency for 70 cues
    const targets = new Set<number>();
    while (targets.size < targetFreq) {
      targets.add(Math.floor(Math.random() * count));
    }
    for (let i = 0; i < count; i++) {
      if (targets.has(i)) {
        schedule.push({ symbol: "X", isTarget: true });
      } else {
        const dists = ["A", "B", "C", "D", "E", "F", "Y", "Z"];
        const randDist = dists[Math.floor(Math.random() * dists.length)];
        schedule.push({ symbol: randDist, isTarget: false });
      }
    }
  } else {
    // Level 3: 1-Back matching.
    // Output is digit sequence. Target is when current === previous.
    const matchFreq = 18; // ~25% targets out of 70 cues
    let prevDigit = Math.floor(Math.random() * 9) + 1; // 1-9
    schedule.push({ symbol: String(prevDigit), isTarget: false });
    
    const matchIndices = new Set<number>();
    while (matchIndices.size < matchFreq) {
      matchIndices.add(Math.floor(Math.random() * (count - 1)) + 1);
    }
    
    for (let i = 1; i < count; i++) {
      if (matchIndices.has(i)) {
        schedule.push({ symbol: String(prevDigit), isTarget: true });
      } else {
        let nextDigit = Math.floor(Math.random() * 9) + 1;
        while (nextDigit === prevDigit) {
          nextDigit = Math.floor(Math.random() * 9) + 1;
        }
        schedule.push({ symbol: String(nextDigit), isTarget: false });
        prevDigit = nextDigit;
      }
    }
  }
  return schedule;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DividedAttentionTask({ isPractice, onComplete }: DividedAttentionTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;
  const { language } = useAssessmentStore();
  const langCode = language || "en";
  const { speak, stop: stopVoice, warmUp } = useVoice();

  const [levelIndex,      setLevelIndex]     = useState(0);
  const [dotPosition,     setDotPosition]    = useState(0);
  const [moveIndex,       setMoveIndex]      = useState(0);
  const [levelBanner,     setLevelBanner]    = useState<string | null>(null);
  const [flashFeedback,   setFlashFeedback]  = useState<"hit" | "miss" | null>(null);
  const [isRunning,       setIsRunning]      = useState(false);
  const [hasStartedLevel, setHasStartedLevel] = useState(false);

  // Per-level metrics refs
  const auditoryScheduleRef     = useRef<SpokenCue[]>([]);
  const primaryClicksRef        = useRef<Set<number>>(new Set()); // move indices user tracked dot
  const redHitsRef              = useRef(0);   // correct auditory responses
  const redMissesRef            = useRef(0);   // missed auditory targets
  const falseAlarmsRef          = useRef(0);   // false alarm audio presses
  const reactionTimesRef        = useRef<number[]>([]);
  const activeStimulusRef       = useRef<AudioStimulus | null>(null);
  const levelResults            = useRef<LevelResult[]>([]);
  const levelStartTimeRef       = useRef(0);

  // Cross-level clinical accumulators
  const totalPrimaryAcc   = useRef<number[]>([]);
  const totalSecondaryAcc = useRef<number[]>([]);

  const currentConfig = configs[levelIndex];
  const responseWindowMs = currentConfig ? currentConfig.auditoryIntervalMs - 300 : 1500;

  // ── Reset and start on level change ──────────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;

    auditoryScheduleRef.current = buildAuditorySchedule(cfg);
    primaryClicksRef.current = new Set();
    redHitsRef.current = 0;
    redMissesRef.current = 0;
    falseAlarmsRef.current = 0;
    reactionTimesRef.current = [];
    activeStimulusRef.current = null;
    setDotPosition(Math.floor((cfg.gridSize * cfg.gridSize) / 2));
    setMoveIndex(0);
    setFlashFeedback(null);
    levelStartTimeRef.current = Date.now();
    setHasStartedLevel(false);
    setIsRunning(false);
  }, [levelIndex]);

  // ── Auditory Loop runner ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const cfg = configs[levelIndex];
    if (!cfg) return;

    let audioIdx = 0;
    const sched = auditoryScheduleRef.current;
    if (sched.length === 0) return;

    const playNextCue = () => {
      if (audioIdx >= sched.length) return;
      const cue = sched[audioIdx];
      audioIdx++;
      
      speak(cue.symbol, langCode);
      
      const now = performance.now();
      activeStimulusRef.current = {
        index: audioIdx - 1,
        symbol: cue.symbol,
        isTarget: cue.isTarget,
        timestamp: now,
        hasResponded: false
      };
      
      if (cue.isTarget) {
        const currentIdx = audioIdx - 1;
        setTimeout(() => {
          if (activeStimulusRef.current && 
              activeStimulusRef.current.index === currentIdx && 
              !activeStimulusRef.current.hasResponded) {
            redMissesRef.current += 1;
            setFlashFeedback("miss");
            setTimeout(() => setFlashFeedback(null), 400);
          }
        }, responseWindowMs);
      }
    };

    const initialTimer = setTimeout(() => {
      playNextCue();
    }, 500);

    const intervalTimer = setInterval(() => {
      playNextCue();
    }, cfg.auditoryIntervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      stopVoice();
    };
  }, [isRunning, levelIndex, langCode, responseWindowMs]);

  // ── Move runner (visual dot) ──────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const cfg = configs[levelIndex];
    if (!cfg) return;

    if (moveIndex >= cfg.totalMoves) {
      setIsRunning(false);
      
      // Compute level metrics
      const targetCount = auditoryScheduleRef.current.filter(c => c.isTarget).length;
      const primaryCorrect = primaryClicksRef.current.size;
      const primaryAcc = cfg.totalMoves > 0 ? (primaryCorrect / cfg.totalMoves) * 100 : 0;
      const secondaryAcc = targetCount > 0 ? (redHitsRef.current / targetCount) * 100 : 100;
      
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

    const newPos = randomCell(cfg.gridSize, dotPosition);
    setDotPosition(newPos);

    const timer = setTimeout(() => {
      setMoveIndex((prev) => prev + 1);
    }, cfg.moveIntervalMs);

    return () => clearTimeout(timer);
  }, [moveIndex, isRunning, levelIndex]);

  // ── Primary task: tap any cell to confirm tracking ────────────────────────
  const handleCellClick = useCallback((cellIdx: number) => {
    if (cellIdx !== dotPosition) return;
    primaryClicksRef.current.add(moveIndex);
  }, [dotPosition, moveIndex]);

  // ── Secondary task: press RESPOND on red ─────────────────────────────────
  const handleRespond = useCallback(() => {
    warmUp();
    if (!isRunning) return;
    const active = activeStimulusRef.current;
    if (!active || active.hasResponded) return;

    const now = performance.now();
    const elapsed = now - active.timestamp;

    active.hasResponded = true;

    if (active.isTarget && elapsed <= responseWindowMs) {
      redHitsRef.current += 1;
      reactionTimesRef.current.push(elapsed);
      setFlashFeedback("hit");
      setTimeout(() => setFlashFeedback(null), 300);
    } else {
      falseAlarmsRef.current += 1;
    }
  }, [isRunning, responseWindowMs]);

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
        <p className="text-xs text-on-surface-variant font-semibold px-4">
          {cfg?.targetDescription}
        </p>
        <p className="text-[10px] text-on-surface-variant/70 font-medium">
          Track the dot by clicking it on the grid.
        </p>
      </div>

      {/* Grid */}
      {!hasStartedLevel ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center mx-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-brand-primary" />
            </div>
            <button
              onClick={() => {
                warmUp();
                setHasStartedLevel(true);
                setIsRunning(true);
                levelStartTimeRef.current = Date.now();
              }}
              type="button"
              className="px-6 h-12 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-primary/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Start {isPractice ? "Practice" : `Level ${cfg?.level ?? 1}`}
            </button>
          </div>
        </div>
      ) : !isRunning && moveIndex === 0 ? (
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
                  ? `bg-brand-primary ring-2 ring-brand-primary/40 shadow-md scale-105`
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
              : "bg-brand-secondary hover:bg-brand-secondary/90 text-white"
          }`}
        >
          {flashFeedback === "hit" ? "✓ HIT!" : flashFeedback === "miss" ? "✗ MISSED!" : "RESPOND TO AUDIO (SPACE)"}
        </button>

        <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
          <span>Move: {Math.min(moveIndex, cfg?.totalMoves ?? 0)}/{cfg?.totalMoves}</span>
          {!isPractice && (
            <div className="flex gap-3">
              <span>Hits: {redHitsRef.current}</span>
              <span>Misses: {redMissesRef.current}</span>
              <span>False Alarms: {falseAlarmsRef.current}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
