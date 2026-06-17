"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Target, Brain, Sparkles, Heart, Eye, LucideIcon } from "lucide-react";
import { CognitiveDomain } from "@/types/assessment.types";

interface DomainScoreRowProps {
  domain: string;
  score: number;
}

export default function DomainScoreRow({ domain, score }: DomainScoreRowProps) {
  // Domain config mapping
  const configMap: Record<string, { color: string; bg: string; icon: LucideIcon }> = {
    Attention: { color: "text-[#2563EB]", bg: "bg-[#2563EB]", icon: Target },
    Memory: { color: "text-[#7C3AED]", bg: "bg-[#7C3AED]", icon: Brain },
    Reasoning: { color: "text-[#0D9488]", bg: "bg-[#0D9488]", icon: Sparkles },
    Coordination: { color: "text-[#10B981]", bg: "bg-[#10B981]", icon: Heart },
    Perception: { color: "text-[#D85A30]", bg: "bg-[#D85A30]", icon: Eye }
  };

  const current = configMap[domain] || { color: "text-brand-primary", bg: "bg-brand-primary", icon: Target };
  const Icon = current.icon;

  return (
    <div className="space-y-1 select-none">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 shrink-0", current.color)} />
          <span className="text-xs font-bold text-on-surface">{domain}</span>
        </div>
        <span className={cn("text-xs font-black", current.color)}>{score}%</span>
      </div>
      <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden border border-border-default shadow-inner">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", current.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
