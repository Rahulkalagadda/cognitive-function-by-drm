import { BaseEntity } from "./common.types";

export type PatientStatus = 'Stable' | 'Critical' | 'Scheduled' | 'Testing';

export interface PatientScoreTrend {
  date: string;
  score: number;
}

export interface Patient extends BaseEntity {
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  status: PatientStatus;
  medicalId: string;
  assessmentToken: string;
  doctorName: string;
  lastAssessmentDate?: string;
  scoresHistory?: PatientScoreTrend[];
}

export interface CreatePatientInput {
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  status: PatientStatus;
  assessmentTemplateId?: string;
}
