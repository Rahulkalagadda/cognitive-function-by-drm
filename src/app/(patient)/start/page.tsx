"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { getTranslation } from "@/lib/translations";
import { getTaskIdFromStep } from "@/lib/taskRegistry";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function StartCountdownPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { currentSession, loadSession, language, startSession } = useAssessment();
  const [count, setCount] = useState(3);
  const [isGo, setIsGo] = useState(false);

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setIsGo(true);
          clearInterval(interval);
          
          // Start the session timer & state
          startSession();

          // After showing "Go!" for 800ms, redirect to the first step
          setTimeout(() => {
            const firstStep = currentSession.steps[0];
            if (!firstStep) {
              router.push(`/complete?token=${token}`);
              return;
            }
            
            const taskId = getTaskIdFromStep(firstStep);
            router.push(`/instructions/${taskId}?token=${token}&step=0`);
          }, 800);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession, router, token, startSession]);

  if (!currentSession) {
    return <LoadingScreen message="Initializing session..." />;
  }

  const langCode = language || "en";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">
          {getTranslation(langCode, "secureAssessment")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface">
          {getTranslation(langCode, "countdownGetReady")}
        </h1>
        
        {/* Animated Countdown Circle */}
        <div className="flex items-center justify-center pt-8">
          <div className="w-40 h-40 rounded-full border-4 border-brand-primary/20 flex items-center justify-center bg-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-primary/5 animate-pulse" />
            <span className="text-6xl font-black text-brand-primary relative z-10 select-none transition-all duration-300 transform scale-110">
              {isGo ? getTranslation(langCode, "countdownGo") : count}
            </span>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-xs text-on-surface-variant font-medium">
            {currentSession.patientName} · Step 1 of {currentSession.steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}
