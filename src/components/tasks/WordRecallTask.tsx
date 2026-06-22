"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LevelResult, RawMetrics } from "@/types/task.types";
import { Badge } from "@/components/ui/badge";

interface WordRecallTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
  config?: {
    words?: string[];
  };
}

// ─── Level configuration ─────────────────────────────────────────────────────

interface WordLevelConfig {
  level: 1 | 2 | 3;
  words: string[];
  studySeconds: number;
  label: string;
}

const LEVEL_CONFIGS: WordLevelConfig[] = [
  {
    level: 1,
    words: ["Apple", "River", "Shadow", "Anchor", "Breeze"],
    studySeconds: 12,
    label: "5 words · 12s",
  },
  {
    level: 2,
    words: ["Apple", "River", "Cabinet", "Shadow", "Anchor", "Breeze", "Lantern", "Saddle"],
    studySeconds: 15,
    label: "8 words · 15s",
  },
  {
    level: 3,
    words: ["Apple", "River", "Cabinet", "Shadow", "Anchor", "Breeze", "Lantern", "Saddle",
            "Glacier", "Phantom", "Compass", "Velvet"],
    studySeconds: 18,
    label: "12 words · 18s",
  },
];

const PRACTICE_CONFIG: WordLevelConfig = {
  level: 1,
  words: ["Apple", "River", "Cabinet"],
  studySeconds: 10,
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

export default function WordRecallTask({ isPractice, onComplete, config }: WordRecallTaskProps) {
  const configs = isPractice ? [PRACTICE_CONFIG] : LEVEL_CONFIGS;

  const [levelIndex,    setLevelIndex]    = useState(0);
  const [phase,         setPhase]         = useState<"study" | "recall">("study");
  const [studyTimer,    setStudyTimer]    = useState(0);
  const [typedWord,     setTypedWord]     = useState("");
  const [recalledWords, setRecalledWords] = useState<string[]>([]);
  const [feedback,      setFeedback]      = useState<Record<string, "correct" | "incorrect">>({});
  const [levelBanner,   setLevelBanner]   = useState<string | null>(null);

  const startTime            = useRef(0);
  const firstWordTime        = useRef(0);
  const levelResults         = useRef<LevelResult[]>([]);
  // Clinical: track intrusion errors (total across all levels)
  const totalIntrusionErrors = useRef(0);
  // Retention: level 3 recalled / level 3 word count
  const level3RecalledRef    = useRef(0);
  // Stale-closure-safe mirror of recalledWords state
  const recalledWordsRef     = useRef<string[]>([]);

  const currentConfig = configs[levelIndex];

  // ── Reset per-level state on level change ─────────────────────────────────
  useEffect(() => {
    const cfg = configs[levelIndex];
    if (!cfg) return;
    setPhase("study");
    setStudyTimer(cfg.studySeconds);
    setRecalledWords([]);
    recalledWordsRef.current = [];      // reset ref too
    setFeedback({});
    setTypedWord("");
    firstWordTime.current = 0;
    startTime.current = 0;
  }, [levelIndex]);

  // ── Study timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "study") return;

    const interval = setInterval(() => {
      setStudyTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("recall");
          startTime.current = Date.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, levelIndex]);

  const handleAddWord = useCallback(() => {
    const word = typedWord.trim();
    if (!word) return;

    if (recalledWordsRef.current.length === 0) {
      firstWordTime.current = Date.now() - startTime.current;
    }

    if (!recalledWordsRef.current.some((w) => w.toLowerCase() === word.toLowerCase())) {
      const updated = [...recalledWordsRef.current, word];
      recalledWordsRef.current = updated;    // keep ref in sync BEFORE state update
      setRecalledWords(updated);

      if (isPractice) {
        const isCorrect = currentConfig?.words.some((w) => w.toLowerCase() === word.toLowerCase());
        setFeedback((prev) => ({ ...prev, [word]: isCorrect ? "correct" : "incorrect" }));
      }
    }
    setTypedWord("");
  }, [typedWord, isPractice, currentConfig]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWord();
    }
  };

  const handleLevelComplete = useCallback(() => {
    const cfg = currentConfig;
    if (!cfg) return;

    // Read from ref — guaranteed to include the most recently added word
    const words = recalledWordsRef.current;

    const matched = words.filter((w) =>
      cfg.words.some((target) => target.toLowerCase() === w.toLowerCase())
    );
    const intrusions = words.length - matched.length;
    totalIntrusionErrors.current += intrusions;

    if (cfg.level === 3) {
      level3RecalledRef.current = matched.length;
    }

    const omissions = cfg.words.length - matched.length;
    const acc = (matched.length / cfg.words.length) * 100;

    const result: LevelResult = {
      level: cfg.level,
      accuracy: Math.round(acc),
      reactionTime: Math.round(firstWordTime.current || 4000),
      correctResponses: matched.length,
      missedResponses: omissions,
      commissionErrors: intrusions,
      completionTime: Math.round((Date.now() - startTime.current) / 1000),
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
      const l3WordCount = LEVEL_CONFIGS[2].words.length;
      const retentionScore =
        isPractice ? undefined : level3RecalledRef.current / l3WordCount;

      const rawMetrics: RawMetrics = {
        difficultyLevel: 3,
        levels: levelResults.current,
        retentionScore: retentionScore !== undefined ? Math.round(retentionScore * 100) / 100 : undefined,
        intrusionErrors: totalIntrusionErrors.current,
        immediateRecall: Math.round(agg.accuracy),
      };

      onComplete({ ...agg, rawMetrics });
    }
  }, [currentConfig, levelIndex, configs, isPractice, onComplete]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (levelBanner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full py-6 gap-4">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-xs font-black text-brand-primary uppercase tracking-widest">{levelBanner}</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Get ready for the next word set…</p>
        </div>
      </div>
    );
  }

  const cfg = currentConfig;

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full py-4 space-y-4">
      <div className="text-center space-y-1">
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
          {phase === "study"
            ? `Memorize the ${cfg?.words.length} words. You have ${cfg?.studySeconds}s.`
            : "Type any words you remember and press Enter."}
        </p>
      </div>

      {phase === "study" ? (
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 w-full">
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
            {cfg?.words.map((word) => (
              <div
                key={word}
                className="py-2.5 border border-border-default bg-white rounded-xl text-center text-xs font-extrabold text-[#1E293B] shadow-sm select-none"
              >
                {word}
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs space-y-1">
            <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                style={{ width: `${(studyTimer / (cfg?.studySeconds ?? 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant font-semibold text-center uppercase tracking-wider">
              Recall begins in {studyTimer}s
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between w-full max-w-xs">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={typedWord}
                onChange={(e) => setTypedWord(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type word here…"
                className="flex-1 px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddWord}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-surface-page border border-border-default rounded-xl min-h-[52px]">
              {recalledWords.length === 0 ? (
                <span className="text-[10px] text-on-surface-variant/50 font-bold p-1 select-none">
                  No words yet.
                </span>
              ) : (
                recalledWords.map((word) => {
                  const state = feedback[word];
                  return (
                    <Badge
                      key={word}
                      variant="outline"
                      className={`text-[10px] font-bold px-2.5 py-1 border rounded-lg ${
                        state === "correct"
                          ? "bg-score-good/10 text-score-good border-score-good/20"
                          : state === "incorrect"
                          ? "bg-score-attention/10 text-score-attention border-score-attention/20"
                          : "bg-white border-border-default text-on-surface"
                      }`}
                    >
                      {word}
                    </Badge>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={handleLevelComplete}
            type="button"
            className="w-full h-12 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all select-none"
          >
            {levelIndex < configs.length - 1 ? `Complete Level ${cfg?.level}` : "Complete Recall Task"}
          </button>
        </div>
      )}

      <div className="w-full max-w-xs flex justify-between text-[9px] text-on-surface-variant/70 font-semibold px-1">
        <span>Phase: {phase === "study" ? "Memorize" : "Recall"}</span>
        <span>{cfg?.words.length} target words</span>
      </div>
    </div>
  );
}
