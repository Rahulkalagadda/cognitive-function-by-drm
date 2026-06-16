import { AssessmentSession } from "@/types/assessment.types";
import { fetchMockSessionByToken } from "../mock/assessments.mock";

export async function getSessionByToken(token: string): Promise<AssessmentSession | null> {
  return fetchMockSessionByToken(token);
}

export async function submitAssessmentResponses(
  sessionId: string,
  responses: Record<number, any>
): Promise<{ success: boolean; generatedReportId?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Standard scores generator based on responses
  const mockScores = {
    Attention: Math.round(65 + Math.random() * 30),
    Memory: Math.round(55 + Math.random() * 35),
    Reasoning: Math.round(60 + Math.random() * 30),
    Coordination: Math.round(60 + Math.random() * 25),
    Perception: Math.round(50 + Math.random() * 40)
  };

  const { createMockReportFromSession } = await import("../mock/reports.mock");
  const report = await createMockReportFromSession("pat-sunita-mehta", "Sunita Mehta", mockScores);
  return {
    success: true,
    generatedReportId: report.id
  };
}
