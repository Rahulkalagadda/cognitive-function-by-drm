import { useReportStore } from "@/stores/report.store";

export function useReport() {
  const {
    reports,
    selectedReport,
    isLoading,
    error,
    fetchReports,
    fetchReportById
  } = useReportStore();

  return {
    reports,
    selectedReport,
    isLoading,
    error,
    fetchReports,
    fetchReportById
  };
}
