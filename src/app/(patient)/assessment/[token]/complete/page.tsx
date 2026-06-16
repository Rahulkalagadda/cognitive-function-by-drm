"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

function AssessmentCompletePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { token } = params;
  const reportId = searchParams.get("reportId") || "rep-sunita-mehta-1";
  
  const [milestone, setMilestone] = useState<"Analyzing" | "Scoring" | "Generating">("Analyzing");

  useEffect(() => {
    // Cycle milestones animatively over 3 seconds
    const timerScoring = setTimeout(() => setMilestone("Scoring"), 1000);
    const timerGenerating = setTimeout(() => setMilestone("Generating"), 2000);
    
    // Auto-navigate to results
    const timerRedirect = setTimeout(() => {
      router.push(`/assessment/${token}/results?reportId=${reportId}`);
    }, 3200);

    return () => {
      clearTimeout(timerScoring);
      clearTimeout(timerGenerating);
      clearTimeout(timerRedirect);
    };
  }, [token, reportId, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 select-none">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 animate-scaleIn">
        
        {/* Premium SVG Doctor illustration */}
        <div className="w-[200px] h-[200px] shrink-0 text-brand-primary flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background elements */}
            <circle cx="100" cy="100" r="80" className="fill-blue-50/50" />
            <circle cx="100" cy="100" r="60" className="fill-blue-100/30" />
            
            {/* Doctor figure */}
            <path d="M70,140 C70,110 80,95 100,95 C120,95 130,110 130,140" className="fill-brand-secondary/80" />
            <circle cx="100" cy="75" r="18" className="fill-brand-primary/10 stroke-brand-primary stroke-2" />
            
            {/* Stethoscope */}
            <path d="M92,85 C92,95 108,95 108,85" fill="none" className="stroke-brand-secondary stroke-2" />
            
            {/* Clipboard with checkmark */}
            <rect x="110" y="110" width="35" height="45" rx="4" className="fill-white stroke-brand-primary stroke-2" />
            <rect x="120" y="105" width="15" height="6" rx="1" className="fill-brand-secondary" />
            <line x1="118" y1="122" x2="132" y2="122" className="stroke-slate-200 stroke-2" />
            <line x1="118" y1="130" x2="137" y2="130" className="stroke-slate-200 stroke-2" />
            
            {/* Checkmark in circle */}
            <circle cx="138" cy="142" r="10" className="fill-status-complete" />
            <path d="M134,142 L137,145 L143,139" fill="none" className="stroke-white stroke-2" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold text-on-surface tracking-tight">
            Assessment Submitted!
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium max-w-sm leading-relaxed">
            Your evaluation metrics have been transmitted successfully. Please wait while the diagnostics engine generates your file.
          </p>
        </div>

        {/* Milestone progress steps */}
        <div className="w-full pt-4">
          <div className="flex justify-between items-center w-full max-w-xs mx-auto relative text-[10px] font-extrabold uppercase tracking-wider">
            
            {/* Connecting line */}
            <div className="absolute top-2 left-0 right-0 h-1 bg-slate-100 z-0 rounded-full">
              <div 
                className="h-full bg-brand-secondary rounded-full transition-all duration-1000"
                style={{
                  width: milestone === "Analyzing" ? "20%" : milestone === "Scoring" ? "60%" : "100%"
                }}
              />
            </div>

            {/* Step: Analyzing */}
            <div className="flex flex-col items-center z-10">
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all duration-300",
                milestone === "Analyzing"
                  ? "bg-brand-primary text-white border-brand-primary ring-4 ring-brand-primary/25 scale-110"
                  : "bg-brand-secondary text-white border-brand-secondary"
              )}>
                {milestone !== "Analyzing" ? "✓" : "1"}
              </div>
              <span className={cn("mt-1.5", milestone === "Analyzing" ? "text-brand-primary font-black" : "text-on-surface-variant")}>
                Analyzing
              </span>
            </div>

            {/* Step: Scoring */}
            <div className="flex flex-col items-center z-10">
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all duration-300",
                milestone === "Scoring"
                  ? "bg-brand-primary text-white border-brand-primary ring-4 ring-brand-primary/25 scale-110"
                  : milestone === "Generating"
                  ? "bg-brand-secondary text-white border-brand-secondary"
                  : "bg-white text-on-surface-variant/40 border-border-default"
              )}>
                {milestone === "Generating" ? "✓" : "2"}
              </div>
              <span className={cn("mt-1.5", milestone === "Scoring" ? "text-brand-primary font-black" : "text-on-surface-variant")}>
                Scoring
              </span>
            </div>

            {/* Step: Generating */}
            <div className="flex flex-col items-center z-10">
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all duration-300",
                milestone === "Generating"
                  ? "bg-brand-primary text-white border-brand-primary ring-4 ring-brand-primary/25 scale-110"
                  : "bg-white text-on-surface-variant/40 border-border-default"
              )}>
                3
              </div>
              <span className={cn("mt-1.5", milestone === "Generating" ? "text-brand-primary font-black" : "text-on-surface-variant")}>
                Generating
              </span>
            </div>

          </div>
        </div>

        {/* Warning pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-status-pending/10 text-status-pending border border-status-pending/20 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-sm">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Do not close this tab</span>
        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(AssessmentCompletePage);
