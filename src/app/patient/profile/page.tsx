"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Activity,
  HelpCircle,
  Lock
} from "lucide-react";
import { toastSuccess } from "@/lib/toast";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation } from "@/lib/translations";
import {
  getPatientPortalProfile,
  PatientPortalProfile,
} from "@/services/api/patient-portal.service";

function PatientProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isPatientAuthed, setIsPatientAuthed] = useState<boolean | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [profile, setProfile] = useState<PatientPortalProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
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
    setProfileLoading(true);
    getPatientPortalProfile(patientId).then((data) => {
      setProfile(data);
      setProfileLoading(false);
    });
  }, [patientId]);

  const handleLogout = () => {
    // Clear all patient session data
    localStorage.removeItem("cap_patient_id");
    localStorage.removeItem("cap_patient_name");
    localStorage.removeItem("cap_role");
    document.cookie = "cap_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "cap_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    toastSuccess("Logged Out", "Patient session closed securely.");
    router.replace("/patient-login");
  };

  const langCode = language || "en";

  if (!mounted || isPatientAuthed === null) {
    return <LoadingScreen message="Loading profile workspace..." />;
  }
  if (!isPatientAuthed) {
    return <LoadingScreen message="Redirecting..." />;
  }
  if (profileLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  return (
    <>
      <div className="max-w-md mx-auto px-6 py-6 space-y-6 animate-fadeIn pb-24">
        
        {/* Header */}
        <div>
          <h2 className="text-xl font-extrabold text-on-surface">
            {getTranslation(langCode, "yourProfile")}
          </h2>
          <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
            {getTranslation(langCode, "profileSub")}
          </p>
        </div>

        {/* Patient Profile Card */}
        {profile ? (
          <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-card space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xl border-2 border-brand-primary/20">
                {profile.name.split(" ").pop()?.[0] || "P"}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-on-surface leading-tight">
                  {profile.name}
                </h3>
                <p className="text-[9px] font-extrabold text-brand-secondary border border-brand-secondary/20 bg-brand-secondary/5 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider">
                  ID: {profile.medical_id}
                </p>
              </div>
            </div>

            <div className="h-px bg-border-default w-full"></div>

            {/* Demographics details */}
            <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
                <div className="flex justify-between w-full">
                  <span>{getTranslation(langCode, "ageGender")}</span>
                  <span className="text-on-surface font-bold">
                    {profile.age} {getTranslation(langCode, "years")} / {profile.gender}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
                <div className="flex justify-between w-full">
                  <span>{getTranslation(langCode, "phoneNumber")}</span>
                  <span className="text-on-surface font-bold">{profile.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
                <div className="flex justify-between w-full truncate min-w-0">
                  <span>{getTranslation(langCode, "emailAddress")}</span>
                  <span className="text-on-surface font-bold truncate ml-4">{profile.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
                <div className="flex justify-between w-full">
                  <span>{getTranslation(langCode, "status")}</span>
                  <span className="text-on-surface font-bold capitalize">{profile.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
                <div className="flex justify-between w-full">
                  <span>{getTranslation(langCode, "assignedClinician")}</span>
                  <span className="text-on-surface font-bold">{profile.doctor_name}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-border-default bg-surface-card rounded-2xl">
            <p className="text-xs text-on-surface-variant">Profile unavailable. Please try again.</p>
          </div>
        )}

        {/* Support Card (WhatsApp CTA) */}
        <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-brand-secondary/10 text-brand-secondary rounded-xl shrink-0">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">{getTranslation(langCode, "needHelp")}</h4>
              <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed mt-0.5">
                {getTranslation(langCode, "helpDesc")}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hi%20CogHealth%20Support%2C%20I%20have%20a%20question%20about%20my%20cognitive%20assessment."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md shadow-emerald-500/10 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <img
              src="/icons/whatsapp-app-round-icon-popular-messenger-social-media-logo_277909-873.avif"
              alt="WhatsApp"
              className="h-5 w-5 object-contain rounded-full shrink-0"
            />
            <span>{getTranslation(langCode, "whatsappCTA")}</span>
          </a>
        </div>

        {/* Security & Logout Actions */}
        <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex gap-3 items-center text-status-error/90">
            <Lock className="h-4.5 w-4.5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">{getTranslation(langCode, "securityControls")}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 border border-status-error/20 bg-status-error/5 hover:bg-status-error/10 text-status-error rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>{getTranslation(langCode, "secureLogout")}</span>
          </button>
        </div>

      </div>
    </>
  );
}

export default withErrorBoundary(PatientProfilePage);
