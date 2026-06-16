"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useReport } from "@/hooks/useReport";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import PatientBottomNav from "@/components/patient/PatientBottomNav";
import { FileText, Eye, Lock } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation } from "@/lib/translations";

function PatientReportsPage() {
  const [mounted, setMounted] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { reports, fetchReports } = useReport();
  const { language } = useAssessmentStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (mounted) {
      fetchReports();
    }
  }, [mounted, fetchReports]);

  const langCode = language || "en";

  if (!mounted || isLoading || !isAuthenticated) {
    return <LoadingScreen message="Fetching wellness logs..." />;
  }

  // Filter reports only shared with this patient (Sunita Mehta)
  const patientReports = reports.filter((r) => r.patientId === user?.id || r.patientId === "pat-sunita-mehta");

  return (
    <>
      <div className="max-w-md mx-auto px-6 py-6 space-y-6 animate-fadeIn pb-24">
        
        {/* Header */}
        <div>
          <h2 className="text-xl font-extrabold text-on-surface">
            {getTranslation(langCode, "yourReports")}
          </h2>
          <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
            {getTranslation(langCode, "reportsSub")}
          </p>
        </div>

        {/* Reports List */}
        {patientReports.length > 0 ? (
          <div className="space-y-3">
            {patientReports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-surface-card rounded-2xl border border-border-default shadow-card flex justify-between items-center group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-on-surface leading-tight">
                      Assessment Report
                    </h4>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">
                      ID: {report.reportId} · {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-extrabold text-brand-secondary font-mono">
                    {report.totalScore}%
                  </span>
                  
                  <button
                    onClick={() => router.push(`/assessment/${report.patientId}/results?reportId=${report.id}`)}
                    className="p-2 rounded-xl border border-border-default text-on-surface-variant bg-surface-muted/30 hover:bg-surface-muted hover:text-on-surface transition-colors active:scale-95"
                    title="Open report"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-border-default bg-surface-card rounded-2xl shadow-sm flex flex-col justify-center items-center">
            <Lock className="h-8 w-8 text-on-surface-variant/40 mb-2" />
            <p className="text-xs text-on-surface-variant font-medium">
              {getTranslation(langCode, "noReports")}
            </p>
          </div>
        )}
      </div>
      <PatientBottomNav />
    </>
  );
}

export default withErrorBoundary(PatientReportsPage);
