import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  status: string;
  className?: string;
}

export default function ScoreGauge({ score, status, className }: ScoreGaugeProps) {
  // Circular arc values
  const radius = 16;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius; // ~100.53
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-status-complete stroke-current";
  let bgFill = "bg-status-complete/10 text-status-complete border-status-complete/20";
  
  if (score < 50) {
    colorClass = "text-status-error stroke-current";
    bgFill = "bg-status-error/10 text-status-error border-status-error/20";
  } else if (score < 70) {
    colorClass = "text-status-pending stroke-current";
    bgFill = "bg-status-pending/10 text-status-pending border-status-pending/20";
  }

  return (
    <div
      role="img"
      aria-label={`Overall score ${score} out of 100`}
      className={cn("flex flex-col items-center select-none", className)}
    >
      <div className="relative h-32 w-32 md:h-36 md:w-36">
        
        {/* Arc Dial */}
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#eff4ff"
            strokeWidth={strokeWidth}
            className="text-surface-muted stroke-current"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", colorClass)}
          />
        </svg>

        {/* Dial Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl font-extrabold text-on-surface leading-none tracking-tight">
            {score}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant/70 mt-0.5">
            / 100
          </span>
        </div>

      </div>

      <div className={cn("mt-4 px-4 py-1 rounded-full text-xs font-bold border", bgFill)}>
        {status}
      </div>
    </div>
  );
}
