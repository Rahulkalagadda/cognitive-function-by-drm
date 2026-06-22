"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { FileText, Eye, Lock } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation } from "@/lib/translations";
import {
  getPatientPortalReports,
  PatientPortalReport,
} from "@/services/api/patient-portal.service";

function PatientReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [isPatientAuthed, setIsPatientAuthed] = useState<boolean | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [reports, setReports] = useState<PatientPortalReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const { language } = useAssessmentStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedId = localStorage.getItem("cap_patient_id");
    const storedRole = localStorage.getItem("cap_role");
    if (storedId && storedRole === "patient") {
      setPatientId(storedId);
      setIsPatientAuthed(true);
    } else {
      setIsPatientAuthed(false);
    }
  }, []);

  useEffect(() => {
    if (isPatientAuthed === false) {
      router.replace("/patient-login");
    }
  }, [isPatientAuthed, router]);

  useEffect(() => {
    if (!patientId) return;
    setReportsLoading(true);
    getPatientPortalReports(patientId).then((data) => {
      setReports(data);
      setReportsLoading(false);
    });
  }, [patientId]);

  const langCode = language || "en";

  if (!mounted || isPatientAuthed === null) {
    return <LoadingScreen message="Fetching wellness logs..." />;
  }
  if (!isPatientAuthed) {
    return <LoadingScreen message="Redirecting..." />;
  }
  if (reportsLoading) {
    return <LoadingScreen message="Loading your reports..." />;
  }

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-600";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

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
        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-surface-card rounded-2xl border border-border-default shadow-card flex justify-between items-center group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-on-surface leading-tight">
                      Assessment Report
                    </h4>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5 truncate">
                      {report.report_id} · {new Date(report.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-[9px] text-on-surface-variant/70 font-semibold mt-0.5">
                      By {report.clinician_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div className="text-right">
                    <span className={`text-lg font-extrabold font-mono ${scoreColor(report.total_score)}`}>
                      {report.total_score}
                    </span>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">
                      {report.score_status}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/results?reportId=${report.id}`)
                    }
                    className="p-2 rounded-xl border border-border-default text-on-surface-variant bg-surface-muted/30 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/20 transition-colors active:scale-95"
                    title="Open report"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-border-default bg-surface-card rounded-2xl shadow-sm flex flex-col justify-center items-center gap-3">
            <Lock className="h-8 w-8 text-on-surface-variant/40" />
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              {getTranslation(langCode, "noReports")}
            </p>
            <p className="text-[10px] text-on-surface-variant/70 font-medium leading-relaxed">
              Your report will appear here after completing your assessment.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default withErrorBoundary(PatientReportsPage);
