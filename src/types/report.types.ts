import { BaseEntity } from "./common.types";
import { CognitiveDomain } from "./assessment.types";

export interface DomainScore {
  domain: CognitiveDomain;
  score: number; // percentage
  status: 'Above Average' | 'Average' | 'Below Average';
}

export interface AssessmentReport extends BaseEntity {
  reportId: string;
  assessmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  clinicianName: string;
  totalScore: number; // 0 - 100
  scoreStatus: 'Above Average' | 'Average' | 'Below Average';
  domainScores: Record<CognitiveDomain, number>;
  recommendations: string[];
  systemVersion: string;
}
