"use client";

import React, { useEffect, useState } from "react";
import { useAssessment } from "@/hooks/useAssessment";
import { useParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import LanguageSelector from "@/components/patient/LanguageSelector";
import Logo from "@/components/shared/Logo";
import Avatar from "@/components/shared/Avatar";
import { 
  Clock, 
  Layers, 
  ShieldCheck, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Target,
  Sparkles,
  Heart,
  Eye,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { getTranslation } from "@/lib/translations";

function AssessmentOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = params;
  const { currentSession, loadSession, isLoading, error, language } = useAssessment();
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    if (token) {
      loadSession(token as string);
    }
  }, [token, loadSession]);

  if (isLoading) {
    return <LoadingScreen message={getTranslation(language || "en", "loadingTestParams")} />;
  }

  if (error || !currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-blue-50/50">
        <ErrorState
          title={getTranslation(language || "en", "sessionLoadError")}
          message={error || "Invalid assessment token. Please verify the URL or contact your clinician."}
          retryAction={() => token && loadSession(token as string)}
        />
      </div>
    );
  }

  const handleStart = () => {
    router.push(`/start?token=${token}`);
  };

  const accordionSteps = [
    {
      title: getTranslation(language || "en", "step1Title"),
      content: getTranslation(language || "en", "step1Content")
    },
    {
      title: getTranslation(language || "en", "step2Title"),
      content: getTranslation(language || "en", "step2Content")
    },
    {
      title: getTranslation(language || "en", "step3Title"),
      content: getTranslation(language || "en", "step3Content")
    }
  ];

  const domainsList = [
    { label: "Attention", icon: Target },
    { label: "Memory", icon: Brain },
    { label: "Reasoning", icon: Sparkles },
    { label: "Coordination", icon: Heart },
    { label: "Perception", icon: Eye }
  ];

  const langCode = language || "en";

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-6 px-4">
      
      {/* Welcome Card */}
      <div className="w-full bg-white rounded-2xl shadow-card p-6 sm:p-10 space-y-8 border border-border-default animate-scaleIn">
        
        {/* Patient header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Avatar 
            name={currentSession.patientName} 
            className="h-16 w-16 border-2 border-brand-primary/10"
            fallbackClassName="text-xl"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              {getTranslation(langCode, "welcome")}, {currentSession.patientName}
            </h1>
            <p className="text-xs text-on-surface-variant/80 font-bold uppercase tracking-wider mt-0.5">
              {getTranslation(langCode, "preparedBy")}
            </p>
          </div>
        </div>

        {/* Info tiles */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-surface-muted/50 rounded-xl border border-border-default shadow-sm text-center">
            <Clock className="h-5 w-5 text-brand-primary mb-1.5" />
            <span className="text-xs font-extrabold text-on-surface">25-30 min</span>
            <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{getTranslation(langCode, "duration")}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-surface-muted/50 rounded-xl border border-border-default shadow-sm text-center">
            <Layers className="h-5 w-5 text-brand-secondary mb-1.5" />
            <span className="text-xs font-extrabold text-on-surface">5 domains</span>
            <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{getTranslation(langCode, "structure")}</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-surface-muted/50 rounded-xl border border-border-default shadow-sm text-center">
            <ShieldCheck className="h-5 w-5 text-brand-accent mb-1.5" />
            <span className="text-xs font-extrabold text-on-surface">{getTranslation(langCode, "confidential")}</span>
            <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{getTranslation(langCode, "hipaaSafe")}</span>
          </div>
        </div>

        {/* Language selector */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-center">
            Preferred Language / भाषा निवडा / भाषा चुनें / భాషను ఎంచుకోండి
          </p>
          <LanguageSelector />
        </div>

        {/* How it works Accordion */}
        <div className="border border-border-default rounded-xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full flex justify-between items-center px-4 py-3 bg-surface-muted/30 hover:bg-surface-muted/50 transition-colors text-xs font-extrabold text-on-surface uppercase tracking-wider"
          >
            <span>{getTranslation(langCode, "howItWorks")}</span>
            {accordionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {accordionOpen && (
            <div className="divide-y divide-border-default bg-white px-4 py-2 animate-fadeIn">
              {accordionSteps.map((step, idx) => (
                <div key={idx} className="py-3 first:pt-1 last:pb-1 text-xs space-y-1">
                  <p className="font-extrabold text-on-surface">{step.title}</p>
                  <p className="text-on-surface-variant/80 font-medium leading-relaxed">{step.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Domain progress strip (Connectors, all empty/gray) */}
        <div className="space-y-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 text-center">
            {getTranslation(langCode, "assessmentStructureTimeline")}
          </p>
          <div className="flex items-center justify-between w-full max-w-lg mx-auto py-2">
            {domainsList.map((dom, index) => {
              const Icon = dom.icon;
              return (
                <div key={dom.label} className="flex flex-col items-center flex-1 relative">
                  {/* Circle */}
                  <div className="h-10 w-10 rounded-full flex items-center justify-center border bg-white text-on-surface-variant/40 border-border-default z-10 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Label */}
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase mt-1.5 text-on-surface-variant/60 tracking-wider text-center leading-tight max-w-[55px] sm:max-w-none break-words px-0.5 select-none">
                    {dom.label}
                  </span>

                  {/* Line Connector */}
                  {index < domainsList.length - 1 && (
                    <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-[1px] bg-border-default z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full h-14 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-lg shadow-brand-primary/25 rounded-xl text-sm font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <span>{getTranslation(langCode, "startAssessment")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

      </div>

      {/* Footer privacy note */}
      <footer className="w-full max-w-2xl text-center mt-6 text-[10px] font-bold text-on-surface-variant/60 leading-relaxed max-w-lg">
        {getTranslation(langCode, "complianceNote")}
      </footer>
    </div>
  );
}

export default withErrorBoundary(AssessmentOnboardingPage);
