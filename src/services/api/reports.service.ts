import { AssessmentReport } from "@/types/report.types";
import { fetchMockReports, fetchMockReportById } from "../mock/reports.mock";
import { httpGet } from "../http";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getReports(): Promise<AssessmentReport[]> {
  if (USE_MOCK) {
    return fetchMockReports();
  }
  return httpGet<AssessmentReport[]>("/reports");
}

export async function getReportById(id: string): Promise<AssessmentReport | undefined> {
  if (USE_MOCK) {
    return fetchMockReportById(id);
  }
  try {
    return await httpGet<AssessmentReport>(`/reports/${id}`);
  } catch (e) {
    return undefined;
  }
}
