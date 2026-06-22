"use client";

import React, { useEffect } from "react";
import { useAssessment } from "@/hooks/useAssessment";
import { useAssessmentStore } from "@/stores/assessment.store";
import { useTimer } from "@/hooks/useTimer";
import TimerDisplay from "./TimerDisplay";
import DomainTaskArea from "./DomainTaskArea";
import LoadingScreen from "../shared/LoadingScreen";
import ErrorState from "../shared/ErrorState";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import ErrorBoundary from "../shared/ErrorBoundary";

interface AssessmentEngineWrapperProps {
  token: string;
  domainIndex: number;
}

function AssessmentEngineWrapperInternal({ token, domainIndex }: AssessmentEngineWrapperProps) {
  const router = useRouter();
  const {
    currentSession,
    isLoading,
    error,
    loadSession,
    submitResponse,
    submitSession
  } = useAssessment();

  // Load session on mount
  useEffect(() => {
    loadSession(token);
  }, [token, loadSession]);

  // Tick active timer
  const isActive = currentSession?.status === "started";
  useTimer(isActive);

  // Sync index from URL back to Zustand store currentStepIndex
  useEffect(() => {
    if (currentSession && currentSession.currentStepIndex !== domainIndex) {
      useAssessmentStore.setState((state: any) => {
        if (!state.currentSession) return state;
        return {
          currentSession: {
            ...state.currentSession,
            currentStepIndex: domainIndex,
            timeRemainingSeconds: state.currentSession.steps[domainIndex]?.durationSeconds ?? 30
          }
        };
      });
    }
  }, [domainIndex, currentSession]);

  if (isLoading) {
    return <LoadingScreen message="Loading assessment engine..." />;
  }

  if (error || !currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface-page">
        <ErrorState
          title="Engine Error"
          message={error || "Could not find active assessment session. Verify URL."}
          retryAction={() => loadSession(token)}
        />
      </div>
    );
  }

  const steps = currentSession.steps;
  const currentStep = steps[domainIndex];
  
  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface-page">
        <ErrorState
          title="Invalid Index"
          message={`Step index ${domainIndex} is out of bounds.`}
          retryAction={() => router.push(`/assessment/${token}/domain/0`)}
        />
      </div>
    );
  }

  const progressPct = ((domainIndex + 1) / steps.length) * 100;

  const handleResponse = (responseValue: unknown) => {
    // Save response keyed by taskId or stepIndex. Prompt says: "keyed by taskId"
    // We can use the domain as the taskId key
    const taskId = currentStep.domain.toLowerCase();
    submitResponse(domainIndex, { taskId, value: responseValue });
  };

  const handleBack = () => {
    if (domainIndex > 0) {
      router.push(`/assessment/${token}/domain/${domainIndex - 1}`);
    }
  };

  const handleNext = async () => {
    if (domainIndex === steps.length - 1) {
      // Complete!
      try {
        const reportId = await submitSession();
        router.push(`/assessment/${token}/complete?reportId=${reportId}`);
      } catch (e) {
        console.error("Submission failed", e);
      }
    } else {
      router.push(`/assessment/${token}/domain/${domainIndex + 1}`);
    }
  };

  const savedResponseObj = currentSession.responses[domainIndex];
  const hasResponse = savedResponseObj !== undefined;

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-surface-page overflow-hidden select-none">
      
      {/* Sticky top bar */}
      <header className="shrink-0 bg-white border-b border-border-default h-14 px-4 flex items-center justify-between z-30 shadow-sm pt-safe">
        
        {/* Domain badge left */}
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 text-[9px] font-bold rounded-full uppercase tracking-wider">
            {currentStep.domain} · {domainIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Linear progress bar center — hidden on mobile */}
        <div className="hidden sm:block flex-1 max-w-xs mx-6">
          <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-secondary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Circular timer right */}
        <div className="shrink-0">
          <TimerDisplay
            secondsRemaining={currentSession.timeRemainingSeconds}
            totalSeconds={currentStep.durationSeconds}
          />
        </div>
      </header>

      {/* Pure plug-in zone for task area */}
      <main role="main" aria-live="polite" className="flex-1 overflow-y-auto p-3 sm:p-5 max-w-2xl w-full mx-auto flex flex-col">
        <div className="bg-white rounded-2xl border border-border-default shadow-card p-4 sm:p-6 flex flex-col flex-1 overflow-hidden">
          
          {/* Instructions header */}
          <div className="shrink-0 mb-3 space-y-1">
            <h2 className="text-sm font-extrabold text-on-surface tracking-tight">
              {currentStep.title}
            </h2>
            <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
              {currentStep.instructions}
            </p>
          </div>

          {/* Plugin target area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <DomainTaskArea
              step={currentStep}
              savedResponse={savedResponseObj?.value}
              onResponse={handleResponse}
            />
          </div>

        </div>
      </main>

      {/* Fixed bottom nav bar */}
      <footer className="shrink-0 bg-white border-t border-border-default px-4 flex items-center justify-between z-30 pb-safe" style={{height: 'calc(56px + env(safe-area-inset-bottom))'}}>
        
        {/* Previous button */}
        <button
          onClick={handleBack}
          disabled={domainIndex === 0}
          className={cn(
            "px-3 py-2 border rounded-xl text-xs font-bold transition-all active:scale-95 min-h-[44px]",
            domainIndex === 0
              ? "bg-surface-muted border-border-default text-on-surface-variant/30 cursor-not-allowed"
              : "bg-white border-border-default text-on-surface hover:bg-surface-muted"
          )}
        >
          ← Prev
        </button>

        {/* Dot indicators center */}
        <div className="flex gap-1.5">
          {steps.map((s, idx) => {
            const isCompleted = idx < domainIndex || currentSession.responses[idx] !== undefined;
            const isCurrent = idx === domainIndex;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCurrent
                    ? "h-2.5 w-2.5 bg-brand-primary ring-4 ring-brand-primary/25 animate-pulse"
                    : isCompleted
                    ? "h-2 w-2 bg-brand-secondary"
                    : "h-2 w-2 bg-border-strong"
                )}
                title={`Step ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Next/Complete button */}
        <button
          onClick={handleNext}
          disabled={!hasResponse}
          className={cn(
            "px-4 py-2.5 text-white rounded-xl shadow-md transition-all active:scale-95 text-xs font-bold min-h-[44px]",
            !hasResponse
              ? "bg-brand-primary/40 cursor-not-allowed shadow-none"
              : domainIndex === steps.length - 1
              ? "bg-brand-secondary shadow-brand-secondary/20 hover:bg-brand-secondary/95"
              : "bg-brand-primary shadow-brand-primary/20 hover:bg-brand-primary/95"
          )}
        >
          {domainIndex === steps.length - 1 ? "Complete" : "Next →"}
        </button>

      </footer>

    </div>
  );
}

export default function AssessmentEngineWrapper(props: AssessmentEngineWrapperProps) {
  return (
    <ErrorBoundary>
      <AssessmentEngineWrapperInternal {...props} />
    </ErrorBoundary>
  );
}
