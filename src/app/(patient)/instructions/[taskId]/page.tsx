"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { TASK_REGISTRY } from "@/lib/taskRegistry";
import { useVoice } from "@/hooks/useVoice";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, VolumeX, Play, Info } from "lucide-react";
import { TaskId } from "@/types/task.types";

export default function TaskInstructionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskId = params.taskId as TaskId;
  const token = searchParams.get("token");
  const stepStr = searchParams.get("step");
  const stepIndex = stepStr !== null ? parseInt(stepStr, 10) : 0;

  const { currentSession, loadSession, isLoading, error, language } = useAssessment();
  const { isPlaying, speak, stop, warmUp } = useVoice();

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  const taskDef = TASK_REGISTRY[taskId];

  useEffect(() => {
    // Auto-speak instructions on load in preferred language
    if (taskDef && currentSession) {
      const text = taskDef.speakText[language] || taskDef.speakText["en"];
      // Wait slightly for voices to load in browser
      const timer = setTimeout(() => {
        speak(text, language);
      }, 500);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [taskDef, currentSession, language]);

  if (isLoading || !taskDef) {
    return <LoadingScreen message="Loading task instructions..." />;
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

  const handleToggleSpeak = () => {
    if (isPlaying) {
      stop();
    } else {
      warmUp();
      const text = taskDef.speakText[language] || taskDef.speakText["en"];
      speak(text, language);
    }
  };

  const handleStartPractice = () => {
    stop();
    warmUp();
    router.push(`/trial/${taskId}?token=${token}&step=${stepIndex}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 flex flex-col justify-center min-h-[80vh] animate-scaleIn">
      <Card className="border border-border-default shadow-card rounded-2xl bg-white overflow-hidden">
        {/* Banner Indicator */}
        <div className="bg-brand-primary/5 border-b border-border-default px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Info className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
              Task instructions
            </p>
            <h1 className="text-base font-extrabold text-on-surface tracking-tight">
              {taskDef.title}
            </h1>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-on-surface">
              How to complete this task:
            </h2>
            <p className="text-xs sm:text-sm font-medium text-on-surface-variant leading-relaxed bg-surface-page p-4 border border-border-default rounded-xl">
              {taskDef.instructions}
            </p>
          </div>

          {/* Spoken instructions audio trigger */}
          <div className="flex items-center justify-between p-4 bg-brand-secondary/5 border border-brand-secondary/15 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                {isPlaying ? <Volume2 className="h-5 w-5 animate-bounce" /> : <VolumeX className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Spoken Guide</p>
                <p className="text-[10px] text-on-surface-variant font-medium">
                  {isPlaying ? "Speaking instructions..." : "Play spoken audio instructions"}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleSpeak}
              type="button"
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                isPlaying
                  ? "bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20"
                  : "bg-brand-secondary text-white shadow-sm"
              }`}
            >
              {isPlaying ? "Stop Audio" : "Listen"}
            </button>
          </div>

          {/* Action button */}
          <button
            onClick={handleStartPractice}
            type="button"
            className="w-full h-14 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-lg shadow-brand-primary/25 rounded-xl text-sm font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <span>Try Practice Trial</span>
            <Play className="h-4.5 w-4.5 fill-white" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
