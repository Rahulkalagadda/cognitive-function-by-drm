"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Target, Brain, Sparkles, Heart, Eye, LucideIcon } from "lucide-react";
import { CognitiveDomain } from "@/types/assessment.types";

interface SectionCompletionStripProps {
  currentStepIndex: number;
  steps: { domain: CognitiveDomain; title: string }[];
}

export default function SectionCompletionStrip({ currentStepIndex, steps }: SectionCompletionStripProps) {
  const domainIcons: Record<CognitiveDomain, LucideIcon> = {
    Attention: Target,
    Memory: Brain,
    Reasoning: Sparkles,
    Coordination: Heart,
    Perception: Eye
  };

  return (
    <div className="w-full bg-white border border-border-default rounded-2xl p-5 shadow-sm space-y-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 text-center">
        Assessment Progress Timeline
      </p>

      <div className="flex items-center justify-between w-full py-2 relative">
        {steps.map((step, idx) => {
          const Icon = domainIcons[step.domain] || Target;
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <div key={idx} className="flex flex-col items-center flex-1 relative z-10">
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-[calc(50%+22px)] right-[calc(-50%+22px)] h-[2px] z-0 transition-colors duration-300",
                    idx < currentStepIndex ? "bg-brand-secondary" : "bg-border-default"
                  )}
                />
              )}

              {/* Step Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 z-10",
                  isCompleted
                    ? "bg-brand-secondary border-brand-secondary text-white shadow-sm"
                    : isActive
                    ? "bg-brand-primary border-brand-primary text-white ring-4 ring-brand-primary/20 scale-105 animate-pulse"
                    : "bg-surface-page border-border-default text-on-surface-variant/40"
                )}
                title={step.title}
              >
                {isCompleted ? <Check className="h-5 w-5 stroke-[3px]" /> : <Icon className="h-5 w-5" />}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "block w-full text-[8px] sm:text-[9px] font-extrabold uppercase mt-2 tracking-wider text-center max-w-[60px] sm:max-w-[65px] select-none break-words",
                  isCompleted
                    ? "text-brand-secondary"
                    : isActive
                    ? "text-brand-primary font-black"
                    : "text-on-surface-variant/50"
                )}
              >
                {step.domain}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
