"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { TASK_REGISTRY, getTaskIdFromStep } from "@/lib/taskRegistry";
import { useTimer } from "@/hooks/useTimer";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import SectionCompletionStrip from "@/components/patient/SectionCompletionStrip";
import TimerDisplay from "@/components/assessment/TimerDisplay";
import { TaskId } from "@/types/task.types";

// Import Task components
import CPTTask from "@/components/tasks/CPTTask";
import GoNoGoTask from "@/components/tasks/GoNoGoTask";
import NBackTask from "@/components/tasks/NBackTask";
import TowerPuzzleTask from "@/components/tasks/TowerPuzzleTask";
import ShapeMatchTask from "@/components/tasks/ShapeMatchTask";
import WordRecallTask from "@/components/tasks/WordRecallTask";

export default function ActiveTaskPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskId = params.taskId as TaskId;
  const token = searchParams.get("token");
  const stepStr = searchParams.get("step");
  const stepIndex = stepStr !== null ? parseInt(stepStr, 10) : 0;

  const {
    currentSession,
    loadSession,
    isLoading,
    error,
    submitResponse,
    submitSession
  } = useAssessment();

  const [taskSubmitted, setTaskSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  // Start & tick session timer
  const isActive = currentSession?.status === "started" && !taskSubmitted;
  useTimer(isActive);

  const taskDef = TASK_REGISTRY[taskId];

  if (isLoading || !taskDef) {
    return <LoadingScreen message="Initialising active task environment..." />;
  }

  if (error || !currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <ErrorState
          title="Session Error"
          message={error || "Invalid assessment session. Verify URL."}
          retryAction={() => token && loadSession(token)}
        />
      </div>
    );
  }

  const handleTaskComplete = async (metrics: any) => {
    if (taskSubmitted) return;
    setTaskSubmitted(true);

    // Save metrics
    submitResponse(stepIndex, metrics);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= currentSession.steps.length) {
      // Last step, submit whole session
      try {
        const reportId = await submitSession();
        router.push(`/complete?token=${token}&reportId=${reportId}`);
      } catch (err) {
        console.error("Submission error:", err);
        router.push(`/complete?token=${token}`);
      }
    } else {
      // Move to next step instructions
      const nextStep = currentSession.steps[nextIndex];
      const nextTaskId = getTaskIdFromStep(nextStep);
      router.push(`/instructions/${nextTaskId}?token=${token}&step=${nextIndex}`);
    }
  };

  const renderActiveEngine = () => {
    const props = {
      isPractice: false,
      onComplete: handleTaskComplete,
      config: currentSession.steps[stepIndex]?.config
    };

    switch (taskId) {
      case "cpt":
        return <CPTTask {...props} />;
      case "go-no-go":
        return <GoNoGoTask {...props} />;
      case "n-back":
        return <NBackTask {...props} />;
      case "tower-puzzle":
        return <TowerPuzzleTask {...props} />;
      case "shape-match":
        return <ShapeMatchTask {...props} />;
      case "word-recall":
        return <WordRecallTask {...props} />;
      default:
        return <p className="text-xs text-status-error font-bold">Unknown Task Engine: {taskId}</p>;
    }
  };

  const currentStep = currentSession.steps[stepIndex];

  return (
    <div className="h-screen w-full flex flex-col bg-surface-page overflow-hidden select-none">
      {/* Top Header Panel */}
      <header className="shrink-0 bg-white border-b border-border-default h-16 px-6 flex items-center justify-between z-30 shadow-sm pt-safe">
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
            {currentStep?.domain} · Step {stepIndex + 1} of {currentSession.steps.length}
          </span>
        </div>

        {/* High precision timer right */}
        <div className="shrink-0">
          <TimerDisplay
            secondsRemaining={currentSession.timeRemainingSeconds}
            totalSeconds={currentStep?.durationSeconds ?? 30}
          />
        </div>
      </header>

      {/* Main Task Canvas */}
      <main className="flex-1 overflow-hidden p-6 max-w-2xl w-full mx-auto flex flex-col justify-center gap-6">
        {/* Step completion strip */}
        <SectionCompletionStrip
          currentStepIndex={stepIndex}
          steps={currentSession.steps.map((s) => ({ domain: s.domain, title: s.title }))}
        />

        <Card className="border border-border-default shadow-card rounded-2xl bg-white overflow-hidden flex-1 min-h-[460px] md:max-h-[60vh] h-auto flex flex-col justify-between p-6 sm:p-8">
          <div className="flex-grow flex flex-col overflow-hidden w-full">
            {renderActiveEngine()}
          </div>
        </Card>
      </main>

      {/* Bottom status bar indicator */}
      <footer className="shrink-0 bg-white border-t border-border-default h-10 px-6 flex items-center justify-between text-[9px] text-on-surface-variant/50 font-bold pb-safe">
        <span>PATIENT PORTAL SECURED</span>
        <span>HIPAA COMPLIANT</span>
      </footer>
    </div>
  );
}
