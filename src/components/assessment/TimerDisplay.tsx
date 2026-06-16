import React from "react";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";

interface TimerDisplayProps {
  secondsRemaining: number;
  totalSeconds: number;
}

export default function TimerDisplay({ secondsRemaining, totalSeconds }: TimerDisplayProps) {
  const isLowTime = secondsRemaining <= 5;
  
  // Format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const percentage = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300 shadow-sm",
        isLowTime
          ? "bg-status-error/10 text-status-error border-status-error/20 animate-pulse scale-105"
          : "bg-surface-card text-on-surface-variant border-border-default"
      )}
    >
      <Timer className={cn("h-4 w-4", isLowTime ? "text-status-error" : "text-brand-primary")} />
      <span className="font-mono tabular-nums">{formatTime(secondsRemaining)}</span>
    </div>
  );
}
