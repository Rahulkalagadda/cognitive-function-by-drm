import { AssessmentReport } from "@/types/report.types";
import { httpGet, httpGetPublic } from "../http";

function mapReportResponse(p: any): AssessmentReport {
  return {
    id: p.id,
    reportId: p.report_id,
    assessmentId: p.session_id,
    patientId: p.patient_id,
    patientName: p.patient_name,
    patientAge: p.patient_age,
    patientGender: p.patient_gender,
    patientPhone: p.patient_phone,
    clinicianName: p.clinician_name,
    totalScore: p.total_score,
    scoreStatus: p.score_status,
    domainScores: {
      Attention: p.score_attention ?? 0,
      Memory: p.score_memory ?? 0,
      Reasoning: p.score_reasoning ?? 0,
      Coordination: p.score_coordination ?? 0,
      Perception: p.score_perception ?? 0,
    },
    recommendations: p.recommendations || [],
    systemVersion: p.system_version || "2.5.0-LTS",
    clinicalMetrics: p.clinical_metrics || {},
    phq9Score: p.phq9_score,
    gad7Score: p.gad7_score,
    pss10Score: p.pss10_score,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
}

export async function getReports(): Promise<AssessmentReport[]> {
  const reports = await httpGet<any[]>("/reports/");
  return reports.map(mapReportResponse);
}

export async function getReportById(id: string): Promise<AssessmentReport | undefined> {
  try {
    let url = `/reports/${id}`;
    const params: string[] = [];

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const patientId = localStorage.getItem("cap_patient_id");
      const role = localStorage.getItem("cap_role");

      if (token) {
        params.push(`token=${encodeURIComponent(token)}`);
      } else if (patientId && role === "patient") {
        // Patient portal access: no URL token, use patient_id instead
        params.push(`patient_id=${encodeURIComponent(patientId)}`);
      }
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    // Always use public fetch for patient contexts (no Authorization header)
    const role = typeof window !== "undefined" ? localStorage.getItem("cap_role") : null;
    const hasPatientSession = role === "patient";
    const report = hasPatientSession
      ? await httpGetPublic<any>(url)
      : await httpGet<any>(url);
    return mapReportResponse(report);
  } catch (e) {
    return undefined;
  }
}

