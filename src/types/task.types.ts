export type TaskId =
  | "cpt"
  | "go-no-go"
  | "n-back"
  | "tower-puzzle"
  | "shape-match"
  | "word-recall"
  | "divided-attention"
  | "updating";

export interface TaskResponse {
  taskId: TaskId;
  accuracy: number;            // percentage (0-100), weighted average across levels
  reactionTime: number;        // ms (weighted average)
  missedResponses: number;     // total omissions across all levels
  correctResponses: number;    // total correct across all levels
  commissionErrors: number;    // total commission errors across all levels
  completionTime: number;      // total time in seconds (all levels)
  rawMetrics?: RawMetrics;     // clinical detail, level breakdowns, domain-specific scores
}

/** Per-level performance record stored inside rawMetrics.levels[] */
export interface LevelResult {
  level: 1 | 2 | 3;
  accuracy: number;
  reactionTime: number;
  correctResponses: number;
  missedResponses: number;
  commissionErrors: number;
  completionTime: number;
}

/** Extended clinical metrics stored inside rawMetrics */
export interface RawMetrics {
  difficultyLevel: 1 | 2 | 3;         // highest level reached
  levels: LevelResult[];               // per-level breakdown

  // CPT-specific
  vigilanceDrop?: number;              // last25pct accuracy - first25pct accuracy (negative = worse)

  // Go/No-Go-specific
  inhibitoryControlIndex?: number;     // correctNoGo / (correctNoGo + commissions)

  // N-Back / Updating-specific
  nBackLevel?: 1 | 2 | 3;             // the N value at final level
  updatingEfficiency?: number;         // correct / (correct + false alarms + misses)

  // Tower Puzzle-specific
  efficiencyScore?: number;            // optimalMoves / actualMoves (capped 0-1)
  planningTimeMs?: number;             // ms to first move
  optimalMoves?: number;

  // Word Recall-specific
  retentionScore?: number;             // delayedRecall / immediateRecall
  intrusionErrors?: number;            // words recalled that were never shown
  immediateRecall?: number;            // % recalled immediately
  delayedRecall?: number;              // % recalled after distractor phase

  // Divided Attention-specific
  primaryAccuracy?: number;
  secondaryAccuracy?: number;
  interferenceScore?: number;          // primaryAccuracy - dualTaskPrimaryAccuracy
}
