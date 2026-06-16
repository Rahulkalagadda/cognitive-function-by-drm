import { AssessmentReport } from "@/types/report.types";

export const MOCK_REPORTS: AssessmentReport[] = [
  {
    id: "rep-sunita-mehta-1",
    reportId: "CAP-2025-0312",
    assessmentId: "AX8C92",
    patientId: "pat-sunita-mehta",
    patientName: "Sunita Mehta",
    patientAge: 48,
    patientGender: "Female",
    patientPhone: "9876543210",
    clinicianName: "Dr. Priya Sharma",
    totalScore: 74,
    scoreStatus: "Above Average",
    domainScores: {
      Attention: 82,
      Memory: 68,
      Reasoning: 79,
      Coordination: 71,
      Perception: 70
    },
    recommendations: [
      "Engage in high-frequency word puzzles and strategic memory games (minimum 15 mins daily) to stimulate the temporal lobe functions.",
      "Maintain a consistent sleep hygiene schedule with 7.5 to 8 hours of restorative rest to optimize memory consolidation processes.",
      "Incorporate light physical activity, such as brisk walking or yoga, 3 times a week to improve cerebral blood flow and coordination metrics.",
      "Schedule a 6-month clinical re-assessment to monitor progress in the Reasoning and Memory domains for longitudinal comparative analysis."
    ],
    systemVersion: "2.4.1-LTS",
    createdAt: "2025-03-12T10:30:00Z",
    updatedAt: "2025-03-12T10:30:00Z"
  },
  {
    id: "rep-ravi-kumar-1",
    reportId: "CAP-2025-0305",
    assessmentId: "AX8C90",
    patientId: "pat-ravi-kumar",
    patientName: "Ravi Kumar",
    patientAge: 67,
    patientGender: "Male",
    patientPhone: "9898765432",
    clinicianName: "Dr. Priya Sharma",
    totalScore: 42,
    scoreStatus: "Below Average",
    domainScores: {
      Attention: 50,
      Memory: 38,
      Reasoning: 45,
      Coordination: 40,
      Perception: 37
    },
    recommendations: [
      "Initiate cognitive rehabilitation training focused on memory-retrieval strategies and executive functioning support.",
      "Review medications for potential cognitive side effects with the primary care physician.",
      "Install safety visual aids at home to mitigate coordinate deficits and balance risks.",
      "Schedule follow-up MRI review and cognitive checkup within 3 months."
    ],
    systemVersion: "2.4.1-LTS",
    createdAt: "2025-03-05T16:45:00Z",
    updatedAt: "2025-03-05T16:45:00Z"
  }
];

export async function fetchMockReports(): Promise<AssessmentReport[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_REPORTS];
}

export async function fetchMockReportById(id: string): Promise<AssessmentReport | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_REPORTS.find(r => r.id === id || r.reportId === id || r.patientId === id);
}

export async function createMockReportFromSession(patientId: string, patientName: string, scores: Record<string, number>): Promise<AssessmentReport> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const totalScore = Math.round(
    Object.values(scores).reduce((sum, val) => sum + val, 0) / Object.values(scores).length
  );
  
  const scoreStatus = totalScore >= 70 ? "Above Average" : totalScore >= 50 ? "Average" : "Below Average";

  const newReport: AssessmentReport = {
    id: `rep-${Math.random().toString(36).substring(2, 9)}`,
    reportId: `CAP-2025-${Math.floor(1000 + Math.random() * 9000)}`,
    assessmentId: `AX${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    patientId,
    patientName,
    patientAge: 45, // Default mock value
    patientGender: "Female",
    patientPhone: "9876543210",
    clinicianName: "Dr. Priya Sharma",
    totalScore,
    scoreStatus,
    domainScores: {
      Attention: scores.Attention || 70,
      Memory: scores.Memory || 70,
      Reasoning: scores.Reasoning || 70,
      Coordination: scores.Coordination || 70,
      Perception: scores.Perception || 70
    },
    recommendations: [
      "Maintain active mental stimulation with logical puzzles.",
      "Regular cardiovascular exercise to support brain health.",
      "Engage in structured social and visual activities."
    ],
    systemVersion: "2.4.1-LTS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  MOCK_REPORTS.push(newReport);
  return newReport;
}
