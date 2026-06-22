/**
 * patient-portal.service.ts
 *
 * All endpoints used by the patient portal after OTP login.
 * These call public backend routes that accept patient_id only (no doctor JWT).
 */

import { BASE_URL } from "@/services/http";

export interface PatientPortalProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  status: string;
  medical_id: string;
  doctor_id: string;
  doctor_name: string;
  assessment_token_used: boolean;
  assessment_token_expires_at: string | null;
  last_assessment_date: string | null;
  raw_assessment_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientPortalReport {
  id: string;
  report_id: string;             // e.g. "CAP-2026-AB12"
  patient_id: string;
  doctor_id: string;
  session_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  patient_phone: string;
  clinician_name: string;
  total_score: number;
  score_status: string;          // "Good" | "Moderate" | "Poor"
  score_attention: number | null;
  score_memory: number | null;
  score_reasoning: number | null;
  score_coordination: number | null;
  score_perception: number | null;
  phq9_score: number | null;
  gad7_score: number | null;
  pss10_score: number | null;
  recommendations: string[];
  language: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

/** Fetch the logged-in patient's own profile (created by doctor). */
export async function getPatientPortalProfile(
  patientId: string
): Promise<PatientPortalProfile | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/patient/${patientId}/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Fetch all reports belonging to the logged-in patient. */
export async function getPatientPortalReports(
  patientId: string
): Promise<PatientPortalReport[]> {
  try {
    const res = await fetch(`${BASE_URL}/auth/patient/${patientId}/reports`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
