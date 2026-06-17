"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CognitiveDomain } from "@/types/assessment.types";

interface DomainBadgeProps {
  domain: CognitiveDomain | string;
  className?: string;
}

export default function DomainBadge({ domain, className }: DomainBadgeProps) {
  const styles: Record<string, string> = {
    Attention: "bg-domain-attention/10 text-domain-attention border-domain-attention/20",
    Memory: "bg-domain-memory/10 text-domain-memory border-domain-memory/20",
    Reasoning: "bg-domain-executive/10 text-domain-executive border-domain-executive/20",
    Coordination: "bg-domain-coordination/10 text-domain-coordination border-domain-coordination/20",
    Perception: "bg-domain-perception/10 text-domain-perception border-domain-perception/20",
    Executive: "bg-domain-executive/10 text-domain-executive border-domain-executive/20"
  };

  const currentStyle = styles[domain] || "bg-brand-primary/10 text-brand-primary border-brand-primary/20";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider select-none",
        currentStyle,
        className
      )}
    >
      {domain}
    </span>
  );
}
