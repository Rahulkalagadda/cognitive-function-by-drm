import React from "react";
import { cn } from "@/lib/utils";
import { CognitiveDomain } from "@/types/assessment.types";
import { Brain, Heart, Eye, Target, Sparkles } from "lucide-react";

interface DomainStepperProps {
  domains: CognitiveDomain[];
  currentStepIndex: number;
}

export default function DomainStepper({ domains, currentStepIndex }: DomainStepperProps) {
  const icons: Record<string, any> = {
    Attention: Target,
    Memory: Brain,
    Reasoning: Sparkles,
    Coordination: Heart,
    Perception: Eye
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto py-2">
      {domains.map((domain, index) => {
        const Icon = icons[domain] || Brain;
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <div key={domain} className="flex flex-col items-center flex-1 relative">
            {/* Step Icon Button */}
            <div
              className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center border transition-all duration-300 z-10",
                isActive
                  ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20 scale-110"
                  : isCompleted
                  ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary"
                  : "bg-surface-card text-on-surface-variant border-border-default"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            
            {/* Step name */}
            <span className={cn(
              "text-[9px] font-extrabold uppercase mt-1 tracking-wider",
              isActive ? "text-brand-primary" : "text-on-surface-variant"
            )}>
              {domain.substring(0, 5)}
            </span>

            {/* Connector line */}
            {index < domains.length - 1 && (
              <div
                className={cn(
                  "absolute top-4.5 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 z-0",
                  index < currentStepIndex ? "bg-brand-secondary" : "bg-border-default"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
