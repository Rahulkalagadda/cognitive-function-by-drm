import { create } from "zustand";
import { AssessmentReport } from "@/types/report.types";
import { getReports, getReportById } from "@/services/api/reports.service";

interface ReportState {
  reports: AssessmentReport[];
  selectedReport: AssessmentReport | null;
  isLoading: boolean;
  error: string | null;
  fetchReports: () => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  selectedReport: null,
  isLoading: false,
  error: null,

  fetchReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getReports();
      set({ reports: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch reports", isLoading: false });
    }
  },

  fetchReportById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const report = await getReportById(id);
      set({ selectedReport: report || null, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch report", isLoading: false });
    }
  }
}));
