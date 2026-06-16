import React from "react";
import { cn } from "@/lib/utils";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface ScoreBreakdownBarProps {
  segments: Segment[];
  className?: string;
}

export default function ScoreBreakdownBar({ segments, className }: ScoreBreakdownBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Bar breakdown */}
      <div className="h-3.5 w-full bg-surface-muted rounded-full overflow-hidden flex shadow-inner">
        {segments.map((segment, index) => {
          const widthPct = total > 0 ? (segment.value / total) * 100 : 0;
          if (widthPct === 0) return null;
          
          return (
            <div
              key={segment.label}
              style={{ width: `${widthPct}%` }}
              className={cn("h-full first:rounded-l-full last:rounded-r-full transition-all duration-500", segment.color)}
              title={`${segment.label}: ${segment.value}%`}
            />
          );
        })}
      </div>

      {/* Legend list */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", segment.color)} />
            <span>
              {segment.label} ({segment.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
