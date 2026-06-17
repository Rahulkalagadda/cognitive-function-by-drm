"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  className?: string;
}

export default function ScoreGauge({ score, className }: ScoreGaugeProps) {
  // Determine color and status text
  let statusText = "Attention Required";
  let statusColor = "text-[#B91C1C] border-[#B91C1C]/20 bg-[#B91C1C]/10";
  let gaugeColor = "stroke-[#B91C1C]";

  if (score >= 85) {
    statusText = "Exceptional";
    statusColor = "text-[#166534] border-[#166534]/20 bg-[#166534]/10";
    gaugeColor = "stroke-[#166534]";
  } else if (score >= 70) {
    statusText = "Good (Above Average)";
    statusColor = "text-[#15803D] border-[#15803D]/20 bg-[#15803D]/10";
    gaugeColor = "stroke-[#15803D]";
  } else if (score >= 50) {
    statusText = "Monitoring Needed";
    statusColor = "text-[#B45309] border-[#B45309]/20 bg-[#B45309]/10";
    gaugeColor = "stroke-[#B45309]";
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
