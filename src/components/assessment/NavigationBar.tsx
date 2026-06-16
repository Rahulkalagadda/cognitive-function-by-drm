import React from "react";
import { ChevronLeft, ChevronRight, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationBarProps {
  currentIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  disableNext?: boolean;
}

export default function NavigationBar({
  currentIndex,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  disableNext = false
}: NavigationBarProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  return (
    <div className="flex justify-between items-center w-full gap-4 pt-2">
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={isFirst}
        className={cn(
          "inline-flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold border shadow-sm transition-all active:scale-95",
          isFirst
            ? "bg-surface-muted text-on-surface-variant/30 border-border-default cursor-not-allowed"
            : "bg-surface-card text-on-surface border-border-default hover:bg-surface-muted"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Next or Submit button */}
      {isLast ? (
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-secondary text-white rounded-xl shadow-md shadow-brand-secondary/20 hover:bg-brand-secondary/95 transition-all active:scale-95 text-xs font-bold"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Finish & Generate Report</span>
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={disableNext}
          className={cn(
            "inline-flex items-center gap-1 px-6 py-2.5 text-white rounded-xl shadow-md transition-all active:scale-95 text-xs font-bold",
            disableNext
              ? "bg-brand-primary/40 shadow-none cursor-not-allowed"
              : "bg-brand-primary shadow-brand-primary/20 hover:bg-brand-primary/95"
          )}
        >
          <span>Next Task</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
