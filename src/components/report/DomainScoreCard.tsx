import React from "react";
import { cn } from "@/lib/utils";
import { CognitiveDomain } from "@/types/assessment.types";
import { Target, Brain, Sparkles, Heart, Eye } from "lucide-react";

interface DomainScoreCardProps {
  domain: CognitiveDomain;
  score: number;
}

export default function DomainScoreCard({ domain, score }: DomainScoreCardProps) {
  const icons: Record<string, any> = {
    Attention: Target,
    Memory: Brain,
    Reasoning: Sparkles,
    Coordination: Heart,
    Perception: Eye
  };

  const Icon = icons[domain] || Brain;

  let colorClass = "bg-brand-primary";
  let textClass = "text-brand-primary";
  let bgClass = "bg-brand-primary/10";
  
  if (score < 50) {
    colorClass = "bg-status-error";
    textClass = "text-status-error";
    bgClass = "bg-status-error/10";
  } else if (score < 70) {
    colorClass = "bg-status-pending";
    textClass = "text-status-pending";
    bgClass = "bg-status-pending/10";
  } else if (domain === "Memory") {
    // Lavender/purple color accent for memory in mockup
    colorClass = "bg-[purple]";
    textClass = "text-[purple]";
    bgClass = "bg-[purple]/10";
  } else if (domain === "Reasoning" || domain === "Coordination") {
    colorClass = "bg-brand-secondary";
    textClass = "text-brand-secondary";
    bgClass = "bg-brand-secondary/10";
  }

  return (
    <div className="space-y-2 select-none">
      <div className="flex justify-between items-center text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg shrink-0", bgClass)}>
            <Icon className={cn("h-4 w-4", textClass)} />
          </div>
          <span className="text-on-surface font-semibold">{domain}</span>
        </div>
        <span className={cn("font-mono", textClass)}>{score}%</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", colorClass)}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
