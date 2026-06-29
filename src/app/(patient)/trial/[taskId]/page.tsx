"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { TASK_REGISTRY } from "@/lib/taskRegistry";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, RotateCcw } from "lucide-react";
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

import { useVoice } from "@/hooks/useVoice";

export default function PracticeTrialPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskId = params.taskId as TaskId;
  const token = searchParams.get("token");
  const stepStr = searchParams.get("step");
  const stepIndex = stepStr !== null ? parseInt(stepStr, 10) : 0;

  const { currentSession, loadSession, isLoading, error } = useAssessment();
  const [trialCompleted, setTrialCompleted] = useState(false);
  const [trialResults, setTrialResults] = useState<any>(null);
  const [retryKey, setRetryKey] = useState(0); // force component remount on retry

  const { warmUp } = useVoice();

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  const taskDef = TASK_REGISTRY[taskId];

  if (isLoading || !taskDef) {
    return <LoadingScreen message="Loading practice trial workspace..." />;
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

  const handleTrialComplete = (results: any) => {
    setTrialResults(results);
    setTrialCompleted(true);
  };

  const handleRetry = () => {
    warmUp();
    setTrialCompleted(false);
    setTrialResults(null);
    setRetryKey((prev) => prev + 1);
  };

  const handleStartActual = () => {
    warmUp();
    router.push(`/task/${taskId}?token=${token}&step=${stepIndex}`);
  };

  const renderTaskEngine = () => {
    const props = {
      isPractice: true,
      onComplete: handleTrialComplete,
      config: currentSession.steps[stepIndex]?.config
    };

    switch (taskId) {
      case "cpt":
        return <CPTTask key={retryKey} {...props} />;
      case "go-no-go":
        return <GoNoGoTask key={retryKey} {...props} />;
      case "n-back":
        return <NBackTask key={retryKey} {...props} />;
      case "tower-puzzle":
        return <TowerPuzzleTask key={retryKey} {...props} />;
      case "shape-match":
        return <ShapeMatchTask key={retryKey} {...props} />;
      case "word-recall":
        return <WordRecallTask key={retryKey} {...props} />;
      case "divided-attention":
        return <DividedAttentionTask key={retryKey} {...props} />;
      case "updating":
        return <UpdatingTask key={retryKey} {...props} />;
      default:
        return <p className="text-xs text-status-error font-bold">Unknown Task Engine: {taskId}</p>;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 flex flex-col justify-center min-h-[85vh] animate-scaleIn">
      <Card className="border border-border-default shadow-card rounded-2xl bg-white overflow-hidden min-h-[460px] md:h-[480px] h-auto flex flex-col justify-between">
        <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-hidden">
          {!trialCompleted ? (
            /* Active Practice Engine */
            renderTaskEngine()
          ) : (
            /* Trial Completion State & Feedback */
            <div className="flex-1 flex flex-col items-center justify-between py-4 w-full">
              <div className="text-center space-y-2 shrink-0">
                <h2 className="text-lg font-extrabold text-[#1E293B] tracking-tight">
                  Practice Trial Completed!
                </h2>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-xs mx-auto">
                  You scored <strong className="text-brand-secondary font-black">{Math.round(trialResults?.accuracy ?? 100)}% accuracy</strong> on this practice round. You are ready for the actual assessment.
                </p>
              </div>

              {/* Big Check Graphic */}
              <div className="w-28 h-28 shrink-0 rounded-full bg-score-good/10 flex items-center justify-center text-score-good shadow-sm animate-scaleIn">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="w-full max-w-xs flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={handleRetry}
                  type="button"
                  className="w-full sm:flex-1 h-12 shrink-0 border border-border-default hover:bg-surface-page text-on-surface font-extrabold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry Practice
                </button>
                <button
                  onClick={handleStartActual}
                  type="button"
                  className="w-full sm:flex-1 h-12 shrink-0 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer"
                >
                  Start Actual Test
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
