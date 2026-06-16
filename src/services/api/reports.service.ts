import { AssessmentReport } from "@/types/report.types";
import { fetchMockReports, fetchMockReportById } from "../mock/reports.mock";

export async function getReports(): Promise<AssessmentReport[]> {
  return fetchMockReports();
}

export async function getReportById(id: string): Promise<AssessmentReport | undefined> {
  return fetchMockReportById(id);
}
