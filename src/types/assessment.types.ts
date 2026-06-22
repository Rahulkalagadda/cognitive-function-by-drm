import { BaseEntity } from "./common.types";

export type CognitiveDomain = 'Attention' | 'Memory' | 'Reasoning' | 'Coordination' | 'Perception';

export interface CognitiveTaskConfig {
  words?: string[];
  puzzleBlocks?: number[];
  targetPattern?: string;
  clickIntervalMs?: number;
}

export interface AssessmentStep {
  stepIndex: number;
  domain: CognitiveDomain;
  taskType: 'word-recall' | 'reasoning-puzzle' | 'coordination-test' | 'perception-test' | 'n-back' | 'divided-attention' | 'updating';
  title: string;
  instructions: string;
  durationSeconds: number;
  config: CognitiveTaskConfig;
}

export interface AssessmentSession extends BaseEntity {
  token: string;
  patientId: string;
  patientName: string;
  status: 'initialized' | 'started' | 'completed';
  currentStepIndex: number;
  steps: AssessmentStep[];
  responses: Record<number, any>; // stepIndex -> response data
  timeRemainingSeconds: number;
}
