"use client";

import React, { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { usePatient } from "@/hooks/usePatient";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import PatientBottomNav from "@/components/patient/PatientBottomNav";
import { Brain, Calendar, Play, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation } from "@/lib/translations";

function PatientDashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { patients, fetchPatients } = usePatient();
  const { language } = useAssessmentStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect if not authorized
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (mounted) {
      fetchPatients();
    }
  }, [mounted, fetchPatients]);

  const langCode = language || "en";

  if (!mounted || isLoading || !isAuthenticated) {
    return <LoadingScreen message="Loading patient portal..." />;
  }

  // Find active patient details matching the logged in patient (Sunita Mehta)
  const patientRecord = patients.find(p => p.id === user?.id) || patients[0];

  return (
    <>
      <div className="max-w-md mx-auto px-6 py-6 space-y-6 animate-fadeIn pb-24">
        
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-extrabold text-on-surface">
            {getTranslation(langCode, "dashboardTitle")}, {user?.name || "Sunita Mehta"}
          </h2>
          <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
            {getTranslation(langCode, "patientPortalSub")}
          </p>
        </div>

        {/* Active Assessment callout */}
        {patientRecord && (
          <div className="p-5 bg-brand-primary/5 rounded-2xl border-2 border-brand-primary/10 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">{getTranslation(langCode, "scheduledBattery")}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                  {getTranslation(langCode, "assignedBy")}: {patientRecord.doctorName}
                </p>
              </div>
            </div>
            
            <div className="h-px bg-border-default w-full"></div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-on-surface-variant uppercase tracking-wider">{getTranslation(langCode, "status")}:</span>
              <StatusBadge status={patientRecord.status} />
            </div>

            <button
              onClick={() => router.push(`/assessment/${patientRecord.assessmentToken}`)}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-md shadow-brand-primary/20 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{getTranslation(langCode, "launchAssessment")}</span>
            </button>
          </div>
        )}

        {/* Security Info Card */}
        <div className="p-4 bg-surface-card rounded-2xl border border-border-default shadow-card flex gap-3 items-start">
          <ShieldAlert className="h-5 w-5 text-status-info shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-on-surface">{getTranslation(langCode, "secureClinicalData")}</p>
            <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed mt-0.5">
              {getTranslation(langCode, "clinicalDataDesc")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default withErrorBoundary(PatientDashboardPage);
