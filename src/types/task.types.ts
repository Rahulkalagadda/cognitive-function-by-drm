export type TaskId =
  | "cpt"
  | "go-no-go"
  | "n-back"
  | "tower-puzzle"
  | "shape-match"
  | "word-recall";

export interface TaskResponse {
  taskId: TaskId;
  accuracy: number;            // percentage (0-100)
  reactionTime: number;        // ms (average)
  missedResponses: number;     // number of omissions
  correctResponses: number;    // number of correct answers
  commissionErrors: number;    // number of incorrect taps/presses
  completionTime: number;      // total time in seconds
  rawMetrics?: any;            // logs, moves, or additional arrays
}
