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
  level: number;
  gridSize: number;       // NxN
  moveIntervalMs: number; // how often dot moves
  totalMoves: number;
  auditoryIntervalMs: number; // how often audio speaks
  label: string;
  targetDescription: string;
  hasVisual: boolean;     // whether visual tracking task is active
  hasAuditory: boolean;   // whether auditory respond task is active
  hasDistractors?: boolean;
}

const LEVEL_CONFIGS: DALevelConfig[] = [
  { 
    level: 1, 
    gridSize: 4, 
    moveIntervalMs: 1200, 
    totalMoves: 50, 
    auditoryIntervalMs: 2400,
    label: "Block 1 of 5 (Visual Baseline)", 
    targetDescription: "Track the moving dot by clicking it on the grid. No sound will play in this block.",
    hasVisual: true,
    hasAuditory: false
  },
  { 
    level: 2, 
    gridSize: 4, 
    moveIntervalMs: 1200, 
    totalMoves: 30, // controlled by auditory intervals
    auditoryIntervalMs: 2000, 
    label: "Block 2 of 5 (Auditory Baseline)", 
    targetDescription: "Listen to the audio. Press RESPOND when you hear the number 7. The grid is inactive.",
    hasVisual: false,
    hasAuditory: true
  },
  { 
    level: 3, 
    gridSize: 4, 
    moveIntervalMs: 1200, 
    totalMoves: 50, 
    auditoryIntervalMs: 2400, 
    label: "Block 3 of 5 (Divided Attention)", 
    targetDescription: "Dual Task: Track the moving dot AND press RESPOND when you hear the number 7.",
    hasVisual: true,
    hasAuditory: true
  },
  { 
    level: 4, 
    gridSize: 5, 
    moveIntervalMs: 1000, 
    totalMoves: 60, 
    auditoryIntervalMs: 2000, 
    label: "Block 4 of 5 (Increased Load)", 
    targetDescription: "Higher Speed: Track the moving dot AND press RESPOND when you hear the letter X.",
    hasVisual: true,
    hasAuditory: true
  },
  { 
    level: 5, 
    gridSize: 5, 
    moveIntervalMs: 800, 
    totalMoves: 75, 
    auditoryIntervalMs: 2000, 
    label: "Block 5 of 5 (Distractors Added)", 
    targetDescription: "1-Back & Distractors: Track the dot AND press RESPOND when you hear the same number twice in a row.",
    hasVisual: true,
    hasAuditory: true,
    hasDistractors: true
  }
];

