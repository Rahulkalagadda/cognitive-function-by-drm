"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { Brain, Play, ShieldAlert, Calendar, User } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation } from "@/lib/translations";
import {
  getPatientPortalProfile,
  PatientPortalProfile,
} from "@/services/api/patient-portal.service";

function PatientDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isPatientAuthed, setIsPatientAuthed] = useState<boolean | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [profile, setProfile] = useState<PatientPortalProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { language } = useAssessmentStore();
  const router = useRouter();

  // 1. Check localStorage session on mount
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

  // 2. Redirect if not authenticated
  useEffect(() => {
    if (isPatientAuthed === false) {
      router.replace("/patient-login");
    }
  }, [isPatientAuthed, router]);

  // 3. Fetch patient profile from backend using patient_id
  useEffect(() => {
    if (!patientId) return;
    setProfileLoading(true);
    getPatientPortalProfile(patientId).then((data) => {
      setProfile(data);
      // Keep patient name in sync with what the doctor set
      if (data?.name) {
        localStorage.setItem("cap_patient_name", data.name);
      }
      setProfileLoading(false);
    });
  }, [patientId]);

  const langCode = language || "en";

  if (!mounted || isPatientAuthed === null) {
    return <LoadingScreen message="Loading patient portal..." />;
  }
  if (!isPatientAuthed) {
    return <LoadingScreen message="Redirecting..." />;
  }
  if (profileLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  // Extract token from assessment link, e.g. "http://localhost:3000/assessment/<token>"
  const assessmentToken = profile?.raw_assessment_link
    ? profile.raw_assessment_link.split("/").pop() || ""
    : "";

  return (
    <div className="max-w-md mx-auto px-6 py-6 space-y-6 animate-fadeIn pb-24">

      {/* Greeting */}
      <div>
        <h2 className="text-xl font-extrabold text-on-surface">
          {getTranslation(langCode, "dashboardTitle")}, {profile?.name || "Patient"}
        </h2>
        <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
          {getTranslation(langCode, "patientPortalSub")}
        </p>
      </div>

      {profile ? (
        <>
          {/* Patient Info Card */}
          <div className="p-5 bg-surface-card rounded-2xl border border-border-default shadow-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg border-2 border-brand-primary/20 shrink-0">
                {profile.name.split(" ").pop()?.[0] || "P"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-on-surface leading-tight truncate">
                  {profile.name}
                </p>
                <p className="text-[10px] font-bold text-brand-secondary border border-brand-secondary/20 bg-brand-secondary/5 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider">
                  ID: {profile.medical_id}
                </p>
              </div>
            </div>

            <div className="h-px bg-border-default" />

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>{profile.age} yrs · {profile.gender}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {profile.last_assessment_date
                    ? new Date(profile.last_assessment_date).toLocaleDateString()
                    : "No prior assessment"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant/70 tracking-wider">
                {getTranslation(langCode, "status")}:
              </span>
              <StatusBadge status={profile.status} />
            </div>
          </div>

          {/* Active Assessment callout */}
          <div className="p-5 bg-brand-primary/5 rounded-2xl border-2 border-brand-primary/10 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">
                  {getTranslation(langCode, "scheduledBattery")}
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                  {getTranslation(langCode, "assignedBy")}: {profile.doctor_name}
                </p>
              </div>
            </div>

            <div className="h-px bg-border-default w-full" />

            {assessmentToken ? (
              <button
                onClick={() => router.push(`/assessment/${assessmentToken}`)}
                className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-md shadow-brand-primary/20 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{getTranslation(langCode, "launchAssessment")}</span>
              </button>
            ) : (
              <p className="text-[11px] text-on-surface-variant font-medium text-center py-2">
                No active assessment scheduled.
              </p>
            )}
          </div>
        </>
      ) : (
        /* Profile fetch failed */
        <div className="p-8 text-center border-2 border-dashed border-border-default bg-surface-card rounded-2xl">
          <p className="text-sm text-on-surface-variant font-medium">
            Unable to load profile. Please try again later.
          </p>
        </div>
      )}

      {/* Security Info Card */}
      <div className="p-4 bg-surface-card rounded-2xl border border-border-default shadow-card flex gap-3 items-start">
        <ShieldAlert className="h-5 w-5 text-status-info shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-on-surface">
            {getTranslation(langCode, "secureClinicalData")}
          </p>
          <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed mt-0.5">
            {getTranslation(langCode, "clinicalDataDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(PatientDashboardPage);
