"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { TASK_REGISTRY, getTaskIdFromStep } from "@/lib/taskRegistry";
import { useAssessmentStore } from "@/stores/assessment.store";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import SectionCompletionStrip from "@/components/patient/SectionCompletionStrip";
import { TaskId } from "@/types/task.types";

// React task components — no jsPsych, no SSR issues, no HTML strings
import CPTTask from "@/components/tasks/CPTTask";
import GoNoGoTask from "@/components/tasks/GoNoGoTask";
import NBackTask from "@/components/tasks/NBackTask";
import TowerPuzzleTask from "@/components/tasks/TowerPuzzleTask";
import ShapeMatchTask from "@/components/tasks/ShapeMatchTask";
import WordRecallTask from "@/components/tasks/WordRecallTask";
import DividedAttentionTask from "@/components/tasks/DividedAttentionTask";
import UpdatingTask from "@/components/tasks/UpdatingTask";

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

  // Sync URL step index to store state
  useEffect(() => {
    if (currentSession && currentSession.currentStepIndex !== stepIndex) {
      const targetStep = currentSession.steps[stepIndex];
      if (targetStep) {
        useAssessmentStore.setState((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              currentStepIndex: stepIndex,
              timeRemainingSeconds: targetStep.durationSeconds
            }
          };
        });
      }
    }
  }, [stepIndex, currentSession]);

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
    await submitResponse(stepIndex, metrics);

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
      case "divided-attention":
        return <DividedAttentionTask {...props} />;
      case "updating":
        return <UpdatingTask {...props} />;
      default:
        return <p className="text-xs text-status-error font-bold">Unknown Task Engine: {taskId}</p>;
    }
  };

  const currentStep = currentSession.steps[stepIndex];

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-surface-page overflow-hidden select-none">
      {/* Top Header Panel */}
      <header className="shrink-0 bg-white border-b border-border-default h-14 px-4 flex items-center justify-between z-30 shadow-sm pt-safe">
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[9px] font-extrabold rounded-full uppercase tracking-wider">
            {currentStep?.domain} · Step {stepIndex + 1} of {currentSession.steps.length}
          </span>
        </div>
      </header>

      {/* Main Task Canvas */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 max-w-2xl w-full mx-auto flex flex-col gap-3">
        {/* Step completion strip */}
        <SectionCompletionStrip
          currentStepIndex={stepIndex}
          steps={currentSession.steps.map((s) => ({ domain: s.domain, title: s.title }))}
        />

        <Card className="border border-border-default shadow-card rounded-2xl bg-white overflow-hidden flex-1 flex flex-col p-4 sm:p-6">
          <div className="flex-grow flex flex-col overflow-hidden w-full">
            {renderActiveEngine()}
          </div>
        </Card>
      </main>

      {/* Bottom status bar indicator */}
      <footer className="shrink-0 bg-white border-t border-border-default h-9 px-4 flex items-center justify-between text-[8px] text-on-surface-variant/40 font-bold pb-safe">
        <span>PATIENT PORTAL SECURED</span>
        <span>HIPAA COMPLIANT</span>
      </footer>
    </div>
  );
}