const PRACTICE_CONFIG: DALevelConfig = {
  level: 1, 
  gridSize: 4, 
  moveIntervalMs: 1200, 
  totalMoves: 10, 
  auditoryIntervalMs: 2400, 
  label: "Practice Trial (Divided)", 
  targetDescription: "Practice Dual Task: Track the moving dot AND press RESPOND when you hear the number 7.",
  hasVisual: true,
  hasAuditory: true
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

function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.round(Math.sqrt(variance));
}

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
  if (!cfg.hasAuditory) return [];
  const count = Math.ceil((cfg.totalMoves * cfg.moveIntervalMs) / cfg.auditoryIntervalMs);
  const schedule: SpokenCue[] = [];

  // Block 1, 2, 3 have target "7" (level 1 in config is Visual baseline, level 2 is Auditory baseline, level 3 is divided attention)
  if (cfg.level === 1 || cfg.level === 2 || cfg.level === 3) {
    const targetFreq = cfg.totalMoves === 10 ? 2 : Math.max(2, Math.floor(count * 0.25));
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
  } else if (cfg.level === 4) {
    // Block 4: Target "X"
    const targetFreq = Math.max(2, Math.floor(count * 0.25));
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
    // Block 5: 1-Back matching
    const matchFreq = Math.max(2, Math.floor(count * 0.25));
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

  const [levelIndex,      setLevelIndex]      = useState(0);
  const [dotPosition,     setDotPosition]     = useState(0);
  const [decoyPositions,  setDecoyPositions]  = useState<number[]>([]);
  const [moveIndex,       setMoveIndex]       = useState(0);
  const [levelBanner,     setLevelBanner]     = useState<string | null>(null);
  const [flashFeedback,   setFlashFeedback]   = useState<"hit" | "miss" | null>(null);
  const [isRunning,       setIsRunning]       = useState(false);
  const [hasStartedLevel, setHasStartedLevel]  = useState(false);
  const [isDotClicked,    setIsDotClicked]    = useState(false);

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
  const allReactionTimesRef     = useRef<number[]>([]);
  
  // Baselines for dual-task cost
  const block1VisualAccRef      = useRef<number | null>(null);
  const block2AuditoryAccRef    = useRef<number | null>(null);
  const block3VisualAccRef      = useRef<number | null>(null);
  const block3AuditoryAccRef    = useRef<number | null>(null);

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
    setIsDotClicked(false);
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
      
      let primaryAcc = 0;
      let secondaryAcc = 0;
      let dualAcc = 0;

      if (cfg.hasVisual) {
        primaryAcc = cfg.totalMoves > 0 ? (primaryCorrect / cfg.totalMoves) * 100 : 0;
        totalPrimaryAcc.current.push(primaryAcc);
      }
      if (cfg.hasAuditory) {
        secondaryAcc = targetCount > 0 ? (redHitsRef.current / targetCount) * 100 : 100;
        totalSecondaryAcc.current.push(secondaryAcc);
      }

      if (cfg.hasVisual && cfg.hasAuditory) {
        dualAcc = (primaryAcc + secondaryAcc) / 2;
      } else if (cfg.hasVisual) {
        dualAcc = primaryAcc;
      } else {
        dualAcc = secondaryAcc;
      }

      // Save baselines
      if (cfg.level === 1) {
        block1VisualAccRef.current = primaryAcc;
      } else if (cfg.level === 2) {
        block2AuditoryAccRef.current = secondaryAcc;
      } else if (cfg.level === 3) {
        block3VisualAccRef.current = primaryAcc;
        block3AuditoryAccRef.current = secondaryAcc;
      }

      const avgRT = reactionTimesRef.current.length > 0
        ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
        : 0;

      const result: LevelResult = {
        level: cfg.level,
        accuracy: Math.round(dualAcc),
        reactionTime: Math.round(avgRT),
        correctResponses: (cfg.hasAuditory ? redHitsRef.current : 0) + (cfg.hasVisual ? primaryCorrect : 0),
        missedResponses: cfg.hasAuditory ? redMissesRef.current : 0,
        commissionErrors: cfg.hasAuditory ? falseAlarmsRef.current : 0,
        completionTime: Math.round((Date.now() - levelStartTimeRef.current) / 1000),
      };
      levelResults.current.push(result);

      const nextIndex = levelIndex + 1;
      if (nextIndex < configs.length) {
        setLevelBanner(`Block ${cfg.level} complete — next: Block ${cfg.level + 1}`);
        setTimeout(() => {
          setLevelBanner(null);
          setIsRunning(false);
          setLevelIndex(nextIndex);
        }, 1500);
      } else {
        const agg = buildAggregates(levelResults.current);
        const avgPrimary = totalPrimaryAcc.current.length > 0
          ? totalPrimaryAcc.current.reduce((a, b) => a + b, 0) / totalPrimaryAcc.current.length
          : 0;
        const avgSecondary = totalSecondaryAcc.current.length > 0
          ? totalSecondaryAcc.current.reduce((a, b) => a + b, 0) / totalSecondaryAcc.current.length
          : 0;

        // Compute Dual-Task Costs: Cost (%) = (Dual - Single) / Single * 100
        const visualBaseline = block1VisualAccRef.current ?? 100;
        const auditoryBaseline = block2AuditoryAccRef.current ?? 100;
        const dualVisual = block3VisualAccRef.current ?? 100;
        const dualAuditory = block3AuditoryAccRef.current ?? 100;

        const visualCost = ((dualVisual - visualBaseline) / (visualBaseline || 1)) * 100;
        const auditoryCost = ((dualAuditory - auditoryBaseline) / (auditoryBaseline || 1)) * 100;
        const interferenceScore = Math.max(0, Math.round(visualBaseline - dualVisual));

        const rawMetrics: RawMetrics = {
          difficultyLevel: 5,
          levels: levelResults.current,
          primaryAccuracy:   Math.round(avgPrimary),
          secondaryAccuracy: Math.round(avgSecondary),
          interferenceScore,
          dualTaskCostVisual: Math.round(visualCost),
          dualTaskCostAuditory: Math.round(auditoryCost),
          rtVariability: calculateStandardDeviation(allReactionTimesRef.current),
        };
        onComplete({ ...agg, rawMetrics });
      }
      return;
    }

    const newPos = randomCell(cfg.gridSize, dotPosition);
    setDotPosition(newPos);
    setIsDotClicked(false);

    // Generate decoys if distractors are active
    if (cfg.hasDistractors) {
      const decoys: number[] = [];
      while (decoys.length < 2) {
        const decoy = Math.floor(Math.random() * cfg.gridSize * cfg.gridSize);
        if (decoy !== newPos && !decoys.includes(decoy)) {
          decoys.push(decoy);
        }
      }
      setDecoyPositions(decoys);
    } else {
      setDecoyPositions([]);
    }

    const timer = setTimeout(() => {
      setMoveIndex((prev) => prev + 1);
    }, cfg.moveIntervalMs);

    return () => clearTimeout(timer);
  }, [moveIndex, isRunning, levelIndex]);

  // ── Primary task: tap any cell to confirm tracking ────────────────────────
  const handleCellClick = useCallback((cellIdx: number) => {
    if (!currentConfig?.hasVisual) return;
    if (cellIdx !== dotPosition) return;
    if (primaryClicksRef.current.has(moveIndex)) return; // already clicked for this move

    primaryClicksRef.current.add(moveIndex);
    setIsDotClicked(true);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(45);
    }
  }, [dotPosition, moveIndex, currentConfig]);

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
  const showDot = cfg?.hasVisual ?? false;

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-4 gap-4">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            {isPractice ? "Practice Trial" : `${cfg?.label}`}
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
          {showDot ? "Track the dot by clicking it on the grid." : "Listen to the spoken audio cue and respond."}
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
              Start {isPractice ? "Practice" : `Block ${cfg?.level ?? 1}`}
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
              className={`h-10 w-full rounded-lg border transition-all flex items-center justify-center ${
                showDot && i === dotPosition
                  ? isDotClicked
                    ? `bg-score-good ring-2 ring-score-good/30 scale-95 opacity-90 border-score-good`
                    : `bg-brand-primary ring-2 ring-brand-primary/40 shadow-md scale-105 border-brand-primary`
                  : showDot && cfg?.hasDistractors && decoyPositions.includes(i)
                  ? `bg-brand-primary/25 border-brand-primary/30 animate-pulse`
                  : "bg-surface-page border-border-default hover:bg-surface-muted/50"
              }`}
            >
              {showDot && i === dotPosition && isDotClicked && (
                <svg className="w-5 h-5 text-white scale-100 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Secondary task button / stats */}
      {cfg?.hasAuditory ? (
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
      ) : (
        <div className="w-full max-w-xs space-y-3 shrink-0">
          <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-semibold px-1">
            <span>Move: {Math.min(moveIndex, cfg?.totalMoves ?? 0)}/{cfg?.totalMoves}</span>
          </div>
        </div>
      )}
    </div>
  );
}
