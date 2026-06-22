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

  const total = steps.length;
  const current = currentStepIndex + 1;

  return (
    <div className="w-full bg-white border border-border-default rounded-2xl px-4 py-3 shadow-sm">
      {/* Header row: title + compact counter */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">
          Progress
        </p>
        <span className="text-[9px] font-extrabold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
          {current} / {total}
        </span>
      </div>

      {/* Scrollable step rail — scrolls horizontally if more steps than fit */}
      <div className="overflow-x-auto no-scrollbar -mx-1">
        <div
          className="flex items-start px-1 pb-1"
          style={{ minWidth: `${total * 52}px` }}
        >
          {steps.map((step, idx) => {
            const Icon = domainIcons[step.domain] || Target;
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={idx} className="flex flex-col items-center flex-1 relative z-10">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-[2px] z-0 transition-colors duration-300",
                      idx < currentStepIndex ? "bg-brand-secondary" : "bg-border-default"
                    )}
                  />
                )}

                {/* Step circle — compact */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 z-10 shrink-0",
                    isCompleted
                      ? "bg-brand-secondary border-brand-secondary text-white"
                      : isActive
                      ? "bg-brand-primary border-brand-primary text-white ring-4 ring-brand-primary/20 scale-105"
                      : "bg-surface-page border-border-default text-on-surface-variant/40"
                  )}
                  title={step.title}
                >
                  {isCompleted
                    ? <Check className="h-3.5 w-3.5 stroke-[3px]" />
                    : <Icon className="h-3.5 w-3.5" />}
                </div>

                {/* Label — truncated to 6 chars max */}
                <span
                  className={cn(
                    "block text-[7px] font-extrabold uppercase mt-1.5 tracking-wider text-center w-full select-none leading-tight",
                    isCompleted
                      ? "text-brand-secondary"
                      : isActive
                      ? "text-brand-primary font-black"
                      : "text-on-surface-variant/40"
                  )}
                >
                  {step.domain.length > 6 ? step.domain.substring(0, 6) : step.domain}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
