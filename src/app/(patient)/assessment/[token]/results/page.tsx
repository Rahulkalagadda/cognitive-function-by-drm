"use client";

import React, { useEffect } from "react";
import { useReport } from "@/hooks/useReport";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import ScoreGauge from "@/components/report/ScoreGauge";
import DomainScoreCard from "@/components/report/DomainScoreCard";
import { Brain, ArrowRight, Award, Download } from "lucide-react";
import { CognitiveDomain } from "@/types/assessment.types";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

function AssessmentResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");
  const { selectedReport, fetchReportById, isLoading, error } = useReport();

  useEffect(() => {
    if (reportId) {
      fetchReportById(reportId);
    }
  }, [reportId, fetchReportById]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading diagnostic results..." />;
  }

  if (error || !selectedReport) {
    return (
      <div className="p-6">
        <ErrorState
          title="Results Error"
          message={error || "Diagnostic report could not be found."}
          retryAction={() => reportId && fetchReportById(reportId)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-6 animate-fadeIn space-y-6">
      
      {/* Overview Card */}
      <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-card flex flex-col items-center text-center space-y-5">
        
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-brand-primary" />
          <h2 className="text-base font-extrabold text-on-surface">Your Score Summary</h2>
        </div>

        <ScoreGauge score={selectedReport.totalScore} status={selectedReport.scoreStatus} />

        <div className="h-px bg-border-default w-full"></div>

        {/* Domain List */}
        <div className="w-full text-left space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
            Domain-specific Breakdowns
          </h3>
          <div className="space-y-3.5">
            {(Object.keys(selectedReport.domainScores) as CognitiveDomain[]).map((dom) => (
              <DomainScoreCard
                key={dom}
                domain={dom}
                score={selectedReport.domainScores[dom]}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-border-default w-full"></div>

        {/* Clinician note */}
        <div className="p-3.5 bg-brand-secondary/5 rounded-xl border border-brand-secondary/15 text-left text-xs font-semibold text-on-surface-variant leading-relaxed">
          <div className="flex gap-1.5 items-center text-brand-secondary mb-1.5">
            <Brain className="h-4 w-4 shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wide">Clinician Note</span>
          </div>
          Your results have been synced back to Dr. Priya Sharma. You may close this window or return to your patient dashboard below.
        </div>

        {/* Actions layout (hidden during printing) */}
        <div className="flex flex-col gap-2 w-full no-print">
          <button
            onClick={handlePrint}
            className="w-full py-3 bg-brand-secondary hover:bg-brand-secondary/95 text-white shadow-md shadow-brand-secondary/20 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Report</span>
          </button>
          
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-md shadow-brand-primary/20 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Go to Patient Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(AssessmentResultsPage);
