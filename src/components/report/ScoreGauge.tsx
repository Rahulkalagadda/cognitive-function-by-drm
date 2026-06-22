"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  className?: string;
}

export default function ScoreGauge({ score, className }: ScoreGaugeProps) {
  // 3-tier clinical classification aligned to DB generated column (75/50 thresholds)
  let statusText = "Below Average";
  let statusColor = "text-[#dc2626] border-[#dc2626]/20 bg-[#dc2626]/10";
  let gaugeColor = "stroke-[#dc2626]";

  if (score >= 75) {
    statusText = "Above Average";
    statusColor = "text-[#0f766e] border-[#0f766e]/20 bg-[#0f766e]/10";
    gaugeColor = "stroke-[#0f766e]";
  } else if (score >= 50) {
    statusText = "Average";
    statusColor = "text-[#d97706] border-[#d97706]/20 bg-[#d97706]/10";
    gaugeColor = "stroke-[#d97706]";
  }

  // Dasharray calculation for circle circumference (2 * pi * r ≈ 100)
  const strokeDashArray = `${score}, 100`;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-[140px] h-[140px] relative">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-[#F1F5F9]"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3.2"
          />
          <path
            className={cn(gaugeColor, "transition-all duration-1000")}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeDasharray={strokeDashArray}
            strokeLinecap="round"
            strokeWidth="3.2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="text-3xl font-black text-[#1E293B] leading-none">{score}</span>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">/ 100</span>
        </div>
      </div>
      <div className={cn("mt-4 px-4 py-1.5 rounded-full border text-xs font-bold shadow-sm select-none", statusColor)}>
        {statusText}
      </div>
    </div>
  );
}
