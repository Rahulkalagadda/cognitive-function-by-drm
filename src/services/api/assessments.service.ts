import { AssessmentSession } from "@/types/assessment.types";
import { httpGet, httpPost, httpGetPublic, httpPostPublic } from "../http";

export async function getSessionByToken(token: string): Promise<AssessmentSession | null> {
  const devType = typeof window !== "undefined"
    ? (window.innerWidth < 768 ? "MOBILE" : "DESKTOP")
    : "DESKTOP";
  const userAgent = typeof window !== "undefined" ? navigator.userAgent : "SSR";
  
  const sessionRes = await httpPostPublic<any>("/assessment/start", {
    raw_token: token,
    language: "en",
    device_type: devType,
    user_agent: userAgent
  });

  if (!sessionRes) return null;

  const stepsRes = await httpGetPublic<any[]>(`/assessment/${sessionRes.id}/steps`);

  // patient_name is now included in the session response — no second auth call needed
  const patientName: string = sessionRes.patient_name || "Patient";

  const session: AssessmentSession = {
    id: sessionRes.id,
    token: token,
    patientId: sessionRes.patient_id,
    patientName: patientName,
    status: sessionRes.status,
    currentStepIndex: sessionRes.current_step_index,
    steps: stepsRes.map(s => ({
      stepIndex: s.step_index,
      domain: s.domain,
      taskType: s.task_id,
      title: s.title,
      instructions: s.instructions || "",
      durationSeconds: s.duration_seconds,
      config: s.config || {}
    })),
    responses: {},
    timeRemainingSeconds: sessionRes.time_remaining_seconds ?? stepsRes[sessionRes.current_step_index]?.duration_seconds ?? 30,
    createdAt: sessionRes.created_at,
    updatedAt: sessionRes.updated_at
  };

  return session;
}

export async function submitAssessmentResponses(
  sessionId: string,
  responses: Record<number, any>
): Promise<{ success: boolean; generatedReportId?: string }> {
  const sessionRes = await httpPostPublic<any>(`/assessment/${sessionId}/complete`, {});
  return {
    success: true,
    generatedReportId: sessionRes.report_id || undefined
  };
}

export async function submitStepAttempt(
  sessionId: string,
  stepIndex: number,
  attempt: {
    taskId: string;
    domain: string;
    isPractice: boolean;
    accuracy: number;
    reactionTime: number;
    correctResponses: number;
    missedResponses: number;
    commissionErrors: number;
    completionTime: number;
    rawMetrics?: any;
  }
): Promise<any> {
  const payload = {
    task_id: attempt.taskId,
    domain: attempt.domain,
    is_practice: attempt.isPractice,
    accuracy: attempt.accuracy,
    reaction_time_ms: attempt.reactionTime,
    correct_responses: attempt.correctResponses,
    missed_responses: attempt.missedResponses,
    commission_errors: attempt.commissionErrors,
    completion_time_s: attempt.completionTime,
    raw_metrics: attempt.rawMetrics || {}
  };

  return httpPostPublic<any>(`/assessment/${sessionId}/step/${stepIndex}/attempt`, payload);
}

export async function submitQuestionnaireResponse(
  sessionId: string,
  slug: string,
  language: string,
  answers: Record<string, number>,
  totalScore: number,
  itemCount: number
): Promise<any> {
  const payload = {
    slug: slug,
    language: language,
    answers: answers,
    total_score: totalScore,
    item_count: itemCount
  };

  return httpPostPublic<any>(`/assessment/${sessionId}/questionnaire`, payload);
}

